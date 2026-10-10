import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { registerAPI } from "../../../api/api";

import PersonalFields from "../components/PersonalFields";

function Register({ onRegister }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const form = new FormData(event.currentTarget);
  //   setError("");
  //   setLoading(true);

  //   try {
  //     await registerAPI({
  //       first_name: form.get("first_name"),
  //       last_name: form.get("last_name"),
  //       phone: form.get("phone"),
  //       Email: form.get("Email"),
  //       Password: form.get("Password"),
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
    <section className="auth-card" aria-labelledby="register-title">
      <p className="auth-eyebrow">Make yourself at home</p>
      <h1 id="register-title">Sign up</h1>
      <p className="mb-8 text-ink/70">Create your Houzz account.</p>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      <form className="space-y-5">
        <PersonalFields prefix="register" />
        <div>
          <label htmlFor="register-email" className="auth-label">Email</label>
          <input id="register-email" name="Email" type="email" autoComplete="email" required className="auth-input" />
        </div>
        <div>
          <label htmlFor="register-password" className="auth-label">Password</label>
          <input id="register-password" name="Password" type="password" autoComplete="new-password" required className="auth-input" />
        </div>
        <button type="submit" disabled={loading} className="auth-button">{loading ? "Creating account..." : "Sign up"}</button>
      </form>
      <div className="mt-6 border-t border-sage-200/60 pt-6 text-center">
        <p className="mb-3 text-sm text-ink/70">Joining as a professional?</p>
        <Link to="/auth/register/agent" className="inline-flex w-full justify-center rounded-full border border-sage-700 px-6 py-3 font-semibold text-sage-700 transition-colors hover:bg-sage-50">
          Register as an agent
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-ink/70">Already have an account? <Link to="/auth/login" className="font-semibold text-sage-700 underline underline-offset-4">Login</Link></p>
    </section>
  );
}

export default Register;
