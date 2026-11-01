//libraries
import { Link } from "react-router-dom";

const policies = [
  {
    title: "Your account",
    description: "Provide accurate details when creating an account and keep your login information private. Use your own account when contacting designers or managing company information, and let us know if you notice activity you do not recognise.",
  },
  {
    title: "Privacy and personal information",
    description: "Share only the information needed for your enquiry. Avoid including passwords, payment details or sensitive documents in messages, design descriptions or uploaded images. Company contact information displayed in the directory is intended for project enquiries.",
  },
  {
    title: "Designs and uploaded content",
    description: "Upload only photos, designs and descriptions that you own or have permission to share. Credit other creators where appropriate, and remove personal information from images before publishing. Content should accurately represent the work shown.",
  },
  {
    title: "Respectful communication",
    description: "Keep enquiries relevant and treat customers, designers and companies with respect. Do not use the platform for spam, harassment, misleading offers or content that infringes someone else’s rights.",
  },
  {
    title: "Working with professionals",
    description: "Design images and listed budgets are a starting point for discussion. Confirm quotations, materials, schedules, payment arrangements and project terms directly with your chosen company before committing to any work. An approved listing does not guarantee a particular project outcome.",
  },
  {
    title: "Keeping information current",
    description: "Companies and designers should keep their profiles, contact details and portfolios up to date. Availability, pricing and project details can change, so check important information directly with the professional before making a decision.",
  },
];

function PolicyPage() {
  return (
    <section aria-labelledby="policy-title" className="mx-auto max-w-6xl py-6 sm:py-10">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">Houzz</p>
      <h1 id="policy-title" className="text-4xl sm:text-5xl">Policy</h1>
      <p className="mb-8 text-lg text-ink/70">Clear information. Peace of mind.</p>
      <div className="mb-6 rounded-2xl bg-sage-50 p-6 sm:p-8">
        <h2 className="mb-3 text-xl font-semibold text-ink">Using our community thoughtfully</h2>
        <p className="leading-relaxed text-ink/70">These general guidelines cover sharing designs, discovering companies and discussing your next home project.</p>
        <p className="mt-3 text-sm text-ink/60">Draft policy content for this demonstration website.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {policies.map(({ title, description }, index) => (
          <section key={title} aria-labelledby={`policy-section-${index}`} className={`rounded-2xl border border-sage-200/60 p-6 sm:p-8 ${index % 2 === 0 ? "bg-sage-50 lg:col-span-2" : "bg-white"}`}>
            <h2 id={`policy-section-${index}`} className="mb-3 text-xl font-semibold text-ink">{title}</h2>
            <p className="leading-relaxed text-ink/70">{description}</p>
          </section>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-sage-200/60 bg-white p-6 sm:p-8">
        <h2 className="mb-3 text-xl font-semibold text-ink">Questions or concerns?</h2>
        <p className="leading-relaxed text-ink/70">If you notice incorrect information, inappropriate content or an issue with your account, get in touch through our contact page.</p>
        <Link to="/contact" className="mt-5 inline-flex rounded-full bg-sage-700 px-6 py-3 font-semibold text-white hover:bg-ink">Contact us</Link>
      </div>
    </section>
  );
}

export default PolicyPage;
