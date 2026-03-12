# Apex Monorepo

Apex is a full-stack race timing platform with a NestJS backend and a React frontend.

## Projects

- `apps/apex-back` - NestJS API + Socket.io gateway for auth, tracks, users, and live race updates.
- `apps/apex-front` - React Router frontend for login, track management, and live race table UI.

## Repository Structure

```text
apex/
  apps/
    apex-back/   # Backend service (NestJS)
    apex-front/  # Frontend app (React Router + Vite)
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (for backend)

## Install Dependencies

Install dependencies per app:

```bash
npm install --prefix apps/apex-back
npm install --prefix apps/apex-front
```

## Run in Development

Open two terminals from the repository root.

Terminal 1 (backend):

```bash
npm run start:dev --prefix apps/apex-back
```

Terminal 2 (frontend):

```bash
npm run dev --prefix apps/apex-front
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Backend Swagger: http://localhost:3000/api

## Backend Environment Variables

Create `apps/apex-back/.env`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/apex
JWT_SECRET=your_strong_secret_here
FRONTEND_URL=http://localhost:5173
PORT=3000
```

## Build for Production

Backend:

```bash
npm run build --prefix apps/apex-back
npm run start:prod --prefix apps/apex-back
```

Frontend:

```bash
npm run build --prefix apps/apex-front
npm run start --prefix apps/apex-front
```

## Test

Backend unit tests:

```bash
npm run test --prefix apps/apex-back
```

Backend e2e tests:

```bash
npm run test:e2e --prefix apps/apex-back
```

Frontend type checks:

```bash
npm run typecheck --prefix apps/apex-front
```

## Useful Links

- Backend docs: `apps/apex-back/README.md`
- Frontend docs: `apps/apex-front/README.md`
