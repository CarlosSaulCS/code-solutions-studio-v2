<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Code Solutions Studio - Copilot Instructions

## Project Overview

This is a comprehensive e-commerce platform for "Code Solutions Studio" - a digital services marketplace specializing in:

- Web Development
- Software Development
- Data Analysis
- Digital Marketing
- Technology Consulting

## Tech Stack

- **Frontend**: React 18 + TypeScript + Next.js 15
- **Styling**: Tailwind CSS v3
- **Routing**: Next.js App Router
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Database**: Prisma + SQLite
- **Auth**: NextAuth.js
- **Email**: Resend
- **Utils**: clsx + tailwind-merge

## Design System & Branding

- **Brand Personality**: Professional, Innovative, Trustworthy
- **Design Style**: Modern, Elegant, Minimalist
- **Color Palette**:
  - Primary: Blue shades (primary-500 to primary-900)
  - Secondary: Neutral grays (secondary-100 to secondary-900)
- **Typography**: Inter font family
- **Logo**: "CS" in gradient circle + "Code Solutions Studio" text

## Code Conventions

- Use TypeScript for all components and utilities
- Follow functional component patterns with hooks
- Use Tailwind CSS utility classes and custom components
- Implement responsive design (mobile-first)
- Use proper semantic HTML and accessibility features
- Follow React best practices for state management
- Use custom utility function `cn()` for conditional classes

## Component Structure

- Layout components in `src/components/layout/`
- UI components in `src/components/ui/`
- App pages in `src/app/`
- Types in `src/types/`
- Utilities in `src/utils/`
- Custom hooks in `src/hooks/`
- API routes in `src/app/api/`

## Key Features to Implement

1. **Frontend**:

   - Landing page with services showcase
   - User authentication (login/register)
   - Service catalog with detailed pages
   - Online quotation system
   - Portfolio showcase
   - Contact forms
   - Customer dashboard
   - Admin dashboard (CRM/ERP style)

2. **Backend** (Next.js API Routes):
   - RESTful API design with Next.js API routes
   - Prisma ORM with SQLite database
   - Authentication & authorization (NextAuth.js)
   - Payment processing (Stripe)
   - File upload handling
   - Email notifications (Resend)

## Services Offered

1. **Web Development**: Modern websites, e-commerce, responsive design
2. **Software Development**: Custom applications, mobile apps, APIs
3. **Data Analysis**: Dashboards, ML, reporting, visualization
4. **Digital Marketing**: Google Ads, Facebook Ads, SEO, social media
5. **Technology Consulting**: Architecture, migration, optimization

## Development Guidelines

- Prioritize user experience and accessibility
- Implement proper error handling and loading states
- Use consistent naming conventions
- Write clean, maintainable code
- Focus on performance optimization
- Ensure mobile responsiveness
- Follow SEO best practices
- Implement proper form validation
- Use TypeScript strictly (no `any` types)

## Styling Guidelines

- Use Tailwind CSS utility classes
- Create reusable component styles in `@layer components`
- Maintain consistent spacing and typography
- Use the custom color palette defined in tailwind.config.js
- Implement smooth transitions and hover effects
- Follow mobile-first responsive design principles
