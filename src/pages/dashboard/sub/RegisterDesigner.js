//libraries
import { Link } from "react-router-dom";

//components
import { ArrowLeft } from "lucide-react";

function RegisterDesigner() {
  return (
    <section className="auth-card w-full max-w-none" aria-labelledby="designer-register-title">
      <Link
        to="/dashboard/designers"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-sage-700 hover:text-ink"
      >
        <ArrowLeft size={18} /> Back to designers
      </Link>
      <p className="auth-eyebrow">Company dashboard</p>
      <h1 id="designer-register-title">Add designer</h1>
      <p className="mb-8 text-ink/70">Create a designer account for your company.</p>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {[
            { name: "first_name", label: "First name", autoComplete: "given-name" },
            { name: "last_name", label: "Last name", autoComplete: "family-name" },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
            { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={`designer-${field.name}`} className="auth-label">
                {field.label}
              </label>
              <input
                id={`designer-${field.name}`}
                name={field.name}
                type={field.type || "text"}
                autoComplete={field.autoComplete}
                minLength={field.name === "password" ? 8 : undefined}
                required
                className="auth-input"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-sage-200/60 pt-5">
          <p id="designer-registration-availability" className="mb-4 text-sm text-ink/70">
            Designer registration is not available yet.
          </p>
          <div className="flex justify-end gap-3">
            <Link
              to="/dashboard/designers"
              className="inline-flex items-center rounded-full border border-sage-200 px-5 py-2 font-semibold text-ink hover:bg-sage-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled
              aria-describedby="designer-registration-availability"
              className="rounded-full bg-sage-700 px-5 py-2 font-semibold text-white disabled:opacity-50"
            >
              Register designer
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default RegisterDesigner;
