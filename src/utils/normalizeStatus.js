export default function normalizeStatus(status) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}
