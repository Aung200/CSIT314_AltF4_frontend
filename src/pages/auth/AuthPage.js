//libraries
import { Navigate, Route, Routes } from "react-router-dom";

//context
import { useAuth } from "../../context/AuthContext";

//pages
import PageNotFoundPage from "../error/PageNotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompanyRegisterPage from "./pages/CompanyRegisterPage";

function AuthPage() {
  const { isLoggedIn, setLogin } = useAuth();

  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={setLogin} />} />
      <Route path="register" element={isLoggedIn ? <Navigate to="/" replace /> : <RegisterPage onRegister={setLogin} />} />
      <Route path="register/company" element={isLoggedIn ? <Navigate to="/" replace /> : <CompanyRegisterPage onRegister={setLogin} />} />
      <Route path="*" element={<PageNotFoundPage />} />
    </Routes>
  );
}

export default AuthPage;
