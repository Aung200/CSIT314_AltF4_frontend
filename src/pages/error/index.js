import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <section aria-labelledby="error-title" className="flex min-h-[65vh] items-center justify-center py-8">
      <div className="w-full max-w-xl rounded-3xl border border-sage-200/60 bg-white px-6 py-12 text-center shadow-[0_12px_40px_rgba(28,42,31,0.04)] sm:px-12 sm:py-16">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-sage-700">
          A little off the beaten path
        </p>
        <p aria-hidden="true" className="mb-6 text-8xl font-light tracking-tight text-sage-700 sm:text-9xl">
          404
        </p>
        <h1 id="error-title" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-base leading-relaxed text-ink/70">
          The page you’re looking for may have moved or no longer exists. Let’s find your way home.
        </p>
        <Link to="/" className="inline-flex items-center gap-3 rounded-full bg-sage-700 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-ink">
          Back to home <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}

export default PageNotFound;
