//libraries
import { Link, NavLink } from "react-router-dom";

//components
import { Building2, LayoutDashboard, LogOut, Paintbrush, Pencil, Shield, ShieldCheck } from "lucide-react";

const roleBadges = {
  0: { label: "Admin", icon: Shield, color: "bg-gray-100 text-gray-700" },
  1: { label: "Platform Management", icon: ShieldCheck, color: "bg-purple-100 text-purple-800" },
  2: { label: "Company", icon: Building2, color: "bg-blue-100 text-blue-800" },
  3: { label: "Designer", icon: Paintbrush, color: "bg-green-100 text-green-800" },
  4: { label: "Customer", color: "bg-amber-100 text-amber-800" },
};

function ProfileActions({ mobile = false, profileInitial, role, onNavigate, onLogout }) {
  const roleBadge = roleBadges[role] || { label: "Account", color: "bg-gray-100 text-gray-700" };
  const RoleIcon = roleBadge.icon;
  const showRoleBadge = role !== 4 && Boolean(roleBadges[role]);
  const profileLabel = showRoleBadge ? `Edit profile · ${roleBadge.label}` : "Edit profile";
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
        aria-label={profileLabel}
        title={profileLabel}
        className="group relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      >
        <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-sage-700 text-lg font-semibold text-white ring-1 ring-sage-200 transition-colors group-hover:bg-ink group-hover:ring-sage-700">
          <span aria-hidden="true">{profileInitial}</span>
          <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-sage-200 bg-white text-sage-700 shadow-sm transition-colors group-hover:bg-sage-50">
            <Pencil size={11} aria-hidden="true" />
          </span>
        </span>
        {showRoleBadge && <span title={roleBadge.label} className={`absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-sm ${roleBadge.color}`}>
          <RoleIcon size={11} aria-hidden="true" />
        </span>}
      </Link>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sage-200 text-sage-700 transition-colors hover:bg-sage-50"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ProfileActions;
