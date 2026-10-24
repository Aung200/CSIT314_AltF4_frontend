//libraries
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

//components
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";

//api
import API from "../../../api/api";

const emptyDesign = {
  title: "", description: "", location: "", property_type: "HDB",
  budget: "", completion_date: "", category_id: "",
};

export function getDesignError(error, fallback) {
  const detail = error.response?.data?.detail;
  return (typeof detail === "string" ? detail : detail?.message) || error.response?.data?.message || fallback;
}

function DesignFormDialog({ designId, designerId, onClose, onSaved }) {
  const [design, setDesign] = useState(emptyDesign);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const mountedRef = useRef(false);
  const savingRef = useRef(false);
  const editing = Boolean(designId);
  const keptImageCount = savedImages.filter((image) => !removedImageIds.includes(image.id)).length;
  const totalImageCount = keptImageCount + images.length;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadDesignForm = async () => {
      setLoading(true);
      setLoadFailed(false);
      try {
        const [categoryResponse, designResponse] = await Promise.all([
          API.get_categories(),
          designId ? API.get_design(designId) : Promise.resolve(null),
        ]);
        if (!active) return;
        if (!Array.isArray(categoryResponse.data)) throw new Error("Unexpected category response.");
        setCategories(categoryResponse.data);
        if (designResponse) {
          const data = designResponse.data;
          const details = Array.isArray(data?.items) ? data.items.find((item) => item.id === designId) : data;
          if (typeof details?.title !== "string") throw new Error("Unexpected design response.");
          setDesign({
            title: details.title, description: details.description || "", location: details.location || "",
            property_type: details.property_type || "HDB", budget: String(details.budget ?? ""),
            completion_date: details.completion_date?.slice(0, 10) || "", category_id: details.category_id || "",
          });
          setSavedImages(details.images || []);
          setRemovedImageIds([]);
        }
      } catch (error) {
        if (active) {
          setLoadFailed(true);
          toast.error(getDesignError(error, "Unable to load the form. Please try again."), { autoClose: 5000 });
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDesignForm();
    return () => { active = false; };
  }, [designId, retry]);

  useEffect(() => {
    const nextPreviews = images.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(nextPreviews);
    return () => nextPreviews.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [images]);

  const updateDesignField = (event) => {
    const { name, value } = event.target;
    setDesign((current) => ({ ...current, [name]: value }));
  };

  const selectDesignImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please select image files only.", { autoClose: 5000 });
      return;
    }
    setImages((current) => [...current, ...files]);
  };

  const removeSelectedImage = (index) => {
    if (editing && totalImageCount <= 1) return;
    setImages((current) => current.filter((_, position) => position !== index));
  };

  const removeSavedImage = (imageId) => {
    if (totalImageCount <= 1 || removedImageIds.includes(imageId)) return;
    setRemovedImageIds((current) => [...current, imageId]);
  };

  const restoreSavedImage = (imageId) => {
    setRemovedImageIds((current) => current.filter((id) => id !== imageId));
  };

  const closeDesignForm = (open) => {
    if (!open && !savingRef.current) onClose();
  };

  const saveDesign = async (event) => {
    event.preventDefault();
    if (savingRef.current || loading || loadFailed) return;
    if (!design.title.trim() || !design.description.trim() || !design.location.trim() || !design.category_id || !design.completion_date) {
      toast.error("Please complete all the design details.", { autoClose: 5000 });
      return;
    }
    if (!design.budget.trim() || !Number.isFinite(Number(design.budget)) || Number(design.budget) < 0) {
      toast.error("Please enter a valid budget of zero or more.", { autoClose: 5000 });
      return;
    }
    if (totalImageCount === 0) {
      toast.error("Please select at least one design image.", { autoClose: 5000 });
      return;
    }
    savingRef.current = true;
    setSaving(true);
    const payload = {
      ...design, title: design.title.trim(), description: design.description.trim(),
      location: design.location.trim(), budget: Number(design.budget), designer_id: designerId,
    };
    try {
      if (editing) await API.update_design(designId, payload, images, removedImageIds);
      else await API.create_design(payload, images);
      if (mountedRef.current) onSaved(editing ? "Design updated successfully." : "Design created successfully.");
    } catch (error) {
      if (mountedRef.current) toast.error(getDesignError(error, "Unable to save this design. Please try again."), { autoClose: 5000 });
    } finally {
      savingRef.current = false;
      if (mountedRef.current) setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={closeDesignForm}>
      <DialogContent className="max-h-[90vh] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto rounded-2xl border-sage-200 text-ink" showCloseButton={!saving}>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit design" : "Add design"}</DialogTitle>
          <DialogDescription className="text-ink/70">Share your interior design details and photos.</DialogDescription>
        </DialogHeader>
        {loading ? <p role="status">Loading form...</p> : loadFailed ? (
          <div><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>
        ) : (
          <form onSubmit={saveDesign} aria-label={editing ? "Edit design" : "Add design"}>
            <fieldset disabled={saving} className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="design-title" className="auth-label">Design title</label>
                <input id="design-title" name="title" value={design.title} onChange={updateDesignField} required className="auth-input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="design-description" className="auth-label">Description</label>
                <textarea id="design-description" name="description" value={design.description} onChange={updateDesignField} required rows={3} className="auth-input resize-y" />
              </div>
              <div>
                <label htmlFor="design-location" className="auth-label">Location</label>
                <input id="design-location" name="location" value={design.location} onChange={updateDesignField} required className="auth-input" />
              </div>
              <div>
                <label htmlFor="design-property-type" className="auth-label">Property type</label>
                <select id="design-property-type" name="property_type" value={design.property_type} onChange={updateDesignField} required className="auth-input">
                  {["HDB", "Condo", "Landed"].map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="design-budget" className="auth-label">Budget (SGD)</label>
                <input id="design-budget" name="budget" type="number" min="0" step="0.01" value={design.budget} onChange={updateDesignField} required className="auth-input" />
              </div>
              <div>
                <label htmlFor="design-completion-date" className="auth-label">Completion date</label>
                <input id="design-completion-date" name="completion_date" type="date" value={design.completion_date} onChange={updateDesignField} required className="auth-input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="design-category" className="auth-label">Category</label>
                <select id="design-category" name="category_id" value={design.category_id} onChange={updateDesignField} required className="auth-input">
                  <option value="">Select a category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                {!categories.length && <p className="mt-2 text-sm text-ink/70">No categories are available. Contact Platform Management to add one.</p>}
              </div>
              {savedImages.length > 0 && <div className="sm:col-span-2">
                <p className="auth-label">Saved images</p>
                <p className="text-sm text-ink/70">Keep at least one photo. Add a new photo before removing the last one. Photos marked for removal will be deleted when you save changes.</p>
                <ul aria-label="Saved images" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {savedImages.map((image, index) => {
                    const removed = removedImageIds.includes(image.id);
                    return (
                      <li key={image.id} className="overflow-hidden rounded-xl border border-sage-200">
                        <img src={image.url} alt={`Saved design ${index + 1}`} className={`h-28 w-full object-cover ${removed ? "opacity-40" : ""}`} />
                        {(removed || totalImageCount > 1) && <button type="button" onClick={() => removed ? restoreSavedImage(image.id) : removeSavedImage(image.id)} aria-label={removed ? `Keep saved image ${index + 1}` : `Remove saved image ${index + 1}`} className="w-full px-2 py-2 text-sm font-semibold text-sage-700 hover:bg-sage-50">{removed ? "Undo removal" : "Remove"}</button>}
                      </li>
                    );
                  })}
                </ul>
              </div>}
              <div className="sm:col-span-2">
                <label htmlFor="design-images" className="auth-label">{editing ? "Add more images" : "Design images"}</label>
                <input id="design-images" type="file" accept="image/*" multiple onChange={selectDesignImages} className="auth-input file:mr-3 file:rounded-full file:border-0 file:bg-sage-100 file:px-4 file:py-2 file:text-sage-700" />
                <p className="mt-2 text-sm text-ink/70">{editing ? "You can select multiple new photos. Unmarked saved images will be kept." : "Select one or more photos from your device."}</p>
                {previews.length > 0 && <ul aria-label="Selected images" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {previews.map(({ file, url }, index) => (
                    <li key={url} className="relative overflow-hidden rounded-xl border border-sage-200">
                      <img src={url} alt={file.name} className="h-28 w-full object-cover" />
                      <p className="truncate px-2 py-2 text-xs" title={file.name}>{file.name}</p>
                      {(!editing || totalImageCount > 1) && <button type="button" onClick={() => removeSelectedImage(index)} aria-label={`Remove image ${index + 1}: ${file.name}`} className="absolute right-1 top-1 rounded-full bg-white p-1 text-ink shadow"><X size={16} aria-hidden="true" /></button>}
                    </li>
                  ))}
                </ul>}
              </div>
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button type="button" onClick={() => closeDesignForm(false)} className="rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700">Cancel</button>
                <button type="submit" disabled={saving || !categories.length} className="rounded-full bg-sage-700 px-5 py-2.5 font-semibold text-white hover:bg-ink disabled:opacity-50">{saving ? "Saving..." : editing ? "Save changes" : "Create design"}</button>
              </div>
            </fieldset>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DesignFormDialog;
