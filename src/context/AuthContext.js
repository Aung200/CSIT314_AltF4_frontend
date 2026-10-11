import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
 
  function setLogin() {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, hideAuthLink: isLoggedIn , setLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
