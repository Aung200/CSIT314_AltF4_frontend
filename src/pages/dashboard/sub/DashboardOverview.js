function DashboardOverview({ eyebrow, title, description, sections = [] }) {
  return (
    <section className="auth-card sm:max-w-3xl" aria-labelledby="dashboard-title">
      <p className="auth-eyebrow">{eyebrow}</p>
      <h1 id="dashboard-title">{title}</h1>
      <p className="mb-8 text-ink/70">{description}</p>
      {sections.length > 0 && (
        <div className="grid gap-5 border-t border-sage-200/60 pt-6 sm:grid-cols-2">
          {sections.map(({ title: sectionTitle, description: sectionDescription, icon: Icon }) => (
            <div key={sectionTitle} className="rounded-2xl border border-sage-200/60 p-5">
              <Icon size={24} className="mb-4 text-sage-700" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-ink">{sectionTitle}</h2>
              <p className="mt-2 text-sm text-ink/70">{sectionDescription}</p>
              <p className="mt-4 text-xs font-semibold text-sage-700">Coming soon</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardOverview;
