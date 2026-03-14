import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});
export const getScanHistory = (targetId) => {
  return api.get(`/scan/history/${targetId}`);
};
export default api;
