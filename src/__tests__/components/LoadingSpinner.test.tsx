import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner without text by default', () => {
    render(<LoadingSpinner />);

    const container = screen.getByTestId('loading-spinner');
    const spinner = screen.getByTestId('spinner');
    
    expect(container).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin', 'w-6', 'h-6');
  });

  it('should render with custom text', () => {
    render(<LoadingSpinner text="Procesando..." />);
    
    expect(screen.getByText('Procesando...')).toBeInTheDocument();
  });

  it('should apply different sizes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="lg" />);
    spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('should apply custom className when provided', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const container = screen.getByTestId('loading-spinner');
    expect(container).toHaveClass('custom-class');
  });
});
