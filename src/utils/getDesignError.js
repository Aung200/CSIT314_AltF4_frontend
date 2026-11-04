export default function getDesignError(error, fallback) {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    const messages = detail.map((issue) => {
      if (typeof issue?.msg !== "string") return "";
      const field = Array.isArray(issue.loc)
        ? issue.loc.filter((part) => typeof part === "string" && !["body", "query", "path"].includes(part)).join(".").replace(/_/g, " ")
        : "";
      return field ? `${field.charAt(0).toUpperCase()}${field.slice(1)}: ${issue.msg}` : issue.msg;
    }).filter(Boolean);
    if (messages.length) return messages.join(". ");
  }
  return (typeof detail === "string" ? detail : detail?.message) || error.response?.data?.message || fallback;
}
