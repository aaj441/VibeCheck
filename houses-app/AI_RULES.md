# AI Rules for Houses App Development

This document outlines the core technologies and library usage guidelines for the Houses application. Adhering to these rules ensures consistency, maintainability, and optimal performance across the project.

## Tech Stack Overview

The Houses application is built with a modern, full-stack JavaScript/TypeScript ecosystem:

*   **Frontend Framework**: Next.js 14 for server-side rendered React applications, providing routing, API routes, and optimized builds.
*   **Frontend Language**: TypeScript for type safety and improved developer experience.
*   **Styling**: Tailwind CSS for utility-first styling, enabling rapid and consistent UI development.
*   **UI Components**: shadcn/ui for accessible, customizable, and pre-built React components.
*   **Frontend State Management**: Zustand for lightweight and flexible client-side state management.
*   **Frontend Data Fetching**: `@tanstack/react-query` for managing, caching, and synchronizing server state.
*   **Backend Framework**: A hybrid Express/Fastify server running on Node.js 20 for RESTful APIs and server-side logic.
*   **Backend Language**: TypeScript for robust backend development.
*   **Database**: PostgreSQL 15 for relational data storage, with SQL migrations for schema management.
*   **Real-time Communication**: Socket.io for bidirectional, event-based communication between frontend and backend.
*   **Authentication/Database Integration**: Supabase for authentication and database interactions (via `@supabase/supabase-js`).

## Library Usage Rules

To maintain a consistent and efficient codebase, please adhere to the following library usage guidelines:

*   **Frontend Framework**: Always use **Next.js 14** for all new frontend pages and components.
*   **Styling**: All styling must be done using **Tailwind CSS** classes. Avoid inline styles or custom CSS files unless absolutely necessary for specific overrides not achievable with Tailwind.
*   **UI Components**: Prefer **shadcn/ui** components for common UI elements (buttons, forms, dialogs, etc.). If a required component is not available in shadcn/ui, create a new, custom component following shadcn/ui's design principles and Tailwind CSS.
*   **Frontend State Management**: Use **Zustand** for global client-side state that needs to be shared across multiple components. For local component state, use React's `useState` and `useReducer` hooks.
*   **Frontend Data Fetching**: Use **@tanstack/react-query** for all interactions with backend APIs, including fetching, caching, and mutating data.
*   **Real-time Communication (Frontend)**: Use **socket.io-client** to connect to and interact with the backend's Socket.io server.
*   **Backend Framework**: Use **Express** for general API routing and middleware, and **Fastify** for performance-critical endpoints if needed, maintaining the existing hybrid structure.
*   **Database Interactions (Backend)**: Use the **`pg`** library for direct PostgreSQL queries. For Supabase-specific operations (e.g., authentication, RLS-enabled table interactions), use **`@supabase/supabase-js`**.
*   **Real-time Communication (Backend)**: Use **`socket.io`** for implementing real-time features.
*   **Caching/Pub-Sub (Backend)**: Use **`redis`** for any caching or publish-subscribe patterns required on the backend.
*   **Authentication/Authorization (Backend)**: Use **`jsonwebtoken`** for handling JSON Web Tokens for authentication and authorization purposes.
*   **Language**: All new code, both frontend and backend, must be written in **TypeScript**.