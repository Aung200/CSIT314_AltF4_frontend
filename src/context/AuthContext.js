//libraries
import { createContext, useContext, useState } from "react";
//api(Controller)
import API from "../api/api";

const AuthContext = createContext(null);

function getStoredProfile() {
  const storedProfile = localStorage.getItem("profile");
  if (!storedProfile) return null;

  try {
    return JSON.parse(storedProfile);
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [profile, setProfile] = useState(getStoredProfile);

  function setLogin(user) {
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
    <AuthContext.Provider value={{ isLoggedIn, hideAuthLink: isLoggedIn, profile, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
