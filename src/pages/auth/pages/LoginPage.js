//libraries
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

//components
import { ToastContainer, toast } from "react-toastify";

//api
import API from "../../../api/api";

//utils
import getCompanyApprovalMessage from "../../../utils/getCompanyApprovalMessage";

function LoginPage({onLogin}) {
  const [loading, setLoading] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState("");
  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();
    if (loading) return;
    setApprovalMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = form.get("Email");
    const password = form.get("Password");

    try {
      const response = await API.loginAPI(email, password);
      let user = response.data?.user;
      if (!user?.id || user.role == null) throw new Error("Your account details could not be loaded. Please try again.");
      if (Number(user.role) === 2) {
        const accountResponse = await API.getUserDetailsAPI(user.id);
        const account = accountResponse.data?.user ?? accountResponse.data;
        if (!account || account.id !== user.id || (account.role != null && Number(account.role) !== 2)) {
          throw new Error("Your company approval could not be verified. Please try again.");
        }
        const status = account.status;
        const message = getCompanyApprovalMessage(status);
        if (message) {
          setApprovalMessage(message);
          toast.info(message, { autoClose: 7000 });
          return;
        }
        user = { ...user, status };
      }
      onLogin(user);
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        (typeof error.response?.data?.detail === "string" ? error.response.data.detail : error.response?.data?.detail?.message) ||
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
      {approvalMessage && <p role="status" className="mb-6 rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-ink">{approvalMessage}</p>}
      <form onSubmit={loginUser} className="space-y-5">
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

export default LoginPage;
