//libraries
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

//components
import { ArrowUpRight, ChevronDown, Eye, Images, RefreshCw, TrendingUp } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";

//api
import API from "../../../../api/api";

//context
import { useAuth } from "../../../../context/AuthContext";

//utils
import getDesignError from "../../../../utils/getDesignError";
import getDesignViewStats from "../../../../utils/getDesignViewStats";

const periods = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 0, label: "All time" },
];

function DesignStatistics() {
  const { isLoggedIn, role, profile } = useAuth();
  const [views, setViews] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [designDetails, setDesignDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loadedAt, setLoadedAt] = useState(Date.now);
  const userId = profile?.id;
  const allowed = isLoggedIn && [1, 2, 3].includes(role) && Boolean(userId);

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    const loadViews = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get_design_views();
        if (!active) return;
        if (!Array.isArray(response.data)) throw new Error("Unexpected views response.");
        setViews(response.data);
        setLoadedAt(Date.now());
      } catch (requestError) {
        if (active) setError(getDesignError(requestError, "Unable to load view statistics. Please try again."));
      } finally {
        if (active) setLoading(false);
      }
    };
    loadViews();
    return () => { active = false; };
  }, [allowed, role, userId, retry]);

  const stats = useMemo(() => getDesignViewStats(views, { role, userId, days, now: loadedAt }), [views, role, userId, days, loadedAt]);
  const topIds = stats.topDesigns.map(({ id }) => id).join(",");

  useEffect(() => {
    if (!allowed || loading || error || !topIds) return;
    let active = true;
    const loadTopDesigns = async () => {
      setDetailsLoading(true);
      setDesignDetails({});
      const ids = topIds.split(",");
      const results = await Promise.allSettled(ids.map((id) => API.get_design(id)));
      if (!active) return;
      const details = {};
      results.forEach((result, index) => {
        if (result.status !== "fulfilled") return;
        const data = result.value.data;
        const design = Array.isArray(data?.items) ? data.items.find(({ id }) => id === ids[index]) : data;
        if (design?.id === ids[index] && typeof design.title === "string") details[design.id] = design;
      });
      setDesignDetails(details);
      setDetailsLoading(false);
    };
    loadTopDesigns();
    return () => { active = false; };
  }, [allowed, loading, error, topIds, retry]);

  if (!allowed) return null;
  const scope = role === 1 ? "Across the platform" : role === 2 ? "Your company’s designs" : "Your designs";
  const peak = Math.max(1, ...stats.dailyViews.map(({ count }) => count));
  const summary = [
    { label: "Total views", value: stats.totalViews, icon: Eye },
    { label: "Designs viewed", value: stats.designCount, icon: Images },
    { label: "Top design views", value: stats.topDesigns[0]?.views || 0, icon: TrendingUp },
  ];

  return (
    <section aria-labelledby="statistics-title" aria-busy={loading}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="statistics-title" className="text-xl font-semibold text-ink">Design performance</h2><p className="mt-2 text-sm text-ink/70">{scope}. Rankings use recorded views, including repeat visits.</p></div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label={`Statistics period: ${periods.find(({ value }) => value === days).label}`} className="inline-flex items-center gap-4 rounded-xl border border-sage-200 bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-sage-50">
                {periods.find(({ value }) => value === days).label}<ChevronDown size={16} aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[60] w-44 rounded-xl border-sage-200 p-1.5">
              <DropdownMenuRadioGroup value={String(days)} onValueChange={(value) => setDays(Number(value))}>
                {periods.map(({ value, label }) => <DropdownMenuRadioItem key={value} value={String(value)} className="rounded-lg py-2.5 focus:bg-sage-50 focus:text-sage-700">{label}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <button type="button" onClick={() => setRetry((value) => value + 1)} disabled={loading} aria-label="Refresh statistics" title="Refresh statistics" className="rounded-full border border-sage-200 p-3 text-sage-700 hover:bg-sage-50 disabled:opacity-40"><RefreshCw size={20} aria-hidden="true" /></button>
        </div>
      </div>
      {loading ? <p role="status" className="py-12 text-center text-ink/70">Loading statistics...</p> : error ? <div role="alert" className="rounded-2xl border border-sage-200 p-6"><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div> : <>
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {summary.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-sage-200/60 bg-white p-5">
              <div><p className="text-sm text-ink/70">{label}</p><p className="mt-2 text-2xl font-semibold text-ink">{value.toLocaleString("en-SG")}</p></div>
              <Icon size={20} aria-hidden="true" className="text-sage-700" />
            </div>
          ))}
        </div>
        <div className="grid items-start gap-5 xl:grid-cols-2">
        <section aria-labelledby="daily-views-title" className="rounded-xl border border-sage-200/60 p-5">
          <h3 id="daily-views-title" className="text-lg font-semibold text-ink">Daily views · last {days || 30} days</h3>
          <p className="mt-2 text-xs text-ink/60">Dates use Singapore time. Hover or focus a bar for its count.</p>
          <div className="mt-6 flex h-44 items-end gap-1" aria-label="Daily design views">{stats.dailyViews.map(({ date, count }) => <div key={date} className="flex h-full min-w-0 flex-1 items-end"><div tabIndex={0} role="img" aria-label={`${date}: ${count} views`} title={`${date}: ${count} views`} className={`w-full rounded-t-sm focus:outline focus:outline-2 focus:outline-sage-700 ${count ? "bg-sage-700" : "bg-sage-100"}`} style={{ height: `${count ? Math.max(3, count / peak * 100) : 2}%` }} /></div>)}</div>
          <div className="mt-3 flex justify-between text-xs text-ink/60"><span>{stats.dailyViews[0].date}</span><span>{stats.dailyViews[stats.dailyViews.length - 1].date}</span></div>
        </section>
        <section aria-labelledby="trending-designs-title" className="rounded-xl border border-sage-200/60 p-5">
          <h3 id="trending-designs-title" className="text-lg font-semibold text-ink">Top 5 trending designs</h3>
          <p className="mb-5 mt-2 text-sm text-ink/70">Most viewed in the selected period.</p>
          {!stats.topDesigns.length ? <p className="py-8 text-center text-ink/70">No recorded views for this period yet.</p> : <ol className="divide-y divide-sage-200/60">{stats.topDesigns.map((item, index) => {
            const design = designDetails[item.id];
            return <li key={item.id} className="flex flex-wrap items-center gap-3 py-4">
              <span className="w-5 font-semibold text-sage-700">{index + 1}</span>
              {design?.images?.[0]?.url && <img src={design.images[0].url} alt="" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} className="h-12 w-14 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1"><p className="break-words font-semibold text-ink">{design?.title || (detailsLoading ? "Loading design..." : "Design details unavailable")}</p>{item.designerName && <p className="mt-1 text-sm text-ink/60">{item.designerName}</p>}</div>
              <div className="text-right"><p className="font-semibold text-sage-700">{item.views} {item.views === 1 ? "view" : "views"}</p>{design && <Link to={`/designs/${encodeURIComponent(item.id)}`} className="mt-1 inline-flex items-center gap-1 text-sm text-sage-700 hover:underline">View design <ArrowUpRight size={14} aria-hidden="true" /></Link>}</div>
            </li>;
          })}</ol>}
        </section>
        </div>
      </>}
    </section>
  );
}

export default DesignStatistics;
