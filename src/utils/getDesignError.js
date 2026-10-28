export default function getDesignError(error, fallback) {
  const detail = error.response?.data?.detail;
  return (typeof detail === "string" ? detail : detail?.message) || error.response?.data?.message || fallback;
}
