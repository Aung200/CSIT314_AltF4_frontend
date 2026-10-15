//libraries
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//api(controller)
import API from "../../../api/api";
//context
import { useAuth } from "../../../context/AuthContext";
//components
import { Pencil, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

function ProfileDetails() {
  const { isLoggedIn, profile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const id = profile?.id;
  const email = profile?.email;

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
        const response = await API.getUserDetails(id);
        if (!isActive) return;
        const user = response.data?.user ?? response.data;
        if (!user || typeof user !== "object" || Array.isArray(user)) {
          const message =
            "Profile details were returned in an unexpected format.";
          setError(message);
          toast.error(message, { autoClose: 5000 });
          return;
        }
        setDetails(user);
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
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const first_name = form.get("first_name").trim();
    const last_name = form.get("last_name").trim();
    const address = form.get("address").trim();
    const phone = form.get("phone").trim();

    setSaving(true);
    try {
      const response = await API.updateUserProfileAPI(
        id,
        first_name,
        last_name,
        address,
        phone,
      );
      const message =
        response.data?.detail?.message ||
        response.data?.message ||
        "Profile updated successfully.";
      toast.success(message, { autoClose: 5000 });
      setEditing(false);
      setRetry((attempt) => attempt + 1);
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
    if (changingPassword) return;
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
          <h1 id="profile-title">Profile details</h1>
        </div>
        {!loading && !error && !editing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sage-700 hover:bg-sage-100"
          >
            <Pencil size={18} /> Edit
          </button>
        )}
      </div>
      <p className="mb-8 text-ink/70">
        View and edit your account information.
      </p>

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
            <div>
              {editing ? (
                <>
                  <label htmlFor="profile-first_name" className="auth-label">
                    First name
                  </label>
                  <input
                    id="profile-first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    defaultValue={profileDetails.first_name || ""}
                    disabled={saving}
                    required
                    autoFocus
                    className="auth-input"
                  />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">First name</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">
                    {profileDetails.first_name || "Not provided"}
                  </p>
                </>
              )}
            </div>
            <div>
              {editing ? (
                <>
                  <label htmlFor="profile-last_name" className="auth-label">
                    Last name
                  </label>
                  <input
                    id="profile-last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    defaultValue={profileDetails.last_name || ""}
                    disabled={saving}
                    required
                    className="auth-input"
                  />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">Last name</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">
                    {profileDetails.last_name || "Not provided"}
                  </p>
                </>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-ink/70">Email</p>
              <p className="mt-1 break-words font-semibold text-ink">
                {profileDetails.email || email}
              </p>
            </div>
            <div>
              {editing ? (
                <>
                  <label htmlFor="profile-phone" className="auth-label">
                    Phone number
                  </label>
                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    defaultValue={profileDetails.phone || ""}
                    disabled={saving}
                    required
                    className="auth-input"
                  />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">
                    Phone number
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">
                    {profileDetails.phone || "Not provided"}
                  </p>
                </>
              )}
            </div>
            <div>
              {editing ? (
                <>
                  <label htmlFor="profile-address" className="auth-label">
                    Address
                  </label>
                  <textarea
                    id="profile-address"
                    name="address"
                    autoComplete="street-address"
                    defaultValue={profileDetails.address || ""}
                    disabled={saving}
                    rows={3}
                    className="auth-input"
                  />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">Address</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">
                    {profileDetails.address || "Not provided"}
                  </p>
                </>
              )}
            </div>
          </div>
          {editing && (
            <div className="mt-8 flex justify-end gap-3 border-t border-sage-200/60 pt-5">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-sage-200 px-5 py-2 font-semibold text-ink hover:bg-sage-100 disabled:opacity-50"
              >
                <X size={18} /> Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
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
              disabled={changingPassword}
              placeholder="Enter new password"
              className="auth-input"
            />
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2 font-semibold text-white disabled:opacity-50"
          >
            {changingPassword ? "Changing password..." : "Change password"}
          </button>
        </form>
      </section>
    </section>
  );
}

export default ProfileDetails;
