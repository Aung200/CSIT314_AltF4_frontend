//libraries
import { Link } from "react-router-dom";

function About() {
  return (
    <section className="mx-auto max-w-3xl py-6 sm:py-10">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">Houzz</p>
      <h1 className="text-4xl sm:text-5xl">About Us</h1>
      <p className="mb-8 text-lg text-ink/70">Thoughtful spaces. Inspired living.</p>
      <div className="rounded-2xl border border-sage-200/60 bg-white p-6 sm:p-8">
        <h2 className="mb-3 text-xl font-semibold">A home that feels like you</h2>
        <p className="mb-6 leading-relaxed text-ink/70">Houzz brings interior inspiration and company discovery together, helping you explore ideas and find professionals for your next home project.</p>
        <Link to="/interior-designs" className="inline-flex rounded-full bg-sage-700 px-6 py-3 font-semibold text-white hover:bg-ink">Explore Interior Designs</Link>
      </div>
    </section>
  );
}

export default About;
