//api
import client from "./client";

function create_category(name, description) {
  return client.post("/categories", { name, description });
}

function get_categories() {
  return client.get("/categories");
}

function get_category(category_id) {
  return client.get(`/categories/${category_id}`);
}

function update_category(category_id, name, description) {
  return client.patch(`/categories/${category_id}`, { name, description });
}

function delete_category(category_id) {
  return client.delete(`/categories/${category_id}`);
}

const CategoryAPI = {
  create_category,
  get_categories,
  get_category,
  update_category,
  delete_category,
};

export default CategoryAPI;
