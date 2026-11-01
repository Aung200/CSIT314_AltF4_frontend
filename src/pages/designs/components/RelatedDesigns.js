//libraries
import { useEffect, useState } from "react";

//components
import DesignCard from "./DesignCard";

//api
import API from "../../../api/api";

function RelatedDesigns({ designId, categoryId, categoryName }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const loadRelatedDesigns = async () => {
      setLoading(true);
      setFailed(false);
      setDesigns([]);
      try {
        // Sample a bounded pool using the existing category filter API.
        const response = await API.get_interior_designs(1, 20, { category_type: categoryName });
        if (!active) return;
        if (!Array.isArray(response.data?.items)) throw new Error("Unexpected design response.");
        const seen = new Set([designId]);
        const candidates = response.data.items.filter((item) => {
          if (item.category_id !== categoryId || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        for (let index = candidates.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [candidates[index], candidates[randomIndex]] = [candidates[randomIndex], candidates[index]];
        }
        setDesigns(candidates.slice(0, 4));
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadRelatedDesigns();
    return () => { active = false; };
  }, [designId, categoryId, categoryName, retry]);

  if (!loading && !failed && !designs.length) return null;

  return (
    <section aria-labelledby="related-designs-title" aria-busy={loading} className="mt-12 border-t border-sage-200/60 pt-8">
      <h2 id="related-designs-title" className="text-2xl font-semibold text-ink">Related designs</h2>
      <p className="mb-6 mt-2 text-ink/70">Explore more designs in {categoryName}.</p>
      {loading ? <p role="status" className="py-6 text-ink/70">Finding related designs...</p> : failed ? (
        <div className="py-6 text-ink/70">
          <p>Unable to load related designs.</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {designs.map((design) => <DesignCard key={design.id} design={design} categoryName={categoryName} />)}
        </div>
      )}
    </section>
  );
}

export default RelatedDesigns;
