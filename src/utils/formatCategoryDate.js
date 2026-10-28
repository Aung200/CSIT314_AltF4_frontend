export default function formatCategoryDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleString("en-SG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Singapore",
  });
}
