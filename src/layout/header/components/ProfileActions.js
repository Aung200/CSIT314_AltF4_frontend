//libraries
import { Link, NavLink } from "react-router-dom";

//components
import { LogOut } from "lucide-react";

//utils
import getNavigationLinkClassName from "../../../utils/getNavigationLinkClassName";

function ProfileActions({ mobile = false, profileInitial, onNavigate, onLogout }) {
  return (
    <div className={mobile ? "my-2 flex items-center gap-3 px-3" : "flex items-center gap-3 px-3"}>
      <NavLink
        to="/dashboard"
        onClick={onNavigate}
        className={getNavigationLinkClassName}
      >
        Dashboard
      </NavLink>
      <Link
        to="/profile"
        onClick={onNavigate}
        aria-label="Profile"
        title="Profile"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sage-700 text-lg font-semibold text-white transition-colors hover:bg-ink"
      >
        {profileInitial}
      </Link>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
        className={mobile
          ? "inline-flex h-11 items-center justify-center rounded-xl border border-sage-200 px-4 text-sm font-semibold text-sage-700 transition-colors hover:bg-sage-50"
          : "inline-flex h-11 items-center justify-center rounded-xl border border-sage-200 px-4 text-sm font-semibold text-sage-700 transition-colors hover:bg-sage-50"}
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ProfileActions;
