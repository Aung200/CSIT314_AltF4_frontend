//libraries
import { useEffect, useState } from "react";

//components
import Pagination from "./Pagination";
import { toast } from "react-toastify";

//api
import API from "../../../api/api";

//utils
import formatCreatedAt from "../../../utils/formatCreatedAt";

function CustomerTable({ active = true }) {
  const [customers, setCustomers] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    if (!active) return undefined;
    let isActive = true;

    const loadCustomers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get_customers(page, pageSize, searchEmail);
        if (!isActive) return;
        const { items, pagination } = response.data || {};
        if (!Array.isArray(items) || items.some((item) => !item || typeof item !== "object" || Array.isArray(item)) ||
            !Number.isInteger(pagination?.total_items) || pagination.total_items < 0) {
          throw new Error("Customer details were returned in an unexpected format.");
        }
        const lastPage = Math.max(1, Math.ceil(pagination.total_items / pageSize));
        setTotalItems(pagination.total_items);
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setCustomers(items);
      } catch (error) {
        if (!isActive) return;
        const message =
          error.response?.data?.detail?.message ||
          error.response?.data?.message ||
          (typeof error.response?.data?.detail === "string" ? error.response.data.detail : "") ||
          error.message ||
          "Unable to load customers. Please try again.";
        setError(message);
        toast.error(message, { autoClose: 5000 });
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadCustomers();
    return () => { isActive = false; };
  }, [active, page, pageSize, retry, searchEmail]);

  const searchCustomers = (event) => {
    event.preventDefault();
    setPage(1);
    setSearchEmail(emailInput.trim());
    setRetry((attempt) => attempt + 1);
  };

  const clearCustomerSearch = () => {
    setEmailInput("");
    setSearchEmail("");
    setPage(1);
  };

  const changeCustomerPageSize = (size) => {
    setPageSize(size);
    setPage(1);
  };

  return (
    <section aria-label="All customers" aria-busy={loading}>
      <h2 className="text-xl font-semibold text-ink">All customers</h2>
      <p className="mb-6 mt-2 text-ink/70">View customer account and contact information.</p>
      <form
        role="search"
        aria-label="Search customers"
        onSubmit={searchCustomers}
        className="mb-6"
      >
        <label htmlFor="customer-search-email" className="auth-label">Search by email</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            id="customer-search-email"
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
              onClick={clearCustomerSearch}
              className="rounded-full border border-sage-200 px-5 py-3 font-semibold text-sage-700 hover:bg-sage-100"
            >
              Clear
            </button>
          )}
        </div>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-sage-200/60">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">All customers</caption>
          <thead className="bg-sage-50 text-ink">
            <tr>
              <th scope="col" className="whitespace-nowrap px-5 py-4 font-semibold">Email</th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 font-semibold">Name</th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 font-semibold">Phone</th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 font-semibold">Created at</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink/70">
                  <p role="status">Loading customers...</p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink/70">
                  <div role="alert">
                    <p>{error}</p>
                    <button type="button" onClick={() => setRetry((attempt) => attempt + 1)}
                      className="mt-3 font-semibold text-sage-700 underline">
                      Try again
                    </button>
                  </div>
                </td>
              </tr>
            ) : customers?.length > 0 ? customers.map((customer) => (
              <tr key={customer.id || customer.email}>
                <td className="border-t border-sage-200/60 px-5 py-4 text-ink/80">{customer.email || "Not provided"}</td>
                <td className="border-t border-sage-200/60 px-5 py-4 capitalize text-ink/80">
                  {[customer.first_name, customer.last_name].filter(Boolean).join(" ").trim() || "Not provided"}
                </td>
                <td className="border-t border-sage-200/60 px-5 py-4 text-ink/80">{customer.phone || "Not provided"}</td>
                <td className="border-t border-sage-200/60 px-5 py-4 text-ink/80">{formatCreatedAt(customer.created_at)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink/70">
                  {searchEmail ? "No customers match this search." : "No customers found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={changeCustomerPageSize}
        disabled={loading || Boolean(error)}
      />
    </section>
  );
}

export default CustomerTable;
