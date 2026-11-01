const statusStyles = {
  Reviewing: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
};

function DesignStatusBadge({ status = "Reviewing" }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default DesignStatusBadge;
