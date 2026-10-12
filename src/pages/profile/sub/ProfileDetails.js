import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

function ProfileDetails() {
  const { isLoggedIn, profile } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const email = profile?.email;

  useEffect(() => {
    if (!isLoggedIn || !email) {
      setLoading(false);
      return undefined;
    }

    let isActive = true;
    setLoading(true);
    setError("");

    API.getUserDetails(email)
      .then((response) => {
        const user = response.data?.user ?? response.data;
        if (!user || typeof user !== "object" || Array.isArray(user)) {
          throw new Error("Profile details were returned in an unexpected format.");
        }
        if (isActive) setDetails(user);
      })
      .catch((requestError) => {
        if (isActive) {
          setError(
            requestError.response?.data?.detail?.message ||
              requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load your profile. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [email, isLoggedIn, retry]);

  if (!isLoggedIn || !email) {
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
  const fullName = [profileDetails?.first_name, profileDetails?.last_name]
    .filter(Boolean)
    .join(" ");
  const fields = [
    ["Email", profileDetails?.email || email],
    ["Phone number", profileDetails?.phone],
    ["Address", profileDetails?.address],
  ].filter(([, value]) => value);

  return (
    <section className="auth-card sm:max-w-3xl" aria-labelledby="profile-title">
      <p className="auth-eyebrow">Your account</p>
      <h1 id="profile-title">Profile details</h1>
      <p className="mb-8 text-ink/70">View your account information.</p>

      {loading && <p role="status" className="text-ink/70">Loading profile...</p>}
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <p>{error}</p>
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
        <dl className="grid gap-5 sm:grid-cols-2">
          {fullName && (
            <div className="rounded-xl border border-sage-200/60 p-4 sm:col-span-2">
              <dt className="text-sm font-medium text-ink/70">Name</dt>
              <dd className="mt-1 font-semibold text-ink">{fullName}</dd>
            </div>
          )}
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-sage-200/60 p-4">
              <dt className="text-sm font-medium text-ink/70">{label}</dt>
              <dd className="mt-1 break-words font-semibold text-ink">{value}</dd>
            </div>
          ))}
          {fields.length === 0 && !fullName && (
            <p className="text-ink/70 sm:col-span-2">No profile details are available.</p>
          )}
        </dl>
      )}
    </section>
  );
}

export default ProfileDetails;
