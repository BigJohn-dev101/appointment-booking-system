# Project Structure

This guide describes the maintained project layout, the frontend pages and routes currently wired into the app, and the purpose of the existing hooks and backend endpoints. Generated Prisma client internals and dependency folders are represented but not expanded.

## Project Tree

```text
appointment-booking-system/
|-- README.md
|-- PROJECT_STRUCTURE.md
|-- .gitignore
|-- backend/
|   |-- .agents/                     # local agent configuration
|   |-- .claude/                     # local Claude configuration
|   |-- .windsurf/                   # local Windsurf configuration
|   |-- package.json
|   |-- pnpm-lock.yaml
|   |-- pnpm-workspace.yaml
|   |-- prisma.config.ts
|   |-- tsconfig.json
|   |-- skills-lock.json
|   |-- .env                         # local environment configuration
|   |-- prisma/
|   |   |-- schema.prisma            # database models and relations
|   |   `-- migrations/
|   |       |-- migration_lock.toml
|   |       |-- 20260910105136_initial_schema/
|   |       |   `-- migration.sql
|   |       `-- 20260916090010_add_unique_phone_constraints/
|   |           `-- migration.sql
|   `-- src/
|       |-- server.ts                # Express app and API mounts
|       |-- seed.ts                  # database seed entry point
|       |-- vite-env.d.ts
|       |-- generated/prisma/        # generated Prisma client (omitted)
|       |-- lib/prisma.ts            # Prisma client setup
|       |-- middleware/auth.middleware.ts
|       |-- routes/
|       |   |-- auth.routes.ts
|       |   |-- business.routes.ts
|       |   |-- customer.routes.ts
|       |   `-- provider.routes.ts
|       |-- controllers/
|       |   |-- auth.controller.ts
|       |   |-- business.controller.ts
|       |   |-- customer.controller.ts
|       |   `-- provider.controller.ts
|       `-- services/
|           |-- api.ts
|           |-- availability.service.ts
|           |-- booking.service.ts
|           |-- provider.service.ts
|           `-- subscription.service.ts
|-- database/
|   `-- schema.sql
|-- docs/
|   |-- README.md
|   |-- Appointment_Booking_System_3_Member_Working_Plan.md
|   |-- appointment-booking-presentation.html
|   |-- appointment-platform-mvp-corrected.md
|   |-- appointment_platform_erd.html
|   |-- client-brief.md
|   |-- planing-presentation-feedback.md
|   |-- project-folder-structure.md
|   |-- data_modelling_wireframes_presentation/
|   |   |-- Appointment_Booking_Data_Model_v2.1 (1).pdf
|   |   |-- Appointment_Booking_Platform_Presentation_and_Walkthrough.html
|   |   `-- IMG-20260827-WA0002.jpg ... IMG-20260827-WA0013.jpg
|   `-- feedback/
|       |-- appointment-booking-system-feedback.pdf
|       `-- f.md
|-- frontend/
|   |-- package.json
|   |-- pnpm-lock.yaml
|   |-- README.md
|   |-- eslint.config.js
|   |-- index.html
|   |-- tsconfig.json
|   |-- tsconfig.app.json
|   |-- tsconfig.node.json
|   |-- vite.config.ts
|   |-- public/
|   |   |-- favicon.svg
|   |   `-- icons.svg
|   `-- src/
|       |-- App.tsx
|       |-- App.css
|       |-- index.css
|       |-- main.tsx
|       |-- assets/                  # bundled app images and starter assets
|       |-- components/
|       |   |-- booking/             # BookingConfirmation, BookingSummary, SlotPicker
|       |   |-- calendar/            # Calender, WeekView
|       |   |-- dashboard/           # DashboardShell, Navbar, Sidebar, StatCard
|       |   |-- forms/               # OnboardingForm, ServiceForm, StaffForm
|       |   |-- home/                # FindServices, Hero, HowItWorks, ProviderCTA
|       |   |-- layout/              # Footer, Navbar
|       |   `-- ui/                   # Badge, Button, Card, Input, Modal, Table
|       |-- context/AuthContext.tsx  # authentication state and operations
|       |-- data/providers.ts        # provider discovery sample data and types
|       |-- hooks/
|       |   |-- useAuth.ts
|       |   |-- useAvailability.ts
|       |   `-- useBookings.ts
|       |-- layouts/
|       |   |-- AdminLayout.tsx
|       |   |-- BusinessLayout.tsx
|       |   |-- CustomerLayout.tsx
|       |   |-- ProviderLayout.tsx
|       |   |-- PublicLayout.tsx
|       |   `-- StaffLayout.tsx
|       |-- lib/                     # currently empty
|       |-- pages/
|       |   |-- public/
|       |   |   |-- About.tsx
|       |   |   |-- Contact.tsx
|       |   |   |-- Home.tsx
|       |   |   |-- Login.tsx
|       |   |   |-- Pricing.tsx
|       |   |   |-- providers/       # Providers, ProviderProfile
|       |   |   `-- register/        # Register, CustomerRegister, ProviderRegister, BusinessRegister
|       |   |-- dashboard/
|       |   |   |-- admin/           # Dashboard, Appointments, Businesses, Providers, Reports, Subscriptions, User
|       |   |   |-- business/        # Dashboard, Appointments, Package, Profile, Services, Staff, StaffCalender, StaffDetails, Analytics
|       |   |   |-- customer/        # Dashboard, AppointmentDetails, Appointments, Book, Profile
|       |   |   `-- provider/        # Dashboard, AppointmentDetails, Appointments, Availability, Calender, Package, Profile, Services, Analytics
|       |   `-- staff/               # Dashboard, Appointments, Calender
|       |-- routes/
|       |   |-- AppRoutes.tsx
|       |   |-- ProtectedRoute.tsx
|       |   `-- RoleRoute.tsx
|       |-- services/
|       |   |-- api.ts
|       |   |-- auth.ts
|       |   |-- bookings.ts
|       |   |-- providers.ts
|       |   `-- subscriptions.ts
|       `-- types/index.ts
`-- tests/
    `-- .gitkeep
```

## Frontend Entry And Routing

`frontend/src/main.tsx` mounts the React app inside `BrowserRouter`. `App.tsx` wraps the route tree in `AuthProvider` and adds toast notifications. `routes/AppRoutes.tsx` defines the current URL map. Public pages share `PublicLayout` (navigation, page outlet, and footer); protected dashboard URLs are checked by `ProtectedRoute` and then by `RoleRoute` for the required account role.

| URL | Page | Purpose |
|---|---|---|
| `/` | `pages/public/Home.tsx` | Public landing page assembled from the hero, service discovery prompt, workflow overview, and provider call-to-action sections. |
| `/pricing` | `pages/public/Pricing.tsx` | Displays the Starter, Growth, and Enterprise plans and their listed features. |
| `/login` | `pages/public/Login.tsx` | Signs in through the auth context and directs each supported account role to its dashboard URL. |
| `/about` | `pages/public/About.tsx` | Explains the product's mission, benefits, and values. |
| `/contact` | `pages/public/Contact.tsx` | Shows contact details, FAQs, and a client-side contact form. |
| `/providers` | `pages/public/providers/Providers.tsx` | Searches and category-filters the sample provider list, then paginates results. |
| `/providers/:id` | `pages/public/providers/ProviderProfile.tsx` | Shows a provider profile, opening status, business hours, and paginated services; unknown IDs show a not-found state. |
| `/register` | `pages/public/register/Register.tsx` | Lets a visitor choose customer, independent-provider, or business registration. |
| `/register/customer` | `pages/public/register/CustomerRegister.tsx` | Collects customer details, validates password/consent, submits registration, and returns to login. |
| `/register/provider` | `pages/public/register/ProviderRegister.tsx` | Collects an independent provider's profile, service, package, and account details, then submits registration. |
| `/register/business` | `pages/public/register/BusinessRegister.tsx` | Collects business, team, package, and owner account details, then submits registration. |
| `/dashboard/customer` | `pages/dashboard/customer/Dashboard.tsx` | Customer dashboard; loads customer summary and upcoming appointments from the API. Requires `CUSTOMER`. |
| `/dashboard/provider` | `pages/dashboard/provider/Dashboard.tsx` | Independent-provider dashboard; loads appointment statistics, upcoming bookings, and subscription data. Requires `SOLE_PROVIDER`. |
| `/dashboard/business` | `pages/dashboard/business/Dashboard.tsx` | Business-owner dashboard; loads business details, today's appointments, staff, statistics, and subscription data. Requires `BUSINESS_OWNER`. |

The dashboard folders contain additional screen files, but those screens are not currently registered as routes in `AppRoutes.tsx`. The staff and admin dashboard screens are also not registered there. Login currently navigates `BUSINESS_STAFF` to `/dashboard/staff` and `ADMIN` to `/dashboard/admin`, so those destinations do not have matching route definitions yet. Several of the listed dashboard subpage files are empty placeholders; the registered dashboard pages above are the implemented screen entry points.

## Hooks And Authentication

| Hook / module | Purpose |
|---|---|
| `hooks/useAuth.ts` | Reads the shared auth context and throws a clear error if used outside `AuthProvider`. Exposes the current user, loading/authenticated state, and login, logout, and refresh operations. |
| `hooks/useAvailability.ts` | Empty placeholder; no availability hook behavior is implemented yet. |
| `hooks/useBookings.ts` | Empty placeholder; no bookings hook behavior is implemented yet. |
| `context/AuthContext.tsx` | Initializes the session with `/auth/me`, stores the authenticated user, and provides login/logout/refresh operations to the app. |
| `routes/ProtectedRoute.tsx` | Waits for auth initialization and redirects unauthenticated visitors to `/login`. |
| `routes/RoleRoute.tsx` | Enforces an allowed role for a protected page and redirects users without that role to `/login`. |
| `services/api.ts` | Shared fetch wrapper; sends cookies, parses JSON, and raises `ApiError` for failed requests. |

## Backend API

`backend/src/server.ts` configures Express, CORS, cookies, JSON parsing, and mounts the API routers. The health endpoint checks database connectivity.

| Method and path | Access | Purpose |
|---|---|---|
| `POST /api/auth/register/customer` | Public | Creates a customer account. |
| `POST /api/auth/register/provider` | Public | Creates an independent-provider account. |
| `POST /api/auth/register/business` | Public | Creates a business-owner account. |
| `POST /api/auth/login` | Public | Authenticates a user and establishes the session. |
| `POST /api/auth/logout` | Public/session cleanup | Clears the authentication session. |
| `GET /api/auth/me` | Authenticated | Returns the current user's account data. |
| `GET /api/auth/customer-test` | `CUSTOMER` | Role-protected test endpoint. |
| `GET /api/customer/dashboard` | `CUSTOMER` | Returns customer dashboard data. |
| `GET /api/customer/appointments` | `CUSTOMER` | Returns the customer's appointments. |
| `GET /api/provider/dashboard` | `SOLE_PROVIDER` | Returns independent-provider dashboard data. |
| `GET /api/business/dashboard` | `BUSINESS_OWNER` | Returns business dashboard data. |
| `GET /api/health` | Public | Checks whether the API can query the database. |

`controllers/` implements the request handlers; `middleware/auth.middleware.ts` validates session tokens and enforces roles. `services/` contains API/domain service modules for bookings, availability, providers, and subscriptions. The `auth.routes.ts`, `customer.routes.ts`, `provider.routes.ts`, and `business.routes.ts` files connect endpoint paths to those handlers.

## Other Project Areas

- `backend/prisma/schema.prisma` and its migrations define the relational database model and schema changes. `database/schema.sql` is a separate SQL schema artifact.
- `docs/` holds the client brief, project plan, data model, presentations, feedback, and planning notes.
- `frontend/src/components/` groups reusable booking, calendar, dashboard, form, home, layout, and UI components.
- `frontend/src/services/` contains client API modules for auth, bookings, providers, and subscriptions; `data/providers.ts` currently supplies provider discovery data.
- `tests/` currently contains only `.gitkeep`; no test files are present in this folder.
