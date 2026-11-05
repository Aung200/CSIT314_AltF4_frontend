//utils
import normalizeStatus from "./normalizeStatus";

export default function getCompanyApprovalMessage(status) {
  const value = normalizeStatus(status);
  if (value === "approved") return "";
  if (value === "rejected") return "Your company account has not been approved. Please contact Platform Management.";
  if (value && !["pending", "reviewing"].includes(value)) {
    return "Your company account is not approved for access. Please contact Platform Management.";
  }
  return "Your company account is pending Platform Management approval. You can log in once it is approved.";
}
