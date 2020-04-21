import Axios from "axios";
const apiClient = Axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json"
  }
});

export default {
  getMenuItems() {
    return apiClient.get("/menuItems");
  },
  saveMenuItem(menuItem) {
    return apiClient.post("/menuItems", menuItem);
  },
  deleteMenuItem(id) {
    return apiClient.delete("/menuItems/" + id);
  },
  editMenuItem(menuItem) {
    return apiClient.put("/menuItems/" + menuItem.id, menuItem);
  }
};
