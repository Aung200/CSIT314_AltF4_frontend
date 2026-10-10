import { useEffect, useState } from "react";
// import { getCompaniesAPI } from "../../../api/api";

function CompanyFields({ company, onCompanyChange }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   setLoading(true);
  //   setError("");
  //   getCompaniesAPI(controller.signal)
  //     .then(setCompanies)
  //     .catch((error) => {
  //       if (!controller.signal.aborted) setError(error.message);
  //     })
  //     .finally(() => {
  //       if (!controller.signal.aborted) setLoading(false);
  //     });
  //   return () => controller.abort();
  // }, [retry]);

  return (
    <fieldset className="space-y-5 rounded-2xl border border-sage-200/60 p-5">
      <legend className="px-2 text-lg font-semibold">Company</legend>
      <div>
        <label htmlFor="agent-company" className="auth-label">Select company</label>
        <select id="agent-company" value={company} onChange={(event) => onCompanyChange(event.target.value)} required className="auth-input">
          <option value="">{loading ? "Loading companies..." : "Select your company"}</option>
          {companies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          <option value="new">Can’t find your company? Add new company</option>
        </select>
        {error && <div className="mt-2 text-sm text-red-700" role="alert">{error} <button type="button" onClick={() => setRetry(retry + 1)} className="font-semibold underline">Retry</button></div>}
      </div>
      {company === "new" && (
        <>
          <div>
            <label htmlFor="company-name" className="auth-label">Company name</label>
            <input id="company-name" name="company_name" autoComplete="organization" required className="auth-input" />
          </div>
          <div>
            <label htmlFor="company-description" className="auth-label">Company description</label>
            <textarea id="company-description" name="company_description" rows="3" required className="auth-input" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="company-phone" className="auth-label">Company phone</label>
              <input id="company-phone" name="company_phone" type="tel" autoComplete="tel" required className="auth-input" />
            </div>
            <div>
              <label htmlFor="company-email" className="auth-label">Company email</label>
              <input id="company-email" name="company_email" type="email" autoComplete="email" required className="auth-input" />
            </div>
          </div>
          <div>
            <label htmlFor="company-website" className="auth-label">Company website</label>
            <input id="company-website" name="company_website" type="url" placeholder="https://example.com" required className="auth-input" />
          </div>
          <div>
            <label htmlFor="company-address" className="auth-label">Company address</label>
            <textarea id="company-address" name="company_address" autoComplete="street-address" rows="3" required className="auth-input" />
          </div>
        </>
      )}
    </fieldset>
  );
}

export default CompanyFields;
