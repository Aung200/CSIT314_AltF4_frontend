//libraries
import { Navigate, Route, Routes } from "react-router-dom";
//components
import ProfileDetails from "./sub/ProfileDetails";
import CompanyProfileDetails from "./sub/CompanyProfileDetails";

function Profile() {
  let role;
  try {
    role = JSON.parse(localStorage.getItem("role"));
  } catch {
    role = null;
  }
  const details = Number(role) === 2
    ? <CompanyProfileDetails />
    : <ProfileDetails />;

  return (
    <Routes>
      <Route index element={<Navigate to="details" replace />} />
      <Route path="/details" element={details} />
    </Routes>
  );
}

export default Profile;
