# Apex Frontend

A modern, full-stack React application for tracking and managing racing events with real-time updates. Built with React Router 7, TypeScript, and Material-UI.

## Overview

Apex is a racing tracking application that provides:

- Real-time race updates via WebSocket connections
- User authentication and authorization
- Track and race management
- Live race table updates
- Responsive UI with Material-UI components

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **Docker** (optional, for containerized deployment)

## Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Development Setup

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 3. Type Checking

Generate types and perform type checking:

```bash
npm run typecheck
```

## Project Structure

```
apex-front/
├── app/
│   ├── root.tsx              # Root layout component
│   ├── routes.ts             # Route configuration
│   └── routes/               # Page components
│       ├── index.tsx         # Home page
│       ├── login.tsx         # Login page
│       └── track.tsx         # Track management page
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Login/
│   │   ├── RaceTable/
│   │   ├── Tracks/
│   │   └── hooks/            # Custom React hooks
│   ├── services/             # API and data services
│   │   ├── authService.ts    # Authentication
│   │   ├── raceService.ts    # Race management
│   │   └── trackService.ts   # Track management
│   ├── store/                # Zustand state management
│   │   ├── useAuthStore.tsx
│   │   └── useTrackStore.tsx
│   ├── lib/                  # Utilities and helpers
│   │   └── raceSocket.ts     # Real-time WebSocket connections
│   ├── model/                # TypeScript models
│   │   ├── Track.tsx
│   │   └── User.tsx
│   └── config/               # Configuration files
├── public/                   # Static assets
├── Dockerfile                # Docker configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Key Features

### Authentication

- User login/logout functionality
- Auth token management via `useAuthStore`
- Protected routes and API calls

### Real-time Updates

- WebSocket integration for live race updates
- `useRaceSocket` hook for real-time data
- Socket connection management in `raceSocket.ts`

### State Management

- Zustand for lightweight state management
- `useAuthStore` for authentication state
- `useTrackStore` for track/race data

### Components

- **Header**: Navigation and branding
- **Footer**: Footer information
- **Login**: User authentication form
- **RaceTable**: Display live race data
- **Tracks**: Track listing and management

## Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Type checking and TypeScript generation
npm run typecheck
```

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `build/` directory:

```
build/
├── client/    # Static assets (CSS, JS, images)
└── server/    # Server-side code
```

Start the production server:

```bash
npm start
```

## Docker Deployment

### Building the Docker Image

```bash
docker build -t apex-front .
```

### Running the Container Locally

```bash
docker run -p 3000:3000 apex-front
```

Access the application at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```bash
VITE_API_URL=https://api.example.com
VITE_SOCKET_URL=wss://socket.example.com
```

### Deploying to Cloud Platforms

The Docker image can be deployed to:

- **AWS ECS** - Elastic Container Service
- **Google Cloud Run** - Serverless container deployment
- **Azure Container Apps** - Managed container service
- **DigitalOcean App Platform**
- **Fly.io** - Edge computing platform
- **Railway** - Modern deployment platform

## Technology Stack

| Technology   | Version | Purpose                 |
| ------------ | ------- | ----------------------- |
| React        | 19.2.4  | UI library              |
| React Router | 7.12.0  | Client-side routing     |
| TypeScript   | 5.9.2   | Type safety             |
| Vite         | 7.1.7   | Build tool & dev server |
| Material-UI  | 7.3.9   | Component library       |
| Zustand      | 5.0.11  | State management        |
| Socket.IO    | 4.8.3   | Real-time communication |
| TailwindCSS  | 4.1.13  | Utility-first styling   |

## Development Guidelines

### Component Structure

Place new components in `src/components/` with their own folder:

```
src/components/MyComponent/
├── MyComponent.tsx
└── styles.css
```

### API Services

Add new API calls in `src/services/`:

- `authService.ts` - Authentication endpoints
- `trackService.ts` - Track management
- `raceService.ts` - Race operations

### Hooks

Create custom hooks in `src/components/hooks/`:

- `useAuth()` - Authentication state
- `useFetchTracks()` - Fetch tracks
- `useRaceSocket()` - Real-time race updates

### State Management

Use Zustand stores in `src/store/`:

```typescript
import { create } from "zustand";

export const useCustomStore = create((set) => ({
  // state and actions
}));
```

## Troubleshooting

### Port Already in Use

If port 5173 (dev) or 3000 (production) is already in use:

```bash
# macOS/Linux - Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Build Issues

Clear the build cache and reinstall:

```bash
rm -rf node_modules build
npm install
npm run build
```

### WebSocket Connection Issues

Ensure the backend WebSocket server is running and the URL is correct in `VITE_SOCKET_URL`.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test them
3. Run type checking: `npm run typecheck`
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/your-feature`

## Learn More

- [React Router Documentation](https://reactrouter.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Zustand Documentation](https://zustand-demo.vercel.app/)
- [Vite Documentation](https://vitejs.dev/)
- [Socket.IO Documentation](https://socket.io/docs/v4/client-api/)
