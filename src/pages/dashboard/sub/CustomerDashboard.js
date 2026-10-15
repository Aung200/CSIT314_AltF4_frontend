//components
import { Heart } from "lucide-react";
import DashboardOverview from "../components/DashboardOverview";

function CustomerDashboard() {
  return (
    <DashboardOverview
      eyebrow="Customer dashboard"
      title="Favourite designs"
      description="Keep the designs you love together for your next project."
      sections={[
        { title: "Your favourites", description: "Revisit designs you have added to your favourites.", icon: Heart },
      ]}
    />
  );
}

export default CustomerDashboard;
