//libraries
import { useState } from "react";

//api
import API from "../api/api";

//context
import AuthContext from "./AuthContextValue";

//utils
import getStoredProfile from "../utils/getStoredProfile";
import getCompanyApprovalMessage from "../utils/getCompanyApprovalMessage";

export { useAuth } from "../hooks/useAuth";

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(getStoredProfile);
  let role = null;
  try {
    const storedRole = JSON.parse(localStorage.getItem("role"));
    if (storedRole != null) role = Number(storedRole);
  } catch {
    role = null;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true"
    && (role !== 2 || !getCompanyApprovalMessage(profile?.status)));

  function setLogin(user) {
    if (Number(user?.role) === 2) {
      const message = getCompanyApprovalMessage(user.status);
      if (message) throw new Error(message);
    }
    if (user) {
      localStorage.setItem("profile", JSON.stringify(user));
      localStorage.setItem("role", JSON.stringify(user.role));
      setProfile(user);
    }
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  }

  function logout() {
    API.logoutAPI();
    setProfile(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, hideAuthLink: isLoggedIn, profile, role, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
