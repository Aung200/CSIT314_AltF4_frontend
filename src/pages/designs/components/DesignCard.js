//libraries
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//components
import { ArrowUpRight, ImageOff, MapPin } from "lucide-react";

function DesignCard({ design, categoryName }) {
  const detailsPath = `/designs/${encodeURIComponent(design.id)}`;
  const imageUrl = design.images?.[0]?.url;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage-200/60 bg-white transition-shadow hover:shadow-md">
      <Link to={detailsPath} aria-label={`View ${design.title}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-sage-50">
        {imageUrl && !imageFailed ? (
          <img src={imageUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-3 text-sage-700">
            <ImageOff size={32} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm">No photo available</span>
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-5">
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-sage-700">
            {categoryName && <span className="rounded-full bg-sage-50 px-3 py-1">{categoryName}</span>}
            {design.property_type && <span className="rounded-full bg-sage-50 px-3 py-1">{design.property_type}</span>}
          </div>
          <h2 className="break-words text-lg font-semibold text-ink">{design.title}</h2>
          {design.location && <p className="mt-2 flex items-start gap-1.5 text-sm text-ink/70"><MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0" /><span className="break-words">{design.location}</span></p>}
          {design.description && <p className="mt-3 line-clamp-2 break-words text-sm leading-relaxed text-ink/70">{design.description}</p>}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-sage-200/60 pt-4 text-sm">
          <p className="font-semibold text-ink">{design.budget == null ? "Budget not provided" : new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" }).format(design.budget)}</p>
          <Link to={detailsPath} aria-label={`View details for ${design.title}`} className="inline-flex items-center gap-1 font-semibold text-sage-700 hover:text-ink">View details <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
  );
}

export default DesignCard;
