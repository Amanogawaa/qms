# Architecture & Implementation Plan

## Tech Stack (Confirmed)

### Frontend

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Approach:** Mobile-first, progressive enhancement

### Backend

- **Database:** PostgreSQL (Vercel Postgres)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5 (credentials provider)
- **Real-time:** Socket.io for WebSocket connections
- **File Storage:** Vercel Blob Storage (for document uploads)

### Deployment

- **Current Plan:** TBD (keep options open for Vercel or on-premise)
- **Strategy:** Build cloud-ready but keep architecture flexible for migration

---

## Database Schema Design (Prisma)

### Core Models

```prisma
// User authentication and roles
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          UserRole  @default(RESIDENT)

  firstName     String
  lastName      String
  phoneNumber   String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  tickets       Ticket[]
  submissions   FormSubmission[]
  auditLogs     AuditLog[]

  // For staff/officers
  assignedQueues Queue[]
}

enum UserRole {
  RESIDENT
  STAFF
  OFFICER
  ADMIN
}

// Dynamic form templates (created by admin)
model FormTemplate {
  id            String    @id @default(cuid())
  name          String    // "Barangay Indigency Certificate"
  slug          String    @unique // "indigency-certificate"
  description   String?

  // JSON Schema for form fields
  schema        Json      // { fields: [...], validations: {...} }

  isActive      Boolean   @default(true)
  requiresApproval Boolean @default(true)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  createdById   String

  // Relations
  submissions   FormSubmission[]
}

// Resident form submissions
model FormSubmission {
  id            String    @id @default(cuid())

  formTemplateId String
  formTemplate  FormTemplate @relation(fields: [formTemplateId], references: [id])

  userId        String
  user          User      @relation(fields: [userId], references: [id])

  // Form data (JSON matching the template schema)
  data          Json

  status        SubmissionStatus @default(PENDING)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  ticket        Ticket?
  documents     Document[]
  auditLogs     AuditLog[]
}

enum SubmissionStatus {
  PENDING
  IN_QUEUE
  IN_PROGRESS
  APPROVED
  REJECTED
  CANCELLED
}

// Queue tickets with QR codes
model Ticket {
  id            String    @id @default(cuid())
  ticketNumber  String    @unique // "BRG-2025-001234"

  qrCode        String    // Base64 or URL to QR code image
  qrSignature   String    // HMAC signature to prevent forgery

  submissionId  String    @unique
  submission    FormSubmission @relation(fields: [submissionId], references: [id])

  userId        String
  user          User      @relation(fields: [userId], references: [id])

  queueId       String?
  queue         Queue?    @relation(fields: [queueId], references: [id])

  position      Int?      // Position in queue
  estimatedTime DateTime? // ETA when ticket will be called

  status        TicketStatus @default(ISSUED)

  issuedAt      DateTime  @default(now())
  calledAt      DateTime?
  servedAt      DateTime?
  completedAt   DateTime?

  // Relations
  auditLogs     AuditLog[]
}

enum TicketStatus {
  ISSUED
  IN_QUEUE
  CALLED
  SERVING
  COMPLETED
  NO_SHOW
  CANCELLED
}

// Active queues managed by officers
model Queue {
  id            String    @id @default(cuid())
  name          String    // "Window 1 - General Documents"

  officerId     String
  officer       User      @relation(fields: [officerId], references: [id])

  isActive      Boolean   @default(true)

  currentTicket String?   // Currently serving ticket number

  createdAt     DateTime  @default(now())
  closedAt      DateTime?

  // Relations
  tickets       Ticket[]
  auditLogs     AuditLog[]
}

// Document uploads (ID, proof of residency, etc.)
model Document {
  id            String    @id @default(cuid())

  submissionId  String
  submission    FormSubmission @relation(fields: [submissionId], references: [id])

  fileName      String
  fileType      String    // "application/pdf", "image/jpeg"
  fileSize      Int       // bytes
  fileUrl       String    // Vercel Blob Storage URL

  documentType  String    // "valid_id", "proof_of_residency", "supporting_doc"

  uploadedAt    DateTime  @default(now())
}

// Immutable audit trail
model AuditLog {
  id            String    @id @default(cuid())

  action        String    // "ticket.issued", "submission.approved", etc.
  entityType    String    // "Ticket", "FormSubmission", "User"
  entityId      String

  userId        String?
  user          User?     @relation(fields: [userId], references: [id])

  // Who did what
  actorRole     UserRole?

  // Before/after state (for rollback/compliance)
  oldValue      Json?
  newValue      Json?

  ipAddress     String?
  userAgent     String?

  timestamp     DateTime  @default(now())

  // Relations (nullable for flexibility)
  submissionId  String?
  submission    FormSubmission? @relation(fields: [submissionId], references: [id])

  ticketId      String?
  ticket        Ticket?   @relation(fields: [ticketId], references: [id])

  queueId       String?
  queue         Queue?    @relation(fields: [queueId], references: [id])
}
```

### Key Design Decisions

1. **JSON Schema Storage** - Form templates use JSON for flexibility (admin can create any form structure)
2. **Audit Trail** - Separate table with before/after snapshots for compliance
3. **QR Security** - Store HMAC signature with each ticket to prevent forgery
4. **Queue Management** - Officers can manage multiple queues (windows)
5. **Soft Deletes** - Use `isActive` flags instead of hard deletes for auditability

---

## Phase 1: Admin Dashboard Implementation Plan

### 1.1 Project Setup & Dependencies

**Install these first:**

```bash
npm install @prisma/client bcryptjs
npm install -D prisma @types/bcryptjs

npm install next-auth@beta  # NextAuth.js v5
npm install @auth/prisma-adapter

npm install zod  # For form validation
npm install react-hook-form @hookform/resolvers  # Form handling

npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu  # Headless UI
npm install lucide-react  # Icons
```

**Set up Prisma:**

```bash
npx prisma init
# This creates prisma/schema.prisma and .env
```

### 1.2 Database Schema Implementation

**Tasks:**

1. Copy the Prisma schema above into `prisma/schema.prisma`
2. Set up Vercel Postgres connection string in `.env`
3. Run `npx prisma db push` to create tables
4. Generate Prisma Client: `npx prisma generate`

**Environment Variables (.env.local):**

```env
# Database
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

### 1.3 Authentication Setup (NextAuth.js v5)

**File Structure:**

```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
lib/
├── auth.ts          # NextAuth config
├── auth-options.ts  # Session callbacks, RBAC
└── prisma.ts        # Prisma client singleton
```

**Key Features:**

- Credentials provider (email/password)
- bcrypt password hashing
- Session with role information (resident/staff/admin)
- RBAC middleware to protect admin routes

### 1.4 Admin Form Builder

**UI Components:**

1. **Form Template List** - View all form templates
2. **Form Builder UI** - Drag-and-drop or JSON editor
3. **Field Type Options:**
   - Text input (short/long)
   - Number input
   - Date picker
   - Dropdown/Select
   - Radio buttons
   - Checkbox
   - File upload
   - Address (with barangay, city, province)

**JSON Schema Format (Example):**

```json
{
  "formId": "indigency-certificate",
  "title": "Barangay Indigency Certificate",
  "fields": [
    {
      "id": "full_name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "validation": {
        "minLength": 3,
        "maxLength": 100
      }
    },
    {
      "id": "birth_date",
      "type": "date",
      "label": "Date of Birth",
      "required": true
    },
    {
      "id": "purpose",
      "type": "select",
      "label": "Purpose",
      "required": true,
      "options": [
        "Medical Assistance",
        "Financial Assistance",
        "Educational Scholarship",
        "Other"
      ]
    }
  ]
}
```

### 1.5 Admin User Management

**Features:**

1. Create new users (staff/officers)
2. Assign roles (STAFF, OFFICER, ADMIN)
3. Deactivate accounts (soft delete)
4. Reset passwords (generate temporary password)
5. View user activity logs

**Pages:**

- `/admin/users` - List all users
- `/admin/users/new` - Create new user
- `/admin/users/[id]` - View/edit user

### 1.6 Admin Audit Log Viewer

**Features:**

1. Filter by date range, user, action type
2. Search by entity ID (ticket number, submission ID)
3. View before/after states
4. Export to CSV for compliance

---

## Phase 2: Officer Dashboard (Next Priority)

### 2.1 Queue Management

**Officer Dashboard UI:**

- See all tickets in their queue
- "Call Next" button to summon next resident
- Current serving ticket prominently displayed
- Mark ticket as complete/no-show

### 2.2 QR Code Scanner

**Implementation:**

- Use `react-qr-scanner` or browser Web APIs
- Scan ticket QR → verify HMAC signature → auto-populate form
- Display pre-filled form data for validation

### 2.3 Ticket Processing

**Workflow:**

1. Officer scans QR code
2. System loads submission data
3. Officer reviews pre-filled form
4. One-click approve/reject
5. If approved: Generate PDF certificate
6. Audit log records all actions

---

## Phase 3: Resident Portal (After Admin + Officer)

### 3.1 Resident Registration

- Simple signup form
- Email verification (optional for MVP)
- Phone number for notifications

### 3.2 Form Submission

- Mobile-first UI
- Dynamically render form based on admin-defined schema
- Real-time validation
- Save draft functionality

### 3.3 Document Upload

- Upload ID, proof of residency
- File size limits (5MB per file)
- Image compression for mobile uploads

### 3.4 Ticket Generation

- Generate unique ticket number
- Create QR code with HMAC signature
- Display ticket with ETA
- Downloadable PDF ticket

---

## Phase 4: Real-time Features

### 4.1 WebSocket Integration

- Socket.io server in Next.js API routes
- Real-time queue position updates
- Push notifications to residents

### 4.2 Live Queue Display

- Public TV screen showing current queue
- Auto-refresh every few seconds
- Large readable fonts for waiting area

---

## Critical Questions Before Implementation

### 1. Form Builder UX

**Question:** Should we build a visual drag-and-drop form builder (complex, better UX) or start with a JSON editor for admins (simpler, faster to implement)?

**Recommendation:** Start with JSON editor + live preview. Add drag-and-drop in Phase 2 if needed.

### 2. Multi-Barangay Support

**Question:** Should the database schema support multiple barangays from the start?

**Current:** Single barangay assumption  
**If multi-barangay:** Add `Barangay` model and foreign keys to all tables

### 3. Document Approval Workflow

**Question:** Should documents go through multi-step approval (submit → review → approve → issue)?

**Recommendation:** Keep it simple for MVP:

- Submit → Auto-queue → Officer validates → Approve/Reject
- Add multi-step later if officials request it

### 4. Queue Assignment Logic

**Question:** How should tickets be assigned to queues/windows?

**Options:**

- **Manual:** Resident chooses window when submitting
- **Auto-assign:** System balances load across active queues
- **Document-type based:** Indigency goes to Window 1, Clearances to Window 2

**Recommendation:** Start with manual selection, add auto-assignment later.

### 5. Offline Support

**Question:** Should residents be able to fill forms offline?

**Recommendation:** Not in MVP. Focus on connectivity in barangay hall (WiFi). Add PWA offline support later.

### 6. Payment Integration

**Question:** Do any documents require payment (document fees)?

**If yes:** Need payment gateway integration (GCash, PayMongo)  
**For now:** Assume free or cash payment at counter

---

## Next Steps

1. **Review this plan** - Let me know if anything doesn't match your vision
2. **Clarify critical questions** above
3. **Start with Prisma schema** - Set up database first
4. **Build authentication** - NextAuth.js implementation
5. **Admin Form Builder** - First major feature

Once you approve this plan, I can start implementing step-by-step. What do you think?
