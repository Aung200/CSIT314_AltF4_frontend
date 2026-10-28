export default function getNavigationLinkClassName({ isActive }) {
  return `rounded-lg px-4 py-3 text-base font-semibold tracking-wide transition-colors hover:bg-sage-50 hover:text-sage-700 ${isActive ? "bg-sage-50 text-sage-700" : "text-ink"}`;
}
