import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import API from "../../../api/api";

function Login() {
  const location = useLocation();
  const [error, setError] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const email = form.get("Email");
    const password = form.get("Password");

    try {
      const response = await API.loginAPI(email, password);
      console.log("Logged in:", response.data);
    } catch (error) {
      const data = error.response?.data;
      const detail = data?.detail;
      const message = typeof detail === "string"
        ? detail
        : detail?.message || data?.message || "Unable to log in. Please try again.";
      setError(message);
      if (data) console.log("Login response:", data);
    }
  };

  return (
    <section className="auth-card" aria-labelledby="login-title">
      <p className="auth-eyebrow">Welcome back</p>
      <h1 id="login-title">Login</h1>
      <p className="mb-8 text-ink/70">Your next home project starts here.</p>
      {location.state?.registered && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-sage-50 p-3 text-sage-700"
        >
          Account created. You can now log in.
        </p>
      )}
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="auth-label">
            Email
          </label>
          <input
            id="login-email"
            name="Email"
            type="email"
            autoComplete="username"
            required
            className="auth-input"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="auth-label">
            Password
          </label>
          <input
            id="login-password"
            name="Password"
            type="password"
            autoComplete="current-password"
            required
            className="auth-input"
          />
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">
        New to Houzz?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-sage-700 underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </section>
  );
}

export default Login;
