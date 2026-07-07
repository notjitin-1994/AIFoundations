# AI Foundations: Custom Web Platform Architecture & Implementation Plan

## 1. Overview
This document outlines the architecture and step-by-step implementation plan for building the "AI Foundations" course platform. The platform will be a custom headless web application that delivers course content and tracks deep learning analytics via xAPI to a Learning Record Store (LRS). 

Crucially, **authentication will be deferred to the final phase**. The application will be architected to expect an authenticated user from day one using a mock hook, allowing seamless plug-and-play of the real authentication system at the end of development.

## 2. Architecture Stack
* **Framework:** Next.js (App Router)
* **Styling & UI:** Tailwind CSS + shadcn/ui (for rapid, accessible component development like sidebars, accordions, and modals)
* **Content Rendering:** `react-markdown` (for rendering text/images) and `react-player` (for video streaming and event tracking)
* **State Management:** Zustand (for client-side progress tracking during the unauthenticated phase)
* **Data Tracking:** Custom Next.js Server Actions to securely POST xAPI statements to the LRS without exposing API keys in the browser.

## 3. Deferred Authentication Strategy
To ensure the course functions immediately without an auth backend while remaining "auth-ready":
1. **The Mock Hook:** We will create a `useUser()` hook. In Phase 1, this hook will simply return a dummy user object (e.g., `{ name: "Guest Learner", email: "guest@local" }`) and generate a unique UUID stored in the browser's LocalStorage to maintain a session.
2. **xAPI Actor:** All xAPI statements sent to the LRS will use this dummy email/UUID as the "Actor".
3. **The Swap:** At the very end of the project, we will implement Clerk or NextAuth.js. We will simply update the `useUser()` hook to return the *actual* authenticated user data. The rest of the application (and the xAPI tracking) will automatically inherit the real user data with zero refactoring required.

## 4. xAPI Tracking Strategy
We will avoid client-side LRS libraries to keep our LRS credentials secure.
* **Server-Side Tracking:** We will build a Next.js Server Action (`sendXAPIStatement.ts`). 
* **Client Triggers:** Client components (like `react-player` when a video ends, or a "Next Lesson" button) will call this server action asynchronously. 
* **Statements:** The server action constructs the standard Noun-Verb-Object JSON and securely pushes it to the LRS endpoint using `fetch`.

## 5. Implementation Plan (Step-by-Step)

### Phase 1: Foundation & Shell (No Auth)
* [ ] Scaffold the Next.js (App Router) project with Tailwind CSS.
* [ ] Install `shadcn/ui` and configure the brand theme.
* [ ] Build the mock `useUser()` hook and local session generator.
* [ ] Build the global layout: Sidebar (course outline), Header (progress bar), and Main Content Area.

### Phase 2: Content & Media Components
* [ ] Implement `react-markdown` to render the lesson text from Markdown files.
* [ ] Implement the `react-player` component.
* [ ] Build the interactive elements (e.g., the running project template selector).

### Phase 3: xAPI & LRS Plumbing
* [ ] Configure `.env` with LRS endpoint and credentials.
* [ ] Build the `sendXAPIStatement` Server Action.
* [ ] Wire up `react-player` to fire xAPI statements on `onStart`, `onPause`, and `onEnded`.
* [ ] Wire up the "Mark Complete" buttons to fire xAPI statements.

### Phase 4: Local Progress State
* [ ] Implement Zustand to track which modules the local user has completed.
* [ ] Make the sidebar lock/unlock future modules based on this local state.

### Phase 5: Authentication (Final Phase)
* [ ] Install the auth provider (e.g., NextAuth.js or Clerk).
* [ ] Build the Login / Registration screens.
* [ ] Swap the mock `useUser()` hook with the real auth provider session.
* [ ] (Optional) Migrate the local Zustand progress state to a database (like Supabase or Postgres) so the user's progress persists across devices.
