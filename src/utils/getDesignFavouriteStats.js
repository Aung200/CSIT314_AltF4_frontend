export default function getDesignFavouriteStats(records, { designs = null, days = 30, now = Date.now() } = {}) {
  const offset = 8 * 60 * 60 * 1000;
  const date = new Date(now + offset).toISOString().slice(0, 10);
  const start = days ? Date.parse(`${date}T00:00:00+08:00`) - (days - 1) * 86400000 : -Infinity;
  const catalogue = designs === null ? null : new Map(designs.map((design) => [design.id, design]));
  const counts = new Map();
  const customers = new Set();
  const designers = new Set();
  const seen = new Set();
  let total = 0;

  for (const record of records) {
    if (!record?.id || !record.design_id || !record.user_id) continue;
    if (catalogue && !catalogue.has(record.design_id)) continue;
    const timestamp = Date.parse(record.created_at);
    if (!Number.isFinite(timestamp) || timestamp < start || timestamp > now) continue;
    const key = `${record.user_id}:${record.design_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    total++;
    customers.add(record.user_id);
    const designerId = catalogue?.get(record.design_id)?.designer_id;
    if (designerId) designers.add(designerId);
    counts.set(record.design_id, (counts.get(record.design_id) || 0) + 1);
  }

  return {
    total, customerCount: customers.size, designCount: counts.size, designerCount: designers.size,
    topDesigns: [...counts].map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id)).slice(0, 5),
  };
}
