export default function getDesignerRegistrationMessage(data, fallback) {
  const detail = data?.detail;
  return (typeof data?.message === "string" && data.message) ||
    (typeof detail?.message === "string" && detail.message) ||
    (typeof detail === "string" && detail) ||
    (typeof data === "string" && data) || fallback;
}
