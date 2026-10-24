//api
import client from "./client";

function get_user_enquiries(id, role) {
  return client.get(`/contact/lookup`, {
    params: role === 3 ? { designer_id: id } : { user_id: id },
  });
}

function get_enquiry_messages(id) {
  return client.get(`/contact/${id}/messages`);
}

function post_enquiry_message(sender_id, message, enquiry_id, design_id) {
  return client.post(`/contact/messages`, {
    sender_id,
    message,
    enquiry_id,
    design_id,
  });
}

function change_enquiry_status(id) {
  return client.patch(`/contact/${id}/complete`);
}

const EnquiryAPI = {
  get_user_enquiries,
  get_enquiry_messages,
  post_enquiry_message,
  change_enquiry_status,
};

export default EnquiryAPI;
