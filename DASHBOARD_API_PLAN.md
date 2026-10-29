# Dashboard API Plan

## Purpose

Plan the backend work for dashboard data endpoints before implementation. The dashboard UI and missing pages are owned by other team members, so this workstream should provide stable, documented API contracts that they can integrate against.

## Current State

The API uses Express routers mounted under `/api` in `backend/src/server.ts`. Existing dashboard endpoints are role-protected:

| Method and path | Role | Current data |
|---|---|---|
| `GET /api/customer/dashboard` | `CUSTOMER` | Appointment counts by status, today's appointments, and up to five upcoming appointments. |
| `GET /api/provider/dashboard` | `SOLE_PROVIDER` | Today's, upcoming, completed, and cancelled booking counts; upcoming appointments; active subscription summary. |
| `GET /api/business/dashboard` | `BUSINESS_OWNER` | Business profile, appointment and service/staff counts, today's appointments, staff availability summary, and active subscription summary. |

The frontend already calls these three endpoints. Their current contracts are defined in the dashboard page types and should be treated as the integration baseline; agree any field changes with the UI owners first.

There is no admin or staff dashboard router/controller mounted in the backend. The admin dashboard currently displays local placeholder statistics. `BUSINESS_STAFF` has a frontend dashboard destination, but no matching backend endpoint or mounted frontend route is documented in the current route map.

## Proposed Scope

### Keep and validate existing endpoints

- Preserve the three existing endpoint paths and role checks.
- Verify every query is scoped to the authenticated user's customer, sole-provider, or business record. Never accept an owner/provider/customer ID from the client to select dashboard data.
- Validate that counts have clear meanings: all-time versus period-specific, scheduled versus status-filtered, and whether cancelled/no-show appointments are included.
- Keep response fields aligned with the frontend's current TypeScript response types. Normalize dates to JSON ISO strings and numeric values to JSON numbers where needed.
- Return the existing error envelope consistently: `success: false` and a useful message, without exposing database errors.

### Add an admin dashboard endpoint

Proposed route: `GET /api/admin/dashboard`, accessible only to `ADMIN`.

Initial response should support the existing admin dashboard's summary widgets with schema-backed data:

- `stats.totalUsers`
- `stats.totalBusinesses`
- `stats.totalProviders` (sole providers; clarify whether businesses count separately)
- `stats.totalBookingsThisMonth`
- `recentActivity` or `recentSignups` with a bounded list of recent users/businesses/providers, if the UI needs it

Use `User`, `Business`, `SoleProvider`, and `Appointment` records. The schema currently has no approval/review status for business/provider registrations, so do not return a fabricated “pending” state. Decide with the UI owner whether recent activity is required for the first release.

### Add a staff dashboard endpoint

Proposed route: `GET /api/staff/dashboard`, accessible only to `BUSINESS_STAFF`.

Resolve the signed-in staff member through `BusinessStaff.userId = req.user.userId`, then scope appointment and service data to that staff record. A useful first response could include:

- Today's appointment count and a bounded/complete list of today's appointments ordered by start time.
- Upcoming appointment count and a short upcoming list.
- Appointment details needed by the staff screen: appointment ID, start time, status, service name/duration, and customer display name.
- The staff member's assigned services, only if required by the agreed UI contract.

If the staff record is missing, return `404`; do not allow a request parameter to select another staff member or business.

## Contract and Behavior Decisions

Before implementation, confirm these points with the UI owners:

1. Which dashboard widgets and list columns are required for each role, including admin and staff.
2. Whether each count is all-time, today, this month, or a rolling period; use explicit field names such as `completedAppointments` or `appointmentsThisMonth` rather than ambiguous totals.
3. Whether appointment lists have a fixed limit and what empty/loading/error states the UI expects.
4. Which appointment statuses count as upcoming or actionable. Use the existing Prisma `AppointmentStatus` enum and agree on behavior for `RESCHEDULED`, `CANCELLED`, `COMPLETED`, and `NO_SHOW`.
5. The timezone used for “today” and month boundaries. Current handlers calculate boundaries in the server's local timezone; define a consistent policy before changing or expanding that behavior.
6. Whether admin recent activity is in the first release. Do not promise approval queues unless the data model gains an approval status.

Keep the response envelope consistent with current endpoints, for example:

```json
{
  "success": true,
  "stats": {},
  "appointments": []
}
```

This is illustrative only; confirm concrete fields against the UI before implementation.

## Implementation Sequence

1. Review the existing customer, provider, and business handlers against their frontend response types; record any mismatches and agree whether they are in scope.
2. Confirm admin and staff widget requirements and the contract decisions above with the UI teammates.
3. Add admin and staff routers/controllers using the existing `authenticate` and `requireRole` middleware pattern, then mount them in `backend/src/server.ts`.
4. Query dashboard data with Prisma, scope it from `req.user`, and use bounded ordered lists. Use parallel queries where independent, following existing handlers.
5. Add focused tests for role denial, missing profiles, empty data, date boundaries, status filters, and per-user/business/staff data isolation. The repository currently has no dashboard test files, so confirm the test harness before choosing the test location/tooling.
6. Run the backend TypeScript check/build and focused tests, then share endpoint paths, response examples, and any contract changes with the frontend owners.
7. Integrate the UI only after the response contract is agreed; avoid changing the UI pages in this API workstream.

## Acceptance Criteria

- Each dashboard endpoint is accessible only to its intended role.
- A caller can only see data belonging to their authenticated identity or authorized dashboard scope.
- Counts, date windows, appointment statuses, ordering, and list limits are explicit and consistent with the agreed contract.
- Empty datasets return successful responses with zero counts and empty lists where a profile exists.
- Missing role profiles return a clear `404`; unauthenticated/unauthorized requests return `401`/`403` through middleware.
- Dashboard responses contain no secrets or unnecessary customer/account fields.
- Backend typecheck/build and focused endpoint tests pass, and frontend owners have the final response shape.

## Out of Scope for This Plan

- Dashboard page layout, navigation, and missing frontend routes.
- CRUD endpoints for appointments, services, staff, or subscriptions.
- Revenue/payment analytics: the current appointment model does not capture an appointment price, and payment data is subscription-only.
- Adding approval workflow fields or database migrations.
