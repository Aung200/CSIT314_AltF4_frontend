//components
import { Bell, Eye, Images, MessageCircle } from "lucide-react";
import DashboardOverview from "../components/DashboardOverview";

function DesignerDashboard() {
  return (
    <DashboardOverview
      eyebrow="Designer dashboard"
      title="Your designs"
      description="Manage your work and keep up with customer interest."
      sections={[
        { title: "Manage designs", description: "Create and update your designs.", icon: Images },
        { title: "Design views", description: "See how many views your designs receive.", icon: Eye },
        { title: "Like alerts", description: "Get notified when a customer likes your design.", icon: Bell },
        { title: "Customer enquiries", description: "See alerts when customers contact you about your designs.", icon: MessageCircle },
      ]}
    />
  );
}

export default DesignerDashboard;
