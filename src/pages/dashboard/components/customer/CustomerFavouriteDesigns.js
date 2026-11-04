//libraries
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//components
import { Heart, LoaderCircle, RefreshCw } from "lucide-react";
import DesignCard from "../../../designs/components/shared/DesignCard";

//api
import API from "../../../../api/api";

//context
import { useAuth } from "../../../../context/AuthContext";

//utils
import getDesignError from "../../../../utils/getDesignError";

function CustomerFavouriteDesigns() {
  const { isLoggedIn, role, profile } = useAuth();
  const userId = profile?.id;
  const allowed = isLoggedIn && role === 4 && Boolean(userId);
  const [result, setResult] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    const loadFavourites = async () => {
      setResult(null);
      try {
        const response = await API.get_user_favourites(userId);
        if (!active) return;
        if (!Array.isArray(response.data)) throw new Error("Unexpected favourite response.");
        const favourites = [...new Map(response.data.map((item) => [item.design_id, item])).values()];
        const ids = favourites.map((item) => item.design_id);
        const designs = [];
        // Keep requests bounded when a customer has many favourites.
        for (let start = 0; start < ids.length; start += 10) {
          const batch = ids.slice(start, start + 10);
          const responses = await Promise.allSettled(batch.map((id) => API.get_design(id)));
          if (!active) return;
          responses.forEach((item, index) => {
            if (item.status !== "fulfilled") return;
            const data = item.value.data;
            const design = Array.isArray(data?.items) ? data.items.find((entry) => entry.id === batch[index]) : data;
            if (design?.id === batch[index] && typeof design.title === "string") designs.push(design);
          });
        }
        setResult({ userId, designs, favourites, total: ids.length, unavailable: ids.length - designs.length });
      } catch (error) {
        if (active) setResult({ userId, error: getDesignError(error, "Unable to load your favourites. Please try again.") });
      }
    };
    loadFavourites();
    return () => { active = false; };
  }, [allowed, userId, retry]);

  const removeSavedDesign = (designId) => {
    setResult((current) => {
      if (current?.userId !== userId || current.error) return current;
      const favourites = current.favourites.filter((item) => item.design_id !== designId);
      const designs = current.designs.filter((item) => item.id !== designId);
      return { ...current, favourites, designs, total: favourites.length, unavailable: favourites.length - designs.length };
    });
  };

  if (!allowed) return null;
  const loading = !result || result.userId !== userId;

  return (
    <section aria-labelledby="customer-favourites-title" aria-busy={loading}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 id="customer-favourites-title" className="text-xl font-semibold text-ink">Your favourites</h2>
          <p className="mt-2 text-ink/70">Revisit designs you have added to your favourites.</p>
        </div>
        <button type="button" onClick={() => setRetry((value) => value + 1)} disabled={loading} aria-label="Refresh favourites" title="Refresh favourites" className="rounded-full border border-sage-200 p-3 text-sage-700 hover:bg-sage-50 disabled:opacity-40"><RefreshCw size={20} aria-hidden="true" /></button>
      </div>
      {loading ? <p role="status" className="flex items-center justify-center gap-3 py-12 text-ink/70"><LoaderCircle size={20} aria-hidden="true" className="animate-spin" />Loading your favourites...</p> : result.error ? (
        <div role="alert" className="rounded-2xl border border-sage-200/60 p-6 text-center"><p>{result.error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>
      ) : result.total === 0 ? (
        <div className="rounded-2xl border border-sage-200/60 p-10 text-center">
          <Heart size={32} aria-hidden="true" className="mx-auto mb-4 text-sage-700" />
          <h3 className="text-lg font-semibold text-ink">No favourites yet</h3>
          <p className="mt-2 text-sm text-ink/70">Tap the heart on a design card to save it here.</p>
          <Link to="/designs" className="mt-5 inline-flex rounded-full bg-sage-700 px-5 py-3 font-semibold text-white hover:bg-ink">Explore designs</Link>
        </div>
      ) : <>
        {result.unavailable > 0 && <div role="status" className="mb-5 rounded-xl bg-sage-50 p-4 text-sm text-ink/70"><p>{result.unavailable} saved {result.unavailable === 1 ? "design could" : "designs could"} not be loaded. {result.designs.length ? "Your other favourites are shown below." : "The designs may be unavailable or temporarily unable to load."}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-2 font-semibold text-sage-700 underline">Try again</button></div>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Favourite designs">
          {result.designs.map((design) => <DesignCard key={design.id} design={design} isFavourite favouriteId={result.favourites.find((item) => item.design_id === design.id)?.id} onFavouriteRemoved={removeSavedDesign} />)}
        </div>
      </>}
    </section>
  );
}

export default CustomerFavouriteDesigns;
