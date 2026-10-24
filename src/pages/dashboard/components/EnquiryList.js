//libraries
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//components
import { MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import EnquiryStatusBadge from "./EnquiryStatusBadge";

//api
import API from "../../../api/api";

//context
import { useAuth } from "../../../context/AuthContext";

const enquiryStatusOrder = {
  Processing: 0,
  Pending: 1,
  Completed: 2,
};

function sortEnquiries(enquiries) {
  return [...enquiries].sort((first, second) => {
    const statusDifference = (enquiryStatusOrder[first.status] ?? 3)
      - (enquiryStatusOrder[second.status] ?? 3);

    return statusDifference || first.enquiry_number.localeCompare(second.enquiry_number, "en", { numeric: true });
  });
}

function EnquiryList({ active = true }) {
  const { isLoggedIn, profile, role } = useAuth();
  const userId = isLoggedIn ? profile?.id : null;
  const [enquiries, setEnquiries] = useState(null);
  const [loadedUserId, setLoadedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let isActive = true;

    const loadUserEnquiries = async () => {
      setLoading(true);
      setError("");
      setEnquiries(null);
      setLoadedUserId(userId);

      if (userId == null || userId === "") {
        setError("We couldn't identify your account. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get_user_enquiries(userId, role);
        if (!isActive) return;
        const items = response.data;

        if (!Array.isArray(items) || items.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
          throw new Error("Your enquiries were returned in an unexpected format.");
        }

        setEnquiries(sortEnquiries(items));
      } catch (error) {
        if (!isActive) return;
        const detail = error.response?.data?.detail;
        const message =
          detail?.message ||
          error.response?.data?.message ||
          (typeof detail === "string" ? detail : "") ||
          error.message ||
          "Unable to load your enquiries. Please try again.";
        setError(message);
        toast.error(message, { autoClose: 5000 });
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadUserEnquiries();
    return () => { isActive = false; };
  }, [active, userId, role, retry]);

  const retryUserEnquiries = () => {
    setRetry((attempt) => attempt + 1);
  };

  const awaitingUserEnquiries = loading || loadedUserId !== userId;

  return (
    <section aria-label="Your design enquiries" aria-busy={awaitingUserEnquiries}>
      <h2 className="text-xl font-semibold text-ink">Enquiries</h2>
      <p className="mb-6 mt-2 text-ink/70">
        {role === 3 ? "Review customer enquiries about your designs." : "Keep track of the enquiries you’ve sent about your selected designs."}
      </p>
      {awaitingUserEnquiries ? (
        <p role="status" className="rounded-2xl border border-sage-200/60 p-8 text-center text-ink/70">
          Loading your enquiries...
        </p>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-sage-200/60 p-8 text-center text-ink/70">
          <p>{error}</p>
          {userId != null && userId !== "" && (
            <button type="button" onClick={retryUserEnquiries} className="mt-3 font-semibold text-sage-700 underline">
              Try again
            </button>
          )}
        </div>
      ) : enquiries?.length > 0 ? (
        <ul className="space-y-4" aria-label="Design enquiry list">
          {enquiries.map((enquiry) => (
            <li key={enquiry.enquiry_id}>
              <Link
                to={`/dashboard/enquiries/${encodeURIComponent(enquiry.enquiry_number)}`}
                aria-label={`Open enquiry ${enquiry.enquiry_number}`}
                className="block rounded-2xl border border-sage-200/60 bg-white p-5 transition-colors hover:border-sage-400 hover:bg-sage-50 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-50 text-sage-700">
                    <MessageCircle size={22} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 break-words text-xs font-semibold tracking-wide text-sage-700">
                      Enquiry {enquiry.enquiry_number}
                    </p>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="break-words text-lg font-semibold text-ink">{enquiry.title}</h3>
                      <EnquiryStatusBadge status={enquiry.status} />
                    </div>
                    <p className="mt-1 break-words text-sm font-medium text-sage-700">{enquiry.company_name}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-sage-200/60 p-8 text-center">
          <MessageCircle size={32} className="mx-auto mb-4 text-sage-700" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-ink">No enquiries yet</h3>
          <p className="mt-2 text-sm text-ink/70">{role === 3 ? "Customer enquiries will appear here when someone contacts you about your designs." : "Your design enquiries will appear here after you contact a designer."}</p>
        </div>
      )}
    </section>
  );
}

export default EnquiryList;
