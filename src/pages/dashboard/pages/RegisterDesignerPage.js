//libraries
import { Link, Navigate } from "react-router-dom";

//components
import CompanyDesignerRegistration from "../components/company/CompanyDesignerRegistration";

//context
import { useAuth } from "../../../context/AuthContext";

function RegisterDesignerPage() {
  const { isLoggedIn, role, profile } = useAuth();
  if (!isLoggedIn) return <Navigate to="/auth/login" replace />;
  if (role !== 2) return <Navigate to="/dashboard" replace />;
  if (!profile?.id) return (
    <section className="auth-card" aria-labelledby="designer-register-title">
      <h1 id="designer-register-title">Add designer</h1>
      <p className="text-ink/70">Please sign in again to identify your company account.</p>
      <Link to="/auth/login" className="mt-4 inline-block font-semibold text-sage-700 underline">Go to login</Link>
    </section>
  );
  return <CompanyDesignerRegistration key={profile.id} companyId={profile.id} />;
}

export default RegisterDesignerPage;
