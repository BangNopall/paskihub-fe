# PaskiHub Frontend Documentation

## 1. Overview

**PaskiHub Frontend** is the client-side application for the PaskiHub project, a digital platform designed for the registration, management, and execution of Paskibra (Flag Hoisting Team) competitions across Indonesia. The application provides specialized dashboards for Super Admins, Event Organizers (EO), and Participants, ensuring a seamless and transparent competition workflow.

## 2. Main Tech Stack

The application is built using cutting-edge technologies to ensure performance, aesthetics, and type safety:

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) using Turbopack for faster builds.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a specialized theme configuration.
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) for accessible and customizable components.
- **Theming**: Heavily relies on **CSS Variables** defined in `src/styles/globals.css` (e.g., `--color-primary-500`, `--color-secondary-500`, and glassmorphism gradients).
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) integrated with [Zod](https://zod.dev/) for schema-based validation.
- **Data Fetching**: [Axios](https://axios-http.com/) for API communication.
- **Authentication**: [NextAuth.js (v4)](https://next-auth.js.org/) for role-based access control.
- **Animation**: [Framer Motion](https://www.framer.com/motion/) for smooth interactive transitions.
- **Fonts**: Customized local fonts including **Montserrat** (Headings) and **Poppins** (Body).

## 3. Folder Structure

The core application logic resides within the `src/` directory:

- `src/app/` : Next.js App Router configuration containing pages, layouts, and role-based routes (`admin/`, `organizer/`, `peserta/`).
- `src/components/` : Reusable UI components. Primitives are in `src/components/ui/` (shadcn), while feature-specific components are in the root.
- `src/hooks/` : Custom React hooks to separate business logic from UI views.
- `src/lib/` : Utility functions and shared libraries (e.g., `utils.ts` for Tailwind classes, `fonts.ts` for font definitions).
- `src/middleware/` : Next.js middleware for route protection and role redirection.
- `src/styles/` : Global styling definitions, including the primary theme variables in `globals.css`.
- `src/types/` : Global TypeScript types and interfaces to maintain system-wide type safety.

---

## 4. Getting Started

Follow these steps to set up and run the PaskiHub application locally.

### A. Prerequisites

Ensure you have **Node.js** and **npm** installed.
Download them here: [Node.js Official Download](https://nodejs.org/)

### B. Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/BangNopall/paskihub-fe.git
    ```
2. **Navigate to the project folder**:
    ```bash
    cd paskihub-fe
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Run the application** (Development Mode):
    ```bash
    npm run dev
    ```

Happy coding!

---

## 5. NPM Scripts

Available scripts in `package.json` to assist development:

- `npm run dev` ➡️ Starts the development server with Next.js and **Turbopack**.
- `npm run build:prod` ➡️ Checks code formatting via Prettier (dry run) and builds the application for production.
- `npm run build:local` ➡️ Automatically fixes formatting via Prettier and then builds the application.
- `npm run lint` ➡️ Runs ESLint to find and report errors in `.js/.ts/.jsx/.tsx` files.
- `npm run format:fix` ➡️ **Crucial**: Automatically fixes Prettier formatting across the entire project. Should be run regularly.
- `npm run typecheck` ➡️ Validates TypeScript types without emitting files.

---

## 6. Git Guidelines (Conventional Commits)

### A. Branch Naming Standard

Follow the naming convention: **`(name)-(type)/(description)`**
- **Example**: `nopal-feat/super-admin-dashboard`

Create a new branch for every feature or bug fix. Once complete, submit a *Pull Request (PR)* to your lead (e.g., **BangNopall**).

### B. Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/).
Format: **`type: description`**

**Standard Types**:
- **feat**: Adding or removing features (UI or API).
- **fix**: Bug fixes.
- **style**: Changes that do not affect logic (white-space, formatting, CSS variables).
- **refactor**: Code restructuring without changing behavior.
- **docs**: Documentation updates.
- **perf**: Performance improvements.
- **chore**: Miscellaneous tasks (updating `.gitignore`, etc.).

---

## 7. AI Coding & UI/UX Standards

**STRICT SYSTEM INSTRUCTIONS FOR AI AGENTS**:

1. **Context Awareness**: The AI **MUST ALWAYS** use the `context7` and `superpowers` extensions to scan and analyze existing pages, components, and the `globals.css` file before generating any new code. Do not assume logic or styles.
2. **Anti-Generic Design**: Generated UI/UX **MUST NOT** look rigid, generic, or "AI-generated."
3. **Design Mimicry**: The AI **MUST** strictly adopt and blend with existing design patterns (e.g., rounded-3xl corners, specific card shadows, glassmorphism gradients) to maintain the "feel" of previously developed pages.
4. **Theme Strictness**:
    - AI **MUST** prioritize existing `shadcn/ui` components (referenced in `components.json`).
    - AI **MUST** strictly use CSS variables defined in `globals.css` (e.g., `bg-primary-500`, `text-neutral-700`, `border-info-200`).
    - **FORBIDDEN**: Hardcoding Tailwind arbitrary values (e.g., `bg-[#031629]`) if a corresponding variable exists in the theme.
5. **Consistency**: Always ensure that new components align with the local font variables (`font-montserrat` for headers, `font-poppins` for body text).
