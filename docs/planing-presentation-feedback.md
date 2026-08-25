# Appointment Booking System — Presentation & Planning Feedback

**Team:** Appointment Booking System  
**Document:** Planning & Requirements Presentation  
**Review:** Planning Phase Presentation

## What you did well

The team presented the system confidently and demonstrated a good understanding of what they were proposing.

One of the strongest parts of the presentation was how the team responded when challenged. Throughout the Q&A, you were asked questions that were not necessarily covered directly in your slides, and you were able to **think on the spot, discuss possible solutions and defend your decisions** rather than simply saying that something was not in the brief.

We also liked that the team appeared **aligned with one another**. It was clear that the members understood the system they were presenting and were working from the same understanding of the problem.

You also showed initiative in thinking beyond the basic booking process. For example, the discussion around customer accounts, repeat customers, customer activity and possible targeted advertising showed that you were beginning to think about **why the system would be valuable to a business**, rather than only what screens and features it should have.

The fact that you built the presentation as an interactive HTML presentation was also a good demonstration of **initiative and willingness to explore different ways of presenting your work**. The presentation was structured into a complete 12-slide planning flow rather than simply listing requirements.

---

# 1. Think beyond the brief

This is probably the **most important lesson from this presentation**.

You followed the brief well, but during the discussion we wanted to see more of you **challenging and improving the brief**.

In a real software project, a client will often tell you:

> "This is the problem I have, and this is what I think I need."

The client's proposed solution is not necessarily the best solution.

As developers, analysts and product thinkers, we expect you to be able to say:

> "We understand what you asked for, but based on the problem we're solving, we think there may be a better way to approach this."

This does **not** mean ignoring the brief or building whatever you want.

It means:

**Understand the requirement → identify limitations → propose improvements → explain why the improvement creates more value.**

This is an important skill for the rest of the programme.

---

# 2. Reconsider the "one business" assumption

Your current solution is designed around **one business with multiple services and multiple service providers**.

This was one of the biggest concerns raised during the Q&A.

We would like you to reconsider whether the platform should instead support:

**Multiple businesses → multiple services per business → multiple service providers → customers**

For example, a customer could open the platform and discover several salons, clinics, barbers, etc., rather than having to use a separate system for every business.

The important thing here is not simply to change **"one business" to "multiple businesses."**

You need to think through what that change means for:

- Business registration/onboarding
- Business profiles
- Services
- Service providers
- Customers
- Search/discovery
- Booking
- Permissions
- Availability
- Reviews
- Subscriptions or other revenue models

Your current presentation explicitly places "multiple independent businesses" outside the scope.

**Revisit this assumption rather than simply editing the wording.**

---

# 3. Define what makes your platform different

This was one of the questions we kept coming back to:

> **What makes your system special?**

We also asked questions around how the system would differ from existing appointment-booking tools such as Calendly.

You don't necessarily need to have the perfect answer at this stage. However, you need to start thinking about **your value proposition**.

If a business or customer already has other tools available, why would they choose yours?

Consider:

- Who exactly is the platform for?
- What problem does it solve better?
- What does the customer get that they don't get elsewhere?
- What does the business get?
- What does the service provider get?
- Why would businesses pay for it?
- **Why would customers keep using it?**

Your target of **small businesses** is a good starting point. Now you need to explain what makes your solution particularly valuable to that market.

---

# 4. Start thinking about the business model

One of the questions raised during the presentation was:

> **How does the system make money?**

Your presentation currently focuses heavily on functionality and the MVP, but not on the commercial model.

You don't need to implement payments as part of the MVP simply because we asked about revenue.

Instead, **explore possible business models**.

For example, consider whether businesses could subscribe to the platform, whether there could be different subscription tiers, or whether another model makes more sense.

Don't simply choose one because it was suggested to you. **Research and reason about the options and recommend one.**

---

# 5. Reviews and customer feedback

Reviews were another important enhancement raised during the discussion.

Your current customer functionality focuses on viewing availability, booking and managing appointments.

Reviews weren't included.

Consider what happens after a customer has actually used a service.

Could customers:

- Rate the service?
- Leave a review?
- Review the business?
- Review a service/provider?
- Only review after completing an appointment?

Think about how reviews could help customers choose between businesses and how they could create value for businesses on the platform.

---

# 6. Think through real-life appointment scenarios

You have already done a good job identifying cancellation, rescheduling and appointment conflicts as requirements.

However, the Q&A showed that some of the **business rules behind those features still need to be explored**.

We discussed scenarios such as:

### Customer doesn't show up

What happens to the appointment?

Who marks it as a no-show?

Does the customer receive a warning?

Does repeated no-show behaviour affect the customer's account?

### Customer arrives late

For example:

> A customer books a one-hour appointment but arrives 30 minutes late.

There may still be 30 minutes remaining, but the provider may have another appointment afterwards.

Who decides whether the service can still happen?

Does the provider continue with the remaining time?

Does the appointment need to be rescheduled?

What happens to the next appointment?

### Service provider becomes unavailable

We also discussed the opposite situation:

> What happens when the service provider has an emergency and cannot attend?

The system needs to consider the customers who already have appointments.

Who is notified?

Can the provider cancel?

Can the customer reschedule?

Does the system automatically suggest another provider or time?

These are the kinds of scenarios that turn a basic booking system into a **real system designed around real-world behaviour**.

---

# 7. Consider deposits/payments as a future enhancement

The discussion also raised the possibility of requiring a small payment or deposit to discourage no-shows.

Your current MVP excludes payments, so we are **not saying that you must suddenly add payments to the MVP**.

Instead, consider this as a potential future feature.

Think about:

- When would payment happen?
- Would it be a deposit or full payment?
- What happens when a customer cancels?
- What happens when a provider cancels?
- What happens when a customer reschedules?
- How would the payment remain associated with the appointment?

You should be able to explain how you **would eventually accommodate this**, even if you don't build it now.

---

# 8. Be clearer about the MVP

You used the term **MVP** throughout the presentation, and one of the questions raised was for you to explain exactly what you mean by MVP.

Make sure everyone on the team understands that an MVP isn't simply:

> "The features we're building now."

It represents the **smallest useful version of the product that can solve the core problem and provide value**, while leaving room for future development.

Your current presentation does a good job separating in-scope and out-of-scope functionality.

Now make sure the team can explain **why each feature belongs in the MVP** and why another feature can wait.

---

# 9. Continue developing your edge-case thinking

Your acceptance-criteria section was a good step in this direction.

You already considered things such as:

- Slot becoming unavailable
- Invalid information
- Unauthorised access
- Appointment conflicts

The Q&A showed that you can take this further.

Don't only ask:

> "What happens when everything works?"

Also ask:

> **"What happens when something goes wrong?"**

And:

> **"What happens when a real person behaves differently from what we expected?"**

That mindset will be important when you start development and testing.

---

# 10. Your technical thinking needs to follow the product decision

If you move from one business to multiple businesses, don't simply change the presentation.

Think about how the underlying system changes.

For example:

**Current thinking:**

`Business → Services → Providers → Appointments`

**Potential platform model:**

`Platform → Businesses → Services → Providers → Appointments → Customers`

That affects your data model, authentication, permissions, booking logic and potentially your subscription model.

So before development starts, make sure the **product decisions are settled first**, then design the database and architecture around those decisions.

---

# What we want you to take away

The biggest thing we want you to take from this exercise is:

> **Don't just build what was written in front of you. Understand the problem deeply enough to improve the solution.**

You showed that you can think on your feet during questioning. Now we want to see that same thinking reflected in your **planning document**.

If we challenge an assumption during a presentation, don't just answer the question verbally and move on.

**Go back, investigate it, discuss it as a team, and decide whether your original plan should change.**

---

# Next steps

- [ ] Reconsider the one-business model and explore a multiple-business platform.
- [ ] Define the relationship between businesses, services, providers and customers.
- [ ] Clearly explain **what differentiates your platform from existing solutions**.
- [ ] Explore possible **revenue/business models**.
- [ ] Consider adding **customer reviews and ratings**.
- [ ] Define the rules for **no-shows, late arrivals and provider cancellations**.
- [ ] Consider deposits/payments as a **future enhancement**, without necessarily adding them to the MVP.
- [ ] Review your MVP and make sure every included/excluded feature has a reason.
- [ ] Update your user flows and requirements based on the decisions above.
- [ ] Make sure the **whole team understands and agrees with the revised direction** before development begins.

## Final note

**Well done on the presentation.**

The team showed good preparation, initiative and teamwork, and we were particularly impressed by your ability to respond to questions and think through problems without simply relying on the slides.

The next step is to take that thinking **off the presentation stage and into the actual product plan**.

We want to see you become comfortable challenging assumptions, proposing better solutions and working together to justify those decisions.
