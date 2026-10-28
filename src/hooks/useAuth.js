//libraries
import { useContext } from "react";

//context
import AuthContext from "../context/AuthContextValue";

export function useAuth() {
  return useContext(AuthContext);
}
