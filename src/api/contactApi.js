//api
import client from "./client";

function submit_generic_form(name, phone, email, description) {
  return client.post(`/contact/form`, {
    name,
    phone,
    email,
    description,
  });
}

const ContactAPI = {
  submit_generic_form,
};

export default ContactAPI;
