//libraries
import { useEffect, useRef, useState } from "react";

//components
import { Pencil, Save, X } from "lucide-react";
import { toast } from "react-toastify";

//api
import API from "../../../../api/api";

//context
import { useAuth } from "../../../../context/AuthContext";

//utils
import getDesignError from "../../../../utils/getDesignError";

function DesignerProfileDetails({ initialDetails }) {
  const { isLoggedIn, role, profile } = useAuth();
  const initialDesigner = initialDetails.designer ?? initialDetails;
  const [details, setDetails] = useState({ YoE: initialDesigner.YoE ?? null, biography: initialDesigner.biography ?? null });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  if (!isLoggedIn || role !== 3 || !profile?.id) return null;

  const saveDesignerProfile = async (event) => {
    event.preventDefault();
    if (savingRef.current || role !== 3) return;
    const form = new FormData(event.currentTarget);
    const experience = form.get("YoE").trim();
    const YoE = Number(experience);
    if (!experience || !Number.isSafeInteger(YoE) || YoE < 0) {
      toast.error("Please enter a whole number of years, zero or more.", { autoClose: 5000 });
      return;
    }
    const biography = form.get("biography").trim();
    savingRef.current = true;
    setSaving(true);
    try {
      const response = await API.updateDesignerProfileAPI(profile.id, YoE, biography);
      if (!mountedRef.current) return;
      const updated = response.data?.designer ?? response.data;
      setDetails({ YoE: updated?.YoE ?? YoE, biography: updated?.biography ?? biography });
      setEditing(false);
      toast.success("Designer profile updated successfully.", { autoClose: 5000 });
    } catch (error) {
      if (mountedRef.current) toast.error(getDesignError(error, "Unable to update your designer profile. Please try again."), { autoClose: 5000 });
    } finally {
      savingRef.current = false;
      if (mountedRef.current) setSaving(false);
    }
  };

  return (
    <section aria-labelledby="designer-profile-title" className="mt-8 border-t border-sage-200/60 pt-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="designer-profile-title" className="text-lg font-semibold text-ink">Designer profile</h2>
          <p className="mt-2 text-sm text-ink/70">Tell customers about your experience and approach to design.</p>
        </div>
        {!editing && <button type="button" onClick={() => setEditing(true)} aria-label="Edit designer profile" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sage-700 hover:bg-sage-100"><Pencil size={18} aria-hidden="true" /> Edit</button>}
      </div>
      {editing ? (
        <form onSubmit={saveDesignerProfile} aria-label="Edit designer profile">
          <fieldset disabled={saving} className="space-y-5">
            <div className="max-w-xs">
              <label htmlFor="designer-experience" className="auth-label">Years of experience</label>
              <input id="designer-experience" name="YoE" type="number" min="0" step="1" required defaultValue={details.YoE ?? ""} autoFocus className="auth-input" />
            </div>
            <div>
              <label htmlFor="designer-biography" className="auth-label">Biography</label>
              <textarea id="designer-biography" name="biography" rows={5} defaultValue={details.biography ?? ""} placeholder="Share your background, design style and experience." className="auth-input resize-y" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center gap-2 rounded-full border border-sage-200 px-5 py-2 font-semibold text-ink hover:bg-sage-100"><X size={18} aria-hidden="true" /> Cancel</button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2 font-semibold text-white disabled:opacity-50"><Save size={18} aria-hidden="true" />{saving ? "Saving..." : "Save"}</button>
            </div>
          </fieldset>
        </form>
      ) : (
        <dl className="space-y-5">
          <div><dt className="text-sm font-medium text-ink/70">Years of experience</dt><dd className="mt-1 font-semibold text-ink">{details.YoE ?? "Not available"}</dd></div>
          <div><dt className="text-sm font-medium text-ink/70">Biography</dt><dd className="mt-1 whitespace-pre-wrap break-words leading-relaxed text-ink">{details.biography || "Not available"}</dd></div>
        </dl>
      )}
    </section>
  );
}

export default DesignerProfileDetails;
