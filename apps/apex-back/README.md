# Raketa — Live Race Timing Backend

**apex-back** is the NestJS backend for **Raketa**, a real-time race timing platform for karting and motorsport events. It connects to external track timing systems via raw WebSocket, parses their proprietary protocol, and broadcasts live race data to frontend clients over Socket.io. It also provides a REST API for managing tracks, users, and race sessions.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [WebSocket Events](#websocket-events)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)

---

## Features

- JWT-based authentication (login, `getMe`)
- User management with bcrypt-hashed passwords and role support (`admin` / `user`)
- Track configuration management (name, WebSocket URL, HTTP port, image)
- Live race session control — start, stop, and query race state per track
- Real-time data ingestion from external timing hardware via raw `ws://` connections
- Parsed race data (grid, lap times, pit in/out, countdown) broadcast to connected clients via Socket.io rooms
- Swagger UI available at `/api`

---

## Architecture

```
Frontend (e.g. Vite :5173)
  │
  ├── REST (HTTP :3000)
  │     ├── POST /auth/login
  │     ├── GET  /auth/me              ← JWT guarded
  │     ├── CRUD /users
  │     ├── CRUD /tracks
  │     └── POST|GET|POST /races/:trackId/start|state|stop
  │
  └── Socket.io (:3000)
        ├── race:join   →  join room race:{trackId}
        ├── race:leave  →  leave room
        ├── race:state  ←  snapshot sent on join
        └── race:update ←  real-time broadcast on every timing update

NestJS Server (:3000)
  └── RacesService / raceStarter
        └── ws:// external timing system  (one WS connection per active track)
              raw text protocol → parsed state → broadcast to Socket.io room
```

Race state is held **in-memory** per active track. There is no races collection in MongoDB — only tracks and users are persisted.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS v11 (TypeScript) |
| Database | MongoDB via Mongoose (`@nestjs/mongoose`) |
| Auth | Passport.js + JWT (`@nestjs/jwt`, `passport-jwt`) |
| Password hashing | bcrypt (10 rounds) |
| Real-time (server→client) | Socket.io (`@nestjs/platform-socket.io`) |
| Real-time (server→timing hardware) | `ws` (raw WebSocket client) |
| Validation | `class-validator` + `class-transformer` |
| API docs | Swagger (`@nestjs/swagger`) |
| Config | `@nestjs/config` (`.env` via `dotenv`) |

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A running **MongoDB** instance (local or Atlas)
- (Optional) External karting timing system accessible over WebSocket

---

## Environment Variables

Create a `.env` file in the project root:

```dotenv
# MongoDB connection string (required)
MONGODB_URI=mongodb://127.0.0.1:27017/apex

# Secret key for signing JWTs (required)
JWT_SECRET=your_strong_secret_here

# Allowed CORS origin for HTTP and Socket.io (optional, default: http://localhost:5173)
FRONTEND_URL=http://localhost:5173

# HTTP server port (optional, default: 3000)
PORT=3000
```

> `JWT_SECRET` is required — the server will throw an error on startup if it is missing.

---

## Installation

```bash
npm install
```

---

## Running the App

```bash
# Development
npm run start

# Development with watch mode (auto-reload on file changes)
npm run start:dev

# Production build + run
npm run build
npm run start:prod
```

The server listens on `http://localhost:3000` by default.  
Swagger UI is available at `http://localhost:3000/api`.

---

## API Reference

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | None | Login with `userName` + `password`. Returns `{ access_token, userName, role }`. |
| `GET` | `/auth/me` | Bearer JWT | Returns the authenticated user's `{ id, userName, role }`. |

**Login request body:**
```json
{
  "userName": "alice",
  "password": "secret"
}
```

---

### Users

| Method | Path | Description |
|---|---|---|
| `POST` | `/users` | Create a new user. Password is automatically hashed. |
| `GET` | `/users` | List all users. |
| `GET` | `/users/:id` | Get a user by MongoDB ObjectId. |
| `PATCH` | `/users/:id` | Partially update a user. |
| `DELETE` | `/users/:id` | Delete a user. |

**Create user body:**
```json
{
  "userName": "alice",
  "password": "secret",
  "role": "admin"
}
```

---

### Tracks

| Method | Path | Description |
|---|---|---|
| `POST` | `/tracks` | Create a track configuration. |
| `GET` | `/tracks` | List all tracks. |
| `GET` | `/tracks/:id` | Get a track by id. |
| `PATCH` | `/tracks/:id` | Update a track. |
| `DELETE` | `/tracks/:id` | Delete a track. |

**Create track body:**
```json
{
  "name": "Karting Arena",
  "wsUrl": "ws://192.168.1.100:8080",
  "httpPort": 8080,
  "officialTiming": "AMB",
  "imgUrl": "https://example.com/track.jpg"
}
```

---

### Races

| Method | Path | Description |
|---|---|---|
| `POST` | `/races/:trackId/start` | Start a race session — opens a WebSocket connection to the track's timing system. |
| `GET` | `/races/:trackId/state` | Get the current in-memory race state (grid, countdown, lap times, pits). |
| `POST` | `/races/:trackId/stop` | Stop the race session — closes the WebSocket connection. |

---

## WebSocket Events

Connect to `http://localhost:3000` using a Socket.io client.

| Direction | Event | Payload | Description |
|---|---|---|---|
| Client → Server | `race:join` | `{ trackId: string }` | Join the room for a track. Immediately receives current state. |
| Client → Server | `race:leave` | `{ trackId: string }` | Leave the track room. |
| Server → Client | `race:state` | Race state object | Sent once when joining. Contains current grid, countdown, lap times, and pits. |
| Server → Client | `race:update` | Race state object | Broadcast on every update received from the timing system. |

**Example (browser):**
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
socket.emit('race:join', { trackId: '<mongoId>' });
socket.on('race:update', (state) => console.log(state));
```

---

## Project Structure

```
src/
├── app.module.ts           # Root module (ConfigModule, Mongoose)
├── main.ts                 # Bootstrap, CORS, Swagger setup
│
├── auth/                   # JWT login & getMe
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/login.dto.ts
│   ├── guards/jwt-auth.guard.ts
│   └── strategies/jwt.strategy.ts
│
├── users/                  # User CRUD + schema
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   └── schemas/user.schema.ts
│
├── tracks/                 # Track CRUD + schema
│   ├── tracks.controller.ts
│   ├── tracks.service.ts
│   ├── dto/
│   ├── schemas/track.schema.ts
│   └── utills/
│       ├── raceStarter.ts  # Raw WS connection & protocol parser
│       └── functions.ts    # HTML grid parser helpers
│
└── races/                  # Race session control + Socket.io gateway
    ├── races.controller.ts
    ├── races.service.ts
    ├── races.gateway.ts    # Socket.io server
    └── races.module.ts
```

---

## Running Tests

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# End-to-end tests
npm run test:e2e

# Test coverage report
npm run test:cov
```
