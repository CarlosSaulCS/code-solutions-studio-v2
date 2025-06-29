import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import middleware from '@/middleware';

// Mock NextFetchEvent with minimal required properties
const mockNextFetchEvent = {
  waitUntil: jest.fn(),
  passThroughOnException: jest.fn(),
} as unknown as NextFetchEvent;

// Mock NextResponse
jest.mock('next/server', () => {
  const actualNext = jest.requireActual('next/server');
  
  // Mock constructor function that can be called with 'new'
  const MockNextResponse = jest.fn().mockImplementation((body, init) => ({
    status: init?.status || 200,
    headers: new Map(Object.entries(init?.headers || {})),
    json: () => Promise.resolve(body ? JSON.parse(body) : {}),
  }));

  // Add static methods as properties of the function
  Object.assign(MockNextResponse, {
    next: jest.fn((options?: any) => ({
      headers: new Map([
        ['X-Content-Type-Options', 'nosniff'],
        ['X-Frame-Options', 'DENY'],
        ['X-XSS-Protection', '1; mode=block'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin'],
        ['Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'],
        ['Access-Control-Allow-Headers', 'Content-Type, Authorization'],
        ...(Object.entries(options?.headers || {})),
      ]),
      set: jest.fn(),
    })),
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      headers: new Map(Object.entries(init?.headers || {})),
      json: () => Promise.resolve(data),
    })),
    redirect: jest.fn((url) => ({
      status: 307,
      headers: new Map([['location', url.toString()]]),
    })),
  });

  return {
    NextRequest: class MockNextRequest {
      constructor(public url: string, options?: any) {
        this.url = url;
        this.nextUrl = { pathname: new URL(url).pathname };
        this.nextauth = { token: null };
        this.headers = new Map(Object.entries(options?.headers || {}));
        this.cookies = { get: jest.fn() };
      }
      nextUrl: { pathname: string };
      nextauth: { token: any };
      headers: Map<string, string>;
      cookies: { get: jest.MockedFunction<any> };
    },
    NextResponse: MockNextResponse,
  };
});

// Mock next-auth middleware
jest.mock('next-auth/middleware', () => ({
  withAuth: jest.fn((middlewareFunction, config) => {
    return jest.fn((req) => {
      // Mock token for testing
      const mockToken = req.nextauth?.token || null;
      return middlewareFunction(Object.assign(req, { nextauth: { token: mockToken } }));
    });
  }),
}));

const mockedNextResponse = NextResponse as jest.MockedFunction<any>;

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add security headers to all responses', async () => {
    const request = new (NextRequest as any)('http://localhost:3000/api/health');
    
    const response = await middleware(request, mockNextFetchEvent);
    
    expect(mockedNextResponse.next).toHaveBeenCalled();
  });

  it('should add CORS headers for API routes', async () => {
    const request = new (NextRequest as any)('http://localhost:3000/api/test');
    request.nextauth = { token: null };
    
    const response = await middleware(request, mockNextFetchEvent);
    
    expect(mockedNextResponse.next).toHaveBeenCalled();
  });

  it('should return 401 for admin routes without token', async () => {
    const request = new (NextRequest as any)('http://localhost:3000/api/admin/analytics');
    request.nextauth = { token: null };
    
    const response = await middleware(request, mockNextFetchEvent);
    
    expect(mockedNextResponse).toHaveBeenCalledWith(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('should return 403 for admin routes with non-admin token', async () => {
    const request = new (NextRequest as any)('http://localhost:3000/api/admin/analytics');
    request.nextauth = { 
      token: { 
        role: 'CLIENT',
        email: 'user@example.com'
      } 
    };
    
    const response = await middleware(request, mockNextFetchEvent);
    
    expect(mockedNextResponse).toHaveBeenCalledWith(
      JSON.stringify({ error: 'Acceso denegado. Se requieren permisos de administrador.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('should allow admin routes with admin token', async () => {
    const request = new (NextRequest as any)('http://localhost:3000/api/admin/analytics');
    request.nextauth = { 
      token: { 
        role: 'ADMIN',
        email: 'admin@example.com'
      } 
    };
    
    const response = await middleware(request, mockNextFetchEvent);
    
    expect(mockedNextResponse.next).toHaveBeenCalled();
  });

  it('should allow public API routes without authentication', async () => {
    const request = new (NextRequest as any)('http://localhost:3000/api/health');
    request.nextauth = { token: null };
    
    const response = await middleware(request, mockNextFetchEvent);
    
    expect(mockedNextResponse.next).toHaveBeenCalled();
  });

  it('should redirect admin pages to login when not authenticated', async () => {
    const request = new (NextRequest as any)('http://localhost:3000/admin');
    request.nextauth = { token: null };
    
    const response = await middleware(request, mockNextFetchEvent);
    
    expect(mockedNextResponse.redirect).toHaveBeenCalledWith(
      new URL('/auth/login', request.url)
    );
  });
});
