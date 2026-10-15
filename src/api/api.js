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
function getUserDetails(id) {
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
function getCompanyDetails(id) {
  return axios.get(`${endpoint}/companies/${id}`);
}

function updateCompanyProfileAPI(id, name, description, phone, website, address) {
  return axios.put(`${endpoint}/companies/update/${id}`, {
    name,
    description,
    phone,
    website,
    address,
  });
}

const API = {
  loginAPI,
  registerUserAPI,
  registerCompanyAPI,
  updatePasswordAPI,
  logoutAPI,
  
  getUserDetails,
  updateUserProfileAPI,
  
  getCompanyDetails,
  updateCompanyProfileAPI,
  // changepwdAPI,
  // forgotpwdAPI,

  // userAPI,

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
