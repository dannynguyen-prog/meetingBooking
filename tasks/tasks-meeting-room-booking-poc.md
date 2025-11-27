## Relevant Files

- `backend/src/main.ts` - NestJS bootstrap entrypoint for APIs and services.
- `backend/prisma/schema.prisma` - Database schema defining tenants, rooms, meetings, guests, audit logs.
- `apps/web/app/(admin)/page.tsx` - Next.js admin dashboard surface (System + Company Admin).
- `apps/web/app/api-client.ts` - Typed API client used by admin UI.
- `apps/mobile/App.tsx` - React Native (Expo) entrypoint for the employee app.
- `apps/mobile/src/components/CalendarView.tsx` - Calendar/list component for booking and editing meetings.
- `packages/email-templates/src/index.ts` - Shared invitation/update email templates.

### Notes

- Unit tests should typically live alongside the code files they verify (e.g., `MeetingService.ts` and `MeetingService.spec.ts` in the same folder).
- Use the monorepo test runner (e.g., `pnpm test` or `nx test`) to execute all tests, or scope with a specific path when iterating.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, check it off by changing `- [ ]` to `- [x]`. Update the file after each sub-task once they exist, not only after finishing a parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [x] 0.1 Create and checkout `feature/meeting-room-booking-poc`
  - [ ] 0.2 Push the new branch to origin for collaboration
- [ ] 1.0 Establish monorepo structure & core tooling (pnpm workspaces, shared configs)
  - [ ] 1.1 Initialize pnpm workspace (root `package.json`, `pnpm-workspace.yaml`)
  - [ ] 1.2 Scaffold packages/apps (`backend`, `apps/web`, `apps/mobile`, `packages/email-templates`)
  - [ ] 1.3 Configure shared TypeScript, ESLint, Prettier, and Husky hooks if needed
  - [ ] 1.4 Add CI workflow stub (lint/test) to ensure workspace builds
- [ ] 2.0 Implement backend foundation (NestJS + Prisma + PostgreSQL + auth/email services)
  - [ ] 2.1 Scaffold NestJS project with modules: Auth, Company, User, MeetingRoom, Meeting, Invitation
  - [ ] 2.2 Define Prisma schema (companies, company_admins, employees, meeting_rooms, meetings, meeting_guests, audit_logs, invitation_tokens)
  - [ ] 2.3 Implement JWT auth (signup via invitations, login, role guards, last_login tracking)
  - [ ] 2.4 Implement invitation service (create, resend, expiry check) + SendGrid/Resend integration
  - [ ] 2.5 Implement meeting availability endpoints (room filtering, create/edit/cancel meeting with guest notifications)
  - [ ] 2.6 Implement audit logging middleware/interceptor + API tests
- [ ] 3.0 Build web admin POC (Next.js App Router, Chakra UI, TanStack Query)
  - [ ] 3.1 Set up Next.js app with Chakra theme + auth layout (System vs Company Admin views)
  - [ ] 3.2 Implement System Admin dashboard (metrics, company list w/ filters)
  - [ ] 3.3 Implement company CRUD pages + company admin management (invite/resend/deactivate)
  - [ ] 3.4 Implement meeting room CRUD UI + employee management for Company Admin
  - [ ] 3.5 Wire API client with TanStack Query + optimistic updates/tests
- [ ] 4.0 Build mobile employee POC (Expo React Native, React Query, calendar/booking flows)
  - [ ] 4.1 Initialize Expo app with theming + navigation and auth onboarding
  - [ ] 4.2 Implement dashboard (upcoming meetings, quick actions)
  - [ ] 4.3 Implement booking flow (title/details, time pickers, guest selection, room availability call)
  - [ ] 4.4 Implement calendar view using `react-native-calendars` (day/week/month + meeting detail)
  - [ ] 4.5 Implement edit/cancel flow with confirmation + API integration
- [ ] 5.0 Implement cross-cutting concerns (audit logging, invitations, deployment & QA checklist)
  - [ ] 5.1 Build shared email templates package (System Admin, Company Admin, Employee invites/updates)
  - [ ] 5.2 Ensure audit log viewer/export (admin access) and add monitoring hooks
  - [ ] 5.3 Document deployment steps (Render/Railway + Expo EAS + .env management)
  - [ ] 5.4 QA checklist covering timezone tests, invitation expiry, meeting edit/cancel notifications

