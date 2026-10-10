import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { registerAgentAPI } from "../../../api/api";

import PersonalFields from "../components/PersonalFields";
import CompanyFields from "../components/CompanyFields";

function AgentRegister({ onRegister }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [company, setCompany] = useState("");

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const form = new FormData(event.currentTarget);
  //   setError("");
  //   setLoading(true);

  //   try {
  //     await registerAgentAPI({
  //       first_name: form.get("first_name"),
  //       last_name: form.get("last_name"),
  //       phone: form.get("phone"),
  //       biography: form.get("biography"),
  //       years_of_experience: Number(form.get("years_of_experience")),
  //       Email: form.get("Email"),
  //       Password: form.get("Password"),
  //       ...(company === "new" ? {
  //         new_company: {
  //           name: form.get("company_name"),
  //           description: form.get("company_description"),
  //           phone: form.get("company_phone"),
  //           email: form.get("company_email"),
  //           website: form.get("company_website"),
  //           address: form.get("company_address"),
  //         },
  //       } : { company_id: company }),
  //     });
  //     onRegister();
  //     navigate("/auth/login", { replace: true, state: { registered: true } });
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <section className="auth-card !max-w-2xl" aria-labelledby="agent-register-title">
      <p className="auth-eyebrow">For professionals</p>
      <h1 id="agent-register-title">Agent registration</h1>
      <p className="mb-8 text-ink/70">Introduce yourself and your company to join Houzz.</p>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      <form className="space-y-5">
        <PersonalFields prefix="agent" />
        <div>
          <label htmlFor="agent-biography" className="auth-label">Biography</label>
          <textarea id="agent-biography" name="biography" rows="4" required className="auth-input" />
        </div>
        <div>
          <label htmlFor="agent-experience" className="auth-label">Years of experience</label>
          <input id="agent-experience" name="years_of_experience" type="number" min="0" step="1" required className="auth-input" />
        </div>
        <CompanyFields company={company} onCompanyChange={setCompany} />
        <div>
          <label htmlFor="agent-email" className="auth-label">Email</label>
          <input id="agent-email" name="Email" type="email" autoComplete="email" required className="auth-input" />
        </div>
        <div>
          <label htmlFor="agent-password" className="auth-label">Password</label>
          <input id="agent-password" name="Password" type="password" autoComplete="new-password" required className="auth-input" />
        </div>
        <button type="submit" disabled={loading} className="auth-button">{loading ? "Creating account..." : "Register as an agent"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">Already have an account? <Link to="/auth/login" className="font-semibold text-sage-700 underline underline-offset-4">Login</Link></p>
      <p className="mt-3 text-center text-sm text-ink/70">Registering for yourself? <Link to="/auth/register" className="font-semibold text-sage-700 underline underline-offset-4">Personal sign up</Link></p>
    </section>
  );
}

export default AgentRegister;
