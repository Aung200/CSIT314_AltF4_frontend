import { Images, Users } from "lucide-react";
import DashboardOverview from "./DashboardOverview";

function PlatformDashboard() {
  return (
    <DashboardOverview
      eyebrow="Platform management"
      title="Dashboard"
      description="Manage account and design statuses across the platform."
      sections={[
        { title: "User accounts", description: "Review user accounts and change their account status.", icon: Users },
        { title: "Design statuses", description: "Review designs and change their status.", icon: Images },
      ]}
    />
  );
}

export default PlatformDashboard;
