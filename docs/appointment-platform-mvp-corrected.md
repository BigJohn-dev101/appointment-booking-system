# Appointment Booking Platform — MVP Project Overview & 5 Planning Deliverables

**Project:** Multi-Service Provider Appointment Booking Platform
**Framework:** Next.js + TypeScript
**Team:** 5 members
**Development Period:** 10 weeks
**Current Phase:** Planning

---

# PART A — PROJECT OVERVIEW

## 1. Project Vision

Build a multi-service-provider appointment platform where customers can discover service providers, view services and availability, pay a required deposit or full appointment fee, and manage their appointments.

The platform supports:

- **Sole Service Providers** — individuals such as plumbers, cleaners, barbers, nail technicians, electricians, etc.
- **Business Service Providers** — businesses such as salons that manage services and multiple staff/providers.
- **Customers** — discover providers, book appointments, make payments and earn points.
- **Platform Admin** — manages and oversees the platform.

### Business Example

```
Salon Business
├── Hairdresser
├── Barber
└── Nail Technician
```

Each staff member:
- Has their own calendar
- Has their own availability
- Can manage their assigned appointments

The platform is therefore:

```
Platform
├── Sole Providers
│   └── Services → Calendar → Appointments
│
├── Businesses
│   ├── Services
│   └── Staff
│       └── Individual Calendars → Appointments
│
└── Customers
    └── Discover → Book → Pay → Manage
```

## 2. MVP User Areas / Dashboards

The product has four main dashboard areas, with business staff operating within the Business provider area using their own restricted staff dashboard/permissions.

| Dashboard | Users | Purpose |
|---|---|---|
| Customer Dashboard | Customers | Discover providers, book/manage appointments, payments and points |
| Sole Provider Dashboard | Individual providers | Manage services, availability, calendar and appointments |
| Business Dashboard | Business owners/managers | Manage business, services, staff and appointments |
| Platform Admin Dashboard | Platform admins | Manage users, providers, businesses, appointments and transactions |

Business staff/providers have their own restricted calendar and appointment view under the business account. They should not automatically have business-owner permissions.

## 3. Payment Model

Payments are part of the MVP.

Before an appointment is confirmed, the customer must pay either:
- A required deposit, or
- The full appointment fee.

The provider/business determines which payment requirement applies to a service.

Every transaction has a 10% platform fee.

**Example:**
```
Customer pays: R500
Platform fee (10%): R50
Provider/business amount: R450
```

The system must record: Customer, Appointment, Provider/business, Amount, Payment type, Platform fee, Provider/business amount, Payment status, Transaction reference, Date/time.

> **Note:** the MVP launches with a flat 10% commission (Basic tier, no subscription). A Premium tier with a reduced commission and extra features is the recommended next phase — see **Section 7: Business Model & Monetisation** below for the full reasoning and tier comparison.

## 4. Customer Points

Customers earn different points depending on the payment type.

- Deposit payment → Deposit points
- Full payment → Full-payment points

The exact point values should be configurable.

The MVP includes: points balance, points earned, points history, and a link between points and qualifying payment.

Points redemption/rewards can be considered later.

## 5. Important Appointment & Payment Scenarios

The MVP must handle real-world cases.

**Customer Pays but Does Not Pitch**
```
Customer pays → Appointment confirmed → Customer does not arrive
→ Provider marks NO_SHOW → System applies no-show/payment policy
→ Appointment and payment records updated
```

**Provider Does Not Pitch**
```
Customer pays → Provider/business cannot attend → Provider/business cancels
→ System applies provider cancellation policy → Refund / reschedule / other configured outcome
```

**Customer Cancels** — the system checks the cancellation policy and determines the applicable refund/payment outcome.

**Customer Reschedules** — the new slot must be available. The original slot is released and the existing payment remains linked to the appointment.

**Customer Arrives Late** — the provider can record the late arrival and decide the appropriate permitted outcome, such as continuing, completing, cancelling or rescheduling.

Exact refund/no-show/late policies should be confirmed with the client before implementation.

## 6. What Makes the Platform Valuable

**Customers**
- Discover multiple providers in one platform.
- View services, prices and availability.
- Book without manual calls/messages.
- Secure appointments through deposits/full payment.
- Earn points from qualifying payments.
- Manage appointments.

**Sole Providers**
- Get an online booking presence.
- Manage their own services and calendar.
- Reduce manual scheduling.
- Receive financially committed bookings.

**Businesses**
- Manage multiple services.
- Manage multiple staff.
- Give every staff member an individual calendar.
- Manage appointments centrally.

**Platform**
- Supports many providers and businesses.
- Earns 10% from transactions.
- Creates a central service marketplace.

**Why this differs from a single-provider tool (e.g. Calendly):** existing scheduling tools help *one* provider manage *their own* calendar — they don't help a customer discover providers they don't already know about, and they don't put any financial commitment behind a booking. This platform's edge is the combination of (1) cross-provider discovery in one place and (2) deposit/full-payment commitment that protects providers from no-shows — neither of which a single-provider scheduling tool offers.

**Value proposition, stated directly:**
- **Who it's for:** small independent service providers and small businesses (1–15 staff) who don't have the budget or need for enterprise scheduling software, and the customers who use them.
- **What problem it solves better:** discovery. A single-provider tool assumes the customer already knows who they want to book; this platform helps them find who to book in the first place, then books them with the same commitment (deposit/payment) a single-provider tool doesn't offer.
- **What the customer gets:** one account to find, compare, and book across many providers, with points as a reason to keep booking through the platform rather than going back to calling around.
- **What the business/provider gets:** a stream of customers who weren't already theirs, plus a booking commitment mechanism that reduces no-show losses — something a plain calendar tool can't provide.
- **Why a business would pay for Premium:** once a provider is getting real volume through the platform, a lower commission rate and better visibility pay for themselves — see Section 7 below.
- **Why customers keep using it:** accumulated points, booking history in one place, and growing provider coverage make it more convenient than returning to per-business channels over time.

## 7. Business Model & Monetisation

**Options considered:**
- **Commission-only** — simple, no upfront cost for providers, but caps the platform's revenue per provider regardless of how much value they're getting, and gives no reason for a high-volume provider to want more from the platform.
- **Subscription-only** — predictable revenue, but adds friction before a new provider has booked a single customer through the platform, which works against onboarding in the early stage the client is in.
- **Hybrid (recommended)** — a free, commission-only entry point removes all onboarding friction, while a paid Premium tier gives providers a reason to upgrade once the platform is demonstrably bringing them business.

**Recommended structure:**

| | Basic | Premium |
|---|---|---|
| Cost to join | Free | Monthly subscription |
| Commission per booking | 10% | Reduced (e.g. 6–7%) |
| Search/discovery placement | Standard | Featured/priority placement |
| Staff/providers (businesses) | Capped (e.g. up to 3) | Higher or unlimited |
| Analytics | Basic appointment history | Repeat-customer tracking, busiest times/services, no-show rates |
| Customer re-engagement tools | — | Message past customers about new availability/offers |
| Business profile branding | Standard | Custom branding |

**MVP scope:** the MVP implements the **Basic tier only** (flat 10% commission, no subscription billing) — this is what's already fully specified in the Payment Model. **Premium (subscription billing, tiered commission, analytics)** is a defined next phase rather than an MVP feature, since it requires recurring-billing infrastructure that isn't needed to validate the core platform first. This mirrors the same "don't build what isn't needed yet, but know how you'd get there" principle already applied to reviews and deposits.

---

# PART B — FIVE PLANNING DELIVERABLES

## 1. Problem Understanding

### The Problem (As Stated in the Client Brief)

The client is a service-based business that currently manages customer appointments manually — through phone calls, messages, and other communication channels. As their customer base grows, this manual process is becoming increasingly difficult to sustain, leading to scheduling errors, miscommunication, and unnecessary administrative overhead. The client wants a digital solution that makes booking easier for customers and scheduling easier for the business, and has explicitly left the team open to recommend how the system should work.

### Current Problems (as experienced by the client's business)

- Customers must contact the business directly (by phone/message) to check availability, with no self-service way to view open slots.
- Appointment details are scattered across calls and messages rather than recorded centrally.
- Manual coordination increases the risk of human error, scheduling conflicts, and double bookings.
- As the number of customers grows, the administrative burden of manually tracking appointments grows with it.
- Rescheduling or cancelling an appointment requires additional back-and-forth communication rather than being self-service.

### People Affected

**Customers**
- Need a convenient way to view availability and book, without relying on calls/messages.
- Need confirmation that their appointment was recorded correctly.

**Service Providers / Staff**
- Need a centralised schedule instead of manually tracked bookings.
- Need to reduce time lost to scheduling errors and back-and-forth communication.

**Business / Platform Admin**
- Needs oversight of the schedule as the business grows.
- Needs reduced administrative overhead from manual coordination.

### Beyond the Brief: Why We're Recommending a Multi-Provider Platform

The brief describes this one business's problem, but the root cause — no shared system for managing and booking appointments, forcing reliance on manual, ad-hoc communication — is not unique to this client. Any small service-based business (a salon, a plumber, a personal trainer) runs into the same problem as it grows.

A booking tool built to solve this for one business only would still leave the client without a way to be *found* by new customers, and would need to be rebuilt from scratch for every other business with the same problem. Instead, we recommend building the same underlying booking/availability/appointment system as a **multi-provider platform**: independent providers and businesses — including this client — can register and manage their own schedule independently, while customers can discover and book across all of them from one place.

This still fully solves the problem the client actually described — their business gets a working digital system that removes the manual scheduling burden — while adding customer discovery as a byproduct, and turning the project into a viable multi-sided product rather than a single-use internal tool. We're proposing this because the client explicitly invited recommendations on how the system should work; this is that recommendation, with the reasoning made explicit rather than assumed.

### Beyond the Brief: Why Deposit/Payment Is Included in the MVP

Mentor feedback noted that payments don't need to be part of the MVP, and could instead be a documented future enhancement. Our team is including a deposit/full-payment requirement in the MVP anyway, for a specific reason: manual scheduling's biggest real cost to the client isn't just the admin overhead described in the brief — it's the appointment time and income lost when a customer books manually and doesn't show up, with no consequence. A payment requirement is the most direct fix for that specific loss, and without it the platform still leaves the client exposed to the same no-show risk they have today, just through a nicer interface.

We're treating this as "solving the client's problem more completely," not scope creep — the same reasoning the mentor asked us to apply to the one-business assumption. The trade-off (payment integration adds real implementation complexity for a 10-week build) is accepted deliberately, not by default.

### Proposed Solution

Build a multi-service-provider appointment platform using Next.js.

Customers can discover sole providers and businesses, select a service and provider/staff member, choose an available slot and pay the required deposit or full fee. Sole providers manage themselves independently. Businesses manage their business, services and staff, while each staff member has an individual calendar. The platform charges a 10% transaction fee and awards different customer points for deposits and full payments.

### Success Criteria

The MVP should:
- Allow customers to discover multiple providers.
- Allow customers to book available appointments.
- Require the configured deposit/full payment before confirmation.
- Prevent double bookings.
- Allow sole providers to manage their own schedules.
- Allow businesses to manage services and staff.
- Give each business staff member an individual calendar.
- Record no-shows and cancellations correctly.
- Calculate the 10% platform fee correctly.
- Award the correct customer points.
- Allow admins to oversee users, appointments and transactions.

## 2. Stakeholders and Users

| User | Type | Goal | Main Actions |
|---|---|---|---|
| Customer | End user | Find and book services | Browse, select provider, select service, pay, book, cancel, reschedule, manage points |
| Sole Provider | Individual provider | Manage independent services | Register, manage services, availability, calendar and appointments |
| Business Owner/Manager | Business provider | Manage a service business | Register business, manage services, staff, calendars and appointments |
| Business Staff/Provider | Provider under business | Manage their own work | Manage own availability, calendar and assigned appointments |
| Platform Admin | Platform operator | Manage platform | Manage users, providers, businesses, appointments and transactions |

### Access Rules

- **Customer** — can access only their profile, appointments, payments and points.
- **Sole Provider** — can manage only their own services, availability, calendar and appointments.
- **Business Owner/Manager** — can manage the business, services, staff, staff assignments and business appointments.
- **Business Staff** — can manage their own permitted services, availability, calendar and assigned appointments. They do not automatically receive business-owner permissions.
- **Platform Admin** — has platform-level administrative access.

## 3. System Requirements

### A. Functional Requirements

**Authentication & Roles**
- FR-01 — The system shall allow customers to register and log in.
- FR-02 — The system shall allow individuals to register as sole service providers.
- FR-03 — The system shall allow businesses to register as service providers.
- FR-04 — The system shall allow businesses to create/manage staff accounts.
- FR-05 — The system shall enforce role-based access control.
- FR-06 — The system shall provide a secure platform admin area.

**Provider Discovery**
- FR-07 — Customers shall be able to browse multiple service providers.
- FR-08 — Customers shall be able to view provider/business profiles.
- FR-09 — Customers shall be able to view available services.
- FR-10 — The system shall display service price and duration.

**Services**
- FR-11 — Sole providers shall be able to create and manage their services.
- FR-12 — Businesses shall be able to create and manage services.
- FR-13 — Businesses shall be able to assign services to staff.

**Availability & Calendars**
- FR-14 — Providers shall be able to define working hours.
- FR-15 — Providers shall be able to block unavailable dates/times.
- FR-16 — Each business staff member shall have an individual calendar.
- FR-17 — The system shall calculate available slots using service duration and provider availability.
- FR-18 — The system shall prevent conflicting bookings.

**Appointments**
- FR-19 — Customers shall be able to select available appointment slots.
- FR-20 — The system shall require the configured deposit/full payment before confirming an appointment.
- FR-21 — Customers shall be able to view their appointments.
- FR-22 — Customers shall be able to cancel appointments according to the cancellation policy.
- FR-23 — Customers shall be able to reschedule eligible appointments.
- FR-24 — Providers shall be able to view their appointments.
- FR-25 — Providers shall be able to update appointment status.
- FR-26 — Providers shall be able to mark customer no-shows.
- FR-27 — The system shall record provider cancellations.

**Payments**
- FR-28 — The system shall support deposit payments.
- FR-29 — The system shall support full appointment payments.
- FR-30 — Each payment shall be associated with an appointment.
- FR-31 — The system shall calculate the platform fee on every transaction (10% under the MVP's Basic tier; tier-dependent once Premium is built).
- FR-32 — The system shall record the provider/business amount after the platform fee.
- FR-33 — The system shall record payment status and transaction reference.
- FR-34 — The system shall support refund/payment outcomes according to cancellation policies.

**Points**
- FR-35 — The system shall award points for qualifying deposit payments.
- FR-36 — The system shall award a different points value for qualifying full payments.
- FR-37 — The system shall maintain a customer points balance.
- FR-38 — The system shall maintain points history linked to qualifying transactions.

**Admin**
- FR-39 — The admin shall be able to view/manage customers.
- FR-40 — The admin shall be able to manage sole providers.
- FR-41 — The admin shall be able to manage businesses.
- FR-42 — The admin shall be able to manage staff accounts.
- FR-43 — The admin shall be able to view appointments.
- FR-44 — The admin shall be able to view transactions and platform fees.

### B. Non-Functional Requirements

**Security**
- Role-based authorization must be enforced server-side.
- Users may only access data they are permitted to access.
- Business staff must not automatically receive owner permissions.
- Payment information must be handled securely.

**Reliability**
- Booking must prevent double bookings.
- Failed payments must not create confirmed appointments.
- Appointment and payment statuses must remain consistent.

**Performance**
- Provider/service discovery should load efficiently.
- Availability calculations should respond quickly.
- Duplicate booking submissions must be prevented.

**Usability**
- Booking should be simple and clear.
- Dashboards should clearly show upcoming appointments.
- Payment and appointment statuses should be understandable.

**Responsiveness**
- The system must work on desktop, tablet and mobile.

**Validation**
- Invalid dates/times must be rejected.
- Unavailable slots cannot be booked.
- Payment totals and the 10% platform fee must be calculated server-side.

**Error Handling**
- Failed payments must show clear feedback.
- Booking conflicts must show clear feedback.
- Unauthorized actions must be rejected without exposing sensitive information.

### C. Assumptions

1. The platform supports multiple independent providers and businesses.
2. A sole provider is an individual service provider.
3. A business can have multiple staff/service providers.
4. Each business staff member has an individual calendar.
5. Business owners manage business-level configuration.
6. Staff members only manage their own permitted schedules and appointments.
7. Customers must pay the required deposit or full fee before confirmation.
8. The platform charges a 10% commission on every transaction under the MVP's Basic tier; a lower-commission Premium tier is a defined future phase, not part of the MVP *(see Section 7: Business Model & Monetisation)*.
9. Deposit and full payments award different points.
10. Points are recorded against qualifying successful transactions.
11. Appointment and payment history is retained for administration/disputes.
12. Cancellation, refund, no-show and provider-cancellation rules must be agreed before implementation.
13. The payment gateway will be selected during technical planning.
14. Reviews/ratings are a defined future enhancement, not built in the MVP — the design (specific-provider reviews, post-completion only, rolling up to a business average) is settled so it can be added without reworking the appointment/payment model *(see Section 4, "We Are NOT Prioritising Yet")*.

## 4. User Stories and Acceptance Criteria

### Customer

**US-01 — Discover Providers**
As a customer, I want to browse providers so that I can choose a suitable service provider.
*Given* providers are registered, *when* I browse the platform, *then* I should be able to view sole providers and businesses.

**US-02 — View Services**
As a customer, I want to view a provider's services so that I can choose what to book.
*Given* I have selected a provider/business, *when* I view their profile, *then* I should see available services, prices and durations.

**US-03 — Select Business Staff**
As a customer, I want to select an available staff member so that I can choose who provides my service.
*Given* a business has multiple staff members offering the service, *when* I select a staff member, *then* I should see that staff member's availability.

**US-04 — Book With Deposit**
As a customer, I want to pay a deposit so that my appointment can be confirmed.
*Given* the service requires a deposit, *when* the payment succeeds, *then* the appointment should be confirmed and deposit points awarded.

**US-05 — Book With Full Payment**
As a customer, I want to pay the full fee so that my appointment is fully paid.
*Given* the service requires full payment, *when* the payment succeeds, *then* the appointment should be confirmed and full-payment points awarded.

**US-06 — Prevent Double Booking**
As a customer, I want unavailable slots to be prevented so that I cannot book a slot already taken.
*Given* another customer has booked the slot, *when* I attempt to book it, *then* the system should reject the booking.

**US-07 — Customer No-Show**
As a provider, I want to mark a customer as a no-show so that the appointment and payment policy can be applied.
*Given* the customer does not attend, *when* the provider marks NO_SHOW, *then* the system should update the appointment and apply the configured policy.

**US-08 — Provider Cancellation**
As a customer, I want my paid appointment handled fairly if the provider cannot attend.
*Given* I have paid, *when* the provider/business cancels, *then* the system should apply the configured provider-cancellation/refund policy.

**US-09 — Reschedule**
As a customer, I want to reschedule an eligible appointment so that I can select another available time.
*Given* the appointment can be rescheduled, *when* I select an available new slot, *then* the appointment should move without creating a duplicate booking or payment.

### Sole Provider

**US-10 — Manage Services**
As a sole provider, I want to manage my services so that customers can book them.
*Given* I am authenticated, *when* I create/update a service, *then* it should be saved under my provider account.

**US-11 — Manage Availability**
As a sole provider, I want to manage my availability so that customers only book when I am available.
*Given* I configure working hours, *when* customers search for slots, *then* the system should calculate availability using my schedule.

### Business

**US-12 — Register Business**
As a business owner, I want to register my business so that I can offer services on the platform.
*Given* I provide valid business information, *when* I submit registration, *then* the business profile should be created.

**US-13 — Manage Staff**
As a business owner, I want to add staff so that customers can book individual providers within my business.
*Given* I am authorized, *when* I add staff, *then* the staff member should have an account and individual calendar.

**US-14 — Manage Staff Availability**
As a business owner, I want to manage staff schedules so that customers see valid appointment times.
*Given* staff have different schedules, *when* their availability is configured, *then* availability should be calculated per staff member.

### Platform Admin

**US-15 — Manage Users**
As a platform admin, I want to manage customers, sole providers and businesses so that I can maintain the platform.
*Given* I am authorized, *when* I access user management, *then* I should be able to perform permitted administrative actions.

**US-16 — View Transactions**
As a platform admin, I want to view transactions so that I can monitor payments and platform fees.
*Given* transactions exist, *when* I access transaction management, *then* I should see payment amounts, fees, statuses and associated appointments.

## 5. User Flows

**Flow 1 — Customer Books With Deposit**
```
Customer → Register/Login → Browse Providers → Select Sole Provider OR Business
→ Select Service → If Business: Select Staff → Select Date → View Available Times
→ Select Appointment → System Calculates Deposit → Customer Pays
→ Payment Successful?
   ├── No → Show Error → Retry
   └── Yes → Calculate 10% Platform Fee → Record Transaction
             → Award Deposit Points → Confirm Appointment → Show Confirmation
```

**Flow 2 — Customer Books With Full Payment**
```
Customer → Select Provider → Select Service → Select Staff (if business)
→ Select Available Time → Review Appointment → Pay Full Amount
→ Payment Successful?
   ├── No → Do Not Confirm Appointment
   └── Yes → Calculate 10% Platform Fee → Record Transaction
             → Award Full-Payment Points → Confirm Appointment
```

**Flow 3 — Sole Provider Registration**
```
Register as Sole Provider → Create Profile → Add Services → Set Prices & Duration
→ Set Working Hours → Block Unavailable Times → Provider Ready → Customers Can Book
```

**Flow 4 — Business Registration**
```
Business Registration → Create Business Profile → Add Services → Add Staff
→ Assign Services to Staff → Configure Staff Availability
→ Each Staff Member Gets Calendar → Business Ready
```

**Flow 5 — Customer No-Show**
```
Appointment Confirmed → Customer Paid → Appointment Time
→ Customer Attends?
   ├── Yes → Service Provided → Complete
   └── No → Provider Marks NO_SHOW → Apply No-Show Policy
             → Update Appointment & Payment
```

**Flow 6 — Provider Cancellation**
```
Customer Has Paid → Provider Cannot Attend → Provider/Business Cancels
→ Record Provider Cancellation → Apply Cancellation Policy
→ Refund / Reschedule / Other Outcome → Update Payment & Appointment
```

**Flow 7 — Rescheduling**
```
Customer Opens Appointment → Select Reschedule → View Available Slots
→ Select New Slot → Check Availability
→ Available?
   ├── No → Choose Another
   └── Yes → Update Appointment → Release Original Slot
             → Keep Existing Payment Linked → Confirm New Time
```

### MVP Business Rules

- Every appointment belongs to one customer.
- Every appointment belongs to one service and one provider.
- Business appointments also belong to the relevant business.
- A business staff member can only be booked for services assigned to them.
- Providers cannot have overlapping appointments.
- Customers cannot book unavailable slots.
- Required payment must succeed before an appointment is confirmed.
- Failed payments must not create confirmed appointments.
- The platform fee is 10% of every transaction under the MVP's Basic tier (see Section 7: Business Model & Monetisation).
- Deposit and full payments award different points.
- Points are awarded only after successful qualifying payment.
- Payment records remain linked to appointments.
- Cancellation/refund outcomes must be recorded.
- Staff cannot access another provider's private calendar.
- Business staff do not automatically have owner permissions.
- Platform admins have platform-level permissions.
- Cancelled/no-show/completed appointments retain their history.
- Rescheduling must not create duplicate appointments or charges.
- A provider cancellation must trigger the configured customer payment outcome.
- A customer no-show must trigger the configured no-show policy.

### MVP Data Model Concept

```
USER
├── CUSTOMER
├── SOLE_PROVIDER
├── BUSINESS_OWNER
├── BUSINESS_STAFF
└── PLATFORM_ADMIN

BUSINESS
├── SERVICES
├── STAFF
│   └── INDIVIDUAL CALENDAR
└── APPOINTMENTS

SOLE_PROVIDER
├── SERVICES
├── AVAILABILITY
└── APPOINTMENTS

CUSTOMER
├── APPOINTMENTS
├── PAYMENTS
└── POINTS

APPOINTMENT
├── CUSTOMER
├── SERVICE
├── PROVIDER
├── BUSINESS (optional for sole provider)
└── PAYMENT

PAYMENT
├── APPOINTMENT
├── CUSTOMER
├── PLATFORM FEE (tier-dependent: 10% Basic)
└── PROVIDER/BUSINESS AMOUNT

POINTS TRANSACTION
├── CUSTOMER
├── PAYMENT
└── POINTS EARNED
```

### MVP Boundary

**We ARE Building — and why each belongs in the MVP**

| Feature | Why it's in the MVP |
|---|---|
| Multi-provider discovery | Core to the "beyond the brief" value proposition — without it this is just a single-business tool. |
| Sole provider & business registration | Both provider types must exist for discovery/booking to mean anything. |
| Business service & staff management, individual staff calendars | Needed for a business (not just a sole provider) to operate on the platform at all. |
| Provider availability, service management | Required to calculate real bookable slots — the core booking loop can't work without it. |
| Customer booking, cancellation, rescheduling | The core loop the client's brief asked for, directly replacing manual phone/message booking. |
| Deposit & full payments, 10% platform fee | Directly addresses the no-show income loss identified as the client's deeper problem (see "Beyond the Brief" in Section 1). |
| Customer points | Cheap to add once payments exist, and gives customers a reason to keep booking through the platform rather than reverting to direct contact. |
| No-show and provider-cancellation handling | Explicitly required real-world scenarios raised in mentor feedback; without them, payments create disputes with no resolution path. |
| Appointment/payment history | Needed for disputes, admin oversight, and as the foundation for reviews later. |
| Dashboards (customer/provider/business/admin), role-based access | Every other feature above needs a place to live and needs to be permission-scoped. |
| Responsive web interface | Explicit non-functional requirement from the brief and success criteria. |

**We Are NOT Prioritising Yet — and why**

| Feature | Why it's deferred |
|---|---|
| Reviews/ratings | Design is settled (specific-provider reviews, post-completion only, rolling up to business average — see assumption 14) but not built; needs a base of completed appointments to be useful, which the MVP won't have on day one. |
| Premium subscription tier & billing | Requires recurring-billing infrastructure on top of one-off payments; validating the core platform on the Basic (commission-only) tier first is lower-risk (see Section 7). |
| Points redemption/rewards | Points can be earned and tracked in the MVP; redemption is a separate system that isn't needed to prove the core loop. |
| SMS, advanced analytics, marketing/advertising tools | Enhance retention/growth but aren't needed to prove the booking + discovery + payment loop works. |
| Native mobile apps | The responsive web app covers the mobile use case for the MVP; native apps are a scaling decision, not a validation one. |
| AI recommendations, franchise management, advanced loyalty programmes | Depend on usage data and scale the MVP won't have yet — premature before the core platform is proven. |

These can be considered after the MVP, once the core discovery-and-booking loop is validated.

### Final MVP Definition

A multi-service-provider appointment platform where customers discover sole providers and businesses, select services and providers, pay a required deposit or full appointment fee, earn points, and manage appointments; while sole providers and businesses manage services, availability and calendars, and the platform admin manages the overall ecosystem.

```
                    PLATFORM
                       │
          ┌────────────┴────────────┐
          │                         │
   SOLE PROVIDERS              BUSINESSES
          │                         │
      Services                  Services
      Calendar                    Staff
      Bookings                    │
          │                 Individual Calendars
          │                         │
          └────────────┬────────────┘
                       │
                  APPOINTMENTS
                       │
                    CUSTOMERS
                       │
                PAYMENT + POINTS
                       │
             PLATFORM FEE (10% Basic tier)
```

**Important:** the team should agree on this product model and business rules before designing the database or starting development. The mentor feedback specifically emphasized that changing from a single-business system to a multi-business platform affects the data model, authentication, permissions, booking logic and payment/revenue model.

---

## Status Notes

Both open items from the earlier review are now resolved in this document, not left as placeholders:

- **Business model** — researched, compared against alternatives, and recommended: see **Section 7, Business Model & Monetisation** (Part A). MVP builds the Basic (commission-only) tier; Premium is a scoped future phase.
- **Reviews** — deferred from the MVP, but with a settled design (specific-provider reviews, post-completion only, business-level average) captured in **Assumption 14** and the **MVP Boundary** table, so the team can explain the decision rather than just the outcome.
