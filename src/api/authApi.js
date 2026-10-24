//api
import client from "./client";

function loginAPI(email, password) {
  return client.post(`/users/login`, {
    email,
    password,
  });
}

function registerUserAPI(email, password, first_name, last_name, phone) {
  return client.post(`/users/register`, {
    email,
    password,
    first_name,
    last_name,
    phone,
  });
}

function registerCompanyAPI(
  name,
  description,
  phone,
  email,
  website,
  address,
  password,
) {
  return client.post(`/companies/register`, {
    name,
    description,
    phone,
    email,
    website,
    address,
    password,
  });
}

function updatePasswordAPI(id, new_password) {
  return client.put(`/users/update-password/${id}`, {
    new_password,
  });
}

function logoutAPI() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("profile");
}

const AuthAPI = {
  loginAPI,
  registerUserAPI,
  registerCompanyAPI,
  updatePasswordAPI,
  logoutAPI,
};

export default AuthAPI;
