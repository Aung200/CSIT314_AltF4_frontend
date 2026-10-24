//libraries
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//components
import { ToastContainer, toast } from "react-toastify";

//api
import API from "../../../api/api";

function CompanyRegisterPage({ onRegister }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerCompany = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const name = form.get("name");
    const description = form.get("description");
    const phone = form.get("phone");
    const email = form.get("email");
    const website = form.get("website");
    const address = form.get("address");
    const password = form.get("password");

    try {
      const response = await API.registerCompanyAPI(
        name,
        description,
        phone,
        email,
        website,
        address,
        password,
      );
      onRegister(response.data.company);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.detail?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unable to Register. Please try again.";
      toast.error(message, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card sm:max-w-2xl" aria-labelledby="company-register-title">
      <ToastContainer />
      <p className="auth-eyebrow">For businesses</p>
      <h1 id="company-register-title">Register your company</h1>
      <p className="mb-8 text-ink/70">Create a company account on Houzz.</p>
      <form onSubmit={registerCompany} className="space-y-5">
        <div>
          <label htmlFor="company-register-name" className="auth-label">
            Company name
          </label>
          <input
            id="company-register-name"
            name="name"
            autoComplete="organization"
            required
            className="auth-input"
          />
        </div>
        <div>
          <label htmlFor="company-register-description" className="auth-label">
            Description
          </label>
          <textarea
            id="company-register-description"
            name="description"
            rows="2"
            required
            className="auth-input"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="company-register-phone" className="auth-label">
              Phone number
            </label>
            <input
              id="company-register-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="auth-input"
            />
          </div>
          <div>
            <label htmlFor="company-register-email" className="auth-label">
              Email
            </label>
            <input
              id="company-register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="auth-input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="company-register-website" className="auth-label">
            Website
          </label>
          <input
            id="company-register-website"
            name="website"
            type="url"
            autoComplete="url"
            placeholder="https://example.com"
            required
            className="auth-input"
          />
        </div>
        <div>
          <label htmlFor="company-register-address" className="auth-label">
            Address
          </label>
          <textarea
            id="company-register-address"
            name="address"
            autoComplete="street-address"
            rows="2"
            required
            className="auth-input"
          />
        </div>
        <div>
          <label htmlFor="company-register-password" className="auth-label">
            Password
          </label>
          <input
            id="company-register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="auth-input"
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Registering..." : "Register company"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">
        Registering as an individual?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-sage-700 underline underline-offset-4"
        >
          Personal sign up
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-ink/70">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-sage-700 underline underline-offset-4"
        >
          Login
        </Link>
      </p>
    </section>
  );
}

export default CompanyRegisterPage;
