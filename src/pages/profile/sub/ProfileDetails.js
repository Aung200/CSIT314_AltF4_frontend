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

    API.getUserDetails(id)
      .then((response) => {
        if (!isActive) return;
        const user = response.data?.user ?? response.data;
        if (!user || typeof user !== "object" || Array.isArray(user)) {
          const message = "Profile details were returned in an unexpected format.";
          setError(message);
          toast.error(message, { autoClose: 5000 });
          return;
        }
        if (isActive) setDetails(user);
      })
      .catch((requestError) => {
        if (isActive) {
          const message =
            requestError.response?.data?.detail?.message ||
              requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load your profile. Please try again.";
          setError(message);
          toast.error(message, { autoClose: 5000 });
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id, isLoggedIn, retry]);

  if (!isLoggedIn || id == null) {
    return (
      <section className="auth-card sm:max-w-3xl" aria-labelledby="profile-title">
        <p className="auth-eyebrow">Your account</p>
        <h1 id="profile-title">Profile</h1>
        <p className="text-ink/70">Log in to view your profile details.</p>
        <Link to="/auth/login" className="auth-button mt-6 inline-flex justify-center">
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const first_name = form.get("first_name").trim();
    const last_name = form.get("last_name").trim();
    const phone = form.get("phone").trim();
    const address = form.get("address").trim();
    const password = form.get("password");

    console.log("Profile details:", {
      id,
      email: profileDetails.email || email,
      first_name,
      last_name,
      phone,
      address,
      password,
    });
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
          <button type="button" onClick={handleEdit}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sage-700 hover:bg-sage-100">
            <Pencil size={18} /> Edit
          </button>
        )}
      </div>
      <p className="mb-8 text-ink/70">View and edit your account information.</p>

      {loading && <p role="status" className="text-ink/70">Loading profile...</p>}
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
                      required
                      autoFocus
                      className="auth-input"
                    />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">First name</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">{profileDetails.first_name || "Not provided"}</p>
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
                      required
                      className="auth-input"
                    />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">Last name</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">{profileDetails.last_name || "Not provided"}</p>
                </>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-ink/70">Email</p>
              <p className="mt-1 break-words font-semibold text-ink">{profileDetails.email || email}</p>
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
                      required
                      className="auth-input"
                    />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">Phone number</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">{profileDetails.phone || "Not provided"}</p>
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
                      rows={3}
                      className="auth-input"
                    />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">Address</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">{profileDetails.address || "Not provided"}</p>
                </>
              )}
            </div>
            <div>
              {editing ? (
                <>
                  <label htmlFor="profile-password" className="auth-label">
                    Password
                  </label>
                    <input
                      id="profile-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      defaultValue=""
                      placeholder="Enter new password"
                      className="auth-input"
                    />
                    <p className="mt-1 text-xs text-ink/60">Leave blank to keep your current password.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink/70">Password</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-semibold text-ink">{"••••••••"}</p>
                </>
              )}
            </div>
          </div>
          {editing && (
            <div className="mt-8 flex justify-end gap-3 border-t border-sage-200/60 pt-5">
              <button type="button" onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-full border border-sage-200 px-5 py-2 font-semibold text-ink hover:bg-sage-100 disabled:opacity-50">
                <X size={18} /> Cancel
              </button>
              <button type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2 font-semibold text-white disabled:opacity-50">
                <Save size={18} /> Save
              </button>
            </div>
          )}
        </form>
      )}
    </section>
  );
}

export default ProfileDetails;
