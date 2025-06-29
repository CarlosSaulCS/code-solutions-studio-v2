import { cn, formatCurrency, formatDate, validateEmail, generateQuoteId } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should combine class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).toContain('active');
    });

    it('should handle falsy values', () => {
      const result = cn('base', false, null, undefined, 'valid');
      expect(result).toContain('base');
      expect(result).toContain('valid');
      expect(result).not.toContain('false');
      expect(result).not.toContain('null');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in USD by default', () => {
      const result = formatCurrency(1500);
      expect(result).toBe('$1,500.00');
    });

    it('should format currency in MXN', () => {
      const result = formatCurrency(1500, 'MXN');
      expect(result).toContain('1,500');
      expect(result).toContain('MX');
    });

    it('should handle zero values', () => {
      const result = formatCurrency(0);
      expect(result).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      const result = formatCurrency(1000000);
      expect(result).toBe('$1,000,000.00');
    });

    it('should handle decimal values', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });
  });

  describe('formatDate', () => {
    it('should format date with default options', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/ene|jan/i); // Month abbreviation
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('should format date with custom options', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      const result = formatDate(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(result).toContain('2025');
      expect(result).toContain('15');
    });

  it('should handle string dates', () => {
    const result = formatDate('2025-01-15');
    expect(result).toContain('2025');
    // Note: Date parsing might vary by timezone, so we check for the presence of year
  });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin@codesolutions.studio',
        'test+tag@example.org',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        '',
        'user name@domain.com',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
      expect(validateEmail(' ')).toBe(false);
    });
  });

  describe('generateQuoteId', () => {
    it('should generate a quote ID with correct format', () => {
      const quoteId = generateQuoteId();
      expect(quoteId).toMatch(/^QUOTE-\d{4}-\w{8}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateQuoteId();
      const id2 = generateQuoteId();
      expect(id1).not.toBe(id2);
    });

    it('should include current year', () => {
      const quoteId = generateQuoteId();
      const currentYear = new Date().getFullYear().toString();
      expect(quoteId).toContain(currentYear);
    });

  it('should start with QUOTE- prefix', () => {
    const quoteId = generateQuoteId();
    expect(quoteId.startsWith('QUOTE-')).toBe(true);
  });
  });
});
