const dayMilliseconds = 24 * 60 * 60 * 1000;
const singaporeOffset = 8 * 60 * 60 * 1000;
const dateKey = (time) => new Date(time + singaporeOffset).toISOString().slice(0, 10);

export default function getDesignViewStats(views, { role, userId, days = 30, now = Date.now() }) {
  const today = Date.parse(`${dateKey(now)}T00:00:00+08:00`);
  const chartDays = days || 30;
  const chartStart = today - (chartDays - 1) * dayMilliseconds;
  const rangeStart = days ? chartStart : -Infinity;
  const daily = new Map(Array.from({ length: chartDays }, (_, index) => [dateKey(chartStart + index * dayMilliseconds), 0]));
  const designs = new Map();
  const seen = new Set();
  let totalViews = 0;

  for (const view of views) {
    if (!view?.id || !view.design_id || seen.has(view.id)) continue;
    seen.add(view.id);
    if (role === 3 && view.designer_id !== userId) continue;
    if (role === 2 && (!userId || view.company_id !== userId)) continue;
    if (![1, 2, 3].includes(role)) continue;
    const timestamp = Date.parse(view.created_at);
    if (!Number.isFinite(timestamp) || timestamp < rangeStart || timestamp > now) continue;
    totalViews += 1;
    const key = dateKey(timestamp);
    if (daily.has(key)) daily.set(key, daily.get(key) + 1);
    const design = designs.get(view.design_id) || { id: view.design_id, views: 0, lastViewed: timestamp, designerName: view.name || "" };
    design.views += 1;
    design.lastViewed = Math.max(design.lastViewed, timestamp);
    designs.set(view.design_id, design);
  }

  return {
    totalViews,
    designCount: designs.size,
    topDesigns: [...designs.values()].sort((a, b) => b.views - a.views || b.lastViewed - a.lastViewed || a.id.localeCompare(b.id)).slice(0, 5),
    dailyViews: [...daily].map(([date, count]) => ({ date, count })),
  };
}
