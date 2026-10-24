//libraries
import axios from "axios";

const endpoint = "https://backend-52c7fa59.fastapicloud.dev";

//Authentication APIs
function loginAPI(email, password) {
  return axios.post(`${endpoint}/users/login`, {
    email,
    password,
  });
}

function registerUserAPI(email, password, first_name, last_name, phone) {
  return axios.post(`${endpoint}/users/register`, {
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
  return axios.post(`${endpoint}/companies/register`, {
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
  return axios.put(`${endpoint}/users/update-password/${id}`, {
    new_password,
  });
}

function logoutAPI() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("profile");
}

//User Profile APIs
function getUserDetailsAPI(id) {
  return axios.get(`${endpoint}/users/id/${id}`);
}

function updateUserProfileAPI(id, first_name, last_name, address, phone) {
  return axios.put(`${endpoint}/users/update/${id}`, {
    first_name,
    last_name,
    address,
    phone,
  });
}

//Company Profile APIs
function getCompanyDetailsAPI(id) {
  return axios.get(`${endpoint}/companies/${id}`);
}

function updateCompanyProfileAPI(
  id,
  name,
  description,
  phone,
  website,
  address,
) {
  return axios.put(`${endpoint}/companies/update/${id}`, {
    name,
    description,
    phone,
    website,
    address,
  });
}

//Platform Management User APIs
function get_customers(page, page_size, email = "") {
  return axios.get(`${endpoint}/platform/customers`, {
    params: {
      page,
      page_size,
      email: email.trim() || undefined,
    },
  });
}

function get_companies(page, page_size, email = "") {
  return axios.get(`${endpoint}/platform/companies`, {
    params: {
      page,
      page_size,
      email: email.trim() || undefined,
    },
  });
}

function update_company_status(id, status) {
  return axios.put(`${endpoint}/platform/updateStatus`, null, {
    params: {
      id,
      status,
    },
  });
}

//Contact Enquiry APIs
function submit_generic_form(name, phone, email, description) {
  return axios.post(`${endpoint}/contact/form`, {
    name,
    phone,
    email,
    description,
  });
}

function get_user_enquiries(id, role) {
  return axios.get(`${endpoint}/contact/lookup`, {
    params: role === 3 ? { designer_id: id } : { user_id: id },
  });
}

function get_enquiry_messages(id) {
  return axios.get(`${endpoint}/contact/${id}/messages`);
}

function post_enquiry_message(sender_id, message, enquiry_id, design_id) {
  return axios.post(`${endpoint}/contact/messages`, {
    sender_id,
    message,
    enquiry_id,
    design_id,
  });
}

function change_enquiry_status(id) {
  return axios.patch(`${endpoint}/contact/${id}/complete`);
}

const API = {
  loginAPI,
  registerUserAPI,
  registerCompanyAPI,
  updatePasswordAPI,
  logoutAPI,

  getUserDetailsAPI,
  updateUserProfileAPI,

  getCompanyDetailsAPI,
  updateCompanyProfileAPI,

  get_customers,
  get_companies,
  update_company_status,

  submit_generic_form,

  get_user_enquiries,
  get_enquiry_messages,
  post_enquiry_message,
  change_enquiry_status,
  // createProduct,
  // updateProduct,
  // addProductVariant,
  // updateProductVariant,
  // deleteProductVariant,
  // getProductById,
  // getAllProducts,
  // getAllMasterProducts,
  // deleteProductImg,
  // deleteProductSizeImg,
  // deleteProduct
};

export default API;
