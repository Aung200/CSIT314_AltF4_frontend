//api
import client from "./client";

function getUserDetailsAPI(id) {
  return client.get(`/users/id/${id}`);
}

function updateUserProfileAPI(id, first_name, last_name, address, phone) {
  return client.put(`/users/update/${id}`, {
    first_name,
    last_name,
    address,
    phone,
  });
}

function getCompanyDetailsAPI(id) {
  return client.get(`/companies/${id}`);
}

function updateCompanyProfileAPI(
  id,
  name,
  description,
  phone,
  website,
  address,
) {
  return client.put(`/companies/update/${id}`, {
    name,
    description,
    phone,
    website,
    address,
  });
}

const ProfileAPI = {
  getUserDetailsAPI,
  updateUserProfileAPI,
  getCompanyDetailsAPI,
  updateCompanyProfileAPI,
};

export default ProfileAPI;
