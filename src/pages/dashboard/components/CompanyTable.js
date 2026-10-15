//libraries
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

//components
import { toast } from "react-toastify";
import { Check, Clock, MoreHorizontal, X } from "lucide-react";
import Pagination from "./Pagination";

//api
import API from "../../../api/api";

function CompanyTable({ active = true }) {
  const [companies, setCompanies] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [openAction, setOpenAction] = useState(null);
  const actionMenuRef = useRef(null);
  const actionButtonRef = useRef(null);
  const [updatingCompanyId, setUpdatingCompanyId] = useState(null);

  useEffect(() => {
    if (!openAction) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!actionMenuRef.current?.contains(event.target) && !actionButtonRef.current?.contains(event.target)) {
        setOpenAction(null);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpenAction(null);
        actionButtonRef.current?.focus();
      }
    };
    const closeOnMove = () => setOpenAction(null);
    actionMenuRef.current?.querySelector("button:not(:disabled)")?.focus();
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnMove);
    window.addEventListener("scroll", closeOnMove, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnMove);
      window.removeEventListener("scroll", closeOnMove, true);
    };
  }, [openAction]);

  useEffect(() => {
    setOpenAction(null);
    if (!active) return undefined;
    let isActive = true;

    const loadCompanies = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get_companies(page, pageSize, searchEmail);
        if (!isActive) return;
        const { items, pagination } = response.data || {};
        if (!Array.isArray(items) || items.some((item) => !item || typeof item !== "object" || Array.isArray(item)) ||
            !Number.isInteger(pagination?.total_items) || pagination.total_items < 0) {
          throw new Error("Company details were returned in an unexpected format.");
        }
        const lastPage = Math.max(1, Math.ceil(pagination.total_items / pageSize));
        setTotalItems(pagination.total_items);
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setCompanies(items);
      } catch (error) {
        if (!isActive) return;
        const message =
          error.response?.data?.detail?.message ||
          error.response?.data?.message ||
          (typeof error.response?.data?.detail === "string" ? error.response.data.detail : "") ||
          error.message ||
          "Unable to load companies. Please try again.";
        setError(message);
        toast.error(message, { autoClose: 5000 });
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadCompanies();
    return () => { isActive = false; };
  }, [active, page, pageSize, retry, searchEmail]);

  const handleStatusChange = async (company, status) => {
    if (updatingCompanyId != null || company.id == null || status === normalizeStatus(company.status)) return;
    setUpdatingCompanyId(company.id);
    try {
      const response = await API.update_company_status(company.id, statusLabels[status]);
      const message =
        response.data?.detail?.message ||
        response.data?.message ||
        "Company status updated successfully.";
      toast.success(message, { autoClose: 5000 });
      setCompanies((current) => current?.map((item) => (
        item.id === company.id ? { ...item, status } : item
      )));
      setOpenAction(null);
      setRetry((attempt) => attempt + 1);
    } catch (error) {
      const message =
        error.response?.data?.detail?.message ||
        error.response?.data?.message ||
        (typeof error.response?.data?.detail === "string" ? error.response.data.detail : "") ||
        error.message ||
        "Unable to update company status. Please try again.";
      toast.error(message, { autoClose: 5000 });
    } finally {
      setUpdatingCompanyId(null);
    }
  };

  return (
    <section aria-label="All companies" aria-busy={loading}>
      <h2 className="text-xl font-semibold text-ink">All companies</h2>
      <p className="mb-6 mt-2 text-ink/70">View company accounts and review their approval status.</p>
      <form
        role="search"
        aria-label="Search companies"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearchEmail(emailInput.trim());
          setRetry((attempt) => attempt + 1);
        }}
        className="mb-6"
      >
        <label htmlFor="company-search-email" className="auth-label">Search by email</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            id="company-search-email"
            name="email"
            type="search"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            placeholder="Search email"
            className="auth-input min-w-0 flex-1 sm:min-w-64"
          />
          <button type="submit" className="rounded-full bg-sage-700 px-5 py-3 font-semibold text-white hover:bg-ink">
            Search
          </button>
          {(emailInput || searchEmail) && (
            <button
              type="button"
              onClick={() => {
                setEmailInput("");
                setSearchEmail("");
                setPage(1);
              }}
              className="rounded-full border border-sage-200 px-5 py-3 font-semibold text-sage-700 hover:bg-sage-100"
            >
              Clear
            </button>
          )}
        </div>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-sage-200/60">
        <table className="w-full table-fixed text-left text-xs sm:text-sm">
          <caption className="sr-only">All companies</caption>
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="bg-sage-50 text-ink">
            <tr>
              <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-3">Email</th>
              <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-3">Name</th>
              <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-3">URL</th>
              <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-3">Phone</th>
              <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-3">Status</th>
              <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/70">
                  <p role="status">Loading companies...</p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/70">
                  <div role="alert">
                    <p>{error}</p>
                    <button type="button" onClick={() => setRetry((attempt) => attempt + 1)}
                      className="mt-3 font-semibold text-sage-700 underline">
                      Try again
                    </button>
                  </div>
                </td>
              </tr>
            ) : companies?.length > 0 ? companies.map((company) => (
              <tr key={company.id || company.email}>
                <td className="break-words border-t border-sage-200/60 px-2 py-3 text-ink/80 sm:px-3">{company.email || "Not provided"}</td>
                <td className="break-words border-t border-sage-200/60 px-2 py-3 text-ink/80 sm:px-3">{company.name || "Not provided"}</td>
                <td className="break-words border-t border-sage-200/60 px-2 py-3 text-ink/80 sm:px-3">{company.url || company.website || "Not provided"}</td>
                <td className="break-words border-t border-sage-200/60 px-2 py-3 text-ink/80 sm:px-3">{company.phone || "Not provided"}</td>
                <td className="break-words border-t border-sage-200/60 px-2 py-3 text-ink/80 sm:px-3">
                  <span className={`inline-block max-w-full rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[normalizeStatus(company.status)] || "bg-gray-100 text-gray-700"}`}>
                    {statusLabels[normalizeStatus(company.status)] || "Unknown"}
                  </span>
                </td>
                <td className="border-t border-sage-200/60 px-2 py-3 sm:px-3">
                  <button
                    type="button"
                    aria-label={`Actions for ${company.name || company.email}`}
                    aria-expanded={openAction?.company.id === company.id}
                    aria-controls={openAction?.company.id === company.id ? "company-actions" : undefined}
                    disabled={company.id == null || updatingCompanyId != null}
                    onClick={(event) => {
                      if (openAction?.company.id === company.id) {
                        setOpenAction(null);
                        return;
                      }
                      actionButtonRef.current = event.currentTarget;
                      const rect = event.currentTarget.getBoundingClientRect();
                      const top = rect.bottom + 8 + 210 > window.innerHeight
                        ? Math.max(8, rect.top - 218)
                        : rect.bottom + 8;
                      setOpenAction({ company, top, left: Math.max(8, Math.min(rect.right - 192, window.innerWidth - 200)) });
                    }}
                    className="inline-flex rounded-lg p-2 text-sage-700 transition-colors hover:bg-sage-100 disabled:opacity-50"
                  >
                    <MoreHorizontal size={20} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/70">
                  {searchEmail ? "No companies match this search." : "No companies found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {active && openAction && createPortal(
        <div
          ref={actionMenuRef}
          id="company-actions"
          role="group"
          aria-label={`Change status for ${openAction.company.name || openAction.company.email}`}
          style={{ top: openAction.top, left: openAction.left }}
          className="fixed z-[60] w-48 rounded-2xl border border-sage-200 bg-white p-2 shadow-lg"
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Change status</p>
          {[
            { status: "approved", label: "Approve", icon: Check, color: "text-green-700 hover:bg-green-50" },
            { status: "pending", label: "Set pending", icon: Clock, color: "text-yellow-700 hover:bg-yellow-50" },
            { status: "rejected", label: "Reject", icon: X, color: "text-red-700 hover:bg-red-50" },
          ].map(({ status, label, icon: Icon, color }) => (
            <button
              key={status}
              type="button"
              disabled={updatingCompanyId != null || normalizeStatus(openAction.company.status) === status}
              onClick={() => handleStatusChange(openAction.company, status)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium disabled:opacity-40 ${color}`}
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
          {updatingCompanyId != null && <p role="status" className="px-3 py-2 text-xs text-ink/60">Saving...</p>}
        </div>,
        document.body,
      )}
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        disabled={loading || Boolean(error)}
      />
    </section>
  );
}

function normalizeStatus(status) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}

const statusLabels = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const statusStyles = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export default CompanyTable;
