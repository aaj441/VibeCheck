# Houses App

This repository contains the full-stack implementation for **Houses**, a neurodivergent-friendly dating application.  The project is split into multiple packages:

- **frontend/** – a Next.js 14 application written in TypeScript using Tailwind CSS and shadcn/ui for accessible components.  It handles the client-side user interface including onboarding, match discovery, chat, and quests.
- **backend/** – an Express/Fastify hybrid server running on Node.js 20 that exposes RESTful APIs to the frontend, orchestrates real‑time communication via Socket.io, and integrates with third‑party services like Last.fm, Spotify, and Anthropic Claude.
- **database/** – SQL migrations and schema definitions for PostgreSQL 15.  This folder also contains sample seed data for development and testing.
- **docs/** – architecture diagrams, API contracts, and other documentation.
- **.github/workflows/** – GitHub Actions workflows for testing and deployment.

To get started, copy `.env.example` to `.env` in both the `frontend` and `backend` directories and fill in the required secrets (Supabase credentials, OAuth client IDs, Anthropic API keys, etc.).  Then run the respective package managers (e.g. `npm install && npm run dev`) in each package.