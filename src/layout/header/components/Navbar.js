//libraries
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
//contexts
import { useAuth } from "../../../context/AuthContext";
//components
import { LogOut } from "lucide-react";

const linkStyle = ({ isActive }) =>
  `rounded-lg px-4 py-3 text-base font-semibold tracking-wide transition-colors hover:bg-sage-50 hover:text-sage-700 ${isActive ? "bg-sage-50 text-sage-700" : "text-ink"}`;

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef(null);
  const { isLoggedIn, profile, logout } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  function handleKeyDown(event) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggle.current?.focus();
    }
  }

  function handleLogout() {
    logout();
    setOpen(false);
  }

  const profileInitial = profile?.email?.trim()?.[0]?.toUpperCase() || "?";

  function ProfileActions({ mobile = false }) {
    return (
      <div className={mobile ? "my-2 flex items-center gap-3 px-3" : "flex items-center gap-3 px-3"}>
        <Link
          to="/profile"
          onClick={() => setOpen(false)}
          aria-label="Profile"
          title="Profile"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sage-700 text-lg font-semibold text-white transition-colors hover:bg-ink"
        >
          {profileInitial}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
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

  return (
    <header className="sticky top-0 z-50 border-b border-sage-200/60 bg-white/95 shadow-[0_2px_20px_rgba(28,42,31,0.04)] backdrop-blur-md" onKeyDown={handleKeyDown}>
      <div className="h-1 bg-sage-700" />
      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
          <Link to="/" aria-label="Houzz home" onClick={() => setOpen(false)} className="shrink-0 rounded-md">
            <img src={`${process.env.PUBLIC_URL}/houzzlogo.png`} alt="Houzz" width="2132" height="738" className="h-auto w-32 sm:w-36 lg:w-40" />
          </Link>
          <div className="hidden items-center gap-5 md:flex lg:gap-10">
            <NavLink to="/interior-designs" className={linkStyle}>
              Interior Designs
            </NavLink>
            <NavLink to="/companies" className={linkStyle}>
              Companies
            </NavLink>
          </div>
          {isLoggedIn ? (
            <div className="hidden md:block"><ProfileActions /></div>
          ) : (
            <NavLink to="/auth/login" className="hidden items-center gap-3 rounded-full bg-sage-700 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-ink md:inline-flex">
              Login / Sign up
            </NavLink>
          )}
          <button ref={toggle} type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"} className="flex h-11 w-11 items-center justify-center rounded-xl border border-sage-200 bg-sage-50 text-sage-700 md:hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-6 w-6" aria-hidden="true">
              {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        <div id="mobile-navigation" hidden={!open} className="border-t border-sage-200/60 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/interior-designs" onClick={() => setOpen(false)} className={linkStyle}>
              Interior Designs
            </NavLink>
            <NavLink to="/companies" onClick={() => setOpen(false)} className={linkStyle}>
              Companies
            </NavLink>
            {isLoggedIn ? (
              <ProfileActions mobile />
            ) : (
              <NavLink to="/auth/login" onClick={() => setOpen(false)} className="mt-3 flex items-center justify-between rounded-xl bg-sage-700 px-5 py-4 text-base font-semibold text-white hover:bg-ink">
                Login / Sign up
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
