import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [hasRegistered, setHasRegistered] = useState(() => localStorage.getItem("hasRegistered") === "true");

  function handleLogin() {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  }

  function handleRegister() {
    localStorage.setItem("hasRegistered", "true");
    setHasRegistered(true);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, hideAuthLink: isLoggedIn || hasRegistered, handleLogin, handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
