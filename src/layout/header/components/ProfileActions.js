//libraries
import { Link, NavLink } from "react-router-dom";

//components
import { LayoutDashboard, LogOut, Pencil } from "lucide-react";

function ProfileActions({ mobile = false, profileInitial, onNavigate, onLogout }) {
  return (
    <div className={mobile ? "my-2 flex items-center gap-3 px-3" : "flex items-center gap-3 px-3"}>
      <NavLink
        to="/dashboard"
        onClick={onNavigate}
        aria-label="Dashboard"
        title="Dashboard"
        className={({ isActive }) => `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors hover:bg-sage-50 ${isActive ? "border-sage-700 bg-sage-50 text-sage-700" : "border-sage-200 text-sage-700"}`}
      >
        <LayoutDashboard size={20} aria-hidden="true" />
      </NavLink>
      <Link
        to="/profile"
        onClick={onNavigate}
        aria-label="Edit profile"
        title="Edit profile"
        className="group relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-sage-700 text-lg font-semibold text-white ring-1 ring-sage-200 transition-colors hover:bg-ink hover:ring-sage-700"
      >
        <span aria-hidden="true">{profileInitial}</span>
        <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-sage-200 bg-white text-sage-700 shadow-sm transition-colors group-hover:bg-sage-50">
          <Pencil size={11} aria-hidden="true" />
        </span>
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
