//api
import client from "./client";

function get_interior_designs(page = 1, page_size = 10, filters = {}) {
  return client.get("/interior-designs", { params: { page, page_size, ...filters } });
}

function get_designer_designs(designer_id, page = 1, page_size = 10, filters = {}) {
  return client.get(`/interior-designs/designer/${designer_id}`, {
    params: { page, page_size, ...filters },
  });
}

function get_company_designs(company_id, page = 1, page_size = 10, filters = {}) {
  return client.get(`/interior-designs/company/${company_id}`, {
    params: { page, page_size, ...filters },
  });
}

function get_design(design_id) {
  return client.get(`/interior-designs/${design_id}`);
}

function get_design_views() {
  return client.get("/views");
}

function create_design_view(design_id) {
  return client.post("/views", { design_id });
}

function create_design(design, images) {
  const form = new FormData();
  form.append("design", JSON.stringify(design));
  images.forEach((image) => form.append("images", image));
  return client.post("/interior-designs", form);
}

function update_design(design_id, design, images = [], remove_image_ids = []) {
  const form = new FormData();
  form.append("design", JSON.stringify(design));
  images.forEach((image) => form.append("images", image));
  remove_image_ids.forEach((id) => form.append("remove_image_ids", id));
  return client.patch(`/interior-designs/${design_id}`, form);
}

function delete_design(design_id) {
  return client.delete(`/interior-designs/${design_id}`);
}

const DesignAPI = {
  get_interior_designs,
  get_designer_designs,
  get_company_designs,
  get_design,
  create_design_view,
  get_design_views,
  create_design,
  update_design,
  delete_design,
};

export default DesignAPI;
