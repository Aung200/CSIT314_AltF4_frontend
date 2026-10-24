//libraries
import { useSearchParams } from "react-router-dom";

//components
import { Bell, Eye, Images, MessageCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import EnquiryList from "../components/EnquiryList";

const tabs = [
  { id: "designs", label: "Your designs", icon: Images },
  { id: "enquiries", label: "Enquiries", icon: MessageCircle },
];

const designSections = [
  { title: "Manage designs", description: "Create and update your designs.", icon: Images },
  { title: "Design views", description: "See how many views your designs receive.", icon: Eye },
  { title: "Like alerts", description: "Get notified when a customer likes your design.", icon: Bell },
];

function DesignerDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") === "chats" ? "enquiries" : searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.id === selectedTab) ? selectedTab : "designs";

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
          {id === "designs" && (
            <div className="grid gap-5 sm:grid-cols-2">
              {designSections.map(({ title, description, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-sage-200/60 p-5">
                  <Icon size={24} className="mb-4 text-sage-700" aria-hidden="true" />
                  <h2 className="text-lg font-semibold text-ink">{title}</h2>
                  <p className="mt-2 text-sm text-ink/70">{description}</p>
                  <p className="mt-4 text-xs font-semibold text-sage-700">Coming soon</p>
                </div>
              ))}
            </div>
          )}
          {id === "enquiries" && <EnquiryList active={activeTab === "enquiries"} />}
        </div>
      ))}
    </section>
  );
}

export default DesignerDashboardPage;
