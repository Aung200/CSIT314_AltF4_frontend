//libraries
import { Navigate, Route, Routes } from "react-router-dom";
//context
import { useAuth } from "../../context/AuthContext";
//components
import CompanyDashboard from "./sub/CompanyDashboard";
import RegisterDesigner from "./sub/RegisterDesigner";
import CustomerDashboard from "./sub/CustomerDashboard";
import DesignerDashboard from "./sub/DesignerDashboard";
import PlatformDashboard from "./sub/PlatformDashboard";
import DashboardOverview from "./sub/DashboardOverview";

function Dashboard() {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) return <Navigate to="/auth/login" replace />;
  const dashboards = {
    0: <DashboardOverview eyebrow="Admin dashboard" title="Dashboard" description="Your admin workspace." />,
    1: <PlatformDashboard />,
    2: <CompanyDashboard />,
    3: <DesignerDashboard />,
    4: <CustomerDashboard />,
  };
  const dashboard = dashboards[role] || (
    <DashboardOverview
      eyebrow="Your account"
      title="Dashboard"
      description="Your dashboard is unavailable because your account role could not be identified. Please log in again."
    />
  );

  return (
    <Routes>
      <Route index element={dashboard} />
      <Route path="designers" element={role === 2 ? <CompanyDashboard /> : <Navigate to="/dashboard" replace />} />
      <Route path="designers/register" element={role === 2 ? <RegisterDesigner /> : <Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default Dashboard;
