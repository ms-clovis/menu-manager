import Axios from "axios";
const apiClient = Axios.create({
  baseURL: "https://ivif9ocw58.execute-api.us-east-1.amazonaws.com/prod",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json"
  }
});

export default {
  saveMenu(menuItems) {
    return apiClient.post("/menu", menuItems);
  }
};
