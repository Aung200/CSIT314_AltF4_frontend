//components
import { ArrowUpRight, Building2, Mail, Phone } from "lucide-react";

const images = ["1.jpg", "2.jpg", "3.png", "4.jpg", "5.png"];

function CompanyCard({ company, index = 0 }) {
  const imageIndex = index % images.length;
  let website;
  try {
    const url = new URL(company.website || company.url);
    if (["http:", "https:"].includes(url.protocol)) website = url.href;
  } catch { /* Companies without a valid website still show their contact details. */ }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-sage-200/60 bg-white transition-shadow hover:shadow-md">
      <img src={`${process.env.PUBLIC_URL}/${images[imageIndex]}`} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-sage-700"><Building2 size={16} aria-hidden="true" /> Company</div>
        <h2 className="mb-4 break-words text-lg font-semibold text-ink">{company.name || "Company"}</h2>
        <div className="mb-5 space-y-3 text-sm text-ink/70">
          {company.email && <a href={`mailto:${company.email}`} className="flex items-start gap-2 hover:text-sage-700"><Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0" /><span className="break-all">{company.email}</span></a>}
          {company.phone && <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 hover:text-sage-700"><Phone size={16} aria-hidden="true" className="shrink-0" />{company.phone}</a>}
        </div>
        {website && <div className="mt-auto border-t border-sage-200/60 pt-4"><a href={website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${company.name || "company"} website (opens in a new tab)`} className="inline-flex items-center gap-1 text-sm font-semibold text-sage-700 hover:text-ink">Visit website <ArrowUpRight size={16} aria-hidden="true" /></a></div>}
      </div>
    </article>
  );
}

export default CompanyCard;
