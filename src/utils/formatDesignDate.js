export default function formatDesignDate(value) {
  if (!value) return "Not provided";
  const date = new Date(value.slice(0, 10) + "T00:00:00");
  return Number.isNaN(date.getTime()) ? "Not provided" : date.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}
