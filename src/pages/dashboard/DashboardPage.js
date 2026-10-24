//libraries
import { Navigate, Route, Routes } from "react-router-dom";

//components
import DashboardOverview from "./components/DashboardOverview";

//context
import { useAuth } from "../../context/AuthContext";

//pages
import CompanyDashboardPage from "./sub/CompanyDashboardPage";
import RegisterDesignerPage from "./sub/RegisterDesignerPage";
import CustomerDashboardPage from "./sub/CustomerDashboardPage";
import DesignerDashboardPage from "./sub/DesignerDashboardPage";
import PlatformDashboardPage from "./sub/PlatformDashboardPage";

function DashboardPage() {
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
    dashboard = <PlatformDashboardPage />;
  } else if (role === 2) {
    dashboard = <CompanyDashboardPage />;
  } else if (role === 3) {
    dashboard = <DesignerDashboardPage />;
  } else if (role === 4) {
    dashboard = <CustomerDashboardPage />;
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
        element={role === 2 ? <CompanyDashboardPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="designers/register"
        element={role === 2 ? <RegisterDesignerPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default DashboardPage;
