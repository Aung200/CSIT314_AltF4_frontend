//api
import client from "./client";

function get_customers(page, page_size, email = "") {
  return client.get(`/platform/customers`, {
    params: {
      page,
      page_size,
      email: email.trim() || undefined,
    },
  });
}

function get_companies(page, page_size, email = "") {
  return client.get(`/platform/companies`, {
    params: {
      page,
      page_size,
      email: email.trim() || undefined,
    },
  });
}

function update_company_status(id, status) {
  return client.put(`/platform/updateStatus`, null, {
    params: {
      id,
      status,
    },
  });
}

const PlatformAPI = {
  get_customers,
  get_companies,
  update_company_status,
};

export default PlatformAPI;
