import { useAuth } from "../../context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./sub/Login";
import Register from "./sub/Register";
import AgentRegister from "./sub/AgentRegister";
import PageNotFound from "../error/index";

function Auth() {
  const { isLoggedIn, handleRegister } = useAuth();

  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route path="register" element={isLoggedIn ? <Navigate to="/" replace /> : <Register onRegister={handleRegister} />} />
      <Route path="register/agent" element={isLoggedIn ? <Navigate to="/" replace /> : <AgentRegister onRegister={handleRegister} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Auth;
