import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/register/route';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Mock modules
jest.mock('next-auth/next');
jest.mock('bcryptjs');
jest.mock('@/lib/email');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockBcryptHash = bcrypt.hash as jest.Mock;
const mockPrismaUserFindUnique = prisma.user.findUnique as jest.Mock;
const mockPrismaUserCreate = prisma.user.create as jest.Mock;

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockBcryptHash as jest.Mock).mockResolvedValue('hashed_password');
  });

  it('should register a new user successfully', async () => {
    // Mock no existing user
    mockPrismaUserFindUnique.mockResolvedValue(null);
    
    // Mock user creation (only return selected fields as the actual query does)
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: null,
      company: null,
      role: 'CLIENT',
      createdAt: new Date(),
    };
    mockPrismaUserCreate.mockResolvedValue(mockUser);

    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message');
    expect(data.user).toHaveProperty('email', 'test@example.com');
    expect(data.user).not.toHaveProperty('password');
  });

  it('should return error for existing user', async () => {
    // Mock existing user
    mockPrismaUserFindUnique.mockResolvedValue({
      id: '1',
      name: 'Existing User',
      email: 'existing@example.com',
      emailVerified: null,
      image: null,
      password: 'hashed_password',
      role: 'CLIENT',
      phone: null,
      company: null,
      stripeCustomerId: null,
      preferences: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const requestBody = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Ya existe un usuario con este email');
  });

  it('should validate required fields', async () => {
    const requestBody = {
      email: 'test@example.com',
      // Missing name and password
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('should validate email format', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Datos inválidos');
  });

  it('should validate password length', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123', // Too short
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Datos inválidos');
  });
});
