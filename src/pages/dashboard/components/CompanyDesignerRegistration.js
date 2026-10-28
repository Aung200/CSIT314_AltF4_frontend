//libraries
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

//components
import { ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

//api
import API from "../../../api/api";

//utils
import getDesignerRegistrationMessage from "../../../utils/getDesignerRegistrationMessage";

function CompanyDesignerRegistration({ companyId }) {
  const [registering, setRegistering] = useState(false);
  const requestRef = useRef(null);

  useEffect(() => () => {
    if (requestRef.current) requestRef.current.cancelled = true;
  }, []);

  const registerCompanyDesigner = async (event) => {
    event.preventDefault();
    if (requestRef.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const email = fields.get("email").trim();
    const firstName = fields.get("first_name").trim();
    const lastName = fields.get("last_name").trim();
    if (!email || !firstName || !lastName) {
      toast.error("Please enter the designer's email, first name, and last name.", { autoClose: 5000 });
      return;
    }

    const request = { cancelled: false };
    requestRef.current = request;
    setRegistering(true);
    try {
      const response = await API.register_designer(companyId, email, firstName, lastName);
      if (request.cancelled) return;
      toast.success(getDesignerRegistrationMessage(response.data, "Designer registered successfully."), { autoClose: 5000 });
      form.reset();
    } catch (error) {
      if (!request.cancelled) {
        toast.error(getDesignerRegistrationMessage(error.response?.data, "Unable to register this designer. Please try again."), { autoClose: 5000 });
      }
    } finally {
      if (!request.cancelled) {
        requestRef.current = null;
        setRegistering(false);
      }
    }
  };

  return (
    <section className="auth-card w-full max-w-none" aria-labelledby="designer-register-title">
      <ToastContainer />
      <Link to="/dashboard/designers" className="mb-6 inline-flex items-center gap-2 font-semibold text-sage-700 hover:text-ink">
        <ArrowLeft size={18} aria-hidden="true" /> Back to designers
      </Link>
      <p className="auth-eyebrow">Company dashboard</p>
      <h1 id="designer-register-title">Add designer</h1>
      <p className="mb-8 text-ink/70">Create a designer account for your company.</p>
      <form onSubmit={registerCompanyDesigner} aria-label="Register company designer" aria-busy={registering}>
        <fieldset disabled={registering} className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {[
            { name: "first_name", label: "First name", autoComplete: "given-name" },
            { name: "last_name", label: "Last name", autoComplete: "family-name" },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
          ].map((field) => (
            <div key={field.name} className={field.name === "email" ? "sm:col-span-2" : undefined}>
              <label htmlFor={`designer-${field.name}`} className="auth-label">{field.label}</label>
              <input id={`designer-${field.name}`} name={field.name} type={field.type || "text"} autoComplete={field.autoComplete} required className="auth-input disabled:opacity-50" />
            </div>
          ))}
        </fieldset>
        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-sage-200/60 pt-5">
          <Link to="/dashboard/designers" className="inline-flex items-center rounded-full border border-sage-200 px-5 py-2 font-semibold text-ink hover:bg-sage-100">Cancel</Link>
          <button type="submit" disabled={registering} className="rounded-full bg-sage-700 px-5 py-2 font-semibold text-white hover:bg-ink disabled:cursor-wait disabled:opacity-50">{registering ? "Registering..." : "Register designer"}</button>
        </div>
      </form>
    </section>
  );
}

export default CompanyDesignerRegistration;
