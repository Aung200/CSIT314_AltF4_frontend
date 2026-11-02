//libraries
import { useSearchParams } from "react-router-dom";

//components
import DesignStatistics from "../components/shared/DesignStatistics";
import { Building2, LayoutDashboard, Tags, Users } from "lucide-react";
import { ToastContainer } from "react-toastify";
import CustomerTable from "../components/platform/CustomerTable";
import CompanyTable from "../components/platform/CompanyTable";
import CategoryTable from "../components/platform/CategoryTable";

const tabs = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "categories", label: "Categories", icon: Tags },
];

function PlatformDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.id === selectedTab) ? selectedTab : "overview";

  const selectDashboardTab = (id) => {
    setSearchParams((params) => {
      params.set("tab", id);
      return params;
    });
  };

  const navigateDashboardTabs = (event, index) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    document.getElementById(`platform-tab-${tabs[nextIndex].id}`)?.focus();
    selectDashboardTab(tabs[nextIndex].id);
  };

  return (
    <section className="auth-card w-full max-w-none" aria-labelledby="dashboard-title">
      <ToastContainer />
      <p className="auth-eyebrow">Platform management</p>
      <h1 id="dashboard-title">Dashboard</h1>
      <p className="mb-8 text-ink/70">
        Review customer and company accounts, and categories.
      </p>
      <div role="tablist" aria-label="Platform management" className="flex gap-2 overflow-x-auto border-b border-sage-200/60 pb-3">
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            id={`platform-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`platform-panel-${id}`}
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => selectDashboardTab(id)}
            onKeyDown={(event) => navigateDashboardTabs(event, index)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 font-semibold transition-colors ${activeTab === id ? "bg-sage-700 text-white" : "text-sage-700 hover:bg-sage-100"}`}
          >
            <Icon size={18} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
      {tabs.map(({ id }) => (
        <div
          key={id}
          id={`platform-panel-${id}`}
          role="tabpanel"
          aria-labelledby={`platform-tab-${id}`}
          hidden={activeTab !== id}
          tabIndex={0}
          className="pt-6"
        >
          {id === "overview" && activeTab === "overview" && <DesignStatistics />}
          {id === "customers" && (
            <CustomerTable active={activeTab === "customers"} />
          )}
          {id === "companies" && (
            <CompanyTable active={activeTab === "companies"} />
          )}
          {id === "categories" && (
            <CategoryTable active={activeTab === "categories"} />
          )}
        </div>
      ))}
    </section>
  );
}

export default PlatformDashboardPage;
