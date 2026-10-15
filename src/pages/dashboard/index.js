//libraries
import { Navigate, Route, Routes } from "react-router-dom";

//components
import DashboardOverview from "./components/DashboardOverview";

//context
import { useAuth } from "../../context/AuthContext";

//pages
import CompanyDashboard from "./sub/CompanyDashboard";
import RegisterDesigner from "./sub/RegisterDesigner";
import CustomerDashboard from "./sub/CustomerDashboard";
import DesignerDashboard from "./sub/DesignerDashboard";
import PlatformDashboard from "./sub/PlatformDashboard";

function Dashboard() {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  let dashboard;

  if (role === 0) {
    dashboard = (
      <DashboardOverview
        eyebrow="Admin dashboard"
        title="Dashboard"
        description="Your admin workspace."
      />
    );
  } else if (role === 1) {
    dashboard = <PlatformDashboard />;
  } else if (role === 2) {
    dashboard = <CompanyDashboard />;
  } else if (role === 3) {
    dashboard = <DesignerDashboard />;
  } else if (role === 4) {
    dashboard = <CustomerDashboard />;
  } else {
    dashboard = (
      <DashboardOverview
        eyebrow="Your account"
        title="Dashboard"
        description="Your dashboard is unavailable because your account role could not be identified. Please log in again."
      />
    );
  }

  return (
    <Routes>
      <Route index element={dashboard} />
      <Route
        path="designers"
        element={role === 2 ? <CompanyDashboard /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="designers/register"
        element={role === 2 ? <RegisterDesigner /> : <Navigate to="/dashboard" replace />}
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default Dashboard;
