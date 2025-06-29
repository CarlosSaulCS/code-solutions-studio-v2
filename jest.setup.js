// Testing Library DOM setup
require('@testing-library/jest-dom');

// Polyfills for Next.js API routes and middleware testing
const { TextDecoder, TextEncoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Basic Request polyfill for Next.js to load modules
if (typeof global.Request === 'undefined') {
  global.Request = function Request() {};
}

// Response polyfill
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Map(Object.entries(init.headers || {}));
    }
    
    static json(data, init = {}) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...init.headers
        }
      });
    }
    
    async json() {
      return JSON.parse(this.body);
    }
  };
}

// Mock NextRequest and NextResponse for testing
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init = {}) => ({
    url: url,
    method: init.method || 'GET',
    headers: new Map(Object.entries(init.headers || {})),
    nextUrl: {
      searchParams: new URLSearchParams(new URL(url).search),
      pathname: new URL(url).pathname,
    },
    cookies: {
      get: jest.fn(),
      set: jest.fn(),
    },
    json: jest.fn().mockImplementation(() => {
      try {
        return Promise.resolve(init.body ? JSON.parse(init.body) : {});
      } catch {
        return Promise.resolve({});
      }
    }),
    text: jest.fn().mockImplementation(() => Promise.resolve(init.body || '')),
  })),
  NextResponse: {
    json: (data, init = {}) => ({
      status: init.status || 200,
      json: () => Promise.resolve(data),
      headers: new Map(Object.entries(init.headers || {})),
    }),
    next: () => ({
      status: 200,
      headers: new Map(),
    }),
  },
}));

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    quote: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    notification: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

// Mock external services
jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
  sendQuoteEmail: jest.fn().mockResolvedValue({ success: true }),
  sendContactFormNotification: jest.fn().mockResolvedValue({ success: true }),
  sendQuoteApprovedEmail: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@/lib/stripe', () => ({
  stripe: {
    customers: {
      create: jest.fn(),
    },
    paymentIntents: {
      create: jest.fn(),
    },
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'file:./test.db';

// Setup cleanup
afterEach(() => {
  jest.clearAllMocks();
});
