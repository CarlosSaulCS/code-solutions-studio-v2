import { z } from 'zod';

// ================================
// USER SCHEMAS
// ================================

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  language: z.enum(['es', 'en']).default('es'),
  currency: z.enum(['USD', 'MXN']).default('USD'),
});

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const UserUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  bio: z.string().optional(),
  language: z.enum(['es', 'en']).optional(),
  currency: z.enum(['USD', 'MXN']).optional(),
  timezone: z.string().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ================================
// SERVICE SCHEMAS
// ================================

export const ServiceCreateSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  category: z.enum(['WEB_DEVELOPMENT', 'SOFTWARE_DEVELOPMENT', 'DATA_ANALYSIS', 'DIGITAL_MARKETING', 'CONSULTING', 'OTHER']),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  startingPrice: z.number().min(0, 'Starting price must be positive'),
  features: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const ServiceUpdateSchema = ServiceCreateSchema.partial();

// ================================
// PROJECT SCHEMAS
// ================================

export const ProjectCreateSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Description is required'),
  serviceId: z.string().cuid('Invalid service ID'),
  clientId: z.string().cuid('Invalid client ID'),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  deliveryDate: z.string().datetime().optional(),
  technologies: z.array(z.string()).optional(),
  requirements: z.string().optional(),
  deliverables: z.array(z.string()).optional(),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial().extend({
  status: z.enum(['QUOTE_PENDING', 'QUOTE_APPROVED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD']).optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  clientTestimonial: z.string().optional(),
  results: z.record(z.any()).optional(),
});

// ================================
// QUOTE SCHEMAS
// ================================

export const QuoteCreateSchema = z.object({
  clientId: z.string().cuid('Invalid client ID'),
  serviceId: z.string().cuid('Invalid service ID').optional(),
  title: z.string().min(1, 'Quote title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.record(z.any()).optional(),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  tax: z.number().min(0, 'Tax must be positive').default(0),
  discount: z.number().min(0, 'Discount must be positive').default(0),
  validUntil: z.string().datetime(),
  internalNotes: z.string().optional(),
  clientNotes: z.string().optional(),
});

export const QuoteUpdateSchema = QuoteCreateSchema.partial().extend({
  status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'APPROVED', 'REJECTED', 'EXPIRED']).optional(),
});

// ================================
// LEAD SCHEMAS
// ================================

export const LeadCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url().optional(),
  source: z.string().optional(),
  interestedIn: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export const LeadUpdateSchema = LeadCreateSchema.partial().extend({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'CONVERTED', 'LOST']).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().cuid().optional(),
  followUpDate: z.string().datetime().optional(),
});

// ================================
// COMMON SCHEMAS
// ================================

export const PaginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const IdParamSchema = z.object({
  id: z.string().cuid('Invalid ID format'),
});

// ================================
// TYPE EXPORTS
// ================================

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof ServiceUpdateSchema>;

export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

export type QuoteCreateInput = z.infer<typeof QuoteCreateSchema>;
export type QuoteUpdateInput = z.infer<typeof QuoteUpdateSchema>;

export type LeadCreateInput = z.infer<typeof LeadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof LeadUpdateSchema>;

export type PaginationInput = z.infer<typeof PaginationSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;
