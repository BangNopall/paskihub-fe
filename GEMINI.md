# PaskiHub Frontend (paskihub-fe)

PaskiHub is a specialized platform designed for the registration and management of Paskibra (Pasukan Pengibar Bendera) teams and competitions across Indonesia. It provides distinct interfaces for competition organizers and participants.

## Project Overview

- **Main Technologies:**
    - **Framework:** Next.js 16 (App Router)
    - **UI Library:** React 19, shadcn/ui (Radix UI)
    - **Styling:** Tailwind CSS 4, Framer Motion (animations)
    - **Icons:** Lucide React, Iconify
    - **State/Data:** Axios, React Hook Form, Zod (validation), TanStack Table
    - **Auth:** Next-Auth
    - **Charts:** Recharts
- **Architecture:**
    - **App Router:** Located in `src/app`.
    - **Components:** UI components in `src/components/ui` (shadcn-based) and feature-specific components in `src/components`.
    - **Roles:** Separated into `organizer` and `peserta` (participant) directories within `src/app`.
    - **Assets:** Custom local fonts (Montserrat, Poppins) in `src/styles/fonts`.

## Building and Running

### Development
```bash
npm run dev
```
Starts the development server using Turbopack.

### Production Build
```bash
npm run build:prod
```
Checks formatting with Prettier and builds the application for production.

### Local Build (with auto-fix)
```bash
npm run build:local
```
Fixes formatting and builds the application.

### Linting & Formatting
```bash
npm run lint      # Run ESLint
npm run format    # Check formatting
npm run format:fix # Fix formatting
```

### Type Checking
```bash
npm run typecheck
```

## Development Conventions

- **Component Organization:** Follow shadcn/ui patterns. Place generic UI primitives in `src/components/ui` and complex components in `src/components`.
- **Styling:** Use Tailwind CSS for most styling. Utility classes are combined using the `cn` utility from `src/lib/utils.ts`.
- **Fonts:** Use the `Poppins` and `Montserrat` local fonts defined in `src/lib/fonts.ts`.
- **Data Fetching:** The project uses a mix of mock data and API-ready architecture (using Axios). Check `src/app/organizer/dashboard/page.tsx` for an example of simulated API fetching.
- **Form Handling:** Use `react-hook-form` with `zod` for schema validation.
- **Responsive Design:** Utilize Tailwind's responsive modifiers and `@container` queries where applicable.

## Key Directories

- `src/app/admin`: Dashboard and management features for Super Admin (Developer).
- `src/app/(home)`: Landing page implementation.
- `src/app/auth`: Authentication flows (login, register, forgot password).
- `src/app/organizer`: Dashboard and management features for event organizers.
- `src/app/peserta`: Dashboard and management features for participants/teams.
- `src/components/ui`: Reusable UI components managed by shadcn/ui.
- `public/`: Static assets including images for home and dashboard sections.
