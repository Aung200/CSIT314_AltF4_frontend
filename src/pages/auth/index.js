//libraries
import { Navigate, Route, Routes } from "react-router-dom";

//components
import PageNotFound from "../error/index";

//context
import { useAuth } from "../../context/AuthContext";

//pages
import Login from "./sub/Login";
import Register from "./sub/Register";
import CompanyRegister from "./sub/CompanyRegister";

function Auth() {
  const { isLoggedIn, setLogin } = useAuth();

  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={setLogin} />} />
      <Route path="register" element={isLoggedIn ? <Navigate to="/" replace /> : <Register onRegister={setLogin} />} />
      <Route path="register/company" element={isLoggedIn ? <Navigate to="/" replace /> : <CompanyRegister onRegister={setLogin} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Auth;
