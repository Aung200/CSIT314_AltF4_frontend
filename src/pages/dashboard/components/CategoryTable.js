//libraries
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

//components
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

//api
import API from "../../../api/api";

//context
import { useAuth } from "../../../context/AuthContext";

//utils
import getCategoryError from "../../../utils/getCategoryError";
import formatCategoryDate from "../../../utils/formatCategoryDate";

function CategoryTable({ active = true }) {
  const { isLoggedIn, role } = useAuth();
  const canManageCategories = isLoggedIn && role === 1;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listFailed, setListFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [panelMode, setPanelMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [working, setWorking] = useState(false);
  const actionRequestRef = useRef(null);
  const panelHeadingRef = useRef(null);

  useEffect(() => {
    setPanelMode(null);
    setSelectedCategory(null);
    setWorking(false);
    if (!active || !canManageCategories) return undefined;
    let isActive = true;

    const loadCategories = async () => {
      setLoading(true);
      setListFailed(false);
      try {
        const response = await API.get_categories();
        if (!isActive) return;
        if (!Array.isArray(response.data)) throw new Error("Categories were returned in an unexpected format.");
        setCategories(response.data);
      } catch (error) {
        if (isActive) {
          setListFailed(true);
          toast.error(getCategoryError(error, "Unable to load categories. Please try again."), { autoClose: 5000 });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadCategories();
    return () => {
      isActive = false;
      if (actionRequestRef.current) actionRequestRef.current.cancelled = true;
      actionRequestRef.current = null;
    };
  }, [active, canManageCategories, retry]);

  useEffect(() => {
    panelHeadingRef.current?.focus();
  }, [panelMode]);

  const showCreateCategoryForm = () => {
    if (!active || !canManageCategories || actionRequestRef.current) return;
    setName("");
    setDescription("");
    setSelectedCategory(null);
    setPanelMode("create");
  };

  const closeCategoryPanel = () => {
    if (actionRequestRef.current) return;
    setPanelMode(null);
    setSelectedCategory(null);
  };

  const editCategory = async (category) => {
    if (!active || !canManageCategories || actionRequestRef.current) return;
    const request = { cancelled: false };
    actionRequestRef.current = request;
    setWorking(true);
    setPanelMode("loading");

    try {
      const response = await API.get_category(category.id);
      if (request.cancelled) return;
      const details = response.data;
      if (!details?.id || typeof details.name !== "string") throw new Error("Category details were returned in an unexpected format.");
      setSelectedCategory(details);
      setName(details.name);
      setDescription(details.description || "");
      setPanelMode("edit");
    } catch (error) {
      if (request.cancelled) return;
      setPanelMode(null);
      toast.error(getCategoryError(error, "Unable to load this category. Please try again."), { autoClose: 5000 });
    } finally {
      if (!request.cancelled) {
        actionRequestRef.current = null;
        setWorking(false);
      }
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    if (!active || !canManageCategories || actionRequestRef.current) return;
    if (!name.trim()) {
      toast.error("Please enter a category name.", { autoClose: 5000 });
      return;
    }
    const request = { cancelled: false };
    actionRequestRef.current = request;
    setWorking(true);
    const editing = panelMode === "edit";

    try {
      if (editing) {
        await API.update_category(selectedCategory.id, name.trim(), description.trim());
      } else {
        await API.create_category(name.trim(), description.trim());
      }
      if (request.cancelled) return;
      setPanelMode(null);
      setSelectedCategory(null);
      toast.success(editing ? "Category updated successfully." : "Category added successfully.", { autoClose: 5000 });
      setRetry((attempt) => attempt + 1);
    } catch (error) {
      if (!request.cancelled) toast.error(getCategoryError(error, "Unable to save this category. Please try again."), { autoClose: 5000 });
    } finally {
      if (!request.cancelled) {
        actionRequestRef.current = null;
        setWorking(false);
      }
    }
  };

  const requestCategoryDeletion = (category) => {
    if (!active || !canManageCategories || actionRequestRef.current) return;
    setSelectedCategory(category);
    setPanelMode("delete");
  };

  const deleteCategory = async () => {
    if (!active || !canManageCategories || !selectedCategory || actionRequestRef.current) return;
    const request = { cancelled: false };
    actionRequestRef.current = request;
    setWorking(true);

    try {
      await API.delete_category(selectedCategory.id);
      if (request.cancelled) return;
      setPanelMode(null);
      setSelectedCategory(null);
      toast.success("Category deleted successfully.", { autoClose: 5000 });
      setRetry((attempt) => attempt + 1);
    } catch (error) {
      if (!request.cancelled) toast.error(getCategoryError(error, "Unable to delete this category. Please try again."), { autoClose: 5000 });
    } finally {
      if (!request.cancelled) {
        actionRequestRef.current = null;
        setWorking(false);
      }
    }
  };

  const retryCategories = () => {
    setRetry((attempt) => attempt + 1);
  };

  if (!canManageCategories) return null;

  return (
    <section aria-label="Category management" aria-busy={loading}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Categories</h2>
          <p className="mt-2 text-ink/70">Manage the interior design categories available on the platform.</p>
        </div>
        <button type="button" onClick={showCreateCategoryForm} disabled={working} className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-3 font-semibold text-white hover:bg-ink disabled:opacity-50">
          <Plus size={18} aria-hidden="true" /> Add category
        </button>
      </div>
      {panelMode === "loading" && <p role="status" className="mb-5 text-ink/70">Loading category...</p>}
      {(panelMode === "create" || panelMode === "edit") && (
        <form onSubmit={saveCategory} aria-label={panelMode === "edit" ? "Edit category" : "Add category"} className="mb-6 rounded-2xl border border-sage-200/60 bg-sage-50 p-5 sm:p-6">
          <h3 ref={panelHeadingRef} tabIndex={-1} className="mb-5 text-lg font-semibold text-ink focus:outline-none">
            {panelMode === "edit" ? "Edit category" : "Add category"}
          </h3>
          <fieldset disabled={working} className="space-y-5">
            <div>
              <label htmlFor="category-name" className="auth-label">Category name</label>
              <input id="category-name" name="name" value={name} onChange={(event) => setName(event.target.value)} required className="auth-input" />
            </div>
            <div>
              <label htmlFor="category-description" className="auth-label">Description</label>
              <textarea id="category-description" name="description" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="auth-input resize-y" />
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={closeCategoryPanel} className="rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700 hover:bg-white">Cancel</button>
              <button type="submit" disabled={working} className="rounded-full bg-sage-700 px-5 py-2.5 font-semibold text-white hover:bg-ink disabled:opacity-50">
                {working ? "Saving..." : panelMode === "edit" ? "Save changes" : "Create category"}
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {panelMode === "delete" && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
          <h3 ref={panelHeadingRef} tabIndex={-1} className="text-lg font-semibold text-ink focus:outline-none">Delete category?</h3>
          <p className="mt-2 text-sm text-ink/80">Delete “{selectedCategory.name}”? This action cannot be undone.</p>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={closeCategoryPanel} disabled={working} className="rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700 disabled:opacity-50">Cancel</button>
            <button type="button" onClick={deleteCategory} disabled={working} className="rounded-full bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800 disabled:opacity-50">{working ? "Deleting..." : "Delete category"}</button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-sage-200/60">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Available interior design categories</caption>
          <thead className="bg-sage-50 text-ink">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">Design name</th>
              <th scope="col" className="px-5 py-4 font-semibold">Created at</th>
              <th scope="col" className="px-5 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-5 py-10 text-center text-ink/70"><p role="status">Loading categories...</p></td></tr>
            ) : listFailed ? (
              <tr><td colSpan={3} className="px-5 py-10 text-center text-ink/70">
                <div><button type="button" onClick={retryCategories} disabled={working} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>
              </td></tr>
            ) : categories.length > 0 ? categories.map((category) => (
              <tr key={category.id}>
                <td className="break-words border-t border-sage-200/60 px-5 py-4 font-medium text-ink">{category.name}</td>
                <td className="border-t border-sage-200/60 px-5 py-4 text-ink/70">{formatCategoryDate(category.created_at)}</td>
                <td className="border-t border-sage-200/60 px-5 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" aria-label={`Actions for ${category.name}`} disabled={working} className="inline-flex rounded-lg p-2 text-sage-700 hover:bg-sage-100 disabled:opacity-50"><MoreHorizontal size={20} aria-hidden="true" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[60] w-40 rounded-2xl border-sage-200 p-2">
                      <DropdownMenuItem onSelect={() => editCategory(category)} className="rounded-xl px-3 py-2.5"><Pencil size={16} aria-hidden="true" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => requestCategoryDeletion(category)} className="rounded-xl px-3 py-2.5 text-red-700 focus:bg-red-50 focus:text-red-700"><Trash2 size={16} aria-hidden="true" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="px-5 py-10 text-center text-ink/70">No categories yet. Add your first category to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CategoryTable;
