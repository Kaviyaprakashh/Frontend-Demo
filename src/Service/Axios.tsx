import axios from "axios";
const BASE_URL = window.appConfig.BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
});
export default instance;
