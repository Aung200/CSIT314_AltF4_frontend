//libraries
import { Link } from "react-router-dom";

//components
import { ArrowRight, ArrowUpRight, Building2, Images, MessageCircle } from "lucide-react";

const steps = [
  {
    title: "Find a style you love",
    description: "Browse interior designs by category, property type and budget. Open a design to see its photos and project details.",
    link: "/designs",
    label: "Explore designs",
    icon: Images,
  },
  {
    title: "Meet your next design team",
    description: "Explore approved companies, find their contact details and visit their websites to learn more about their work.",
    link: "/companies",
    label: "Browse companies",
    icon: Building2,
  },
  {
    title: "Start the conversation",
    description: "Found a design you like? Sign in and send an enquiry from its details page to discuss your space with the designer.",
    link: "/designs",
    label: "Find your inspiration",
    icon: MessageCircle,
  },
];

// Shorts featured in the creator's media collection: https://www.acvision.com.sg/media
const videos = [
  { id: "M554SzzEzSg", title: "Bedroom inspiration", topic: "Comfortable spaces" },
  { id: "m5R3DwXu7K4", title: "Make more of a small kitchen", topic: "Small-space ideas" },
  { id: "mxS1beGpWmA", title: "Clever hidden storage", topic: "Everyday function" },
];

function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <section aria-labelledby="home-title" className="overflow-hidden rounded-3xl bg-sage-50 p-6 sm:p-10 lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="auth-eyebrow">Ideas for your next chapter</p>
            <h1 id="home-title" className="max-w-2xl text-4xl leading-tight sm:text-5xl">A home that feels like you.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">Discover interior ideas, explore companies and connect with designers to bring your next home project to life.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/designs" className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-6 py-3 font-semibold text-white hover:bg-ink">Explore designs <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="/companies" className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 font-semibold text-sage-700 hover:bg-sage-100">Find a company <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
          <aside aria-labelledby="project-checklist-title" className="rounded-2xl border border-sage-200/60 bg-white p-6 sm:p-8">
            <h2 id="project-checklist-title" className="text-xl font-semibold text-ink">Before you get started</h2>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-ink/70">A few details make your first conversation easier.</p>
            <ul className="space-y-4 text-sm text-ink/80">
              <li className="border-t border-sage-200/60 pt-4">Your property type and the rooms you want to update</li>
              <li className="border-t border-sage-200/60 pt-4">A comfortable budget and preferred timeline</li>
              <li className="border-t border-sage-200/60 pt-4">A few designs that capture the look you like</li>
            </ul>
          </aside>
        </div>
      </section>

      <section aria-labelledby="home-start-title">
        <h2 id="home-start-title" className="text-2xl font-semibold text-ink sm:text-3xl">From inspiration to a conversation</h2>
        <p className="mb-6 mt-3 text-ink/70">Three simple steps to get your project moving.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ title, description, link, label, icon: Icon }, index) => (
            <article key={title} className="flex flex-col rounded-2xl border border-sage-200/60 bg-white p-6">
              <div className="mb-5 flex items-center justify-between"><span className="rounded-xl bg-sage-50 p-3 text-sage-700"><Icon size={24} aria-hidden="true" /></span><span aria-hidden="true" className="text-sm font-semibold text-sage-700">0{index + 1}</span></div>
              <h3 className="text-lg font-semibold text-ink">{title}</h3>
              <p className="mb-6 mt-3 text-sm leading-relaxed text-ink/70">{description}</p>
              <Link to={link} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-sage-700 hover:text-ink">{label} <ArrowRight size={16} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-videos-title" className="border-t border-sage-200/60 pt-10">
        <p className="auth-eyebrow">A little inspiration</p>
        <h2 id="home-videos-title" className="text-2xl font-semibold text-ink sm:text-3xl">Interior ideas in a minute</h2>
        <p className="mb-6 mt-3 text-ink/70">Take a quick look at bedrooms, compact kitchens and clever storage with these YouTube Shorts.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map(({ id, title, topic }) => (
            <article key={id} className="overflow-hidden rounded-2xl border border-sage-200/60 bg-white">
              <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={`${title} — AC Vision YouTube Short`} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="aspect-[9/16] w-full border-0 bg-ink" />
              <div className="p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-700">{topic}</p>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-ink/60">By AC Vision Design</p>
                <a href={`https://www.youtube.com/shorts/${id}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${title} on YouTube (opens in a new tab)`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sage-700 hover:text-ink">Watch on YouTube <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
