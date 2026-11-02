//api
import client from "./client";

function get_favourite_design_ids(user_id) {
  return client.get(`/favourites/user/${user_id}`);
}

function create_favourite(design_id, user_id) {
  return client.post("/favourites", null, { params: { design_id, user_id } });
}

const FavouriteAPI = {
  get_favourite_design_ids,
  create_favourite,
};

export default FavouriteAPI;
