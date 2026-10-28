//api
import AuthAPI from "./authApi";
import ProfileAPI from "./profileApi";
import PlatformAPI from "./platformApi";
import ContactAPI from "./contactApi";
import EnquiryAPI from "./enquiryApi";
import CategoryAPI from "./categoryApi";
import DesignAPI from "./designApi";
import CompanyAPI from "./companyApi";

const API = {
  ...AuthAPI,
  ...ProfileAPI,
  ...PlatformAPI,
  ...ContactAPI,
  ...EnquiryAPI,
  ...CategoryAPI,
  ...DesignAPI,
  ...CompanyAPI,
};

export default API;
