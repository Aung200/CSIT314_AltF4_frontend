//libraries
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

//components
import { Images, LayoutDashboard, Plus, Users } from "lucide-react";
import { ToastContainer } from "react-toastify";
import DesignStatistics from "../components/shared/DesignStatistics";
import DesignerDesignTableContent from "../components/shared/DesignerDesignTableContent";

//context
import { useAuth } from "../../../context/AuthContext";

//api
import API from "../../../api/api";

//utils
import getDesignError from "../../../utils/getDesignError";

// Temporary designer option until company designer selection is available.
const companyDesigners = [
  { id: "dce92d28-2868-42de-ad86-7025ac745641", email: "designernew@gmail.com" },
];

const tabs = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "designs", label: "Designs", icon: Images },
  { id: "designers", label: "Designers", icon: Users },
];

function CompanyDashboardPage() {
  const { isLoggedIn, role, profile } = useAuth();
  const accountId = isLoggedIn && role === 2 ? profile?.id : null;
  const [resolvedCompany, setResolvedCompany] = useState(null);
  const resolvedCompanyId = resolvedCompany?.accountId === accountId ? resolvedCompany.id : null;
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState("");
  const [companyRetry, setCompanyRetry] = useState(0);

  useEffect(() => {
    if (!accountId) return;
    let active = true;
    const loadCompany = async () => {
      setCompanyLoading(true);
      setCompanyError("");
      try {
        // The company designs endpoint currently needs the company record ID.
        const companyResponse = await API.getCompanyDetailsAPI(accountId);
        if (!active) return;
        const company = companyResponse.data?.company ?? companyResponse.data;
        if (!company?.id) throw new Error("Unable to identify your company.");
        setResolvedCompany({ accountId, id: company.id });
      } catch (error) {
        if (active) setCompanyError(getDesignError(error, "Unable to load company details. Please try again."));
      } finally {
        if (active) setCompanyLoading(false);
      }
    };
    loadCompany();
    return () => { active = false; };
  }, [accountId, companyRetry]);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.id === selectedTab) ? selectedTab : "overview";

  const selectTab = (id) => {
    setSearchParams((params) => {
      params.set("tab", id);
      return params;
    });
  };

  const navigateTabs = (event, index) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    document.getElementById(`company-tab-${tabs[nextIndex].id}`)?.focus();
    selectTab(tabs[nextIndex].id);
  };
  if (!isLoggedIn || role !== 2 || !profile?.id) return null;
  return (
    <section className="auth-card w-full max-w-none" aria-labelledby="dashboard-title">
      <ToastContainer />
      <p className="auth-eyebrow">Company dashboard</p>
      <h1 id="dashboard-title">Dashboard</h1>
      <p className="mb-8 text-ink/70">
        Create designs and manage your company’s designers.
      </p>
      <div role="tablist" aria-label="Company dashboard" className="flex gap-2 overflow-x-auto border-b border-sage-200/60 pb-3">
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button key={id} id={`company-tab-${id}`} type="button" role="tab" aria-selected={activeTab === id} aria-controls={`company-panel-${id}`} tabIndex={activeTab === id ? 0 : -1} onClick={() => selectTab(id)} onKeyDown={(event) => navigateTabs(event, index)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 font-semibold transition-colors ${activeTab === id ? "bg-sage-700 text-white" : "text-sage-700 hover:bg-sage-100"}`}>
            <Icon size={18} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
      <div id="company-panel-overview" role="tabpanel" aria-labelledby="company-tab-overview" hidden={activeTab !== "overview"} tabIndex={0} className="pt-6">
        {!resolvedCompanyId && (companyLoading ? <p role="status">Loading company details...</p> : <div role="alert"><p>{companyError || "Unable to load company details."}</p><button type="button" onClick={() => setCompanyRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>)}
        {activeTab === "overview" && resolvedCompanyId && <DesignStatistics key={resolvedCompanyId} companyId={resolvedCompanyId} />}
      </div>
      <div id="company-panel-designs" role="tabpanel" aria-labelledby="company-tab-designs" hidden={activeTab !== "designs"} tabIndex={0} className="pt-6">
        {!resolvedCompanyId && (companyLoading ? <p role="status">Loading company details...</p> : <div role="alert"><p>{companyError || "Unable to load company details."}</p><button type="button" onClick={() => setCompanyRetry((value) => value + 1)} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>)}
        {activeTab === "designs" && resolvedCompanyId && <DesignerDesignTableContent key={resolvedCompanyId} companyId={resolvedCompanyId} designers={companyDesigners} company />}
      </div>
      <div id="company-panel-designers" role="tabpanel" aria-labelledby="company-tab-designers" hidden={activeTab !== "designers"} tabIndex={0} className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-ink">Your company’s designers</h2>
          <Link to="/dashboard/designers/register" className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-ink">
            <Plus size={18} aria-hidden="true" /> Add designer
          </Link>
        </div>
        <div className="mt-6 rounded-2xl border border-sage-200/60 p-8 text-center">
          <Users size={32} className="mx-auto mb-4 text-sage-700" aria-hidden="true" />
          <p className="text-ink/70">Designer listing is not available yet. Use Add designer to register a designer account.</p>
        </div>
      </div>
    </section>
  );
}

export default CompanyDashboardPage;
