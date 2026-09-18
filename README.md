# DETOX — Student Engineering & Builder Showcase

DETOX is a collaborative web platform designed for student engineering laboratories, compiler hackers, kernel tinkerers, and hardware builders. It provides an interactive, visual showcase of student research projects, events, salons, and builder profiles, backed by an authoritative Supabase backend with role-based access control.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **Icons & Visuals**: Lucide React, Three.js
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Deployment**: Vercel (Single Page Application with client-side routing)

---

## 🔐 Role & Security Model

The platform enforces a three-tiered permission hierarchy at both the database level (PostgreSQL RLS) and frontend UI:

1. **Member (`member`)**:
   - Default role assigned upon registration.
   - Access to view published projects, events, accomplishments, and community showcases.
   - Ability to manage their own builder profile (name, bio, skills).
   - Storage upload permissions scoped strictly to their own avatar files.
   - Protected from modifying roles, account status, or other members' data.

2. **Admin (`admin`)**:
   - Content management across the platform (creating, drafting, editing, and publishing projects, events, media, and people profiles).
   - Access to the Control Room (CMS admin dashboard).
   - Full storage management privileges across content buckets (`people`, `projects`, `events`, `media`).

3. **Super Admin (`superadmin`)**:
   - All admin capabilities.
   - User account lifecycle and permission management (promoting members to `admin` or `superadmin`, updating member status).
   - Superadmin elevation is strictly restricted to direct database migrations or service-level administrative execution.

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- A **Supabase** project instance

### 2. Environment Setup

Copy the example environment file and populate it with your Supabase credentials:

```bash
cp .env.example .env
```

Define the following environment variables in `.env`:

```env
# Supabase Project Credentials (Settings -> API in Supabase Dashboard)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Note:** Never commit `.env` or service role keys to source control. The frontend client only requires the public anonymous key (`VITE_SUPABASE_ANON_KEY`).

### 3. Database & Storage Migrations

Apply the SQL migrations located in `supabase/migrations/` sequentially in your Supabase SQL Editor:

1. `20260918000001_initial_schema.sql` — Schema tables, triggers, helper functions, and RLS policies.
2. `20260918000002_storage_setup.sql` — Storage bucket definitions (`avatars`, `people`, `projects`, `events`, `media`) and storage RLS rules.
3. `20260918000003_superadmin_bootstrap.sql` — Function permission restrictions and initial superadmin bootstrap.
4. *(Optional)* `supabase/seed.sql` — Default seed content for projects, events, and collage stage presets.

### 4. Installation & Local Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📦 Build & Verification

```bash
# Type check and build production bundle
npm run build

# Run linter
npm run lint

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment (Vercel)

1. Connect the repository to Vercel.
2. Configure the required environment variables in the Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Single Page Application (SPA) routing is pre-configured via `vercel.json`.
