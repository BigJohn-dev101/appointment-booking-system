export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for solo professionals who are booking their first clients.',
      cta: 'Get started',
      features: [
        'Up to 10 bookings per day',
        '1 staff profile',
        'Online booking page',
        'Basic calendar management',
      ],
    },
    {
      name: 'Growth',
      price: 'R199',
      description: 'Built for busy businesses ready to scale operations smoothly.',
      cta: 'Choose Growth',
      popular: true,
      features: [
        'Unlimited appointments',
        'Up to 15 team members',
        'Business dashboard',
        'Analytics and reports',
        'Priority email support',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Advanced scheduling, automation, and support for larger teams.',
      cta: 'Talk to sales',
      features: [
        'Unlimited staff access',
        'Multi-location scheduling',
        'Advanced reporting',
        'Dedicated onboarding',
        'Custom integrations',
      ],
    },
  ];

  return (
    <section className="plans-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto 40px', textAlign: 'center' }}>
        <span className="badge">Flexible plans</span>
        <h2 style={{ margin: '20px 0 12px', fontSize: 'clamp(2.3rem, 4vw, 4rem)', color: '#0f172a' }}>
          Simple, transparent pricing
        </h2>
        <p style={{ margin: '0 auto', maxWidth: '720px', color: '#334155', fontSize: '1.1rem', lineHeight: '1.8' }}>
          Choose a plan that matches your workflow and start managing bookings with less stress and more control.
        </p>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={plan.popular ? 'plan-card popular' : 'plan-card'}
          >
            {plan.popular && <span className="badge">Most popular</span>}

            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>

            <div className="plan-price">
              <span className="plan-price-value">{plan.price}</span>
              {plan.price !== 'Custom' && <span className="plan-price-unit">/month</span>}
            </div>

            <ul className="plan-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span className="checkmark">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="plan-button">{plan.cta}</button>
          </article>
        ))}
      </div>
    </section>
  );
}