# Local Development Guide

## Requirements

- Node 18+ (tested with v24.11.1 via nvm)
- `pnpm` 8.x (enable via `corepack enable`)
- PostgreSQL 14+ running locally with a database named `meeting_booking`

## Environment setup

1. Copy the backend example env and update credentials:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Run database migrations:
   ```bash
   pnpm --filter @meeting-booking/backend prisma:migrate
   ```

## Running services

### Backend API

```bash
pnpm --filter @meeting-booking/backend dev
```

API will run on `http://localhost:4000`.

### Admin web (Next.js)

```bash
pnpm --filter @meeting-booking/web dev
```

App served at `http://localhost:3000`. The admin UI expects the backend to be running locally.

### Mobile (Expo)

```bash
cd apps/mobile
pnpm dev
```

Use the Expo Go app or an emulator. The mobile app reads `EXPO_PUBLIC_API_URL` for the backend base URL.

## Testing flow

1. Sign in as a System Admin on the web app (`http://localhost:3000/login`).
2. Create a company, invite admins/employees, and add meeting rooms.
3. On mobile, log in as an employee, book/edit/cancel meetings. Invitations send branded emails via SendGrid in non-production environments (console fallback is enabled if no API key is supplied).

## Linting & formatting

```bash
pnpm lint
pnpm format
```

Husky + lint-staged run `prettier` on staged files before every commit.

## QA checklist

- [ ] Verify meeting booking flow across timezones (book room outside local TZ, ensure room timezone alignment).
- [ ] Confirm invitation expiry (link invalid after 48h; resend flow issues new token).
- [ ] Exercise meeting edit + cancel from both admin web and mobile (emails sent, rooms freed).
- [ ] Validate audit log endpoint (`GET /audit-logs`) lists above actions with actor metadata.
