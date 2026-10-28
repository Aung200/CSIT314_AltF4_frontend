//libraries
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

//components
import { ToastContainer, toast } from "react-toastify";
import { ChevronDown, Images, LoaderCircle } from "lucide-react";
import DesignFilters, { maximumBudget } from "./components/DesignFilters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import DesignCard from "./components/DesignCard";
import Pagination from "../dashboard/components/Pagination";

//api
import API from "../../api/api";

//utils
import getDesignError from "../../utils/getDesignError";

const designSortOptions = [
  { value: "created_at:desc", label: "Newest" },
  { value: "created_at:asc", label: "Oldest" },
  { value: "budget:desc", label: "Highest Price" },
  { value: "budget:asc", label: "Lowest Price" },
  { value: "title:asc", label: "A To Z" },
  { value: "title:desc", label: "Z To A" },
];

function DesignsPage() {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get("title") || "";
  const [filters, setFilters] = useState({ property_type: "", category_type: "" });
  const [budgetRange, setBudgetRange] = useState([0, maximumBudget]);
  const [sortValue, setSortValue] = useState("created_at:desc");
  const [heroImage, setHeroImage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listFailed, setListFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesFailed, setCategoriesFailed] = useState(false);
  const [categoryRetry, setCategoryRetry] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [title]);

  useEffect(() => {
    let active = true;
    const loadInteriorDesigns = async () => {
      setLoading(true);
      setListFailed(false);
      try {
        const [sort_by, sort_order] = sortValue.split(":");
        const response = await API.get_interior_designs(page, pageSize, {
          title: title.trim() || undefined,
          property_type: filters.property_type || undefined,
          category_type: filters.category_type || undefined,
          min_budget: budgetRange[0] > 0 ? budgetRange[0] : undefined,
          max_budget: budgetRange[1] < maximumBudget ? budgetRange[1] : undefined,
          sort_by, sort_order,
        });
        if (!active) return;
        const { items, pagination } = response.data;
        if (!Array.isArray(items) || !Number.isInteger(pagination?.total_items) || pagination.total_items < 0) throw new Error("Unexpected design response.");
        setTotalItems(pagination.total_items);
        const lastPage = Math.max(1, Math.ceil(pagination.total_items / pageSize));
        if (page > lastPage) { setPage(lastPage); return; }
        setDesigns(items);
        const cover = items.find((design) => design.images?.[0]?.url)?.images[0].url;
        if (cover) setHeroImage((current) => current || cover);
      } catch (error) {
        if (active) {
          setListFailed(true);
          setTotalItems(null);
          toast.error(getDesignError(error, "Unable to load interior designs. Please try again."), { autoClose: 5000 });
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    const timer = setTimeout(loadInteriorDesigns, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [page, pageSize, title, filters, budgetRange, sortValue, retry]);

  useEffect(() => {
    let active = true;
    const loadInteriorDesignCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesFailed(false);
      try {
        const response = await API.get_categories();
        if (!active) return;
        if (!Array.isArray(response.data)) throw new Error("Unexpected category response.");
        setCategories(response.data);
      } catch (error) {
        if (active) {
          setCategoriesFailed(true);
          toast.error(getDesignError(error, "Unable to load categories. Please try again."), { autoClose: 5000 });
        }
      } finally {
        if (active) setCategoriesLoading(false);
      }
    };
    loadInteriorDesignCategories();
    return () => { active = false; };
  }, [categoryRetry]);

  const updateInteriorDesignFilters = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  const changeInteriorDesignBudget = (range) => {
    setBudgetRange(range);
    setPage(1);
  };

  const sortInteriorDesigns = (value) => {
    setSortValue(value);
    setPage(1);
  };

  const resetInteriorDesignFilters = () => {
    setSearchParams((current) => {
      current.delete("title");
      return current;
    }, { replace: true });
    setFilters({ property_type: "", category_type: "" });
    setBudgetRange([0, maximumBudget]);
    setSortValue("created_at:desc");
    setPage(1);
  };

  const changeInteriorDesignPageSize = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const hasFilters = Boolean(title.trim() || filters.property_type || filters.category_type || budgetRange[0] > 0 || budgetRange[1] < maximumBudget);
  const canReset = hasFilters || sortValue !== "created_at:desc";
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <section aria-labelledby="designs-title" className="py-2 sm:py-4">
      <ToastContainer />
      <div className="relative isolate overflow-hidden rounded-3xl bg-sage-700 px-6 py-14 text-white sm:px-10 sm:py-20">
        {heroImage && <img src={heroImage} alt="" onError={(event) => { event.currentTarget.hidden = true; }} className="absolute inset-0 -z-20 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/20" />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage-100">Find your inspiration</p>
        <h1 id="designs-title" className="max-w-2xl text-4xl sm:text-5xl">Designs</h1>
        <p className="max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">Thoughtful spaces. Fresh ideas. Find a design that feels like home.</p>
      </div>
      <DesignFilters values={filters} budgetRange={budgetRange} categories={categories} categoriesLoading={categoriesLoading} categoriesFailed={categoriesFailed} onChange={updateInteriorDesignFilters} onBudgetChange={changeInteriorDesignBudget} onReset={resetInteriorDesignFilters} onRetryCategories={() => setCategoryRetry((value) => value + 1)} canReset={canReset} />
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <p role="status" className="text-lg font-semibold text-ink">{loading ? "Finding designs..." : totalItems == null ? "Interior designs" : `${totalItems.toLocaleString("en-SG")} interior ${totalItems === 1 ? "design" : "designs"}`}</p>
        <div className="flex items-center gap-3">
          <span id="design-sort-label" className="text-sm font-medium text-ink/70">Sort By</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-labelledby="design-sort-label design-sort-value" className="inline-flex min-w-44 items-center justify-between gap-6 rounded-xl border border-sage-200 bg-white px-4 py-3 text-sm font-semibold text-sage-700 hover:bg-sage-50">
                <span id="design-sort-value">{designSortOptions.find((option) => option.value === sortValue).label}</span><ChevronDown size={18} aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[60] w-48 rounded-xl border-sage-200 p-1.5">
              <DropdownMenuRadioGroup value={sortValue} onValueChange={sortInteriorDesigns}>
                {designSortOptions.map((option) => <DropdownMenuRadioItem key={option.value} value={option.value} className="rounded-lg py-2.5">{option.label}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div aria-busy={loading}>
        {loading ? (
          <p role="status" className="flex items-center justify-center gap-3 rounded-2xl border border-sage-200/60 bg-white px-5 py-16 text-ink/70"><LoaderCircle size={20} aria-hidden="true" className="animate-spin" />Loading interior designs...</p>
        ) : listFailed ? (
          <div className="rounded-2xl border border-sage-200/60 bg-white px-5 py-16 text-center">
            <button type="button" onClick={() => setRetry((value) => value + 1)} className="rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700 hover:bg-sage-50">Try again</button>
          </div>
        ) : designs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Interior design results">
            {designs.map((design) => <DesignCard key={design.id} design={design} categoryName={categoryNames.get(design.category_id)} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-sage-200/60 bg-white px-5 py-16 text-center">
            <Images size={36} aria-hidden="true" className="mx-auto mb-4 text-sage-700" />
            <h2 className="text-lg font-semibold text-ink">{hasFilters ? "No matching designs" : "No designs available yet"}</h2>
            <p className="mt-2 text-sm text-ink/70">{hasFilters ? "Try another title or adjust your filters to explore more designs." : "Check back soon for new interior design inspiration."}</p>
            {hasFilters && <button type="button" onClick={resetInteriorDesignFilters} className="mt-4 font-semibold text-sage-700 underline">Clear search and filters</button>}
          </div>
        )}
      </div>
      <Pagination label="Interior design pagination" pageSizeLabel="Designs per page" page={page} pageSize={pageSize} totalItems={totalItems} onPageChange={setPage} onPageSizeChange={changeInteriorDesignPageSize} disabled={loading} />
    </section>
  );
}

export default DesignsPage;
