export default function getCategoryError(error, fallback) {
  const detail = error.response?.data?.detail;
  return detail?.message || error.response?.data?.message ||
    (typeof detail === "string" ? detail : "") || error.message || fallback;
}
