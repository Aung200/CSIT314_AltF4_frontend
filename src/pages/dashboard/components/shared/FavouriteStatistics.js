//libraries
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

//components
import { ArrowUpRight, Heart, Images, Users } from "lucide-react";

//api
import API from "../../../../api/api";

//context
import { useAuth } from "../../../../context/AuthContext";

//utils
import getDesignError from "../../../../utils/getDesignError";
import getDesignFavouriteStats from "../../../../utils/getDesignFavouriteStats";

async function loadDesigns(role, userId) {
  if (role === 1) return null;
  const fetchPage = role === 2 ? API.get_company_designs : API.get_designer_designs;
  const designs = [];
  let page = 1;
  let totalPages = 1;
  do {
    const { data } = await fetchPage(userId, page, 100);
    if (Array.isArray(data)) return data;
    if (!Array.isArray(data?.items)) throw new Error("Unexpected designs response.");
    designs.push(...data.items);
    totalPages = data.pagination?.total_pages;
    if (!Number.isInteger(totalPages) || totalPages < 0) throw new Error("Unexpected design pagination.");
    page++;
  } while (page <= totalPages);
  return designs;
}

function FavouriteStatistics({ days, refreshKey }) {
  const { isLoggedIn, role, profile } = useAuth();
  const userId = profile?.id;
  const allowed = isLoggedIn && [1, 2, 3].includes(role) && Boolean(userId);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [details, setDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    setData(null);
    setError("");
    const load = async () => {
      try {
        const [response, designs] = await Promise.all([API.get_favourites(), loadDesigns(role, userId)]);
        if (!Array.isArray(response.data)) throw new Error("Unexpected favourites response.");
        if (active) setData({ records: response.data, designs, now: Date.now() });
      } catch (requestError) {
        if (active) setError(getDesignError(requestError, "Unable to load favourite statistics. Please try again."));
      }
    };
    load();
    return () => { active = false; };
  }, [allowed, role, userId, refreshKey, retry]);

  const stats = useMemo(() => getDesignFavouriteStats(data?.records || [], {
    designs: data?.designs ?? null, days, now: data?.now,
  }), [data, days]);
  const topIds = stats.topDesigns.map(({ id }) => id).join(",");

  useEffect(() => {
    if (!allowed || !data) return;
    let active = true;
    setDetails({});
    const load = async () => {
      setDetailsLoading(true);
      const catalogue = new Map((data.designs || []).map((design) => [design.id, design]));
      const ids = topIds ? topIds.split(",") : [];
      const results = await Promise.allSettled(ids.map(async (id) => catalogue.get(id) || (await API.get_design(id)).data));
      if (!active) return;
      const next = {};
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value?.id === ids[index]) next[ids[index]] = result.value;
      });
      setDetails(next);
      setDetailsLoading(false);
    };
    load();
    return () => { active = false; };
  }, [allowed, data, topIds]);

  if (!allowed) return null;
  const summary = [
    { label: "Total favourites", value: stats.total, icon: Heart },
    { label: "Designs saved", value: stats.designCount, icon: Images },
    { label: "Unique customers", value: stats.customerCount, icon: Users },
  ];

  return <section aria-labelledby="favourite-statistics-title" className="mt-8">
    <h3 id="favourite-statistics-title" className="text-lg font-semibold text-ink">Customer favourites</h3>
    <p className="mb-5 mt-2 text-sm text-ink/70">{days ? "Currently saved favourites added in the selected period." : "All currently saved favourites."} Each customer counts once per design.</p>
    {error ? <div role="alert" className="rounded-xl border border-sage-200 p-5"><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Retry favourite statistics</button></div> : !data ? <p role="status" className="py-8 text-center text-ink/70">Loading favourite statistics...</p> : <>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">{summary.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center justify-between rounded-xl border border-sage-200/60 bg-white p-5"><div><p className="text-sm text-ink/70">{label}</p><p className="mt-2 text-2xl font-semibold text-ink">{value.toLocaleString("en-SG")}</p></div><Icon size={20} aria-hidden="true" className="text-sage-700" /></div>)}</div>
      {role === 2 && <p className="mb-5 text-sm text-ink/70">{stats.designerCount} {stats.designerCount === 1 ? "designer has" : "designers have"} designs saved by customers in this period.</p>}
      <div className="rounded-xl border border-sage-200/60 p-5">
        <h4 className="text-lg font-semibold text-ink">Top 5 most-favourited designs</h4>
        {!stats.topDesigns.length ? <p className="py-8 text-center text-ink/70">No favourites for this period yet.</p> : <ol className="mt-3 divide-y divide-sage-200/60">{stats.topDesigns.map((item, index) => {
          const design = details[item.id];
          return <li key={item.id} className="flex flex-wrap items-center gap-3 py-4">
            <span className="w-5 font-semibold text-sage-700">{index + 1}</span>
            {design?.images?.[0]?.url && <img src={design.images[0].url} alt="" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} className="h-12 w-14 rounded-lg object-cover" />}
            <p className="min-w-0 flex-1 break-words font-semibold text-ink">{design?.title || (detailsLoading ? "Loading design..." : "Design details unavailable")}</p>
            <div className="text-right"><p className="font-semibold text-sage-700">{item.count} {item.count === 1 ? "favourite" : "favourites"}</p>{design && <Link to={`/designs/${encodeURIComponent(item.id)}`} className="mt-1 inline-flex items-center gap-1 text-sm text-sage-700 hover:underline">View design <ArrowUpRight size={14} aria-hidden="true" /></Link>}</div>
          </li>;
        })}</ol>}
      </div>
    </>}
  </section>;
}

export default FavouriteStatistics;
