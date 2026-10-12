import axios from "axios";

const endpoint = "https://backend-52c7fa59.fastapicloud.dev";

function loginAPI(email, password) {
  return axios.post(`${endpoint}/users/login`, {
    email,
    password,
  });
}

function registerUserAPI(email, password, first_name, last_name, phone) {
  const role = 0;
  const address = "";
  const status = true;
  return axios.post(`${endpoint}/users/register`, {
    email,
    password,
    first_name,
    last_name,
    role,
    status,
    address,
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

function logoutAPI() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("profile");
}

function getUserDetails(email){
  return axios.get(`${endpoint}/users/${email}`);
}

// export function registerAPI(credentials) {
//   return sendCredentials("register", credentials);
// }

// export function registerAgentAPI(credentials) {
//   const url = process.env.REACT_APP_AGENT_REGISTER_URL;
//   if (!url) {
//     return Promise.reject(new Error("Agent registration is not available yet. Please try again later."));
//   }
//   return sendCredentials("register", credentials, url);
// }

// export async function getCompaniesAPI(signal) {
//   const url = process.env.REACT_APP_COMPANIES_URL;
//   if (!url) throw new Error("The company list is currently unavailable.");
//   const response = await fetch(url, { signal });
//   if (!response.ok) throw new Error("Unable to load companies. Please try again.");
//   const companies = await response.json();
//   if (!Array.isArray(companies) || companies.some((company) => !company || company.id == null || typeof company.name !== "string")) {
//     throw new Error("Unable to load companies. Please try again.");
//   }
//   return companies;
// }

export default {
  loginAPI,
  registerUserAPI,
  registerCompanyAPI,
  logoutAPI,
  getUserDetails,
  // changepwdAPI,
  // forgotpwdAPI,

  // userAPI,
  // updateProfileAPI,

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
