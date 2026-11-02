const enquiryStatusStyles = {
  Processing: "bg-blue-100 text-blue-800",
  Pending: "bg-amber-100 text-amber-800",
  Completed: "bg-green-100 text-green-800",
};

function EnquiryStatusBadge({ status }) {
  return (
    <span className={`inline-block shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${enquiryStatusStyles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default EnquiryStatusBadge;
