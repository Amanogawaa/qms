# Copilot Instructions for Barangay Queue Management System

## Project Overview

This is a **home-first digital queue management system** for barangay (local government) services in the Philippines. The goal is to eliminate physical queuing by allowing residents to pre-fill forms at home, receive digital tickets, and only visit the barangay hall when their turn is ready.

**Key Document:** See `Home-First_ Digital Queue & Form Pre-filling Solution.md` for complete business requirements, target users (Residents, Staff, Admin), and feature specifications.

## Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode enabled)
- **Styling:** Tailwind CSS 4 with PostCSS
- **Fonts:** Geist Sans & Geist Mono (optimized via `next/font`)
- **Path Aliases:** `@/*` maps to project root (configured in `tsconfig.json`)

### Backend Stack

- **Database:** PostgreSQL with Prisma ORM (Vercel Postgres for hosting)
- **Authentication:** NextAuth.js v5 (Auth.js) with credentials provider + RBAC
- **Real-time:** WebSocket/Socket.io for live queue updates and push notifications
- **API:** Next.js API Routes (under `app/api/`)
- **File Storage:** TBD (Vercel Blob Storage or Cloudinary for document uploads)

## Project Structure

```
app/              # Next.js App Router pages and layouts
├── layout.tsx    # Root layout with Geist fonts and metadata
├── page.tsx      # Homepage (currently starter template)
└── globals.css   # Tailwind imports and CSS custom properties
public/           # Static assets (SVGs, images)
```

## Implementation Priorities

### Phase 1: Admin Dashboard & Foundation (CURRENT FOCUS)

**Why Admin First:** Form Builder and system configuration are prerequisites for all other features. Staff need admin-defined forms before residents can submit anything.

**Priority Order:**

1. **Database Schema with Prisma** - Define models for Users, Forms, Queues, Tickets, Documents, AuditLogs
2. **Authentication System** - NextAuth.js setup with credentials provider and role-based sessions
3. **Admin Form Builder** - JSON schema creator for dynamic document types (Indigency, Clearances, Business Permits)
4. **Admin User Management** - Create/manage staff and officer accounts with role assignments
5. **Basic Audit Logging** - Track all administrative actions with timestamps

### Phase 2: Officer Dashboard & Queue Management

6. **Officer Queue Dashboard** - View active queues, call next ticket, see resident details
7. **QR Code Scanner Integration** - Scan resident tickets to auto-populate forms
8. **Ticket Approval/Rejection** - One-click approve/reject with validation workflow
9. **Document Generation** - PDF export for approved certificates/clearances

### Phase 3: Resident Portal

10. **Resident Registration** - Simple signup with basic verification
11. **Form Submission Portal** - Mobile-first UI using admin-defined schemas
12. **File Upload System** - Upload proof documents (ID, residency proof)
13. **Ticket Generation** - Issue unique queue tickets with QR codes and ETAs

### Phase 4: Real-time Features

14. **WebSocket Integration** - Real-time queue position updates
15. **Push Notifications** - In-app alerts for "Your turn in 5 min" (no SMS initially)
16. **Live Queue Display** - Public screen showing current queue status

### Deferred Features (Post-MVP)

- SMS notifications via gateway (low priority, replaced by push notifications)
- Advanced analytics and reporting
- Multi-barangay support
- Mobile app (PWA sufficient for now)

## Development Workflows

**Start dev server:**

```bash
npm run dev  # Runs on http://localhost:3000
```

**Build for production:**

```bash
npm run build
npm start
```

**Linting:**

```bash
npm run lint  # Uses ESLint 9 with Next.js config
```

## Code Conventions

### TypeScript Patterns

- Use `type` for React component props (see `Metadata` import pattern in `layout.tsx`)
- Prefer `Readonly<{}>` for immutable props
- Strict mode enabled - handle all null/undefined cases explicitly

### Styling Guidelines

- **Mobile-first approach** - Start with mobile breakpoints, use `sm:`, `md:`, etc. for larger screens
- Use Tailwind utility classes directly in JSX (no separate CSS modules)
- CSS custom properties defined in `globals.css` via `@theme inline` for Tailwind 4
- Dark mode via `dark:` prefix (automatic via `prefers-color-scheme`)
- Color tokens: `--color-background`, `--color-foreground` (customizable in globals.css)

### Component Structure

```tsx
// Example pattern from page.tsx
export default function ComponentName() {
  return (
    <div className="flex min-h-screen ...">
      {/* Mobile-first, dark mode support */}
    </div>
  );
}
```

### File Organization

- Use Next.js App Router conventions (no `pages/` directory)
- Server Components by default - add `"use client"` only when needed
- Co-locate related files (components, hooks, utils) near their usage

## Key Design Decisions

1. **No Backend Yet** - This is a fresh Next.js scaffold. Backend API routes and database integration need to be added under `app/api/`.

2. **Tailwind 4 with PostCSS** - Uses new `@import "tailwindcss"` syntax instead of `@tailwind` directives. Custom theme values go in `@theme inline` blocks.

3. **Path Aliases** - Import from project root using `@/`:

   ```typescript
   import { Component } from '@/components/Component';
   ```

4. **Font Optimization** - Geist fonts are self-hosted and optimized via `next/font/google`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`.

## Business Context

**Problem Being Solved:**

- Residents wait 30-120 minutes in physical lines
- Officers manually re-enter data on paper forms
- No queue transparency or COVID-19 safety measures
- Forms get lost/misplaced

**Solution:**

- Pre-fill forms at home → Get digital ticket → Visit only when notified
- Officers scan QR, validate pre-filled data, approve in one click
- Real-time queue visibility for everyone

**Critical User Flows:**

1. Resident submits form + documents → receives ticket #XYZ with QR code
2. Barangay staff sees queue dashboard → calls next ticket
3. Resident arrives, officer scans QR → auto-populates data → validates → issues document
4. Audit log captures all actions with timestamps

## Integration Points

- **QR Code Generation:** Use `qrcode` or `react-qr-code` for ticket QR codes
- **PDF Generation:** For form previews and final documents (use `react-pdf` or `@react-pdf/renderer`)
- **WebSocket:** Socket.io for real-time queue updates and in-app push notifications
- **File Upload:** Vercel Blob Storage for document uploads (ID, residency proof, supporting docs)
- **SMS Gateway:** Deferred - using WebSocket push notifications instead for Phase 1-3

## Security Considerations

- NextAuth.js credentials provider with bcrypt-hashed passwords
- RBAC middleware via NextAuth session callbacks (resident/staff/admin roles)
- Validate and sanitize all form inputs, especially JSON schemas from Form Builder
- Rate limiting on ticket generation and auth endpoints to prevent abuse
- Secure QR codes with HMAC signatures to prevent ticket forgery
- Audit logs should be append-only (use Prisma transactions for immutability)
- CSRF protection built into NextAuth.js
- Sanitize user-uploaded files (validate file types, scan for malware if budget allows)

## Next Steps for AI Agents

When implementing features:

1. **Check the proposal doc first** - All requirements are detailed in `Home-First_ Digital Queue & Form Pre-filling Solution.md`
2. **Start with Prisma schema** - Define database models before building API routes or UI
3. **Start with API design** - Create Next.js API routes under `app/api/` before building UI
4. **Build mobile-first** - Residents will primarily use mobile devices
5. **Consider offline scenarios** - Queue tickets should work even with poor connectivity
6. **Prioritize real-time updates** - Queue position changes need instant visibility
7. **Design for auditability** - Every state change should be logged with who/what/when

## Questions to Clarify

- Database choice: MongoDB (flexible schemas for forms) vs PostgreSQL (relational integrity)?
- Authentication provider: Custom JWT or third-party (Firebase, Auth0, NextAuth)?
- File storage: Local filesystem, cloud storage, or both?
- Deployment target: Vercel, on-premise server, or hybrid?
