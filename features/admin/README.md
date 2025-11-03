# Admin Feature - Layered Architecture

This document explains the layered architecture for the admin features.

## Architecture Pattern

Each feature follows a 3-layer architecture:

```
features/admin/[feature]/
├── domain/          # Business entities and types
├── application/     # Use cases and business logic
└── presentation/    # UI components (React)
```

### Layer Responsibilities

#### Domain Layer

- **Purpose:** Define core business entities and types
- **Files:** `types.ts`
- **Rules:**
  - No dependencies on other layers
  - Pure TypeScript types and interfaces
  - Represents business concepts (User, FormTemplate, AuditLog, etc.)

#### Application Layer

- **Purpose:** Implement business logic and use cases
- **Files:** `*.service.ts`, repository interfaces
- **Rules:**
  - Depends only on domain layer
  - Contains business validation and orchestration
  - Defines repository interfaces (but doesn't implement them)
  - Independent of frameworks and UI

#### Presentation Layer

- **Purpose:** UI components and user interactions
- **Files:** React components (`*.tsx`)
- **Rules:**
  - Can depend on domain and application layers
  - Uses shadcn/ui components
  - Handles user input and display
  - Client components (`"use client"`) when needed

## Current Features

### 1. Forms Management (`/admin/forms`)

- **Domain:** FormTemplate, FormField, FormSchema types
- **Application:** FormTemplateService with CRUD operations
- **Presentation:**
  - `FormTemplateList` - Grid view of all templates
  - `FormTemplateBuilder` - Visual form editor with live preview

### 2. User Management (`/admin/users`)

- **Domain:** User, UserRole types
- **Application:** UserService with user CRUD and validation
- **Presentation:**
  - `UserManagementList` - Table view with search and filters

### 3. Audit Logs (`/admin/audit`)

- **Domain:** AuditLog, AuditLogFilter types
- **Application:** AuditLogService for querying logs
- **Presentation:**
  - `AuditLogViewer` - Searchable audit log table

## Navigation Structure

```
/admin
├── /admin              → Dashboard with stats
├── /admin/forms        → Form template list
│   └── /new            → Create new form template
├── /admin/users        → User management table
│   └── /new            → Create new user
└── /admin/audit        → Audit log viewer
```

## Component Usage

### shadcn/ui Components Available

- `Button` - Actions and navigation
- `Card` - Content containers
- `Dialog` - Modals
- `DropdownMenu` - Context menus
- `Table` - Data tables
- `Form` - Form controls
- `Input, Label, Select, Textarea` - Form fields
- `Badge` - Status indicators
- `Separator` - Visual dividers
- `Tabs` - Tabbed content

## Development Workflow

1. **Define types in domain layer**

   ```typescript
   // domain/types.ts
   export interface Entity {
     id: string;
     name: string;
   }
   ```

2. **Create service in application layer**

   ```typescript
   // application/entity.service.ts
   export interface EntityRepository {
     findAll(): Promise<Entity[]>;
   }

   export class EntityService {
     constructor(private repository: EntityRepository) {}
   }
   ```

3. **Build UI in presentation layer**

   ```tsx
   // presentation/entity-list.tsx
   'use client';
   export function EntityList() {
     // Component implementation
   }
   ```

4. **Connect in Next.js App Router**

   ```tsx
   // app/(admin)/admin/entities/page.tsx
   import { EntityList } from '@/features/admin/entities/presentation/entity-list';

   export default function EntitiesPage() {
     return <EntityList />;
   }
   ```

## Next Steps

- [ ] Implement repository layer with Prisma
- [ ] Add API routes in `app/api/`
- [ ] Connect presentation layer to real data
- [ ] Add form validation with Zod
- [ ] Implement authentication middleware
- [ ] Add server actions for mutations

## Benefits of This Architecture

1. **Separation of Concerns** - Each layer has a single responsibility
2. **Testability** - Business logic is isolated and easy to test
3. **Maintainability** - Changes to UI don't affect business logic
4. **Scalability** - Easy to add new features following the same pattern
5. **Type Safety** - TypeScript types flow through all layers
