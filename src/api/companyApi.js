//api
import client from "./client";

function register_designer(company_id, email, first_name, last_name) {
  return client.post(`/companies/${company_id}/designers`, {
    email,
    first_name,
    last_name,
  });
}

const CompanyAPI = {
  register_designer,
};

export default CompanyAPI;
