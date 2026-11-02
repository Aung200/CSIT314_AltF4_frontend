//libraries
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

//components
import { CheckCircle2, Clock3, ChevronDown, ChevronUp, Eye, Filter, RotateCcw, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";
import DesignFormDialog from "./DesignFormDialog";
import DesignStatusBadge from "./DesignStatusBadge";
import Pagination from "./Pagination";

//api
import API from "../../../../api/api";

//utils
import formatDesignDate from "../../../../utils/formatDesignDate";
import getDesignError from "../../../../utils/getDesignError";

const defaultDesignFilters = {
  title: "", property_type: "", category_type: "",
};

function DesignerDesignTableContent({ designerId, companyId, designers, company = false }) {
  const [designs, setDesigns] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categories, setCategories] = useState([]);
  const [filterInputs, setFilterInputs] = useState(defaultDesignFilters);
  const [filters, setFilters] = useState({ sort_by: "created_at", sort_order: "desc" });
  const [totalItems, setTotalItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listFailed, setListFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const [form, setForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const statusSavingRef = useRef(false);
  const mountedRef = useRef(false);
  const deletingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadDesignerDesigns = async () => {
      setLoading(true);
      setListFailed(false);
      try {
        const response = company
          ? await API.get_company_designs(companyId, page, pageSize, filters)
          : await API.get_designer_designs(designerId, page, pageSize, filters);
        if (!active) return;
        const { items, pagination } = response.data;
        if (!Array.isArray(items) || !Number.isInteger(pagination?.total_items) || pagination.total_items < 0) throw new Error("Unexpected design response.");
        const lastPage = Math.max(1, Math.ceil(pagination.total_items / pageSize));
        setTotalItems(pagination.total_items);
        if (page > lastPage) { setPage(lastPage); return; }
        setDesigns(items);
      } catch (error) {
        if (active) {
          setListFailed(true);
          setTotalItems(null);
          toast.error(getDesignError(error, "Unable to load designs. Please try again."), { autoClose: 5000 });
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDesignerDesigns();
    return () => { active = false; };
  }, [designerId, companyId, company, page, pageSize, filters, reload]);

  useEffect(() => {
    let active = true;
    const loadDesignCategories = async () => {
      try {
        const response = await API.get_categories();
        if (!active) return;
        if (!Array.isArray(response.data)) throw new Error("Unexpected category response.");
        setCategories(response.data);
      } catch (error) {
        if (active) toast.error(getDesignError(error, "Unable to load categories. Please try again."), { autoClose: 5000 });
      }
    };
    loadDesignCategories();
    return () => { active = false; };
  }, [reload]);

  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const hasFilters = Boolean(filters.title || filters.property_type || filters.category_type);
  const hasFilterChanges = Object.keys(defaultDesignFilters).some((key) => filterInputs[key].trim() !== defaultDesignFilters[key]);

  const updateDesignFilters = (event) => {
    const { name, value } = event.target;
    setFilterInputs((current) => ({ ...current, [name]: value }));
  };

  const applyDesignFilters = (event) => {
    event.preventDefault();
    if (loading || !hasFilterChanges) return;
    setFilters((current) => ({
      ...current,
      title: filterInputs.title.trim() || undefined,
      property_type: filterInputs.property_type || undefined,
      category_type: filterInputs.category_type || undefined,
    }));
    setPage(1);
  };

  const clearDesignFilters = () => {
    setFilterInputs(defaultDesignFilters);
    setFilters({ sort_by: "created_at", sort_order: "desc" });
    setPage(1);
  };

  const sortDesigns = (sortBy, sortOrder) => {
    setFilters((current) => ({ ...current, sort_by: sortBy, sort_order: sortOrder }));
    setPage(1);
  };

  const showCreateDesignForm = () => {
    setForm({ designId: null });
  };

  const showEditDesignForm = (design) => {
    setForm({ designId: design.id });
  };

  const finishDesignSave = (message) => {
    setForm(null);
    toast.success(message, { autoClose: 5000 });
    setPage(1);
    setReload((value) => value + 1);
  };

  const requestDesignDeletion = (design) => {
    setDeleteTarget(design);
  };

  const closeDesignDeletion = (open) => {
    if (!open && !deletingRef.current) setDeleteTarget(null);
  };

  const deleteDesign = async () => {
    if (!deleteTarget || deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    try {
      await API.delete_design(deleteTarget.id);
      if (!mountedRef.current) return;
      setDeleteTarget(null);
      toast.success("Design deleted successfully.", { autoClose: 5000 });
      setPage(1);
      setReload((value) => value + 1);
    } catch (error) {
      if (mountedRef.current) toast.error(getDesignError(error, "Unable to delete this design. Please try again."), { autoClose: 5000 });
    } finally {
      deletingRef.current = false;
      if (mountedRef.current) setDeleting(false);
    }
  };

  const changeDesignStatus = async (design, status) => {
    if (statusSavingRef.current || !company || !["Reviewing", "Approved"].includes(status)) return;
    statusSavingRef.current = true;
    setUpdatingStatus(design.id);
    try {
      await API.update_design(design.id, { status });
      if (!mountedRef.current) return;
      setDesigns((current) => current.map((item) => item.id === design.id ? { ...item, status } : item));
      toast.success("Design status updated successfully.", { autoClose: 5000 });
    } catch (error) {
      if (mountedRef.current) toast.error(getDesignError(error, "Unable to update design status. Please try again."), { autoClose: 5000 });
    } finally {
      statusSavingRef.current = false;
      if (mountedRef.current) setUpdatingStatus(null);
    }
  };

  const changeDesignPageSize = (size) => {
    setPageSize(size);
    setPage(1);
  };

  return (
    <section aria-label="Design management">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">{company ? "Company designs" : "Your designs"}</h2>
          <p className="mt-2 text-ink/70">{company ? "Manage designs across your company and review their approval status." : "Create and manage your interior design portfolio."}</p>
        </div>
        <button type="button" onClick={showCreateDesignForm} className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-3 font-semibold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"><Plus size={18} aria-hidden="true" /> Add design</button>
      </div>
      <form role="search" aria-label="Search and filter designs" onSubmit={applyDesignFilters} className="mb-6 grid items-end gap-4 rounded-2xl border border-sage-200/60 bg-sage-50 p-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <label htmlFor="design-search" className="auth-label">Search by title</label>
          <div className="relative">
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage-700" />
            <input id="design-search" name="title" type="search" value={filterInputs.title} onChange={updateDesignFilters} placeholder="Enter a design title" className="auth-input pl-11" />
          </div>
        </div>
        <div>
          <label htmlFor="design-filter-property" className="auth-label">Property type</label>
          <select id="design-filter-property" name="property_type" value={filterInputs.property_type} onChange={updateDesignFilters} className="auth-input">
            <option value="">All</option>
            {["HDB", "Condo", "Landed"].map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="design-filter-category" className="auth-label">Category</label>
          <select id="design-filter-category" name="category_type" value={filterInputs.category_type} onChange={updateDesignFilters} className="auth-input">
            <option value="">All</option>
            {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
        </div>
        <div className="flex min-h-[50px] flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-1 lg:flex-nowrap">
          <button type="submit" aria-label="Apply filters" title="Apply filters" disabled={loading || !hasFilterChanges} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage-700 text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40">
            <Filter size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={clearDesignFilters} aria-label="Reset filters" title="Reset filters" disabled={loading || !(hasFilterChanges || hasFilters || filters.sort_by !== "created_at" || filters.sort_order !== "desc")} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-sage-200 text-sage-700 transition-colors hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40">
            <RotateCcw size={20} aria-hidden="true" />
          </button>
        </div>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-sage-200/60" aria-busy={loading}>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Your interior designs</caption>
          <thead className="bg-sage-50 text-ink"><tr>
            {[
              ["Design title", "title"], ["Category"], ["Property type"], ["Status"],
              ["Budget", "budget"], ["Completion date"], ["Created date", "created_at"], ["Actions"],
            ].map(([heading, sortBy]) => (
              <th key={heading} scope="col" aria-sort={sortBy ? (filters.sort_by === sortBy ? (filters.sort_order === "asc" ? "ascending" : "descending") : "none") : undefined} className="whitespace-nowrap px-5 py-4 font-semibold">
                {sortBy ? (
                  <button type="button" onClick={() => sortDesigns(sortBy, filters.sort_by === sortBy && filters.sort_order === "asc" ? "desc" : "asc")} disabled={loading} aria-label={`Sort ${heading.toLowerCase()} ${filters.sort_by === sortBy && filters.sort_order === "asc" ? "descending" : "ascending"}`} className="group inline-flex items-center gap-1 rounded-sm text-left transition-colors hover:text-sage-700 disabled:cursor-wait">
                    {heading}
                    <span className="ml-1 flex shrink-0 flex-col -space-y-[5px]" aria-hidden="true">
                      <ChevronUp size={18} strokeWidth={2} className={filters.sort_by === sortBy && filters.sort_order === "asc" ? "text-sage-700" : "text-ink/40 group-hover:text-ink/60"} />
                      <ChevronDown size={18} strokeWidth={2} className={filters.sort_by === sortBy && filters.sort_order === "desc" ? "text-sage-700" : "text-ink/40 group-hover:text-ink/60"} />
                    </span>
                  </button>
                ) : heading}
              </th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} className="px-5 py-10 text-center text-ink/70"><p role="status">Loading designs...</p></td></tr> : listFailed ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-ink/70"><div><button type="button" onClick={() => setReload((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div></td></tr>
            ) : designs.length ? designs.map((design) => (
              <tr key={design.id} className="border-t border-sage-200/60">
                <td className="min-w-[10rem] break-words px-5 py-4 font-medium text-ink">{design.title}</td>
                <td className="px-5 py-4 text-ink/70">{categoryNames.get(design.category_id) || "Not available"}</td>
                <td className="px-5 py-4 text-ink/70">{design.property_type}</td>
                <td className="px-5 py-4"><DesignStatusBadge status={design.status || "Reviewing"} /></td>
                <td className="whitespace-nowrap px-5 py-4 text-ink/70">{design.budget == null ? "Not provided" : new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" }).format(design.budget)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-ink/70">{formatDesignDate(design.completion_date)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-ink/70">{formatDesignDate(design.created_at)}</td>
                <td className="px-5 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><button type="button" aria-label={`Actions for ${design.title}`} className="rounded-lg p-2 text-sage-700 hover:bg-sage-100"><MoreHorizontal size={20} aria-hidden="true" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[60] w-56 rounded-2xl border-sage-200 p-2">
                      <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5"><Link to={`/designs/${encodeURIComponent(design.id)}`}><Eye size={16} aria-hidden="true" /> View</Link></DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => showEditDesignForm(design)} className="rounded-xl px-3 py-2.5"><Pencil size={16} aria-hidden="true" /> Edit</DropdownMenuItem>
                      {company && ["Approved", "Reviewing"].map((status) => (
                        <DropdownMenuItem key={status} disabled={updatingStatus !== null || (design.status || "Reviewing") === status} onSelect={() => changeDesignStatus(design, status)} className={`rounded-xl px-3 py-2.5 ${status === "Approved" ? "text-green-800 focus:bg-green-50 focus:text-green-800" : "text-amber-800 focus:bg-amber-50 focus:text-amber-800"}`}>
                          {status === "Approved" ? <CheckCircle2 size={16} aria-hidden="true" /> : <Clock3 size={16} aria-hidden="true" />}
                          {status === "Approved" ? "Approve" : "Mark as reviewing"}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem onSelect={() => requestDesignDeletion(design)} className="rounded-xl px-3 py-2.5 text-red-700 focus:bg-red-50 focus:text-red-700"><Trash2 size={16} aria-hidden="true" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )) : <tr><td colSpan={8} className="px-5 py-10 text-center text-ink/70">{hasFilters ? "No designs match your search or filters." : "No designs yet. Add your first design to get started."}</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageSize={pageSize} totalItems={totalItems} onPageChange={setPage} onPageSizeChange={changeDesignPageSize} disabled={loading} />
      {form && <DesignFormDialog designId={form.designId} designerId={designerId} designers={designers} onClose={() => setForm(null)} onSaved={finishDesignSave} />}
      {deleteTarget && <Dialog open onOpenChange={closeDesignDeletion}>
        <DialogContent className="w-[calc(100%_-_2rem)] rounded-2xl border-sage-200 text-ink" showCloseButton={!deleting}>
          <DialogHeader>
            <DialogTitle>Delete design?</DialogTitle>
            <DialogDescription className="text-ink/70">Delete “{deleteTarget.title}”? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => closeDesignDeletion(false)} disabled={deleting} className="rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700 disabled:opacity-50">Cancel</button>
            <button type="button" onClick={deleteDesign} disabled={deleting} className="rounded-full bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800 disabled:opacity-50">{deleting ? "Deleting..." : "Delete design"}</button>
          </div>
        </DialogContent>
      </Dialog>}
    </section>
  );
}

export default DesignerDesignTableContent;
