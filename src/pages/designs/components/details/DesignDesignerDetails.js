//libraries
import { useEffect, useState } from "react";

//components
import { Briefcase, Mail, UserRound } from "lucide-react";

//api
import API from "../../../../api/api";

//utils
import formatName from "../../../../utils/formatName";
import getDesignError from "../../../../utils/getDesignError";

function DesignDesignerDetails({ designerId }) {
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!designerId) return;
    let active = true;
    const loadDesigner = async () => {
      setLoading(true);
      setError("");
      setDesigner(null);
      try {
        const response = await API.getUserDetailsAPI(designerId);
        if (!active) return;
        const user = response.data?.user ?? response.data;
        if (!user || user.id !== designerId || (user.role != null && Number(user.role) !== 3)) {
          throw new Error("Unexpected designer response.");
        }
        const details = user.designer ?? user;
        setDesigner({
          name: formatName([user.first_name, user.last_name].filter(Boolean).join(" ") || user.name) || "Designer",
          email: user.email,
          experience: details.YoE,
          biography: details.biography,
        });
      } catch (requestError) {
        if (active) setError(getDesignError(requestError, "Unable to load designer details. Please try again."));
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDesigner();
    return () => { active = false; };
  }, [designerId, retry]);

  if (!designerId) return null;
  const hasExperience = designer?.experience != null && designer.experience !== "";

  return (
    <section aria-labelledby="design-designer-title" aria-busy={loading} className="rounded-2xl border border-sage-200/60 bg-white p-5 sm:p-6">
      <h2 id="design-designer-title" className="mb-5 flex items-center gap-2 text-xl font-semibold text-ink"><UserRound size={22} aria-hidden="true" className="text-sage-700" />Designer details</h2>
      {loading ? <p role="status" className="text-sm text-ink/70">Loading designer details...</p> : error ? (
        <div role="alert" className="text-sm text-ink/70"><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>
      ) : designer && <>
        <h3 className="break-words text-lg font-semibold capitalize text-ink">{designer.name}</h3>
        <dl className="mt-4 space-y-4 text-sm">
          {hasExperience && <div>
            <dt className="flex items-center gap-2 font-medium text-sage-700"><Briefcase size={16} aria-hidden="true" />Years of experience</dt>
            <dd className="mt-1 text-ink/70">{designer.experience} {Number(designer.experience) === 1 ? "year" : "years"}</dd>
          </div>}
          {designer.biography?.trim() && <div>
            <dt className="font-medium text-sage-700">Biography</dt>
            <dd className="mt-1 whitespace-pre-wrap break-words leading-relaxed text-ink/70">{designer.biography}</dd>
          </div>}
        </dl>
        {designer.email && <a href={`mailto:${designer.email}`} className="mt-5 flex items-start gap-2 text-sm text-ink/70 hover:text-sage-700"><Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0" /><span className="break-all">{designer.email}</span></a>}
      </>}
    </section>
  );
}

export default DesignDesignerDetails;
