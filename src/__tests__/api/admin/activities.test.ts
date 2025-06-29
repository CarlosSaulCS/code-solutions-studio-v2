import { NextRequest } from 'next/server';
import { GET } from '@/app/api/admin/activities/route';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    quote: {
      findMany: jest.fn(),
    },
    project: {
      findMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
    },
  },
}));

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockPrismaQuoteFindMany = prisma.quote.findMany as jest.MockedFunction<typeof prisma.quote.findMany>;
const mockPrismaProjectFindMany = prisma.project.findMany as jest.MockedFunction<typeof prisma.project.findMany>;
const mockPrismaUserFindMany = prisma.user.findMany as jest.MockedFunction<typeof prisma.user.findMany>;
const mockPrismaMessageFindMany = prisma.message.findMany as jest.MockedFunction<typeof prisma.message.findMany>;

describe('/api/admin/activities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when no session', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/admin/activities');
    const response = await GET(request);
    
    expect(response.status).toBe(401);
    
    const data = await response.json();
    expect(data).toHaveProperty('error', 'No autorizado');
  });

  it('should return 403 when user is not admin', async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: '1',
        email: 'user@example.com',
        role: 'CLIENT',
      },
      expires: '2025-12-31',
    });

    const request = new NextRequest('http://localhost:3000/api/admin/activities');
    const response = await GET(request);
    
    expect(response.status).toBe(403);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('permisos de administrador');
  });

  it('should return activities for admin user', async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: '1',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
      expires: '2025-12-31',
    });

    // Mock database responses
    mockPrismaQuoteFindMany.mockResolvedValue([
      {
        id: '1',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        userId: 'user1',
        serviceType: 'WEB',
        packageType: 'BASIC',
        selectedAddons: null,
        basePrice: 1000,
        addonsPrice: 0,
        totalPrice: 1000,
        currency: 'USD',
        timeline: 30,
        status: 'PENDING',
        notes: null,
        adminNotes: null,
        validUntil: new Date('2025-02-01'),
        user: { name: 'Client 1', email: 'client1@example.com' },
      } as any,
    ]);

    mockPrismaProjectFindMany.mockResolvedValue([
      {
        id: '1',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
        userId: 'user2',
        serviceType: 'WEB',
        packageType: 'BASIC',
        quoteId: 'quote1',
        title: 'Test Project',
        description: null,
        status: 'IN_PROGRESS',
        progress: 50,
        startDate: new Date('2025-01-02'),
        estimatedEndDate: new Date('2025-02-02'),
        actualEndDate: null,
        totalAmount: 1000,
        currency: 'USD',
        isActive: true,
        statusNotes: null,
        user: { name: 'Client 2', email: 'client2@example.com' },
      } as any,
    ]);

    mockPrismaUserFindMany.mockResolvedValue([
      {
        id: '2',
        name: 'New Client',
        email: 'newclient@example.com',
        emailVerified: null,
        image: null,
        password: null,
        role: 'CLIENT',
        phone: null,
        company: null,
        stripeCustomerId: null,
        preferences: null,
        createdAt: new Date('2025-01-03'),
        updatedAt: new Date('2025-01-03'),
      },
    ]);

    mockPrismaMessageFindMany.mockResolvedValue([
      {
        id: '1',
        createdAt: new Date('2025-01-04'),
        userId: 'user3',
        projectId: 'project1',
        content: 'Test message',
        type: 'GENERAL',
        isFromAdmin: false,
        priority: 'NORMAL',
        status: 'ACTIVE',
        subject: null,
        senderEmail: null,
        requiresEmailResponse: false,
        responseMethod: null,
        readAt: null,
        repliedAt: null,
        user: { name: 'Client 3', email: 'client3@example.com' },
        project: { title: 'Message Project' },
      } as any,
    ]);

    const request = new NextRequest('http://localhost:3000/api/admin/activities');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
    expect(data).toHaveProperty('meta');
    expect(data.meta).toHaveProperty('total');
    expect(data.meta).toHaveProperty('hasMore');

    // Verify activities are properly formatted
    if (data.data.length > 0) {
      const activity = data.data[0];
      expect(activity).toHaveProperty('id');
      expect(activity).toHaveProperty('type');
      expect(activity).toHaveProperty('title');
      expect(activity).toHaveProperty('description');
      expect(activity).toHaveProperty('timestamp');
      expect(activity).toHaveProperty('user');
    }
  });

  it('should filter activities by type', async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: '1',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
      expires: '2025-12-31',
    });

    // Mock only quote data
    mockPrismaQuoteFindMany.mockResolvedValue([
      {
        id: '1',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        userId: 'user1',
        serviceType: 'WEB',
        packageType: 'BASIC',
        selectedAddons: null,
        basePrice: 1000,
        addonsPrice: 0,
        totalPrice: 1000,
        currency: 'USD',
        timeline: 30,
        status: 'PENDING',
        notes: null,
        adminNotes: null,
        validUntil: new Date('2025-02-01'),
        user: { name: 'Client 1', email: 'client1@example.com' },
      } as any,
    ]);

    mockPrismaProjectFindMany.mockResolvedValue([]);
    mockPrismaUserFindMany.mockResolvedValue([]);
    mockPrismaMessageFindMany.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/admin/activities?type=quote');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    
    // All activities should be of type 'quote'
    data.data.forEach((activity: any) => {
      expect(activity.type).toBe('quote');
    });
  });

  it('should limit activities correctly', async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: '1',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
      expires: '2025-12-31',
    });

    // Mock multiple activities
    mockPrismaQuoteFindMany.mockResolvedValue(
      Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        createdAt: new Date(`2025-01-0${i + 1}`),
        updatedAt: new Date(`2025-01-0${i + 1}`),
        userId: `user${i + 1}`,
        serviceType: 'WEB',
        packageType: 'BASIC',
        selectedAddons: null,
        basePrice: 1000,
        addonsPrice: 0,
        totalPrice: 1000,
        currency: 'USD',
        timeline: 30,
        status: 'PENDING',
        notes: null,
        adminNotes: null,
        validUntil: new Date('2025-02-01'),
        user: { name: `Client ${i + 1}`, email: `client${i + 1}@example.com` },
      })) as any
    );

    mockPrismaProjectFindMany.mockResolvedValue([]);
    mockPrismaUserFindMany.mockResolvedValue([]);
    mockPrismaMessageFindMany.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/admin/activities?limit=3');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeLessThanOrEqual(3);
  });
});
