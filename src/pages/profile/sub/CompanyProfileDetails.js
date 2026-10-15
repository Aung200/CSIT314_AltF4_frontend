//libraries
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//components
import { Pencil, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

//api
import API from "../../../api/api";

//context
import { useAuth } from "../../../context/AuthContext";

function CompanyProfileDetails() {
  const { isLoggedIn, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const id = profile?.id;
  const email = profile?.email;
  const busy = saving || changingPassword || logoutPending;

  useEffect(() => {
    if (!logoutPending) return undefined;

    const timeout = setTimeout(() => {
      logout();
      navigate("/auth/login", { replace: true });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [logoutPending, logout, navigate]);

  useEffect(() => {
    if (!isLoggedIn || id == null) {
      setLoading(false);
      return undefined;
    }

    let isActive = true;
    setLoading(true);
    setError("");

    const loadProfile = async () => {
      try {
        const response = await API.getCompanyDetailsAPI(id);
        if (!isActive) return;
        const company = response.data?.company ?? response.data;
        if (!company || typeof company !== "object" || Array.isArray(company)) {
          const message =
            "Profile details were returned in an unexpected format.";
          setError(message);
          toast.error(message, { autoClose: 5000 });
          return;
        }
        setDetails(company);
      } catch (requestError) {
        if (isActive) {
          const message =
            requestError.response?.data?.detail?.message ||
            requestError.response?.data?.message ||
            requestError.message ||
            "Unable to load your profile. Please try again.";
          setError(message);
          toast.error(message, { autoClose: 5000 });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [id, isLoggedIn, retry]);

  if (!isLoggedIn || id == null) {
    return (
      <section
        className="auth-card sm:max-w-3xl"
        aria-labelledby="profile-title"
      >
        <p className="auth-eyebrow">Your account</p>
        <h1 id="profile-title">Profile</h1>
        <p className="text-ink/70">Log in to view your profile details.</p>
        <Link
          to="/auth/login"
          className="auth-button mt-6 inline-flex justify-center"
        >
          Login
        </Link>
      </section>
    );
  }

  const profileDetails = details ?? profile;
  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const name = form.get("name").trim();
    const description = form.get("description").trim() || null;
    const phone = form.get("phone").trim() || null;
    const website = form.get("website").trim() || null;
    const address = form.get("address").trim() || null;

    setSaving(true);
    try {
      const response = await API.updateCompanyProfileAPI(
        id,
        name,
        description,
        phone,
        website,
        address,
      );
      const message =
        response.data?.detail?.message ||
        response.data?.message ||
        "Profile updated successfully.";
      toast.success(message, { autoClose: 5000 });
      setLogoutPending(true);
    } catch (error) {
      const message =
        error.response?.data?.detail?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unable to update your profile. Please try again.";
      toast.error(message, { autoClose: 5000 });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const passwordForm = event.currentTarget;
    const form = new FormData(passwordForm);
    const new_password = form.get("new_password");

    setChangingPassword(true);
    try {
      const response = await API.updatePasswordAPI(id, new_password);
      const message =
        response.data?.detail?.message ||
        response.data?.message ||
        "Password changed successfully.";
      toast.success(message, { autoClose: 5000 });
      passwordForm.reset();
      setLogoutPending(true);
    } catch (error) {
      const message =
        error.response?.data?.detail?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unable to change your password. Please try again.";
      toast.error(message, { autoClose: 5000 });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <section className="auth-card sm:max-w-3xl" aria-labelledby="profile-title">
      <ToastContainer />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="auth-eyebrow">Your account</p>
          <h1 id="profile-title">Company profile details</h1>
        </div>
        {!loading && !error && !editing && (
          <button
            type="button"
            onClick={handleEdit}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sage-700 hover:bg-sage-100"
          >
            <Pencil size={18} /> Edit
          </button>
        )}
      </div>
      <p className="mb-8 text-ink/70">
        View and edit your company information.
      </p>
      {logoutPending && (
        <p role="status" className="mb-6 text-sage-700">
          Update successful. Redirecting to login...
        </p>
      )}

      {loading && (
        <p role="status" className="text-ink/70">
          Loading profile...
        </p>
      )}
      {error && (
        <div>
          <button
            type="button"
            onClick={() => setRetry((attempt) => attempt + 1)}
            className="mt-2 font-semibold underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <form key={editing ? "edit" : "view"} onSubmit={handleSubmit}>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {[
              {
                name: "name",
                label: "Company name",
                autoComplete: "organization",
                required: true,
              },
              { name: "description", label: "Description", multiline: true },
              {
                name: "phone",
                label: "Phone number",
                type: "tel",
                autoComplete: "tel",
              },
              { name: "email", label: "Email", readOnly: true },
              {
                name: "website",
                label: "Website",
                type: "url",
                autoComplete: "url",
              },
              {
                name: "address",
                label: "Address",
                multiline: true,
                autoComplete: "street-address",
              },
            ].map((field) => (
              <div key={field.name}>
                {editing && !field.readOnly ? (
                  <>
                    <label
                      htmlFor={`company-${field.name}`}
                      className="auth-label"
                    >
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        id={`company-${field.name}`}
                        name={field.name}
                        defaultValue={profileDetails[field.name] || ""}
                        autoComplete={field.autoComplete}
                        disabled={busy}
                        rows={3}
                        className="auth-input"
                      />
                    ) : (
                      <input
                        id={`company-${field.name}`}
                        name={field.name}
                        type={field.type || "text"}
                        autoComplete={field.autoComplete}
                        defaultValue={profileDetails[field.name] || ""}
                        required={field.required}
                        disabled={busy}
                        autoFocus={field.name === "name"}
                        className="auth-input"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-ink/70">
                      {field.label}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">
                      {profileDetails[field.name] ||
                        (field.name === "email" ? email : "") ||
                        "Not provided"}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="mt-8 flex justify-end gap-3 border-t border-sage-200/60 pt-5">
              <button
                type="button"
                onClick={handleCancel}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full border border-sage-200 px-5 py-2 font-semibold text-ink hover:bg-sage-100 disabled:opacity-50"
              >
                <X size={18} /> Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2 font-semibold text-white disabled:opacity-50"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </form>
      )}

      <section
        aria-labelledby="password-title"
        className="mt-8 border-t border-sage-200/60 pt-6"
      >
        <h2 id="password-title" className="text-lg font-semibold text-ink">
          Change password
        </h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mt-5 sm:max-w-sm">
            <label htmlFor="profile-new-password" className="auth-label">
              New password
            </label>
            <input
              id="profile-new-password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={busy}
              placeholder="Enter new password"
              className="auth-input"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2 font-semibold text-white disabled:opacity-50"
          >
            {changingPassword ? "Changing password..." : "Change password"}
          </button>
        </form>
      </section>
    </section>
  );
}

export default CompanyProfileDetails;
