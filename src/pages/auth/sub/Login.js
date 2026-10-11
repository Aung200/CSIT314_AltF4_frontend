//libraries
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
//components
import { ToastContainer, toast } from "react-toastify";
//api(controllers)
import API from "../../../api/api";

function Login({onLogin}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = form.get("Email");
    const password = form.get("Password");

    try {
      const response = await API.loginAPI(email, password);
      onLogin();
      localStorage.setItem("role", response.data.role);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.detail?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unable to log in. Please try again.";
      toast.error(message, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card" aria-labelledby="login-title">
      <ToastContainer />
      <p className="auth-eyebrow">Welcome back</p>
      <h1 id="login-title">Login</h1>
      <p className="mb-8 text-ink/70">Your next home project starts here.</p>
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
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Loading..." : "Login"}
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
