//libraries
import { useEffect, useState } from "react";

//components
import { ArrowUpRight, Building2, Mail, MapPin, Phone } from "lucide-react";

//api
import API from "../../../../api/api";

//utils
import getDesignError from "../../../../utils/getDesignError";

function DesignCompanyDetails({ companyId }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!companyId) return;
    let active = true;
    const loadCompany = async () => {
      setLoading(true);
      setError("");
      setCompany(null);
      try {
        const response = await API.getCompanyDetailsAPI(companyId);
        if (!active) return;
        const details = response.data?.company ?? response.data;
        if (!details || typeof details.name !== "string") throw new Error("Unexpected company response.");
        setCompany(details);
      } catch (requestError) {
        if (active) setError(getDesignError(requestError, "Unable to load company details. Please try again."));
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCompany();
    return () => { active = false; };
  }, [companyId, retry]);

  if (!companyId) return null;
  let website;
  try {
    const url = new URL(company?.website || company?.url);
    if (["http:", "https:"].includes(url.protocol)) website = url.href;
  } catch { /* Contact details remain available without a website. */ }

  return (
    <section aria-labelledby="design-company-title" aria-busy={loading} className="rounded-2xl border border-sage-200/60 bg-white p-5 sm:p-6">
      <h2 id="design-company-title" className="mb-5 flex items-center gap-2 text-xl font-semibold text-ink"><Building2 size={22} aria-hidden="true" className="text-sage-700" />Company details</h2>
      {loading ? <p role="status" className="text-sm text-ink/70">Loading company details...</p> : error ? (
        <div role="alert" className="text-sm text-ink/70"><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>
      ) : company && <>
        <h3 className="break-words text-lg font-semibold text-ink">{company.name}</h3>
        <ul className="mt-5 space-y-3 text-sm text-ink/70">
          {company.email && <li><a href={`mailto:${company.email}`} className="flex items-start gap-2 hover:text-sage-700"><Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0" /><span className="break-all">{company.email}</span></a></li>}
          {company.phone && <li><a href={`tel:${String(company.phone).replace(/[^+\d]/g, "")}`} className="flex items-start gap-2 hover:text-sage-700"><Phone size={16} aria-hidden="true" className="mt-0.5 shrink-0" /><span>{company.phone}</span></a></li>}
          {company.address && <li className="flex items-start gap-2"><MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0" /><span className="whitespace-pre-wrap break-words">{company.address}</span></li>}
        </ul>
        {website && <a href={website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${company.name} website (opens in a new tab)`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sage-700 hover:text-ink">Visit website <ArrowUpRight size={16} aria-hidden="true" /></a>}
      </>}
    </section>
  );
}

export default DesignCompanyDetails;
