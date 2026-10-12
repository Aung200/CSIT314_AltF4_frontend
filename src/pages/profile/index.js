import { Navigate, Route, Routes } from "react-router-dom";
import ProfileDetails from "./sub/ProfileDetails";

function Profile() {
  return (
    <Routes>
      <Route index element={<Navigate to="details" replace />} />
      <Route path="/details" element={<ProfileDetails />} />
    </Routes>
  );
}

export default Profile;
