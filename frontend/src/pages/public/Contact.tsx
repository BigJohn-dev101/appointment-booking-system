import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

const icons = {
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  pin: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Facebook", href: "#" },
];

const faqs = [
  {
    question: "How long does onboarding take?",
    answer:
      "Most users can set up their booking page in less than 30 minutes. Our onboarding wizard guides you through each step.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! All plans include email support. Growth and Enterprise plans get priority support and dedicated account managers.",
  },
  {
    question: "Can I integrate with other tools?",
    answer:
      "We support integrations with calendar apps, email providers, and payment systems. Enterprise customers can request custom integrations.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Start with our free Starter plan. No credit card required. Upgrade anytime when you need more features.",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h1 className="font-[Clash_Display] text-4xl font-bold tracking-tight text-[#0F172A] md:text-5xl">
            Get in touch
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-xl text-[#334155]">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {/* Contact information */}
          <div className="space-y-7 md:col-span-1">
            <ContactItem icon={icons.mail} label="Email">
              <a
                href="mailto:support@itthynkappoint.com"
                className="text-[#0EA5E9] transition-colors hover:text-sky-600"
              >
                support@itthynkappoint.com
              </a>
            </ContactItem>

            <ContactItem icon={icons.phone} label="Phone">
              <a
                href="tel:+27106005000"
                className="text-[#0EA5E9] transition-colors hover:text-sky-600"
              >
                +27 (10) 600-5000
              </a>
            </ContactItem>

            <ContactItem icon={icons.pin} label="Address">
              <p className="text-[#334155]">
                388 kent Street
                <br />
                Ferndale Randburg, South Africa
                <br />
                1200
              </p>
            </ContactItem>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#0F172A]">
                Follow us
              </h3>

              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-[#334155] transition-colors hover:border-[#0EA5E9]/50 hover:text-[#0EA5E9]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
                  />
                </Field>

                <Field label="Email" htmlFor="email">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
                  />
                </Field>
              </div>

              <Field label="Subject" htmlFor="subject">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
                />
              </Field>

              <Field label="Message" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Your message..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
                />
              </Field>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0EA5E9] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(14,165,233,0)] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_24px_-4px_rgba(14,165,233,0.55)]"
              >
                Send message
              </button>

              {submitted && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>

                  <p className="text-sm font-medium text-green-800">
                    Thank you! We've received your message and will get back to
                    you soon.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Gradient hairline, matches the rest of the site */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-[#0EA5E9]/25 to-transparent" />

        {/* FAQ */}
        <div className="pt-16">
          <h2 className="mb-10 text-center font-[Clash_Display] text-3xl font-bold text-[#0F172A]">
            Frequently asked questions
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">
                  {faq.question}
                </h3>
                <p className="text-[#334155]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9]">
        <div className="h-4.5 w-4.5">{icon}</div>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-[#0F172A]">{label}</h3>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-[#0F172A]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}