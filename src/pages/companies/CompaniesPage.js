//libraries
import { useEffect, useState } from "react";

//components
import { Building2, LoaderCircle, RotateCcw, Search } from "lucide-react";
import Pagination from "../dashboard/components/Pagination";
import CompanyCard from "./components/CompanyCard";

//api
import API from "../../api/api";

//utils
import normalizeStatus from "../../utils/normalizeStatus";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const loadCompanies = async () => {
      setLoading(true);
      setFailed(false);
      try {
        // The existing endpoint has no status/name filter. Collect its pages
        // before filtering so directory counts include approved companies only.
        const collected = [];
        let nextPage = 1;
        let totalPages = 1;
        do {
          const response = await API.get_companies(nextPage, 50);
          if (!active) return;
          const { items, pagination } = response.data || {};
          if (
            !Array.isArray(items) ||
            !Number.isInteger(pagination?.total_items) ||
            pagination.total_items < 0 ||
            !Number.isInteger(pagination?.page_size) ||
            pagination.page_size < 1
          )
            throw new Error("Unexpected company response.");
          totalPages = Math.max(
            1,
            Math.ceil(pagination.total_items / pagination.page_size),
          );
          collected.push(...items);
          nextPage += 1;
        } while (nextPage <= totalPages);
        const unique = new Map(
          collected
            .filter(
              (company) =>
                company?.id && normalizeStatus(company.status) === "approved",
            )
            .map((company) => [company.id, company]),
        );
        setCompanies([...unique.values()]);
        setPage(1);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCompanies();
    return () => {
      active = false;
    };
  }, [retry]);

  const query = search.trim().toLowerCase();
  const filtered = companies.filter((company) =>
    `${company.name || ""} ${company.email || ""}`
      .toLowerCase()
      .includes(query),
  );
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section aria-labelledby="companies-title" className="py-2 sm:py-4">
      <div className="rounded-3xl bg-sage-700 px-6 py-12 text-white sm:px-10 sm:py-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-100">
          Find your professionals
        </p>
        <h1 id="companies-title" className="text-4xl sm:text-5xl">
          Companies
        </h1>
        <p className="max-w-xl leading-relaxed text-white/90">
          Find the right team to bring your home ideas to life. Explore approved
          companies and get in touch.
        </p>
      </div>
      <div
        role="search"
        aria-label="Search companies"
        className="my-6 flex max-w-2xl items-center gap-3"
      >
        <div className="relative min-w-0 flex-1">
          <label htmlFor="directory-company-search" className="sr-only">
            Search companies by name or email
          </label>
          <Search
            size={20}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage-700"
          />
          <input
            id="directory-company-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search company name or email"
            className="auth-input pl-12"
          />
        </div>
        <button
          type="button"
          aria-label="Clear company search"
          title="Clear search"
          disabled={!search}
          onClick={() => {
            setSearch("");
            setPage(1);
          }}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sage-200 text-sage-700 hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={20} aria-hidden="true" />
        </button>
      </div>
      <div aria-busy={loading}>
        {loading ? (
          <p
            role="status"
            className="flex items-center justify-center gap-3 py-16 text-ink/70"
          >
            <LoaderCircle
              size={20}
              aria-hidden="true"
              className="animate-spin"
            />
            Loading companies...
          </p>
        ) : failed ? (
          <div
            role="alert"
            className="rounded-2xl border border-sage-200/60 bg-white px-5 py-12 text-center"
          >
            <p>Unable to load companies. Please try again.</p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-4 font-semibold text-sage-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <p role="status" className="mb-6 text-lg font-semibold text-ink">
              {filtered.length}{" "}
              {filtered.length === 1 ? "company" : "companies"}
            </p>
            {visible.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((company, index) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    index={(page - 1) * pageSize + index}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-sage-200/60 bg-white px-5 py-16 text-center">
                <Building2
                  size={36}
                  aria-hidden="true"
                  className="mx-auto mb-4 text-sage-700"
                />
                <h2 className="text-lg font-semibold text-ink">
                  {query
                    ? "No matching companies"
                    : "No companies available yet"}
                </h2>
                <p className="mt-2 text-sm text-ink/70">
                  {query
                    ? "Try another company name or email."
                    : "Check back soon for approved companies."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Pagination
        label="Company directory pagination"
        pageSizeLabel="Companies per page"
        page={page}
        pageSize={pageSize}
        totalItems={loading || failed ? null : filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        disabled={loading || failed}
      />
    </section>
  );
}

export default CompaniesPage;
