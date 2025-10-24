# AI Rules for Houses App

Purpose: This document defines how the AI editor and contributors should work within this codebase—what tech to prefer, how to structure changes, and which libraries to use for which tasks.

## Tech Stack Overview (high-level)
- Frontend: Next.js 14 with React 18 and TypeScript for SSR/SSG and modern UI.
- Styling: Tailwind CSS for utility-first responsive styling; prefer prebuilt UI via shadcn/ui.
- Client State: Zustand for lightweight, local state management.
- Server State: TanStack React Query for data fetching, caching, and request lifecycle on the client.
- Real-time Communication: Socket.io (socket.io-client on frontend, socket.io on backend).
- Backend: Node.js 20 with an Express/Fastify hybrid; default to Express for general APIs, leverage Fastify where performance or plugin ecosystem is advantageous.
- Database: PostgreSQL 15 accessed via the pg driver; schema managed via SQL migrations in houses-app/database/migrations.
- Caching / Pub/Sub: Redis for ephemeral caching, pub/sub, and real-time coordination.
- Integrations: Third-party services like Last.fm, Spotify, and Anthropic Claude; credentials managed via .env files in frontend and backend.
- CI/CD: GitHub Actions workflows for testing and deployment (in .github/workflows/).

## Library Usage Rules (what to use and when)
- Routing (Frontend):
  - Use Next.js routing conventions (App Router or Pages Router per project setup).
  - Do not add React Router to the frontend.
- Styling & UI:
  - Use Tailwind CSS classes for all styling.
  - Prefer shadcn/ui components for accessible, consistent UI. Only create custom components when necessary.
  - Avoid CSS-in-JS libraries (styled-components, emotion) unless explicitly approved.
- Data Fetching & Caching (Client):
  - Use TanStack React Query for all server-originated data on the client (queries, mutations, caching, refetching).
  - Use the native fetch API for HTTP requests; do not add axios unless there’s a strong reason and approval.
- Client State:
  - Use Zustand for local UI state and ephemeral client-only data (modals, filters, settings).
  - Do not introduce Redux or other global state libraries.
- Real-time:
  - Use socket.io-client on the frontend and socket.io on the backend for real-time features (presence, messaging, live updates).
  - Coordinate events with Redis pub/sub on the backend when scaling or cross-process communication is needed.
- Backend HTTP APIs:
  - Default to Express for general endpoints and middleware.
  - Use Fastify for performance-sensitive routes or where Fastify plugins are preferred; keep API style consistent across the app.
  - Share validation logic via lightweight, typed helpers; prefer TypeScript types over runtime-heavy validation libs unless needed.
- Database & Persistence:
  - Use pg for database access with parameterized queries to prevent SQL injection.
  - Manage schema changes via SQL migrations under houses-app/database/migrations and seed data in houses-app/database/seed-data.sql.
  - Do not introduce ORMs (Prisma/TypeORM) without approval.
- Auth & Security:
  - Use jsonwebtoken (JWT) for session tokens where required.
  - Use @supabase/supabase-js for Supabase-based auth or storage integrations; ensure .env variables are set in both frontend and backend when applicable.
  - Centralize auth middleware on the backend; keep token handling consistent across services.
- External Integrations:
  - Encapsulate each third-party API (Last.fm, Spotify, Anthropic) behind a small, typed module that reads credentials from environment variables.
  - Avoid scattering API calls across pages/components; use service modules and React Query hooks.
- Error Handling & Logging:
  - Use consistent error responses from the backend with a global error handler.
  - Use console logging for development; introduce a structured logger only with approval.
- Dependencies:
  - Do not add large new frameworks or overlapping libraries without prior approval.
  - Prefer standard library and existing dependencies; keep TypeScript strict and types clear.
- Project Conventions:
  - Keep components small and focused, favor composition over inheritance.
  - Maintain accessibility (a11y) by leveraging shadcn/ui and semantic HTML.
  - Keep environment variables in .env files per package; do not hardcode secrets.