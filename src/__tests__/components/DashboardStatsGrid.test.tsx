import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardStatsGrid from '@/components/DashboardStatsGrid';

// Mock props
const mockStats = {
  totalQuotes: 150,
  approvedQuotes: 120,
  totalProjects: 85,
  completedProjects: 70,
  totalBudget: 125000,
  averageProjectDuration: 30,
  activeProjects: 15,
  pendingQuotes: 30,
};

const mockFormatPrice = (price: number, currency: string) => {
  if (price === undefined || price === null) return '0';
  return `$${price.toLocaleString()}`;
};

const defaultProps = {
  stats: mockStats,
  currency: 'USD',
  language: 'en' as const,
  formatPrice: mockFormatPrice,
};

describe('DashboardStatsGrid', () => {
  it('renders stats correctly', () => {
    render(<DashboardStatsGrid {...defaultProps} />);
    
    // Check if major stat values are displayed - using unique values that appear in DOM
    expect(screen.getByText('150')).toBeInTheDocument(); // totalQuotes
    expect(screen.getByText(/120/)).toBeInTheDocument(); // approvedQuotes (part of "120 approved")
    expect(screen.getByText('15')).toBeInTheDocument(); // activeProjects
    // Check for labels to ensure component structure is correct
    expect(screen.getByText('Total Quotes')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<DashboardStatsGrid {...defaultProps} />);
    
    // Check for formatted currency (should contain $ or currency symbols)
    const revenueElements = screen.getAllByText(/\$|€|£|USD/i);
    expect(revenueElements.length).toBeGreaterThan(0);
  });

  it('displays all stat categories', () => {
    render(<DashboardStatsGrid {...defaultProps} />);
    
    // Check that the component renders without crashing by looking for key labels
    expect(screen.getByText('Total Quotes')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument(); // Check for approvedQuotes in subtitle
    expect(screen.getByText('15')).toBeInTheDocument(); // activeProjects value
  });
});
