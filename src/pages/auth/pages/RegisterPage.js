//libraries
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//components
import { ToastContainer, toast } from "react-toastify";

//api
import API from "../../../api/api";

function RegisterPage({onRegister}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = form.get("Email");
    const password = form.get("Password");
    const first_name = form.get("first_name");
    const last_name = form.get("last_name");
    const phone = form.get("phone");

    try {
      const response = await API.registerUserAPI(
        email,
        password,
        first_name,
        last_name,
        phone,
      );
      onRegister(response.data.user);
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
    <section className="auth-card sm:max-w-2xl" aria-labelledby="register-title">
      <ToastContainer />
      <p className="auth-eyebrow">Make yourself at home</p>
      <h1 id="register-title">Sign up</h1>
      <p className="mb-8 text-ink/70">Create your Houzz account.</p>
      <form onSubmit={registerUser} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="register-first-name" className="auth-label">
              First name
            </label>
            <input
              id="register-first-name"
              name="first_name"
              autoComplete="given-name"
              required
              className="auth-input"
            />
          </div>
          <div>
            <label htmlFor="register-last-name" className="auth-label">
              Last name
            </label>
            <input
              id="register-last-name"
              name="last_name"
              autoComplete="family-name"
              required
              className="auth-input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="register-phone" className="auth-label">
            Phone number
          </label>
          <input
            id="register-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className="auth-input"
          />
        </div>
        <div>
          <label htmlFor="register-email" className="auth-label">
            Email
          </label>
          <input
            id="register-email"
            name="Email"
            type="email"
            autoComplete="email"
            required
            className="auth-input"
          />
        </div>
        <div>
          <label htmlFor="register-password" className="auth-label">
            Password
          </label>
          <input
            id="register-password"
            name="Password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="auth-input"
          />
        </div>
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <div className="mt-6 border-t border-sage-200/60 pt-6 text-center">
        <p className="mb-3 text-sm text-ink/70">Registering a business?</p>
        <Link
          to="/auth/register/company"
          className="inline-flex w-full justify-center rounded-full border border-sage-700 px-6 py-3 font-semibold text-sage-700 transition-colors hover:bg-sage-50"
        >
          Register your company
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-ink/70">
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

export default RegisterPage;
