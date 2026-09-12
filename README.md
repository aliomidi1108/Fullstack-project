 Full-Stack React + Express Application

This repository contains:

- `frontend/`: React + Vite client
- `backend/`: Express API in MVP/mock mode with in-memory services

The backend is intentionally **database-agnostic for now** and prepared for a future **MySQL + ORM** integration.

## Current Architecture

### Frontend

- Vite development server (`http://localhost:3000`)
- API calls through `/api` proxy to backend
- Auth flow integrated with mock OTP endpoints

### Backend

- Express app mounted under `/api`
- In-memory service layer (`src/services/*`) for users, courses, basket, wallet, payments, reports, chat
- Authentication middleware based on issued mock tokens
- Rate limiting and centralized error handling middleware
- No document-database runtime dependency

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm run install:all
```

### Run in Development

```bash
npm run dev
```

Or run each side separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Environment Setup

Copy environment templates before running:

```bash
cd backend
cp .env.example .env
```

Backend env currently supports:

- auth/jwt/otp settings
- sms and payment provider config
- CORS/rate-limit/logging settings
- placeholder MySQL variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) for future DB wiring

## Deployment Targets

- Frontend: `monyway.ir`
- Backend API: `api.monyway.ir`

## Next Technical Milestones

1. Keep MVP demo stable on mock services
2. Introduce MySQL persistence behind repository interfaces
3. Add production auth/session lifecycle (OTP + JWT access/refresh + persistent token store)
