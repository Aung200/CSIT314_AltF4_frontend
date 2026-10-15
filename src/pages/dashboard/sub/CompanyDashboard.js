//libraries
import { Link } from "react-router-dom";

//components
import { Plus, Users } from "lucide-react";

function CompanyDashboard() {
  return (
    <section className="auth-card w-full max-w-none" aria-labelledby="dashboard-title">
      <p className="auth-eyebrow">Company dashboard</p>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 id="dashboard-title">Employees</h1>
        <Link
          to="/dashboard/designers/register"
          className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2 font-semibold text-white transition-colors hover:bg-ink"
        >
          <Plus size={18} /> Add designer
        </Link>
      </div>
      <p className="mb-8 text-ink/70">
        Register and manage your company’s designer employees.
      </p>
      <div className="border-t border-sage-200/60 pt-8 text-center">
        <Users size={32} className="mx-auto mb-4 text-sage-700" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ink">Your company’s designers</h2>
        <p className="mt-2 text-ink/70">
          Designer management is not available yet. Your designers will appear here once it is ready.
        </p>
      </div>
    </section>
  );
}

export default CompanyDashboard;
