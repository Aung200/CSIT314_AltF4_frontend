//api
import client from "./client";

function get_favourites() {
  return client.get("/favourites");
}

async function get_user_favourites(user_id) {
  const response = await client.get(`/favourites/user/${user_id}`);
  const items = response.data;
  if (!Array.isArray(items)) throw new Error("Unexpected favourite response.");
  if (!items.length) return response;
  if (items.every((item) => typeof item === "string" && item.trim())) {
    // Older customer responses contain design IDs, so resolve the record IDs
    // from the records endpoint until the customer response includes them.
    const records = await get_favourites();
    if (!Array.isArray(records.data)) throw new Error("Unexpected favourite records.");
    const byDesign = new Map(records.data.filter((item) => item?.user_id === user_id && item?.id && item?.design_id).map((item) => [item.design_id, item]));
    return { ...response, data: [...new Set(items)].map((design_id) => byDesign.get(design_id) || { id: null, user_id, design_id }) };
  }
  if (items.some((item) => !item?.id || !item?.design_id || item.user_id !== user_id)) throw new Error("Unexpected favourite records.");
  return response;
}

function create_favourite(design_id, user_id) {
  return client.post("/favourites", null, { params: { design_id, user_id } });
}

function delete_favourite(favourite_id) {
  if (!favourite_id) throw new Error("A favourite record ID is required.");
  return client.delete(`/favourites/${favourite_id}`);
}

const FavouriteAPI = {
  get_favourites,
  get_user_favourites,
  create_favourite,
  delete_favourite,
};

export default FavouriteAPI;
