import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get real-time counts for badges
    const [pendingQuotes, unreadMessages, notifications] = await Promise.all([
      // Count pending quotes
      prisma.quote.count({
        where: {
          status: 'PENDING'
        }
      }),
      // Count unread messages (messages from clients that haven't been read by admin)
      prisma.message.count({
        where: {
          isFromAdmin: false,
          status: 'UNREAD'
        }
      }),
      // Count admin notifications
      prisma.notification.count({
        where: {
          read: false,
          user: {
            role: 'ADMIN'
          }
        }
      })
    ])

    return NextResponse.json({
      pendingQuotes,
      unreadMessages,
      notifications
    })

  } catch (error) {
    console.error('Error fetching badge counts:', error)
    return NextResponse.json(
      { 
        pendingQuotes: 0,
        unreadMessages: 0,
        notifications: 0
      },
      { status: 500 }
    )
  }
}
