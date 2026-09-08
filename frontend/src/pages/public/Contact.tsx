import { useState } from 'react';
 
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };
 
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
 
        <div className="grid gap-12 md:grid-cols-3">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Email</h3>
              <a href="mailto:support@appointhub.com" className="text-sky-500 hover:text-sky-600">
                support@appointhub.com
              </a>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Phone</h3>
              <a href="tel:+27106005000" className="text-sky-500 hover:text-sky-600">
                +27 (10) 600-5000
              </a>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Address</h3>
              <p className="text-slate-600">
                123 Tech Street<br />
                Cape Town, South Africa<br />
                8000
              </p>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-sky-500 hover:text-sky-600 font-medium">LinkedIn</a>
                <a href="#" className="text-sky-500 hover:text-sky-600 font-medium">Twitter</a>
                <a href="#" className="text-sky-500 hover:text-sky-600 font-medium">Facebook</a>
              </div>
            </div>
          </div>
 
          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Your name"
                />
              </div>
 
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="your@email.com"
                />
              </div>
 
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="How can we help?"
                />
              </div>
 
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Your message..."
                />
              </div>
 
              <button
                type="submit"
                className="w-full rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 active:bg-sky-700"
              >
                Send Message
              </button>
 
              {submitted && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-green-800 font-medium">
                    ✓ Thank you! We've received your message and will get back to you soon.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
 
        {/* FAQ Section */}
        <div className="mt-16 border-t border-slate-200 pt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
         
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                How long does onboarding take?
              </h3>
              <p className="text-slate-600">
                Most users can set up their booking page in less than 30 minutes. Our onboarding
                wizard guides you through each step.
              </p>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Do you offer customer support?
              </h3>
              <p className="text-slate-600">
                Yes! All plans include email support. Growth and Enterprise plans get priority support
                and dedicated account managers.
              </p>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I integrate with other tools?
              </h3>
              <p className="text-slate-600">
                We support integrations with calendar apps, email providers, and payment systems.
                Enterprise customers can request custom integrations.
              </p>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-slate-600">
                Yes! Start with our free Starter plan. No credit card required. Upgrade anytime
                when you need more features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
