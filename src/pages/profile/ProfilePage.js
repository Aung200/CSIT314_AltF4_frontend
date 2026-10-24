//libraries
import { Navigate, Route, Routes } from "react-router-dom";

//pages
import ProfileDetailsPage from "./sub/ProfileDetailsPage";
import CompanyProfileDetailsPage from "./sub/CompanyProfileDetailsPage";

function ProfilePage() {
  let role;
  try {
    role = JSON.parse(localStorage.getItem("role"));
  } catch {
    role = null;
  }
  const details = Number(role) === 2
    ? <CompanyProfileDetailsPage />
    : <ProfileDetailsPage />;

  return (
    <Routes>
      <Route index element={<Navigate to="details" replace />} />
      <Route path="/details" element={details} />
    </Routes>
  );
}

export default ProfilePage;
