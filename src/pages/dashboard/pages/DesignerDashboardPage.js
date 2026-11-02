//libraries
import { useSearchParams } from "react-router-dom";

//components
import DesignStatistics from "../components/shared/DesignStatistics";
import { Images, LayoutDashboard, MessageCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import EnquiryList from "../components/shared/EnquiryList";
import DesignerDesignTable from "../components/designer/DesignerDesignTable";

const tabs = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "designs", label: "Your designs", icon: Images },
  { id: "enquiries", label: "Enquiries", icon: MessageCircle },
];

function DesignerDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") === "chats" ? "enquiries" : searchParams.get("tab");
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
    document.getElementById(`designer-tab-${tabs[nextIndex].id}`)?.focus();
    selectDashboardTab(tabs[nextIndex].id);
  };

  return (
    <section className="auth-card w-full max-w-none" aria-labelledby="dashboard-title">
      <ToastContainer />
      <p className="auth-eyebrow">Designer dashboard</p>
      <h1 id="dashboard-title">Dashboard</h1>
      <p className="mb-8 text-ink/70">Manage your work and respond to customer enquiries about your designs.</p>
      <div role="tablist" aria-label="Designer dashboard" className="flex gap-2 overflow-x-auto border-b border-sage-200/60 pb-3">
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            id={`designer-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`designer-panel-${id}`}
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
          id={`designer-panel-${id}`}
          role="tabpanel"
          aria-labelledby={`designer-tab-${id}`}
          hidden={activeTab !== id}
          tabIndex={0}
          className="pt-6"
        >
          {id === "overview" && activeTab === "overview" && <DesignStatistics />}
          {id === "designs" && <DesignerDesignTable active={activeTab === "designs"} />}
          {id === "enquiries" && <EnquiryList active={activeTab === "enquiries"} />}
        </div>
      ))}
    </section>
  );
}

export default DesignerDashboardPage;
