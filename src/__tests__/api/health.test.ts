import { GET } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

describe('/api/health', () => {
  const createMockRequest = () => {
    return new NextRequest('http://localhost:3000/api/health', {
      method: 'GET',
    });
  };

  it('should return health status', async () => {
    const request = createMockRequest();
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('database');
    expect(data).toHaveProperty('integrations');
    expect(data).toHaveProperty('features');
    expect(data).toHaveProperty('configuration');
  });

  it('should include service integrations', async () => {
    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.integrations).toHaveProperty('resend');
    expect(data.integrations).toHaveProperty('stripe');
    expect(data.integrations.resend).toMatch(/^(configured|not configured)$/);
    expect(data.integrations.stripe).toMatch(/^(configured|not configured)$/);
    
    expect(data.database).toHaveProperty('connected', true);
    expect(data.features).toHaveProperty('authentication');
    expect(data.features).toHaveProperty('payments');
  });
});
