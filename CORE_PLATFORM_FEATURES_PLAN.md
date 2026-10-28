# Core Platform Features and Delivery Plan

## Goal

Deliver the platform's core booking loop in three role-based workflows:

1. A sole service provider creates an account, publishes services and availability, and receives customer bookings.
2. A business owner creates a business account, adds staff and services, assigns services to staff, and manages the business schedule.
3. A customer discovers a provider/service, checks available times, books for free, and manages their own appointments.

This document is a planning and team handoff artifact. It does not implement the endpoints or frontend pages.

## Current Implementation Snapshot

| Area | Present now | Missing or incomplete |
|---|---|---|
| Authentication and registration | Auth routes include customer, sole-provider, and business registration, login, email verification, and session endpoints. Provider/business registration forms exist. | Confirm registration's persisted records and package selection end-to-end; the customer registration form also needs to be connected and verified. |
| Sole provider | Provider dashboard endpoint exists. Provider dashboard and registration screens exist. | Provider service, profile management, and availability endpoints are not routed; service, profile, availability, appointment, and calendar dashboard pages are placeholders or not connected. |
| Business | Business dashboard endpoint and registration screen exist. Prisma models include business, staff, services, and staff-service assignments. | No staff, service, assignment, or business availability routes are mounted. Their dashboard pages are empty placeholders. Staff-account provisioning is not defined. |
| Customer | Customer dashboard and appointments-list endpoints exist. Provider discovery/profile pages exist. | Discovery currently needs live API data; booking page and appointment list/detail pages are empty placeholders. No booking creation, slot availability, cancellation, or rescheduling routes exist. |
| Shared backend | Prisma models cover users, providers, businesses, staff, services, availability, appointments, and subscriptions. Auth middleware supports role checks. | `booking.service.ts` and `availability.service.ts` are empty. No service/staff/booking routes exist. No test files or established test harness are currently present. |
| Frontend routing | Public provider list/profile and customer/provider/business dashboard routes exist. | Dashboard links to management pages are not registered routes; staff dashboard route/page is absent from route configuration. |

Existing API paths are mounted under `/api` from `backend/src/server.ts`. Existing routes are documented in the backend route files; do not treat a frontend page or a Prisma model as proof that an API is implemented.

## Core Feature 1: Sole Service Provider

### Expected workflow

1. Register as a sole provider with account and provider profile details, and select a package if required by the agreed MVP policy.
2. Verify email and sign in.
3. View and update the provider's public profile.
4. Create, view, update, activate/deactivate, and remove services.
5. Set weekly working availability and any exceptions needed for the MVP.
6. Publish only services that are active and bookable.
7. Receive customer appointments, view appointment details, and update appointment outcomes using supported statuses.

### Backend responsibilities

- Retain and verify the existing provider registration/auth flow; ensure account and provider profile creation are atomic and role-linked.
- Scope provider profile, service, availability, and appointment operations to the authenticated provider record.
- Validate service name, duration, optional expected price, ownership, and active state.
- Make availability queryable for a selected service/date and compute free slots using service duration and existing appointments.
- Revalidate availability, booking caps, and conflicts inside the booking operation; the browser's displayed slots are never authoritative.

### Frontend responsibilities

- Finish registration validation and API integration, including the verification and post-registration path.
- Complete provider profile, service list/form, and availability/calendar pages.
- Register the pages in role-protected routes and connect dashboard controls to real navigation/actions.
- Show loading, empty, validation, success, and API error states; refresh views after mutations.
- Agree request/response field names with backend before wiring forms.

## Core Feature 2: Business Service Provider

### Expected workflow

1. Register a business owner account and business profile, then verify email and sign in.
2. Create or provision staff accounts and associate each with exactly the owning business.
3. Add, edit, deactivate, and remove business services.
4. Assign one or more services to staff; only assigned active services can be booked with that staff member.
5. Define each staff member's working availability.
6. View bookings across the business and manage staff-specific appointments without exposing other businesses' data.

### Backend responsibilities

- Retain and verify existing business registration and business profile creation.
- Decide the staff account onboarding model before the staff endpoint: invite-by-email, owner-created credentials, or an admin-managed flow. Do not silently invent a staff registration flow or expose passwords in API responses.
- Enforce business ownership for every staff/service/assignment/availability query and mutation.
- Enforce package staff limits where subscription requirements are in scope; prevent duplicate staff-service assignments.
- Validate that a staff member belongs to the business and that the service belongs to the same business before assigning.
- Calculate availability and enforce appointment limits per staff member during booking.

### Frontend responsibilities

- Complete business registration integration and ensure fields map to backend validation.
- Build business staff list/create/invite/detail screens, service management, service assignment controls, and staff calendars.
- Add protected business navigation/routes and role-specific access states.
- Surface package caps and server validation errors, including attempts to exceed staff limits.
- Coordinate the staff invitation/provisioning UX with the backend decision.

## Core Feature 3: Customer Booking and Management

### Expected workflow

1. Browse live sole providers and businesses, filter/search, and open a public provider profile.
2. View active services and service details.
3. Choose a service and, for a business service, an eligible staff member if selection is part of the agreed UX.
4. Select a date and a server-generated available time slot.
5. Confirm a free booking. The server atomically rechecks the slot, provider/staff daily limits, and conflicts before creating a `CONFIRMED` appointment.
6. View upcoming and past appointments, open appointment details, cancel, or reschedule according to agreed rules.
7. Provider/business/staff users view only their relevant appointments and manually update completion/no-show/late-arrival fields where allowed.

### Backend responsibilities

- Replace mock/static discovery data with public, bounded, validated list/profile/service endpoints.
- Return only active and bookable services in public discovery.
- Calculate slots from provider/staff availability, service duration, existing appointments, and package limits.
- Create bookings for the authenticated customer only; no client-supplied customer ID or trusted price/payment field.
- Prevent double booking with a transaction/locking or equivalent database-safe strategy and final server-side revalidation.
- Provide customer-scoped list/detail/cancel/reschedule operations; validate ownership and state transitions for every mutation.
- Keep booking free in the MVP. Subscription billing is separate from customer appointment creation.

### Frontend responsibilities

- Connect provider discovery/profile to live API data and remove/contain demo data.
- Complete booking flow and customer appointment list/detail pages; booking page files currently exist as empty placeholders.
- Show available slots, booking confirmation, conflict feedback, cancellation/reschedule confirmation, and empty/error/loading states.
- Add/register missing dashboard routes and make current navigation controls lead to working pages.
- Never infer a slot is still available from a stale UI result; display backend conflict feedback and allow reselection.

## Endpoint-Sized Issue Breakdown

Create a separate tracker issue for each endpoint below. An issue may include its route, handler/service code, input/output validation, authorization, and focused tests for that one endpoint. Do not put the entire feature or all endpoints in one issue. Add frontend issues separately and link them to the relevant API issue.

### Phase 0: Contract decisions (planning checkpoint, not an endpoint issue)

Phase 0 is useful because later endpoints depend on shared rules. It should be short: review these recommended defaults with the team, change only decisions the product/mentor requires, and record the final contract. No Phase 0 endpoint implementation is needed. With these defaults accepted, backend implementation starts at Phase 1.

| Decision to confirm | Recommended answer for the MVP |
|---|---|
| How are business staff accounts provisioned? | Use an owner-initiated email invitation. The staff member sets their own password through a single-use, expiring invitation flow. Do not have the owner choose or receive staff passwords. Include invitation work in the Phase 2 staff endpoint issues. |
| Which service fields are required, and what is `expectedPrice` for? | Require a non-empty name and positive integer duration in minutes. Description and `expectedPrice` are optional. `expectedPrice` is informational only: it is not collected from customers, used to charge them, or required to book. |
| How do package limits work? | Read daily appointment and staff caps from the selected package/subscription configuration, not hard-coded UI values. Enforce caps on the server when creating a booking and when adding staff. If a limit is null, treat it as unlimited only where the package definition explicitly means unlimited. |
| What cancellation and reschedule rules apply? | For the first release, allow the customer to cancel or reschedule a future confirmed appointment before its scheduled start. Do not allow changes after start or to terminal statuses. Preserve the old booking if rescheduling to the new slot fails. |
| Which appointment statuses are allowed and who changes them? | Booking creates `CONFIRMED`; customer cancellation sets `CANCELLED`; an authorized provider, business owner, or assigned staff member may explicitly set an appointment to `COMPLETED` or `NO_SHOW`, subject to ownership. Never infer completion from elapsed time. Keep `lateArrival` as a separate flag. |
| What customer information can staff see? | Return customer display name only by default. Do not expose customer email or phone to staff unless the product owner explicitly approves it. Owners/providers can receive only the fields needed to manage appointments. |
| What timezone and slot interval should be used? | Store appointment instants as UTC and return ISO timestamps. For MVP, interpret weekly availability in the platform's configured business timezone; document the selected timezone centrally. Generate candidate starts at a consistent 15-minute interval, while requiring the full service duration to fit. Add per-provider/business timezone fields in a later schema change if multiple regions are in scope. |
| Are availability exceptions/holidays in MVP? | Start with weekly recurring availability only. Do not expose a holiday/exception API until the team agrees its data model and UI. Existing appointments still block their occupied times. |
| When is a profile publicly bookable? | Require a verified account, an existing provider/business profile, at least one active service, and valid availability. The current schema has no approval status, so do not imply an approval workflow. |
| Can services be deleted? | Prefer deactivation (`active: false`) once a service has appointments or assignments. Hard-delete only a service with no dependent records, if supported safely. Historical appointments must remain readable. |
| Does a customer choose business staff? | For MVP, have the customer choose a specific eligible staff member for a business service. This keeps availability and daily-cap checks unambiguous. Revisit “any available staff” as a separate feature. |

**Phase 0 completion:** Backend and frontend members agree on the defaults or record replacements, and sample request/response shapes are shared. Then begin Phase 1; do not hold Phase 1 for unrelated future decisions.

### Sequential phase rule

Backend endpoint phases are completed in order. Finish all endpoints in the current phase, run that phase's focused tests plus the backend typecheck/build, fix failures, and record the phase as complete before starting the next phase. Do not implement Phase 2 endpoints while Phase 1 is still being built or tested. Frontend work may proceed separately against the agreed contracts or typed mock data, but backend phase order stays sequential.

Every endpoint issue includes its own authorization, validation, response contract, and focused tests. The phase gate adds integration/regression tests across the endpoints delivered in that phase.

### Phase 1: Provider/business setup

**Issue 1.1 — `GET /api/provider/profile`**

- Authenticate `SOLE_PROVIDER`; resolve profile from `req.user.userId`.
- Return the provider's editable/public profile fields without account secrets.
- Return `404` when a role account has no provider profile.

**Issue 1.2 — `PATCH /api/provider/profile`**

- Authenticate `SOLE_PROVIDER`; allowlist editable profile fields.
- Validate lengths/formats; do not allow profile/user IDs or role changes through the body.
- Return the updated profile and test that another provider cannot be targeted.

**Issue 1.3 — `GET /api/provider/services`**

- List only the signed-in sole provider's services, including active state and fields needed for editing.
- Define stable ordering and empty-list behavior.

**Issue 1.4 — `POST /api/provider/services`**

- Create a service owned by the authenticated sole provider.
- Validate name, duration, optional expected price, and limits; reject business-only ownership fields.

**Issue 1.5 — `PATCH /api/provider/services/:serviceId`**

- Update allowlisted fields only when the service belongs to the authenticated provider.
- Preserve historical appointment snapshots/semantics; coordinate service deactivation behavior.

**Issue 1.6 — `DELETE /api/provider/services/:serviceId` (or agreed deactivate endpoint)**

- Decide hard-delete versus deactivate based on appointment history and foreign-key behavior.
- Prevent deletion that breaks historical appointments; return a clear not-found/invalid-state response.

**Issue 1.7 — `GET /api/provider/availability`**

- List the provider's weekly availability rules.
- Validate/serialize weekday and local time fields consistently.

**Issue 1.8 — `PUT /api/provider/availability`**

- Replace or update the provider's weekly rules using a documented payload.
- Validate weekdays, time format, start-before-end, overlaps, and ownership.

**Issue 1.9 — `GET /api/business/profile`**

- Authenticate `BUSINESS_OWNER`; resolve the business through `ownerUserId`.
- Return business profile fields and handle a missing profile clearly.

**Issue 1.10 — `PATCH /api/business/profile`**

- Update only approved business fields for the authenticated owner.
- Test ownership isolation; do not accept `ownerUserId` or business ID as authority from the client.

### Phase 2: Business team, services, and assignments

**Issue 2.1 — `GET /api/business/staff`**

- Return staff belonging to the authenticated owner's business, with safe user fields and assigned service IDs/names.
- Support empty lists and stable ordering.

**Issue 2.2 — `POST /api/business/staff`**

- Provision/invite staff using the method agreed in Issue 0.1 and link staff to this business.
- Enforce package staff cap and unique user/staff membership; never return password hashes or reusable secrets.

**Issue 2.3 — `GET /api/business/staff/:staffId`**

- Return one staff member and assignments only if the staff member belongs to the owner's business.

**Issue 2.4 — `PATCH /api/business/staff/:staffId`**

- Update the agreed staff fields or active/access state; enforce business ownership and prevent role escalation.

**Issue 2.5 — `DELETE /api/business/staff/:staffId` (or agreed deactivate endpoint)**

- Decide removal/deactivation behavior when appointments exist; preserve historical appointment integrity.

**Issue 2.6 — `GET /api/business/services`**

- List services owned by the authenticated owner's business, including assignment counts if UI needs them.

**Issue 2.7 — `POST /api/business/services`**

- Create a business-owned service with validated name, duration, and optional expected price.

**Issue 2.8 — `PATCH /api/business/services/:serviceId`**

- Update only a service owned by this business; validate fields and preserve appointment history.

**Issue 2.9 — `DELETE /api/business/services/:serviceId` (or agreed deactivate endpoint)**

- Preserve historical bookings and prevent removing a service still needed by assignments/bookings.

**Issue 2.10 — `PUT /api/business/staff/:staffId/services`**

- Replace a staff member's service assignments with the validated service ID list, or choose separate attach/detach endpoints before coding.
- Confirm staff and every service belong to this business; reject duplicate IDs and invalid/inactive services.

**Issue 2.11 — `GET /api/business/staff/:staffId/availability`**

- Return the selected staff member's weekly rules only if the staff member is in the owner's business.

**Issue 2.12 — `PUT /api/business/staff/:staffId/availability`**

- Save validated weekly rules for an authorized staff member; reject cross-business IDs and overlapping/invalid times.

### Phase 3: Public discovery and slots

**Issue 3.1 — `GET /api/providers`**

- Return a bounded, paginated list of bookable sole providers and/or businesses according to the agreed public discovery model.
- Support validated search/category/location filters; return only safe public fields and active profiles/services.

**Issue 3.2 — `GET /api/providers/:providerId`**

- Return a public profile by stable provider identifier, with not-found behavior and no private account fields.
- Confirm whether this route represents a sole provider, a business, or a normalized provider resource.

**Issue 3.3 — `GET /api/providers/:providerId/services`**

- Return only active public services that can be booked; for businesses include eligible staff/service relationships as agreed.

**Issue 3.4 — `GET /api/availability/slots`**

- Accept a provider/service/date and optional business staff selection using a documented query contract.
- Validate input, compute candidate slots from availability and duration, exclude conflicts and cap-exceeded slots, and return timezone-explicit timestamps.
- Keep it read-only; booking creation must repeat all checks.

### Phase 4: Booking and customer management

**Issue 4.1 — `POST /api/customer/appointments`**

- Require `CUSTOMER`; derive customer ID from the session.
- Validate provider/service/staff relationship, future slot, service active state, daily limits, and availability.
- Recheck conflicts within a database-safe transaction and create a free `CONFIRMED` appointment.
- Return a clear conflict response if another booking wins the slot; do not create payment records for customer bookings.

**Issue 4.2 — `GET /api/customer/appointments/:appointmentId`**

- Return details only when the appointment belongs to the authenticated customer.
- Include the agreed public provider, service, time, and status fields.

**Issue 4.3 — `PATCH /api/customer/appointments/:appointmentId/cancel`**

- Confirm cancellation rules in Issue 0.1; enforce customer ownership and valid status transitions.
- Release the slot by updating status; preserve the appointment record for history.

**Issue 4.4 — `PATCH /api/customer/appointments/:appointmentId/reschedule`**

- Validate ownership and policy; recheck the new slot atomically before changing the appointment.
- Ensure the original slot is retained if rescheduling fails and released only after success.

**Issue 4.5 — `GET /api/provider/appointments`**

- Return appointments scoped to the signed-in sole provider with agreed date/status filters and pagination.

**Issue 4.6 — `PATCH /api/provider/appointments/:appointmentId/status`**

- Permit only agreed provider actions (for example mark completed/no-show); enforce provider ownership and allowed transitions.
- Never infer `COMPLETED` from elapsed time.

**Issue 4.7 — `GET /api/business/appointments`**

- Return appointments scoped to the authenticated owner's business, with agreed staff/date/status filters and pagination.

**Issue 4.8 — `PATCH /api/business/appointments/:appointmentId/status`**

- Permit agreed business-owner actions only for appointments in that business; validate transitions and preserve audit-relevant data.

**Issue 4.9 — `GET /api/staff/appointments`**

- Require `BUSINESS_STAFF`; resolve staff via `req.user.userId` and return only that staff member's appointments.
- Include only customer details approved for staff visibility.

**Issue 4.10 — `PATCH /api/staff/appointments/:appointmentId/status`**

- Permit only the actions agreed for staff; scope to the authenticated staff record and validate appointment ownership/status transitions.

## Parallel Frontend Issues

Create these as separate frontend issues, linked to the endpoint issues above:

1. Complete provider registration and verification integration; confirm provider profile is persisted and dashboard destination works.
2. Build provider profile editor and service CRUD page, then connect to Issues 1.1–1.6.
3. Build provider weekly availability editor/calendar, then connect to Issues 1.7–1.8.
4. Complete business registration integration and profile editor, then connect to Issues 1.9–1.10.
5. Build business staff list/provisioning/details and assignment UI, then connect to Issues 2.1–2.5 and 2.10.
6. Build business service CRUD and staff availability management, then connect to Issues 2.6–2.9 and 2.11–2.12.
7. Connect provider list/profile to live discovery API, replacing static/demo data, then connect to Issues 3.1–3.3.
8. Build customer booking and slot selection flow, then connect to Issues 3.4 and 4.1.
9. Build customer appointment list/detail/cancel/reschedule pages, then connect to Issues 4.2–4.4.
10. Build provider, business, and staff appointment management pages and register their protected routes, then connect to Issues 4.5–4.10.

Frontend tasks should not wait for every endpoint to finish: once a contract is agreed, the UI member can build against typed mock responses or a shared API contract, then switch to the live endpoint when its issue is complete.

## Recommended Start Order and Phase Gates

1. Review the Phase 0 recommended answers with the team. Record any changes, then treat the checkpoint as complete; it is not a reason to create a catch-all endpoint issue.
2. Verify the existing provider and business registration flows and persisted Prisma records. Record any required registration fixes as separate issues and complete them before dependent profile endpoints.
3. **Phase 1 — Provider/business profile, sole-provider services, and sole-provider availability (Issues 1.1–1.10).** Implement each endpoint issue and its focused tests. At the gate, run the full Phase 1 endpoint tests, role/ownership isolation checks, empty-profile/list checks, and backend typecheck/build. Fix failures and sign off before Phase 2.
4. **Phase 2 — Business staff, services, assignments, and staff availability (Issues 2.1–2.12).** Complete and test all Phase 2 endpoint issues, including cross-business isolation and package staff-cap checks. Run the Phase 2 regression suite and typecheck/build, then sign off before Phase 3.
5. **Phase 3 — Public discovery and availability slots (Issues 3.1–3.4).** Complete and test all public query endpoints, filtering/pagination, safe public fields, inactive-service exclusion, timezone behavior, and slot conflict/cap calculations. Sign off before Phase 4.
6. **Phase 4 — Booking creation and appointment management (Issues 4.1–4.10).** Complete and test each endpoint, including ownership, valid status transitions, cancellation/reschedule behavior, package limits, and concurrent booking conflicts. Run the full backend regression suite and typecheck/build before declaring the API ready to integrate.
7. After each phase gate passes, share its final endpoint paths and request/response examples with the frontend member. Frontend work can continue in parallel against agreed contracts, but do not skip or overlap backend phase gates.

### Phase completion checklist

- Every endpoint issue in the phase is implemented and its focused tests pass.
- Phase-level tests cover interactions between endpoints and role/data isolation.
- Validation, error codes, response fields, empty states, date/time semantics, and limits match the agreed contract.
- Backend typecheck/build passes; no known phase-specific test failures remain.
- Final request/response examples and any deviations from this plan are recorded and sent to the frontend member.

## Cross-Cutting Acceptance Criteria

- Every private endpoint authenticates and role-checks the caller; every query is scoped to the caller's own profile/business/staff identity.
- Public endpoints expose only deliberately public fields and only active/bookable records.
- Inputs are validated server-side; IDs and role/business ownership are never trusted just because the client supplied them.
- Booking is free for customers, immediately confirmed on success, and conflicts are rechecked server-side at write time.
- Concurrent requests cannot both claim the same provider/staff slot or exceed the applicable daily cap.
- Appointment status transitions follow the agreed policy; completion is always an explicit provider/business/staff action.
- Errors use the existing JSON response convention and do not leak database details.
- Each endpoint issue includes focused tests and a sample request/response for the frontend teammate.
- Before connecting a UI page, its API path, auth role, request body/query, response fields, status codes, and empty/error behavior are agreed and recorded.

## Remaining Product Decisions

The recommended answers in Phase 0 are working defaults, not silently finalized product policy. Before the affected endpoint is implemented, the team should confirm any default that conflicts with mentor/client requirements. In particular, confirm the platform timezone, exact package values, staff invitation details, and whether the customer chooses a specific business staff member. If no change is raised, implement the recommended answer and document it in the endpoint issue.
