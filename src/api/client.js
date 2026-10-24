//libraries
import axios from "axios";

const client = axios.create({
  baseURL: "https://backend-52c7fa59.fastapicloud.dev",
});

export default client;
