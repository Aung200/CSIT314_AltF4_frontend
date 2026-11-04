//api
import client from "./client";

function get_company_designers(user_id) {
  return client.get(`/companies/${user_id}/designers`);
}

function register_designer(user_id, email, first_name, last_name) {
  return client.post(`/companies/${user_id}/designers`, {
    email,
    first_name,
    last_name,
  });
}

const CompanyAPI = {
  get_company_designers,
  register_designer,
};

export default CompanyAPI;
