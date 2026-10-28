//components
import DesignerDesignTableContent from "./DesignerDesignTableContent";

//context
import { useAuth } from "../../../context/AuthContext";

function DesignerDesignTable({ active = true }) {
  const { isLoggedIn, role, profile } = useAuth();
  if (!active || !isLoggedIn || role !== 3 || !profile?.id) return null;
  return <DesignerDesignTableContent key={profile.id} designerId={profile.id} />;
}

export default DesignerDesignTable;
