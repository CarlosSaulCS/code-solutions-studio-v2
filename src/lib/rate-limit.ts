import { RateLimiterMemory } from 'rate-limiter-flexible'
import { NextRequest, NextResponse } from 'next/server'

// Rate limiters for different endpoints
const rateLimiters = {
  // General API rate limiter
  general: new RateLimiterMemory({
    points: parseInt(process.env.RATE_LIMIT_MAX || '100'), // Number of requests
    duration: parseInt(process.env.RATE_LIMIT_WINDOW || '900'), // Per 15 minutes
  }),

  // Auth endpoints (more restrictive)
  auth: new RateLimiterMemory({
    points: 5, // 5 attempts
    duration: 900, // Per 15 minutes
  }),

  // Contact form (prevent spam)
  contact: new RateLimiterMemory({
    points: 3, // 3 submissions
    duration: 3600, // Per hour
  }),

  // Quote creation
  quotes: new RateLimiterMemory({
    points: 10, // 10 quotes
    duration: 3600, // Per hour
  }),
}

function getClientKey(request: NextRequest): string {
  // Try to get user ID from request headers (if authenticated)
  const userAgent = request.headers.get('user-agent') || ''
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  // Use the first available IP
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown'
  
  // Combine IP with user agent for better uniqueness
  return `${ip}:${userAgent.slice(0, 50)}`
}

export async function applyRateLimit(
  request: NextRequest,
  type: keyof typeof rateLimiters = 'general'
): Promise<{ success: boolean; response?: NextResponse }> {
  const limiter = rateLimiters[type]
  
  try {
    const clientKey = getClientKey(request)
    
    await limiter.consume(clientKey)
    return { success: true }
  } catch (rateLimiterRes: any) {
    // Rate limit exceeded
    const secs = Math.round(rateLimiterRes.msBeforeNext / 1000)
    
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${secs} seconds.`,
          retryAfter: secs
        },
        {
          status: 429,
          headers: {
            'Retry-After': secs.toString(),
            'X-RateLimit-Limit': limiter.points.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString()
          }
        }
      )
    }
  }
}

// Middleware wrapper for easy use in API routes
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  type: keyof typeof rateLimiters = 'general'
) {
  return async (request: NextRequest) => {
    const rateLimitResult = await applyRateLimit(request, type)
    
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }
    
    return handler(request)
  }
}

// Check rate limit without consuming
export async function checkRateLimit(
  request: NextRequest,
  type: keyof typeof rateLimiters = 'general'
): Promise<{
  allowed: boolean
  remaining: number
  resetTime: Date
}> {
  try {
    const clientKey = getClientKey(request)
    const limiter = rateLimiters[type]
    const res = await limiter.get(clientKey)
    
    if (!res) {
      return {
        allowed: true,
        remaining: limiter.points,
        resetTime: new Date(Date.now() + limiter.duration * 1000)
      }
    }
    
    return {
      allowed: res.remainingPoints > 0,
      remaining: res.remainingPoints || 0,
      resetTime: new Date(Date.now() + (res.msBeforeNext || 0))
    }
  } catch (error) {
    // If there's an error, allow the request
    console.error('Rate limit check error:', error)
    return {
      allowed: true,
      remaining: 0,
      resetTime: new Date()
    }
  }
}

// Reset rate limit for a specific client (useful for admins)
export async function resetRateLimit(
  clientKey: string,
  type: keyof typeof rateLimiters = 'general'
): Promise<void> {
  try {
    const limiter = rateLimiters[type]
    await limiter.delete(clientKey)
  } catch (error) {
    console.error('Rate limit reset error:', error)
  }
}
