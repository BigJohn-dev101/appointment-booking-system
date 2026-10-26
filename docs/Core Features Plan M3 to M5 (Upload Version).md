# Core Features Plan: M3 to M5

Appointment Booking System · Week starting 26 October 2026 · Team of 5

## 1. Overview

Authentication and roles (M2) are complete. This week the team starts the **core features** of the platform. The dependency chain is:

**Provider Dashboard (M3) → Services & Availability (M4) → Appointment Booking (M5)**

Appointment booking depends on providers being able to manage their services and availability, so these milestones are built in order. This week's goals:

- Complete **M3 (Provider Dashboard)** by Friday.
- Start **M4 (Services & Availability)** so that M5 is not blocked.
- Keep every issue small, clearly owned, and reviewed.

---

## 2. Issues to Complete This Week

All M3 issues must be completed and merged by Friday. The M4 starter issues are targets for Thursday and Friday.

### M3: Provider Dashboard (must complete)

| ID | Issue | Owner | Target |
| --- | --- | --- | --- |
| M3-10 | Write and publish the M3/M4 API contract | Member 2 | Mon |
| M3-05 | Create Provider Profile model and relation to User | Member 2 | Mon–Tue |
| M3-08 | Create provider-only authorization on all provider routes | Member 2 | Tue–Wed |
| M3-06 | Create `GET` provider profile endpoint | Member 2 | Wed |
| M3-07 | Create `PATCH` provider profile endpoint with validation | Member 2 | Wed |
| M3-09 | Create dashboard stats endpoint (counts return 0 until appointments exist) | Member 2 | Wed |
| M3-01 | Create provider dashboard layout (shell, sidebar, top bar) | Member 1 | Mon–Tue |
| M3-03 | Create provider profile page (view mode) | Member 1 | Tue |
| M3-02 | Create dashboard home page with statistics cards | Member 1 | Wed |
| M3-04 | Make the dashboard responsive (collapsible sidebar on mobile) | Member 1 | Thu |
| M3-15 | Restrict dashboard routes to the `PROVIDER` role on the frontend | Member 3 | Tue |
| M3-11 | Connect the profile page to the profile API | Member 3 | Wed |
| M3-12 | Create edit provider profile form and submit flow | Member 3 | Wed–Thu |
| M3-13 | Create provider settings page | Member 3 | Thu |
| M3-14 | Create appointment overview section (empty state until M5) | Member 3 | Thu |
| M3-16 | Connect dashboard statistics cards to the stats endpoint | Member 3 | Thu |
| M3-17 | Build a reusable `StatCard` component | Member 4 | Mon |
| M3-18 | Build reusable `EmptyState` and `LoadingSkeleton` components | Member 4 | Mon–Tue |
| M3-19 | Create the sidebar navigation config (links and icons) | Member 4 | Tue |
| M3-20 | Build the static layout of the profile form | Member 4 | Tue–Wed |
| M3-21 | Check all provider pages on mobile and log layout bugs | Member 4 | Thu |
| M3-22 | Write the "Provider Dashboard" section of the user guide | Member 4 | Fri |
| M3-28 | Create GitHub labels, bug report template, and issue template | Member 5 | Mon |
| M3-26 | Create shared form validation message constants | Member 5 | Tue |
| M3-23 | Write a seed script with 3 to 5 sample providers and profiles | Member 5 | Wed |
| M3-24 | Create a Postman collection for all provider endpoints | Member 5 | Wed |
| M3-27 | Test provider authorization (client and admin accounts must be rejected) | Member 5 | Thu |
| M3-25 | Write the M3 manual test checklist and run it after integration | Member 5 | Thu–Fri |

### M4: Services & Availability (starter issues)

| ID | Issue | Owner | Target |
| --- | --- | --- | --- |
| M4-03 | Create Service model and CRUD API with ownership checks | Member 2 | Thu–Fri |
| M4-01 | Create manage services page (list of services) | Member 1 | Fri |
| M4-10 | Build the static add/edit service form layout | Member 4 | Fri |
| M4-14 | Add sample services to the seed script | Member 5 | Fri |

### M3 is complete when

A provider can log in, land on the dashboard, view and edit their profile, change settings, and see statistics. Client and admin accounts cannot access provider routes.

---

## 3. Team and Ownership

| Member | Role | Main Focus |
| --- | --- | --- |
| **Member 1** | Frontend lead | Dashboard UI, calendar UI, page layouts, shared components |
| **Member 2** | Backend lead | Database models, APIs, validation, authorization, slot logic |
| **Member 3** | Provider functionality and integration | Connecting frontend to backend, provider workflows, reviews |
| **Member 4** | Frontend support and documentation | Reusable UI components, static layouts, responsive checks, user guide |
| **Member 5** | Backend support and QA | Seed data, API testing, test checklists, templates, supporting endpoints |

Members 4 and 5 recently joined the team, so their tasks are scoped to build familiarity with the codebase and grow in size over the coming weeks. Everyone takes part in code review, testing, and bug fixing.

---

## 4. How We Work

### 4.1 Contract first

Member 2 publishes the **API contract** (endpoint, method, request body, response shape, error codes) for M3 on Monday, before building the endpoints. Frontend work can then proceed against mock data without waiting for the backend. The contract lives in the repo (for example `docs/api-contract.md`) and is changed through PRs only.

### 4.2 Pairing

- Member 4 pairs with Member 1, and Member 5 pairs with Member 2.
- At the start of each new task, the pair spends 20 to 30 minutes walking through the existing pattern to follow.
- Member 3 acts as a backup reviewer and pairing partner for both.

### 4.3 Task scoping

Every issue should:

- Be small enough to finish in one to three days.
- Point to an existing file or pattern to follow where one exists.
- Have clear acceptance criteria.
- Avoid mixing database schema changes with unrelated work.

### 4.4 Code review

- Every PR needs at least one reviewer who is not the author.
- Review within **24 hours**. Small PRs make this realistic.
- Review comments explain the reason for a change, not only the change itself.

### 4.5 Communication

- **Daily 15-minute standup**: what I finished, what I am doing today, what blocks me.
- **Blockers**: anyone blocked for more than 30 minutes asks for help in the team chat. If there is no answer in 4 hours, tell the team lead.
- **Shared changes**: announce before changing a database model, shared component, or the API contract.

---

## 5. Week Plan

| Day | Plan |
| --- | --- |
| **Mon** | Kickoff. Create and assign all M3 issues. Member 2 publishes the API contract. Member 1 starts the layout, Member 4 starts reusable components, Member 5 sets up labels and templates. |
| **Tue** | Backend builds the profile model and authorization. Member 1 builds the profile page. Member 3 builds the route guard and forms against mock data. |
| **Wed** | Profile and stats endpoints ready by midday. Member 3 connects frontend to API. Member 5 seeds data and tests endpoints. |
| **Thu** | Integration day. Fix frontend and backend mismatches. Run the M3 test checklist. Member 2 starts the M4 Service model. |
| **Fri** | PR reviews, bug fixing, short M3 demo, close the M3 milestone. Plan M4 for next week. |

---

## 6. M4: Services & Availability (Next Week)

**Goal:** Providers can define what they offer and when they are available.

| ID | Issue | Owner |
| --- | --- | --- |
| M4-01 | Create manage services page (list of services) | Member 1 |
| M4-02 | Create availability and calendar UI | Member 1 |
| M4-03 | Create Service model and CRUD API with ownership checks | Member 2 |
| M4-04 | Create Availability model and API | Member 2 |
| M4-05 | Create time-slot generation logic | Member 2 |
| M4-06 | Prevent invalid availability (end before start, overlaps) | Member 2 |
| M4-07 | Connect services UI to the services API (add, edit, delete) | Member 3 |
| M4-08 | Create provider working hours management | Member 3 |
| M4-09 | Handle provider unavailable dates | Member 3 |
| M4-10 | Build the static add/edit service form layout | Member 4 |
| M4-11 | Build the delete confirmation modal component | Member 4 |
| M4-12 | Add the empty state for "no services yet" | Member 4 |
| M4-13 | Build a weekday selector component (UI only) | Member 4 |
| M4-14 | Add sample services to the seed script | Member 5 |
| M4-15 | Create a Postman collection for service endpoints | Member 5 |
| M4-16 | Write test cases for service CRUD and run them | Member 5 |
| M4-17 | Write test cases for invalid availability and run them | Member 5 |

---

## 7. M5 Preparation (For Awareness)

M5 (Appointment Booking) starts only after M4 is working. Rough split:

- **Member 1:** provider browse and profile pages, date and time picker, booking form.
- **Member 2:** Appointment model, booking API, double-booking prevention, status logic.
- **Member 3:** provider appointment list, accept and cancel actions, calendar integration.
- **Member 4:** booking confirmation page layout, appointment card component, status badge component.
- **Member 5:** double-booking test cases, booking flow test checklist, seed appointments.

---

## 8. Issue Template

**Title:** Short action phrase (for example, "Create reusable StatCard component")

**Description:** What needs to be built and why.

**Steps / Pattern to follow:** Existing file or example to follow, where one exists.

**Acceptance Criteria:**

- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Tested manually or with Postman

**Milestone:** M3 / M4 / M5

**Assignee:** One person

**Reviewer:** Name

**Labels:** `frontend` / `backend` / `testing` / `docs`

### Example

**Title:** Create reusable StatCard component

**Description:** The dashboard home shows several statistic cards. One reusable component keeps every card consistent.

**Steps / Pattern to follow:**

1. Look at how the existing `Button` component accepts props.
2. Create `StatCard` with props `title`, `value`, and `icon`.
3. Style it to match the dashboard design.
4. Add it to a test page with 3 sample cards.

**Acceptance Criteria:**

- [ ] Component accepts `title`, `value`, and `icon`
- [ ] Looks correct on desktop and mobile
- [ ] No hard-coded values inside the component

**Milestone:** M3 · **Assignee:** Member 4 · **Reviewer:** Member 1

---

## 9. Git Workflow and Rules

```text
Issue → Feature branch → Implement → Commit → Push → Pull Request → Review → Fix comments → Merge → Close issue
```

### Branch names

```text
feature/provider-dashboard-layout
feature/provider-profile-api
feature/statcard-component
fix/profile-form-validation
docs/provider-user-guide
```

### Commit examples

```text
feat: create provider dashboard layout
feat: add provider profile endpoints
fix: correct sidebar on mobile
docs: add provider dashboard guide
```

### Team rules

1. Do not build appointment booking before provider services and availability work.
2. Never work directly on `main`.
3. One issue, one branch, one assignee.
4. Keep PRs small (ideally under about 300 changed lines) so reviews are fast.
5. Test your changes before asking for review.
6. Announce changes to database models, shared components, or the API contract before making them.
7. Merge often to avoid large conflicts. Pull from `main` every morning.
8. Do not commit `.env` files or secrets.
9. Anything outside the MVP goes into the backlog, not into the current sprint.
10. Keep issue status updated (To do, In progress, In review, Done).

---

## 10. Definition of Done

An issue is done when:

- [ ] The feature is implemented and matches the acceptance criteria
- [ ] Frontend and backend are connected where required
- [ ] Validation and error handling are in place
- [ ] It has been tested (manually, with Postman, or both)
- [ ] The PR has been reviewed and merged
- [ ] The GitHub issue is closed

---

## 11. Risks and Mitigation

| Risk | Mitigation |
| --- | --- |
| Backend is late and blocks the frontend | API contract first. Frontend works against mock data until endpoints are ready. |
| New team members need time to learn the codebase | Small, well-described tasks, pairing, and the 30-minute ask-for-help rule. |
| Review and pairing load falls on a few people | Member 3 shares reviews and pairing. Review time is blocked in the daily schedule. |
| Merge conflicts in shared components | Announce shared changes. Merge small PRs often. |
| M4 slips and blocks booking | Start the M4 backend on Thursday. Do not start M5 until M4 passes testing. |
