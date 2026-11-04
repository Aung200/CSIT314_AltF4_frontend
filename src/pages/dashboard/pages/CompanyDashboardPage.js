//libraries
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

//components
import { Images, LayoutDashboard, Plus, Users } from "lucide-react";
import { ToastContainer } from "react-toastify";
import DesignStatistics from "../components/shared/DesignStatistics";
import CompanyDesignerTable from "../components/company/CompanyDesignerTable";
import DesignerDesignTableContent from "../components/shared/DesignerDesignTableContent";

//context
import { useAuth } from "../../../context/AuthContext";

//api
import API from "../../../api/api";

//utils
import getDesignError from "../../../utils/getDesignError";

const tabs = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "designs", label: "Designs", icon: Images },
  { id: "designers", label: "Designers", icon: Users },
];

function CompanyDashboardPage() {
  const { isLoggedIn, role, profile } = useAuth();
  const companyUserId = isLoggedIn && role === 2 ? profile?.id : null;
  const [designerResult, setDesignerResult] = useState(null);
  const [designerRetry, setDesignerRetry] = useState(0);
  const currentDesignerResult = designerResult?.companyUserId === companyUserId ? designerResult : null;
  const companyDesigners = currentDesignerResult?.items || [];
  const designersLoading = !currentDesignerResult;
  const designersError = currentDesignerResult?.error || "";
  const designersWarning = currentDesignerResult?.warning || "";

  useEffect(() => {
    if (!companyUserId) return;
    let active = true;
    const loadCompanyDesigners = async () => {
      setDesignerResult(null);
      try {
        const response = await API.get_company_designers(companyUserId);
        if (!active) return;
        const data = response.data;
        const items = Array.isArray(data) ? data : data?.items;
        if (!Array.isArray(items) || items.some((designer) => !(designer?.user_id || designer?.id))) throw new Error("Unexpected designer response.");
        const designers = [...new Map(items.map(({ user_id, id, email, first_name, last_name, name }) => {
          const designer = { id: user_id || id, email, first_name, last_name, name };
          return [designer.id, designer];
        })).values()];
        const profiles = await Promise.allSettled(designers.map((designer) => API.getUserDetailsAPI(designer.id)));
        if (!active) return;
        let unavailableEmails = 0;
        const designersWithEmails = designers.map((designer, index) => {
          const result = profiles[index];
          const user = result.status === "fulfilled" ? result.value.data?.user ?? result.value.data : null;
          if (user?.id === designer.id && typeof user.email === "string" && user.email.trim()) {
            return { ...designer, email: user.email.trim(), first_name: designer.first_name || user.first_name, last_name: designer.last_name || user.last_name };
          }
          if (!designer.email) unavailableEmails += 1;
          return designer;
        });
        setDesignerResult({ companyUserId, items: designersWithEmails, warning: unavailableEmails ? "Some designer emails could not be loaded." : "" });
      } catch (error) {
        if (active) setDesignerResult({ companyUserId, items: [], error: getDesignError(error, "Unable to load designers. Please try again.") });
      }
    };
    loadCompanyDesigners();
    return () => { active = false; };
  }, [companyUserId, designerRetry]);

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
        {activeTab === "overview" && <DesignStatistics key={companyUserId} />}
      </div>
      <div id="company-panel-designs" role="tabpanel" aria-labelledby="company-tab-designs" hidden={activeTab !== "designs"} tabIndex={0} className="pt-6">
        {activeTab === "designs" && <DesignerDesignTableContent key={companyUserId} companyUserId={companyUserId} designers={companyDesigners} designersLoading={designersLoading} designersError={designersError} onRetryDesigners={() => setDesignerRetry((value) => value + 1)} company />}
      </div>
      <div id="company-panel-designers" role="tabpanel" aria-labelledby="company-tab-designers" hidden={activeTab !== "designers"} tabIndex={0} className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-ink">Your company’s designers</h2>
          <Link to="/dashboard/designers/register" className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-ink">
            <Plus size={18} aria-hidden="true" /> Add designer
          </Link>
        </div>
        <CompanyDesignerTable designers={companyDesigners} loading={designersLoading} error={designersError} warning={designersWarning} onRetry={() => setDesignerRetry((value) => value + 1)} />
      </div>
    </section>
  );
}

export default CompanyDashboardPage;
