function CompanyDesignerTable({ designers, loading, error, warning, onRetry }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-sage-200/60" aria-busy={loading}>
      {loading ? <p role="status" className="p-8 text-center text-ink/70">Loading designers...</p> : error ? (
        <div role="alert" className="p-8 text-center"><p>{error}</p><button type="button" onClick={onRetry} className="mt-3 font-semibold text-sage-700 underline">Try again</button></div>
      ) : designers.length ? (
        <>
        {warning && <div role="status" className="border-b border-sage-200/60 bg-sage-50 px-5 py-3 text-sm text-ink/70"><p>{warning}</p><button type="button" onClick={onRetry} className="mt-2 font-semibold text-sage-700 underline">Retry emails</button></div>}
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Your company's designers</caption>
          <thead className="bg-sage-50"><tr><th scope="col" className="px-5 py-4 font-semibold text-ink">Name</th><th scope="col" className="px-5 py-4 font-semibold text-ink">Email</th></tr></thead>
          <tbody>{designers.map((designer) => (
            <tr key={designer.id} className="border-t border-sage-200/60">
              <td className="px-5 py-4 text-ink">{[designer.first_name, designer.last_name].filter(Boolean).join(" ") || designer.name || "Not provided"}</td>
              <td className="break-all px-5 py-4 text-ink/70">{designer.email || "Not provided"}</td>
            </tr>
          ))}</tbody>
        </table>
        </>
      ) : <p className="p-8 text-center text-ink/70">No designers yet. Use Add designer to register your first designer.</p>}
    </div>
  );
}

export default CompanyDesignerTable;
