//libraries
import { Link } from "react-router-dom";

//context
import { useAuth } from "../../../context/AuthContext";

function FooterContent() {
  const { hideAuthLink } = useAuth();
  return (
    <footer className="border-t border-sage-200/60 bg-sage-50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" aria-label="Houzz home" className="inline-block rounded-md">
              <img
                src={`${process.env.PUBLIC_URL}/houzzlogo.png`}
                alt="Houzz"
                width="2132"
                height="738"
                className="h-auto w-32 sm:w-36"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Inspiration for your space. Professionals for your vision.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16 lg:gap-24">
            <nav aria-label="Explore" className="flex flex-col items-start gap-3 text-base text-sage-700">
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Explore</h2>
              <Link to="/interior-designs" className="hover:text-ink hover:underline hover:underline-offset-4">Interior Designs</Link>
              <Link to="/companies" className="hover:text-ink hover:underline hover:underline-offset-4">Companies</Link>
              {!hideAuthLink && (
                <Link to="/auth/login" className="hover:text-ink hover:underline hover:underline-offset-4">Login / Sign up</Link>
              )}
            </nav>
            <nav aria-label="Information" className="flex flex-col items-start gap-3 text-base text-sage-700">
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink">Information</h2>
              <Link to="/about" className="hover:text-ink hover:underline hover:underline-offset-4">About Us</Link>
              <Link to="/contact" className="hover:text-ink hover:underline hover:underline-offset-4">Contact Us</Link>
              <Link to="/policy" className="hover:text-ink hover:underline hover:underline-offset-4">Policy</Link>
            </nav>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-sage-200/60 py-5 text-xs text-ink/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Houzz. All rights reserved.</p>
          <p>Thoughtful spaces. Inspired living.</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterContent;
