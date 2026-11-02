//api
import AuthAPI from "./authApi";
import ProfileAPI from "./profileApi";
import PlatformAPI from "./platformApi";
import ContactAPI from "./contactApi";
import EnquiryAPI from "./enquiryApi";
import CategoryAPI from "./categoryApi";
import DesignAPI from "./designApi";
import CompanyAPI from "./companyApi";
import FavouriteAPI from "./favouriteApi";

const API = {
  ...AuthAPI,
  ...ProfileAPI,
  ...PlatformAPI,
  ...ContactAPI,
  ...EnquiryAPI,
  ...CategoryAPI,
  ...DesignAPI,
  ...CompanyAPI,
  ...FavouriteAPI,
};

export default API;
