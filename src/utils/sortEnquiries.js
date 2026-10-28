const enquiryStatusOrder = {
  Processing: 0,
  Pending: 1,
  Completed: 2,
};

export default function sortEnquiries(enquiries) {
  return [...enquiries].sort((first, second) => {
    const statusDifference = (enquiryStatusOrder[first.status] ?? 3)
      - (enquiryStatusOrder[second.status] ?? 3);

    return statusDifference || first.enquiry_number.localeCompare(second.enquiry_number, "en", { numeric: true });
  });
}
