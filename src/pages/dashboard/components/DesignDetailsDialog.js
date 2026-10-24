//libraries
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

//components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { getDesignError } from "./DesignFormDialog";

//api
import API from "../../../api/api";

function formatDesignDetailsDate(value) {
  if (!value) return "Not provided";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "Not provided" : date.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

function DesignDetailsDialog({ designId, onClose }) {
  const [design, setDesign] = useState(null);
  const [categoryName, setCategoryName] = useState("Not available");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const loadDesignDetails = async () => {
      setLoading(true);
      setDesign(null);
      setCategoryName("Not available");
      const [designResult, categoryResult] = await Promise.allSettled([
        API.get_design(designId), API.get_categories(),
      ]);
      if (!active) return;
      try {
        if (designResult.status === "rejected") throw designResult.reason;
        const data = designResult.value.data;
        const details = Array.isArray(data?.items) ? data.items.find((item) => item.id === designId) : data;
        if (!details || details.id !== designId || typeof details.title !== "string") throw new Error("Unexpected design response.");
        setDesign(details);
        if (categoryResult.status === "fulfilled" && Array.isArray(categoryResult.value.data)) {
          const category = categoryResult.value.data.find((item) => item.id === details.category_id);
          setCategoryName(category?.name || "Not available");
        } else {
          toast.error("Unable to load the category name. Please try again.", { autoClose: 5000 });
        }
      } catch (error) {
        toast.error(getDesignError(error, "Unable to load design details. Please try again."), { autoClose: 5000 });
      } finally {
        setLoading(false);
      }
    };
    loadDesignDetails();
    return () => { active = false; };
  }, [designId, retry]);

  const closeDesignDetails = (open) => {
    if (!open) onClose();
  };

  const details = design ? [
    ["Category", categoryName],
    ["Property type", design.property_type || "Not provided"],
    ["Location", design.location || "Not provided"],
    ["Budget", design.budget == null ? "Not provided" : new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" }).format(design.budget)],
    ["Completion date", formatDesignDetailsDate(design.completion_date)],
    ["Status", design.status || "Not provided"],
    ["Created at", formatDesignDetailsDate(design.created_at)],
    ["Last updated", formatDesignDetailsDate(design.update_at)],
  ] : [];

  return (
    <Dialog open onOpenChange={closeDesignDetails}>
      <DialogContent className="max-h-[90vh] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto rounded-2xl border-sage-200 text-ink">
        <DialogHeader>
          <DialogTitle className="break-words pr-6">{design?.title || "Design details"}</DialogTitle>
          <DialogDescription>View the design information and portfolio photos.</DialogDescription>
        </DialogHeader>
        {loading ? <p role="status" className="py-6 text-ink/70">Loading design details...</p> : design ? (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-sage-700">Description</h3>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink/80">{design.description || "No description provided."}</p>
            </div>
            <dl className="grid gap-5 rounded-2xl bg-sage-50 p-5 sm:grid-cols-2">
              {details.map(([label, value]) => <div key={label}>
                <dt className="text-sm font-semibold text-sage-700">{label}</dt>
                <dd className="mt-1 break-words text-sm text-ink">{value}</dd>
              </div>)}
            </dl>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-sage-700">Design photos</h3>
              {design.images?.length > 0 ? <ul aria-label="Design photos" className="grid gap-4 sm:grid-cols-2">
                {design.images.map((image, index) => <li key={image.id} className="overflow-hidden rounded-2xl border border-sage-200/60 bg-sage-50">
                  <img src={image.url} alt={`${design.title} — ${index + 1}`} loading="lazy" className="h-56 w-full object-contain" />
                </li>)}
              </ul> : <p className="text-sm text-ink/70">No photos available.</p>}
            </div>
          </div>
        ) : <button type="button" onClick={() => setRetry((value) => value + 1)} className="justify-self-start font-semibold text-sage-700 underline">Try again</button>}
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700 hover:bg-sage-50">Close details</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DesignDetailsDialog;
