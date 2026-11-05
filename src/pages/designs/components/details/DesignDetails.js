//libraries
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

//components
import { ArrowLeft, LoaderCircle, MapPin } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import DesignImageGallery from "./DesignImageGallery";
import DesignEnquiryForm from "./DesignEnquiryForm";
import DesignCompanyDetails from "./DesignCompanyDetails";
import DesignDesignerDetails from "./DesignDesignerDetails";
import RelatedDesigns from "./RelatedDesigns";

//api
import API from "../../../../api/api";

//context
import { useAuth } from "../../../../context/AuthContext";

//utils
import formatDesignDate from "../../../../utils/formatDesignDate";

function DesignDetails({ designId }) {
  const { isLoggedIn, role } = useAuth();
  const viewedDesignRef = useRef(null);
  const [design, setDesign] = useState(null);
  const [categoryName, setCategoryName] = useState("Not available");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDescriptionExpanded(false);
  }, [designId]);

  useEffect(() => {
    let active = true;
    const loadDesignDetails = async () => {
      setLoading(true);
      setDesign(null);
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
        const detail = error.response?.data?.detail;
        const message = (typeof detail === "string" ? detail : detail?.message) || error.response?.data?.message || "Unable to load this design. Please try again.";
        toast.error(message, { autoClose: 5000 });
      } finally {
        setLoading(false);
      }
    };
    loadDesignDetails();
    return () => { active = false; };
  }, [designId, retry]);

  useEffect(() => {
    if ((isLoggedIn && role !== 4) || !design?.id || viewedDesignRef.current === design.id) return;
    // Count one successful guest or customer detail-page visit.
    viewedDesignRef.current = design.id;
    API.create_design_view(design.id).catch(() => {
      console.warn("Unable to record design view.");
    });
  }, [design, isLoggedIn, role]);

  const details = design ? [
    ["Property type", design.property_type || "Not provided"],
    ["Category", categoryName],
    ["Location", design.location || "Not provided"],
    ["Budget", design.budget == null ? "Not provided" : new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" }).format(design.budget)],
    ["Completion date", formatDesignDate(design.completion_date)],
    ["Status", design.status || "Not provided"],
    ["Created at", formatDesignDate(design.created_at)],
    ["Last updated", formatDesignDate(design.update_at)],
  ] : [];

  const hasLongDescription = Boolean(design?.description && (design.description.length > 420 || design.description.split("\n").length > 5));

  return (
    <section aria-labelledby="design-details-title" aria-busy={loading}>
      <ToastContainer />
      <Link to="/designs" className="mb-6 inline-flex items-center gap-2 font-semibold text-sage-700 hover:text-ink"><ArrowLeft size={18} aria-hidden="true" /> Back to designs</Link>
      {loading ? (
        <><h1 id="design-details-title" className="sr-only">Design details</h1><p role="status" className="flex items-center justify-center gap-3 rounded-2xl border border-sage-200/60 bg-white py-16 text-ink/70"><LoaderCircle size={20} aria-hidden="true" className="animate-spin" />Loading design details...</p></>
      ) : design ? (
        <>
          <div className="mb-8">
            <p className="auth-eyebrow">Design details</p>
            <h1 id="design-details-title" className="break-words text-3xl sm:text-4xl">{design.title}</h1>
            {design.location && <p className="flex items-center gap-2 text-ink/70"><MapPin size={18} aria-hidden="true" />{design.location}</p>}
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <DesignImageGallery images={design.images || []} title={design.title} />
            <section aria-labelledby="design-information-title" className="min-w-0 rounded-2xl border border-sage-200/60 bg-white p-5 sm:p-6">
              <h2 id="design-information-title" className="mb-5 text-xl font-semibold text-ink">Design information</h2>
              <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {details.map(([label, value]) => <div key={label}><dt className="text-sm font-semibold text-sage-700">{label}</dt><dd className="mt-1 break-words text-sm text-ink">{value}</dd></div>)}
              </dl>
            </section>
          </div>
          <section aria-labelledby="design-description-title" className="mt-6 rounded-2xl border border-sage-200/60 bg-white p-5 sm:p-6">
            <h2 id="design-description-title" className="mb-4 text-xl font-semibold text-ink">About this design</h2>
            <p id="design-description" className={`whitespace-pre-wrap break-words leading-relaxed text-ink/80 ${hasLongDescription && !descriptionExpanded ? "line-clamp-4" : ""}`}>{design.description || "No description provided."}</p>
            {hasLongDescription && <button type="button" aria-expanded={descriptionExpanded} aria-controls="design-description" onClick={() => setDescriptionExpanded((value) => !value)} className="mt-3 text-sm font-semibold text-sage-700 hover:underline">{descriptionExpanded ? "Show less" : "Read more"}</button>}
          </section>
          <div className="mt-6 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {design.designer_id && <div className="min-w-0"><DesignDesignerDetails key={design.designer_id} designerId={design.designer_id} /></div>}
            {design.company_id && <div className="min-w-0"><DesignCompanyDetails key={design.company_id} companyId={design.company_id} /></div>}
            <div className="min-w-0 md:col-span-2 lg:col-span-1"><DesignEnquiryForm designId={design.id} /></div>
          </div>
          {design.category_id && categoryName !== "Not available" && <RelatedDesigns designId={design.id} categoryId={design.category_id} categoryName={categoryName} />}
        </>
      ) : (
        <div className="rounded-2xl border border-sage-200/60 bg-white px-5 py-16 text-center">
          <h1 id="design-details-title" className="text-xl">Design unavailable</h1>
          <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-4 rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700 hover:bg-sage-50">Try again</button>
        </div>
      )}
    </section>
  );
}

export default DesignDetails;
