# Barangay QMS - System Architecture Diagram

## Layered Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│                   (React Components / Next.js)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Form Builder │  │    Users     │  │  Audit Logs  │          │
│  │  Components  │  │  Components  │  │  Components  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│                    (Business Logic / Services)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   FormTemplate │  │     User     │  │   AuditLog   │          │
│  │    Service    │  │   Service    │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Domain Layer                             │
│                 (Types, Interfaces, Entities)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ FormTemplate │  │     User     │  │   AuditLog   │          │
│  │    Types     │  │    Types     │  │    Types     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                          │
│                  (Database, External Services)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Prisma     │  │   NextAuth   │  │ Vercel Blob  │          │
│  │  Repository  │  │ Authentication│  │   Storage    │          │
│  └──────┬───────┘  └──────────────┘  └──────────────┘          │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────┐        │
│  │         PostgreSQL (Vercel Postgres)                 │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Feature Architecture (Example: Form Management)

```
features/admin/forms/
│
├── domain/
│   └── types.ts                    ← Pure TypeScript types
│       ├── FormTemplate
│       ├── FormField
│       ├── FormSchema
│       └── DTOs (Create, Update)
│
├── application/
│   └── form-template.service.ts    ← Business logic
│       ├── FormTemplateRepository (interface)
│       ├── FormTemplateService (class)
│       │   ├── getAllTemplates()
│       │   ├── createTemplate()
│       │   ├── updateTemplate()
│       │   └── deleteTemplate()
│       └── Validation logic
│
└── presentation/
    ├── admin-sidebar.tsx           ← Navigation component
    ├── form-template-list.tsx      ← List view
    └── form-template-builder.tsx   ← Form editor
        ├── Uses shadcn/ui components
        ├── Client-side state
        └── Calls application services
```

## Data Flow

### Creating a Form Template

```
User Action (Presentation)
    │
    ├─ Click "Save Template" button
    │
    ▼
FormTemplateBuilder Component
    │
    ├─ Validates form data
    ├─ Constructs CreateFormTemplateDTO
    │
    ▼
FormTemplateService.createTemplate()
    │
    ├─ Business validation
    ├─ Check slug uniqueness
    │
    ▼
FormTemplateRepository.create()
    │
    ├─ Prisma query
    ├─ INSERT INTO form_templates
    │
    ▼
Database (PostgreSQL)
    │
    ├─ Returns created record
    │
    ▼
Navigate to /admin/forms
```

## Admin Dashboard Flow

```
                  ┌──────────────────┐
                  │   Admin Login    │
                  │  (Future: Auth)  │
                  └────────┬─────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │      Admin Dashboard          │
            │   /admin (stats overview)     │
            └──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                   │
        ▼                  ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Form Builder │  │    Users     │  │  Audit Logs  │
│ /admin/forms │  │/admin/users  │  │/admin/audit  │
└──────────────┘  └──────────────┘  └──────────────┘
        │
        ├─ View templates
        ├─ Create new form
        │   └─ /admin/forms/new
        │       ├─ Add fields
        │       ├─ Configure validation
        │       └─ Live preview
        └─ Edit existing form
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Client)                     │
├─────────────────────────────────────────────────────────┤
│  React 19 + Next.js 16 (App Router)                     │
│  TypeScript (strict mode)                                │
│  Tailwind CSS 4                                          │
│  shadcn/ui (Radix UI primitives)                        │
│  Lucide React (icons)                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Backend (Server)                        │
├─────────────────────────────────────────────────────────┤
│  Next.js API Routes (app/api/)                          │
│  Server Actions (future)                                 │
│  NextAuth.js v5 (authentication)                        │
│  Zod (validation)                                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Data Layer                              │
├─────────────────────────────────────────────────────────┤
│  Prisma ORM                                              │
│  PostgreSQL (Vercel Postgres)                           │
│  Vercel Blob Storage (file uploads)                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Real-time (Future)                      │
├─────────────────────────────────────────────────────────┤
│  Socket.io (WebSocket)                                   │
│  Push notifications                                      │
│  Live queue updates                                      │
└─────────────────────────────────────────────────────────┘
```

## Folder Structure

```
qms/
├── app/                              # Next.js App Router
│   ├── (admin)/                      # Admin route group
│   │   └── admin/
│   │       ├── layout.tsx            # Sidebar layout
│   │       ├── page.tsx              # Dashboard
│   │       ├── forms/
│   │       ├── users/
│   │       └── audit/
│   ├── api/                          # API routes (future)
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   └── globals.css                   # Tailwind CSS
│
├── features/                         # Feature modules
│   └── admin/
│       ├── forms/
│       │   ├── domain/
│       │   ├── application/
│       │   └── presentation/
│       ├── users/
│       └── audit/
│
├── components/                       # Shared components
│   └── ui/                           # shadcn/ui components
│
├── lib/                              # Utilities
│   └── utils.ts                      # cn() helper
│
├── prisma/                           # Prisma schema (future)
│   └── schema.prisma
│
└── public/                           # Static assets
```

## Security Layers (Future Implementation)

```
┌─────────────────────────────────────────────────────────┐
│  1. Authentication (NextAuth.js)                         │
│     - Credentials provider                               │
│     - bcrypt password hashing                            │
│     - Session management                                 │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  2. Authorization (RBAC)                                 │
│     - Role-based middleware                              │
│     - Route protection                                   │
│     - Feature-level permissions                          │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  3. Input Validation (Zod)                               │
│     - Schema validation                                  │
│     - Sanitization                                       │
│     - Type safety                                        │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  4. Audit Logging                                        │
│     - All actions logged                                 │
│     - Immutable records                                  │
│     - Compliance trail                                   │
└─────────────────────────────────────────────────────────┘
```

---

**Legend:**

- `→` Data flow direction
- `├─` Dependency relationship
- `▼` Process flow
- `┌─┐` System boundary
