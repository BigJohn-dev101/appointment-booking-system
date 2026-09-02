# Appointment Booking Platform — MVP Project Overview & 5 Planning Deliverables
**REV 2 — Payment Logic Updated: Free Booking + Provider Subscription Packages**

**Project:** Multi-Service Provider Appointment Booking Platform
**Framework:** Next.js + TypeScript
**Team:** 5 members
**Development Period:** 10 weeks
**Current Phase:** Planning

> **Change summary (this revision):** Per mentor feedback, the platform no longer requires customer payment to confirm a booking. Booking is now free for customers. Revenue instead comes from **provider subscription packages** selected at onboarding, which gate daily appointment volume (sole providers) and staff count + per-staff daily volume (businesses). The customer points system is **removed from the MVP** (deferred, not deleted) since it no longer has a payment event to attach to. See the **Open Decisions** log at the end of this document for items intentionally left unresolved.

---

# PART A — PROJECT OVERVIEW

## 1. Project Vision

Build a multi-service-provider appointment platform where customers can discover service providers, view services and availability, and book appointments for free. Providers and businesses fund the platform through subscription packages chosen at onboarding, which determine how much booking volume and which features they get access to.

The platform supports:

- **Sole Service Providers** — individuals such as plumbers, cleaners, barbers, nail technicians, electricians, etc.
- **Business Service Providers** — businesses such as salons that manage services and multiple staff/providers.
- **Customers** — discover providers and book appointments, free of charge.
- **Platform Admin** — manages and oversees the platform, including provider subscriptions.

### Business Example

```
Salon Business (on a Business Package)
├── Hairdresser
├── Barber
└── Nail Technician
```

Each staff member:
- Has their own calendar
- Has their own availability
- Can manage their assigned appointments
- Is subject to the daily appointment limit set by the business's package

The platform is therefore:

```
Platform
├── Sole Providers (on a Provider Package)
│   └── Services → Calendar → Appointments (capped by package)
│
├── Businesses (on a Business Package)
│   ├── Services
│   └── Staff (count capped by package)
│       └── Individual Calendars → Appointments (capped per staff by package)
│
└── Customers
    └── Discover → Book (free) → Manage
```

### Positioning Statement

> *Our platform is a multi-tenant appointment booking system that enables service businesses and sole providers to manage their services, staff and appointment availability under a subscription package that determines their booking volume and features. Customers book directly from a provider's or business's public profile — free, with no payment step.*

This wording is deliberate: "subscription package" here **does** mean the platform bills and enforces it — that's an explicit MVP commitment in this revision, not just an access-control label (see Section 3). Being precise about that distinction matters for scope conversations with mentors or the client.

## 2. MVP User Areas / Dashboards

| Dashboard | Users | Purpose |
|---|---|---|
| Customer Dashboard | Customers | Discover providers, book/manage appointments |
| Sole Provider Dashboard | Individual providers | Manage services, availability, calendar, appointments, and their subscription package |
| Business Dashboard | Business owners/managers | Manage business, services, staff, appointments, and the business's subscription package |
| Platform Admin Dashboard | Platform admins | Manage users, providers, businesses, appointments and provider/business subscriptions |

Business staff/providers have their own restricted calendar and appointment view under the business account. They should not automatically have business-owner permissions, and cannot change the business's package.

## 3. Free Booking & Provider Subscription Model

**Booking is free for customers.** No deposit or full payment is required to confirm an appointment. This directly implements the mentor feedback.

Instead, **sole providers and businesses select a subscription package during onboarding**. The package determines:

- How many appointments can be booked per day (sole providers), or
- How many staff a business can add, and how many appointments each staff member can take per day (businesses)
- Which platform features the provider/business has access to (placement, analytics, branding, etc.)

### Sole Provider Packages

| | Basic (Free) | Growth (Paid) |
|---|---|---|
| Cost to join | Free | Monthly subscription |
| Daily appointment limit | Capped (e.g. up to 6/day) | Higher or unlimited (e.g. up to 20/day, or unlimited) |
| Search/discovery placement | Standard | Featured/priority placement |
| Analytics | Basic appointment history | Repeat-customer tracking, busiest times/services |
| Business profile branding | Standard | Custom branding |

### Business Packages

| | Basic (Free) | Growth (Paid) |
|---|---|---|
| Cost to join | Free | Monthly subscription |
| Staff/providers allowed | Capped (e.g. up to 3) | Higher or unlimited (e.g. up to 15, or unlimited) |
| Daily appointment limit **per staff member** | Capped (e.g. up to 6/day) | Higher or unlimited |
| Search/discovery placement | Standard | Featured/priority placement |
| Analytics | Basic appointment history | Repeat-customer tracking, busiest times/services, no-show rates |
| Customer re-engagement tools | — | Message past customers about new availability/offers |
| Business profile branding | Standard | Custom branding |

**All limit numbers above are illustrative placeholders** and should be confirmed with the client before implementation — the mechanism (a configurable cap per package) is the important part, not the specific number.

### What the system must record

For every provider/business subscription: Provider/Business, Package, Package limits at time of subscription, Subscription status (active/past due/cancelled), Billing start date, Next billing date, Subscription payment status, Subscription transaction reference.

> **Scope note:** Because provider revenue now depends entirely on subscription billing rather than a per-transaction fee, **recurring billing infrastructure is now required in the MVP**, not deferred to a later phase as it was under the previous (commission-based) model. This is a real increase in MVP scope and should be flagged to the client/mentors explicitly rather than absorbed silently — see Open Decisions.

## 4. Customer Points — Removed From MVP (Deferred)

The previous points system awarded points based on deposit vs. full payment. Since customers no longer pay to book, that trigger no longer exists.

**Decision for this revision: points are removed from the MVP scope entirely**, but with a confirmed plan to reintroduce them immediately after MVP as the platform's customer retention mechanism. When reintroduced, points will be awarded on **completed appointments** (attendance-based) rather than payment or provider package tier, since points should reward customer behaviour, not provider spend.

This closes the retention gap left by removing payment-based points (see Section 6): for the MVP itself, retention rests on discovery + free booking alone; attendance-based points are the planned Phase 2 addition once the core loop is validated.

## 5. Important Appointment Scenarios

The MVP must still handle real-world cases, adjusted for free booking (no payment to refund/reconcile):

**Customer Books but Does Not Pitch**
```
Customer books (free) → Appointment confirmed → Customer does not arrive
→ Provider marks NO_SHOW → Appointment record updated
```
> No payment/refund step applies here anymore. Without a payment to lose, providers have less inherent protection from no-shows than under the deposit model — see Open Decisions for a proposed lightweight mitigation (not yet decided).

**Provider Does Not Pitch**
```
Provider/business cannot attend → Provider/business cancels
→ System records provider cancellation → Reschedule offered
```
> No refund step applies since no payment was taken; reschedule is the primary configured outcome.

**Customer Cancels** — appointment slot is released; no payment/refund logic applies.

**Customer Reschedules** — the new slot must be available. The original slot is released.

**Customer Arrives Late** — the provider can record the late arrival and decide the appropriate outcome (continuing, completing, cancelling or rescheduling).

**Appointment Marked Complete** — set **manually** by the provider/business once the service has actually happened. The system does not infer completion just because the scheduled time has passed — a no-show, late cancellation, or informal change could all be true even after the clock moves past the appointment time. There is no `PENDING` status in the MVP: an appointment is either not yet booked, or `CONFIRMED` immediately on successful booking (no manual approval step) — it then moves to `CANCELLED` or `COMPLETED`.

## 6. What Makes the Platform Valuable

**Customers**
- Discover multiple providers in one platform.
- View services, prices and availability.
- Book without manual calls/messages — and without any payment required upfront.
- Manage appointments.

**Sole Providers**
- Get an online booking presence for free at the Basic tier.
- Manage their own services and calendar.
- Reduce manual scheduling.
- Can upgrade for more daily booking volume and visibility as demand grows.

**Businesses**
- Manage multiple services and staff, each with an individual calendar.
- Start free with a capped staff count and per-staff daily volume.
- Upgrade as the business grows past the Basic limits.

**Platform**
- Supports many providers and businesses.
- Earns recurring subscription revenue instead of per-transaction commission.
- Creates a central service marketplace with a low-friction (free) entry point for customers.

**Value proposition, stated directly:**
- **Who it's for:** small independent service providers and small businesses (1–15 staff) who don't have the budget or need for enterprise scheduling software, and the customers who use them.
- **What problem it solves better:** discovery, at zero cost/friction to the customer. A single-provider tool assumes the customer already knows who they want to book; this platform helps them find who to book in the first place, with no payment barrier at booking time.
- **What the customer gets:** one free account to find, compare, and book across many providers.
- **What the business/provider gets:** a stream of customers who weren't already theirs, on a package that scales with their own growth, without giving up a cut of every single transaction.
- **Why a business would pay for Growth:** once a provider needs more daily volume than the Basic cap allows, or wants better visibility, upgrading directly relieves the constraint that's limiting their revenue — the cap itself is the upgrade trigger.

## 7. Business Model & Monetisation

**Options considered:**
- **Commission-only** *(previous model)* — no cost to providers, but requires customers to pay at booking time, which mentor feedback identified as too much friction for adoption.
- **Subscription-only, capped by volume/features** *(current model)* — free entry point for providers (Basic tier), booking stays free for customers, and revenue comes from providers who need more volume or features than the free tier allows.
- **Hybrid (commission + subscription)** — considered and set aside for now to keep the MVP payment logic simple and avoid running two billing mechanisms (subscription billing *and* per-transaction payment processing) simultaneously in a 10-week build. Could be revisited later — see Open Decisions.

**Recommended structure (current model):**

The platform is **free for customers to book on, always.** Providers and businesses choose a package (Basic/free or Growth/paid) at onboarding, which caps their daily booking volume and staff count. See Section 3 for the full package comparison.

**MVP scope:** the MVP must implement **both** the Basic and Growth tiers, since Growth is now the platform's only revenue mechanism (there is no commission fallback). This is a change from the previous model, where Basic-only was sufficient for MVP and Growth/Premium could be deferred.

---

# PART B — FIVE PLANNING DELIVERABLES

## 1. Problem Understanding

*(Sections on the client's original manual-scheduling problem, the people affected, and the multi-provider platform recommendation are unchanged from the prior revision — see original document. Updated below: the deposit/payment reasoning.)*

### Updated: Why Payment Was Removed From Booking, and What Replaces the No-Show Protection

The previous revision of this document added a required deposit/full payment specifically to protect providers from no-show income loss. Mentor feedback determined this added too much friction to the core booking loop and should be removed for the MVP.

Removing it **does reopen the no-show exposure** the deposit was designed to close — we're not treating that as solved, we're treating it as **traded off deliberately** in favour of adoption/onboarding friction, consistent with how this document has documented other tradeoffs. A lightweight, non-payment mitigation (e.g. a customer reliability/no-show flag visible to providers before accepting a booking) is proposed as a future addition, not yet decided or scoped — see Open Decisions.

### Proposed Solution (Updated)

Build a multi-service-provider appointment platform using Next.js. Customers can discover sole providers and businesses, select a service and provider/staff member, and book an available slot for **free**. Sole providers and businesses choose a subscription package at onboarding that caps their daily booking volume (and, for businesses, staff count), and can upgrade as they grow. The platform earns revenue through these subscriptions rather than a per-transaction fee.

### Success Criteria (Updated)

The MVP should:
- Allow customers to discover multiple providers.
- Allow customers to book available appointments **for free, with no payment step**.
- Prevent double bookings — **including a final server-side re-check at the exact moment of booking confirmation**, independent of what was shown to the customer earlier.
- Keep each business's data (staff, appointments) isolated from every other business.
- Set appointment status to `COMPLETED` only by explicit provider/business action, never inferred from elapsed time.
- Require sole providers and businesses to select a package during onboarding.
- Enforce the daily appointment limit configured by a sole provider's package.
- Enforce the staff count and per-staff daily appointment limit configured by a business's package.
- Allow providers/businesses to upgrade or downgrade their package.
- Allow sole providers to manage their own schedules.
- Allow businesses to manage services and staff within their package's staff limit.
- Give each business staff member an individual calendar.
- Record no-shows and cancellations correctly.
- Support recurring subscription billing for paid packages.
- Prevent a customer from booking more than once per day with the same provider.
- Block a package downgrade until the business is within the target package's staff cap.
- Track Basic→Growth package upgrades, so **Basic→Growth conversion rate** can be measured as a platform health metric.
- Allow admins to oversee users, appointments and provider/business subscriptions.

## 2. Stakeholders and Users

*(Unchanged from prior revision — see original document, Part B §2.)*

## 3. System Requirements

### A. Functional Requirements — Changes in This Revision

**Removed / Superseded**
- ~~FR-20~~ *(required deposit/full payment before confirming an appointment)* — **REMOVED**. Appointments now confirm immediately on booking.
- ~~FR-28~~ to ~~FR-34~~ *(deposit payments, full payments, per-appointment platform fee, provider/business amount after fee)* — **REMOVED**. No customer-facing payment exists at booking. See FR-45–FR-52 below for what replaces them.
- ~~FR-35~~ to ~~FR-38~~ *(points earning, balance, history)* — **REMOVED from MVP scope** (deferred, see Section 4).
- FR-44 *(admin views transactions and platform fees)* — **REVISED**: admin now views provider/business subscriptions and billing status instead of per-appointment transactions.

**New: Onboarding & Package Selection**
- FR-45 — The system shall require sole providers to select a subscription package during onboarding.
- FR-46 — The system shall require businesses to select a subscription package during onboarding.
- FR-47 — The system shall allow providers/businesses to view their current package and its limits from their dashboard.
- FR-48 — The system shall allow providers/businesses to upgrade or downgrade their package.

**New: Limit Enforcement**
- FR-49 — The system shall enforce the configured daily appointment limit for a sole provider's package.
- FR-50 — The system shall enforce the configured maximum staff count for a business's package.
- FR-51 — The system shall enforce the configured daily appointment limit per staff member for a business's package.
- FR-52 — The system shall prevent a business from adding staff beyond its package's staff cap.

**New: Subscription Billing**
- FR-53 — The system shall support recurring subscription billing for paid provider/business packages.
- FR-54 — The system shall record subscription payment status and transaction reference.
- FR-55 — The system shall allow a **3-day grace period** after a failed subscription payment before restricting the provider/business to Basic-tier limits.
- FR-56 — The system shall block a package downgrade (e.g., Growth → Basic) until the business has manually reduced its staff count to at or below the target package's staff cap.

**New: Booking Abuse Prevention**
- FR-57 — The system shall limit a customer to **one active booking per day, per provider** (sole provider or individual business staff member), to prevent a single customer from consuming a provider's entire daily cap.

**New: Reporting**
- FR-58 — The system shall allow providers/businesses to optionally set an **expected price** on a service, for reporting purposes only. This field is never billed, enforced, or shown as a payment requirement to the customer.
- FR-59 — The system shall track, per provider/business, the date of any package upgrade from Basic to Growth, to support measuring Basic→Growth conversion rate.

**Booking (Revised)**
- FR-19 — Customers shall be able to select available appointment slots.
- FR-20 *(revised)* — The system shall confirm an appointment immediately upon successful booking, with no customer payment required.
- FR-21 to FR-24 — Unchanged (view, cancel, reschedule appointments; provider views appointments).
- FR-25 *(clarified)* — Providers/businesses shall be able to **manually** set an appointment's status to `COMPLETED` once the service has actually taken place; the system shall never infer `COMPLETED` from elapsed time alone.
- FR-26, FR-27 — Unchanged (no-show flag, provider cancellation).
- FR-18 *(strengthened)* — The system shall prevent conflicting bookings, including a **final server-side re-validation at the exact moment of booking confirmation** — not only when availability was first displayed to the customer. This closes the race condition where two customers view the same open slot and attempt to book it near-simultaneously.

### B. Non-Functional Requirements — Additions

**Reliability**
- Package limit enforcement must be consistent even under concurrent booking attempts (two customers booking a provider's last available slot for the day at the same time must not both succeed).
- **The backend is the final authority on slot availability.** The displayed calendar is a representation only; availability must be re-validated server-side at the exact moment a booking is created, not just when it was first shown to the customer.

**Security**
- **A business must never be able to access another business's staff, services, or appointment data.** Business data isolation is enforced server-side on every request, not assumed from client-side routing.

**Validation**
- A booking that would exceed a provider's/staff member's daily limit must be rejected server-side, not just hidden client-side.

**Error Handling**
- Booking conflicts must show clear, specific feedback (e.g. "This slot was just booked — please choose another time"), not a generic error.

*(All other non-functional requirements are unchanged — see original document.)*

### C. Assumptions — Updated

1–6. Unchanged (multi-provider structure, sole vs. business, staff calendars, owner-managed configuration).
7. ~~Customers must pay the required deposit or full fee before confirmation.~~ **REPLACED:** Customers book for free; no payment is required before confirmation.
8. ~~The platform charges a 10% commission on every transaction under the MVP's Basic tier.~~ **REPLACED:** The platform charges no per-transaction commission. Revenue comes from provider/business subscription packages (Basic/free and Growth/paid), both of which are in MVP scope.
9–10. ~~Deposit and full payments award different points... points recorded against qualifying transactions.~~ **REMOVED:** Points are out of MVP scope (see Section 4).
11. Appointment history is retained for administration/disputes. *(unchanged, payment history reference removed)*
12. Cancellation and no-show handling rules must still be agreed before implementation — **now without a payment/refund component**, since no payment is taken at booking.
13. ~~The payment gateway will be selected during technical planning.~~ **REPLACED:** A recurring-billing/subscription payment gateway will be selected during technical planning (this is now a harder requirement than before, since it's the platform's only revenue mechanism).
14. Reviews/ratings — unchanged, still deferred (see original document).
15. **New:** Package limit values (daily appointment caps, staff caps) are configurable per package, not hard-coded — exact numbers to be confirmed with the client.
16. **New:** How a provider is prevented from exceeding their daily cap (hidden slots vs. blocked booking vs. waitlist) is an open decision — see Open Decisions.

## 4. User Stories and Acceptance Criteria — Changes in This Revision

**US-04 and US-05 replaced:**

**US-04 (Revised) — Free Booking**
As a customer, I want to book an appointment without paying, so that I can secure a slot with no upfront cost.
*Given* an available slot within the provider's/staff member's remaining daily limit, *when* I complete the booking, *then* the appointment should be confirmed immediately with no payment step.

**US-05 (Revised) — Package Selection at Onboarding**
As a sole provider or business owner, I want to select a subscription package when I register, so that my booking volume and feature access are set correctly from day one.
*Given* I am registering as a provider or business, *when* I complete onboarding, *then* I should be required to select a package before my profile becomes bookable.

**New — Limit Enforcement**

**US-17 — Daily Limit Reached (Sole Provider)**
As a sole provider on a capped package, I want the system to stop new bookings once I hit my daily limit, so that I don't get overbooked beyond what my package allows.
*Given* I have reached my package's daily appointment limit for a given day, *when* a customer attempts to book me for that day, *then* the booking should be prevented.

**US-18 — Staff Cap Reached (Business)**
As a business owner on a capped package, I want to be stopped from adding more staff than my package allows, so that I know when I need to upgrade.
*Given* I am at my package's staff limit, *when* I attempt to add another staff member, *then* the system should prevent it and indicate an upgrade is needed.

**US-19 — Upgrade Package**
As a provider/business owner, I want to upgrade my package, so that I can accept more bookings or add more staff.
*Given* I am on the Basic package, *when* I upgrade to Growth, *then* my new limits should apply immediately.

**US-20 — One Booking Per Day Per Provider**
As a provider, I want a customer limited to one booking with me per day, so that a single customer can't consume my entire daily cap.
*Given* a customer already has an active booking with me for a given day, *when* they attempt to book me again for that same day, *then* the system should prevent the second booking.

**US-21 — Blocked Downgrade**
As a business owner, I want to be stopped from downgrading below my current staff count, so that I don't lose staff access unexpectedly.
*Given* I have more staff than the target package allows, *when* I attempt to downgrade, *then* the system should block it and tell me how many staff to remove first.

*(US-06 through US-09, US-10 through US-16 are otherwise unchanged — see original document, with the understanding that "payment" language in US-08 no longer applies, since there is no payment to refund on provider cancellation.)*

## 5. User Flows — Changes in This Revision

**Flow 1 & 2 merged into a single Free Booking flow:**

```
Customer → Register/Login → Browse Providers → Select Sole Provider OR Business
→ Select Service → If Business: Select Staff → Select Date
→ Check Provider/Staff Daily Limit Remaining
   ├── Limit Reached → Slot Not Bookable → Customer Chooses Another Day/Provider
   └── Limit Available → View Available Times → Select Appointment
             → Confirm Appointment Immediately → Show Confirmation
```

**New Flow — Sole Provider Onboarding (Revises Flow 3)**
```
Register as Sole Provider → Select Package (Basic or Growth)
→ Create Profile → Add Services → Set Prices & Duration
→ Set Working Hours → Block Unavailable Times → Provider Ready → Customers Can Book
```

**New Flow — Business Onboarding (Revises Flow 4)**
```
Business Registration → Select Package (Basic or Growth)
→ Create Business Profile → Add Services
→ Add Staff (up to package's staff cap) → Assign Services to Staff
→ Configure Staff Availability → Each Staff Member Gets Calendar → Business Ready
```

**New Flow — Package Upgrade**
```
Provider/Business Dashboard → View Current Package & Limits
→ Select New Package → Confirm Subscription Payment
→ Payment Successful?
   ├── No → Show Error → Retry
   └── Yes → Apply New Limits Immediately → Confirm Upgrade
```

**Flow 5 (No-Show) and Flow 6 (Provider Cancellation)** — unchanged in structure, with the payment/refund step removed since no payment was taken (see Section 5 in Part A above).

**Flow 7 (Rescheduling)** — unchanged, minus the "keep existing payment linked" step.

### MVP Business Rules — Updated

- Every appointment belongs to one customer, one service, and one provider (business appointments also belong to the business).
- A business staff member can only be booked for services assigned to them.
- Providers cannot have overlapping appointments.
- Customers cannot book unavailable slots.
- **Booking requires no customer payment; appointments confirm immediately.**
- **Slot availability must be re-validated server-side at the exact moment of booking confirmation** — the displayed calendar is not the source of truth.
- **A business must never be able to access another business's staff, services, or appointment data** — enforced server-side, not just via UI routing.
- **`COMPLETED` is set manually by the provider/business — never inferred automatically from elapsed time.** There is no `PENDING` status; appointments auto-confirm on validation.
- **A sole provider cannot accept bookings beyond their package's daily appointment limit.**
- **A business staff member cannot accept bookings beyond the business package's per-staff daily appointment limit.**
- **A business cannot add staff beyond its package's staff cap.**
- **Providers/businesses select a package at onboarding and can upgrade or downgrade later.**
- **A business cannot downgrade its package while its current staff count exceeds the target package's staff cap** — the owner must remove staff down to the new cap first.
- **A failed subscription payment triggers a 3-day grace period** before the provider/business is restricted to Basic-tier limits.
- **A customer may hold only one active booking per day with a given provider** (sole provider, or a given staff member within a business), to prevent a single customer from exhausting that provider's entire daily cap.
- Providers/businesses may optionally record an expected price per service for reporting; this is never enforced or billed by the platform.
- Staff cannot access another provider's private calendar.
- Business staff do not automatically have owner permissions.
- Platform admins have platform-level permissions.
- Cancelled/no-show/completed appointments retain their history.
- Rescheduling must not create duplicate appointments.
- ~~Required payment must succeed before an appointment is confirmed.~~ **REMOVED.**
- ~~The platform fee is 10% of every transaction.~~ **REMOVED.**
- ~~Deposit and full payments award different points.~~ **REMOVED (points deferred).**

### MVP Data Model Concept — Updated

```
USER
├── CUSTOMER
├── SOLE_PROVIDER
├── BUSINESS_OWNER
├── BUSINESS_STAFF
└── PLATFORM_ADMIN

PACKAGE
├── TYPE (Sole Provider / Business)
├── TIER (Basic / Growth)
├── DAILY_APPOINTMENT_LIMIT (sole provider, or per-staff for business)
├── MAX_STAFF (business only)
└── FEATURE_FLAGS (placement, analytics, branding, etc.)

PROVIDER_SUBSCRIPTION
├── PROVIDER/BUSINESS
├── PACKAGE
├── STATUS (active / grace_period / past due / cancelled)
├── BILLING_START_DATE
├── NEXT_BILLING_DATE
├── GRACE_PERIOD_ENDS_AT (set on failed payment; 3 days from failure)
├── UPGRADED_FROM_BASIC_AT (nullable; supports Basic→Growth conversion tracking)
└── SUBSCRIPTION_PAYMENT (status, transaction reference)

BUSINESS
├── SERVICES
├── PACKAGE (via PROVIDER_SUBSCRIPTION)
├── STAFF (capped by PACKAGE.MAX_STAFF)
│   └── INDIVIDUAL CALENDAR (capped by PACKAGE.DAILY_APPOINTMENT_LIMIT)
└── (referenced by) APPOINTMENTS

SOLE_PROVIDER
├── SERVICES
├── PACKAGE (via PROVIDER_SUBSCRIPTION)
├── AVAILABILITY (capped by PACKAGE.DAILY_APPOINTMENT_LIMIT)
└── (referenced by) APPOINTMENTS

CUSTOMER
└── (referenced by) APPOINTMENTS
    (no payment or points records — see Open Decisions)

APPOINTMENT — a relation, not a container
├── CUSTOMER (reference)
├── SERVICE (reference)
├── PROVIDER (reference)
├── BUSINESS (reference, optional for sole provider)
└── STATUS (CONFIRMED / CANCELLED / COMPLETED — COMPLETED set manually only)

SERVICE
├── PROVIDER/BUSINESS
├── DURATION
└── EXPECTED_PRICE (optional, reporting only — never billed or enforced)
```

> **Why this matters:** an Appointment isn't owned by the Customer, the Business, or the Provider — it's the join point that references all of them plus a Service and a Time. Modelling it as a node nested under any single parent (as an earlier revision of this document did) implies an ownership relationship that isn't real, and would push the database design toward an incorrect structure. A Customer is a platform-wide account, not something that belongs under any one business.

> **Enforcement note:** the one-booking-per-day-per-provider rule (FR-57) is enforced at booking time by checking for an existing active appointment for the same CUSTOMER + PROVIDER (or CUSTOMER + STAFF for businesses) on the same date — no new entity is required, just a booking-time constraint.

### MVP Boundary — Updated

**We ARE Building — and why each belongs in the MVP**

| Feature | Why it's in the MVP |
|---|---|
| Multi-provider discovery | Core to the value proposition. |
| Sole provider & business registration, **with mandatory package selection** | Package selection now determines what a provider/business can do from day one — it can't be deferred. |
| Free customer booking, no payment step | Direct implementation of mentor feedback. |
| **Package limit enforcement** (daily appointment caps, staff caps) | This *is* the monetisation mechanism now — without enforcement, there's no reason to upgrade. |
| **Recurring subscription billing** | The platform's only revenue mechanism under this model; can no longer be deferred as "Premium — future phase." |
| **Package upgrade/downgrade** | Needed for the monetisation loop to actually function (providers must be able to act on hitting a cap). |
| Business service & staff management, individual staff calendars | Needed for a business to operate at all. |
| **Server-side booking re-validation at confirmation** | Prevents two customers claiming the same slot — a required real-world edge case, not an enhancement. |
| **Business data isolation** | Multiple tenants share one system; a business must never see another's data. |
| Provider availability, service management | Required to calculate real bookable slots. |
| Customer booking, cancellation, rescheduling | The core loop the client's brief asked for. |
| No-show and provider-cancellation handling (status only, no payment/refund logic) | Still required real-world scenarios; simplified since no payment exists. |
| Appointment history | Needed for disputes and admin oversight. |
| Dashboards, role-based access | Every feature above needs a place to live and needs to be permission-scoped. |
| Responsive web interface | Explicit requirement from the brief. |

**We Are NOT Prioritising Yet — and why**

| Feature | Why it's deferred |
|---|---|
| **Customer points** | No longer has a payment event to attach to; removed from MVP this revision (see Section 4, Part A). Recommended future basis: completed appointments. |
| Reviews/ratings | Unchanged reasoning — needs a base of completed appointments to be useful. |
| Points redemption/rewards | N/A while points themselves are out of scope. |
| **Any optional online payment between customer and provider** | Left as an open decision this revision — not built until resolved (see Open Decisions). |
| **No-show reliability flag / consequence mechanism** | Proposed as a lightweight, non-payment mitigation for the no-show risk reopened by removing deposits; not yet scoped or decided. |
| SMS, advanced analytics, marketing/advertising tools | Enhance retention/growth but aren't needed to prove the core loop. |
| Native mobile apps | Responsive web covers the mobile use case for the MVP. |
| AI recommendations, franchise management, advanced loyalty programmes | Depend on usage data and scale the MVP won't have yet. |

---

## Decisions Log — Resolved This Revision

These were flagged as gaps in the payment-logic redesign and have now been decided:

1. **No-show abuse via free caps** → A customer may hold only one active booking per day with a given provider (FR-57). This is the chosen mitigation in place of a no-show reliability flag/approval system.
2. **Off-platform leakage once a provider hits their cap** → Accepted as a known risk for the MVP; no mitigation built. See Known Risks (Accepted) below.
3. **Cap calibration** (6/day sole provider, 3 staff for business, etc.) → Confirmed as placeholders. Real numbers to be researched/confirmed with the client before build.
4. **Business package downgrade with staff over the new cap** → Downgrade is blocked until the owner manually reduces staff to at or below the target package's cap (FR-56).
5. **Failed subscription payment** → 3-day grace period before restriction to Basic-tier limits (FR-55).
6. **Retention without points** → Confirmed direction: reintroduce points post-MVP, attendance-based, as Phase 2 (see Section 4, Part A).
7. **Optional price field on services** → Added (FR-58), reporting only, never billed or enforced.
8. **Basic→Growth conversion rate** → Added as an explicit MVP success criterion, with `UPGRADED_FROM_BASIC_AT` tracked in the data model to support it (FR-59).

## Known Risks (Accepted for MVP)

- **Off-platform leakage:** nothing currently stops a provider who's hit their daily cap from arranging the next booking directly with a customer, outside the platform. This is accepted for MVP rather than mitigated; revisit if it turns out to meaningfully suppress upgrade conversion.
- **Cap values are unvalidated placeholders:** if the real numbers turn out to be set too high relative to actual provider demand, providers may rarely hit them, weakening the core incentive to upgrade. This needs real data from the client before the caps are finalized, not just before launch.

## Open Decisions (Still Unresolved)

Two items from the original list remain genuinely open and are carried forward:

1. **Does the platform handle any money between customer and provider at all**, or is that entirely outside the platform (cash/card handled directly between them)? This affects whether any payment-adjacent data model is needed beyond subscriptions and the new optional expected-price field.
2. **How is a provider/staff member's daily cap enforced from the customer's side** once reached — slots simply stop appearing as available, the provider shows as "fully booked" for the day, booking is blocked with an upgrade prompt shown only to the provider, or customers can join a waitlist? This affects both UX and the availability-calculation logic (FR-17).

Neither blocks the rest of the document — both are scoped narrowly enough to decide later without reworking what's above.
