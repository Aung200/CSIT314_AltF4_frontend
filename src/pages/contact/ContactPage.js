//libraries
import { useEffect, useRef, useState } from "react";

//components
import { ToastContainer, toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";

//api
import API from "../../api/api";

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submissionPending = useRef(false);
  const confirmationTitle = useRef(null);

  useEffect(() => {
    if (submitted) confirmationTitle.current?.focus();
  }, [submitted]);

  const submitGenericEnquiry = async (event) => {
    event.preventDefault();
    if (submissionPending.current) return;

    const enquiryForm = event.currentTarget;
    if (!enquiryForm.reportValidity()) return;

    const form = new FormData(enquiryForm);
    const name = form.get("name").trim();
    const phone = form.get("phone").trim();
    const email = form.get("email").trim();
    const description = form.get("description").trim();

    if (!name || !phone || !email || !description) {
      toast.error("Please complete all fields before sending your enquiry.", { autoClose: 5000 });
      return;
    }

    submissionPending.current = true;
    setSending(true);

    try {
      await API.submit_generic_form(name, phone, email, description);
      setSubmitted(true);
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message =
        (typeof detail?.message === "string" && detail.message) ||
        (typeof error.response?.data?.message === "string" && error.response.data.message) ||
        (typeof detail === "string" && detail) ||
        "Unable to send your enquiry. Please try again.";
      toast.error(message, { autoClose: 5000 });
    } finally {
      submissionPending.current = false;
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <section className="auth-card sm:max-w-2xl text-center" aria-labelledby="contact-success-title">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sage-50 text-sage-700">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>
        <p className="auth-eyebrow">Enquiry received</p>
        <h1 id="contact-success-title" ref={confirmationTitle} tabIndex={-1} className="focus:outline-none">
          Your enquiry has been submitted
        </h1>
        <p className="text-ink/70">
          Thank you for getting in touch. We’ve received your message and will get back to you using the contact details you provided.
        </p>
      </section>
    );
  }

  return (
    <section className="auth-card sm:max-w-2xl" aria-labelledby="contact-title">
      <ToastContainer />
      <p className="auth-eyebrow">Let’s start a conversation</p>
      <h1 id="contact-title">Contact us</h1>
      <p className="mb-8 text-ink/70">
        Have a question, feedback, or a partnership enquiry? We’d love to hear from you.
      </p>
      <form onSubmit={submitGenericEnquiry} aria-label="Contact enquiry" aria-busy={sending}>
        <fieldset disabled={sending} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="auth-label">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                className="auth-input"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="auth-label">
                Phone number
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="auth-input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-email" className="auth-label">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="auth-input"
            />
          </div>
          <div>
            <label htmlFor="contact-description" className="auth-label">
              Your enquiry
            </label>
            <textarea
              id="contact-description"
              name="description"
              rows={5}
              required
              className="auth-input resize-y"
            />
          </div>
          <button type="submit" disabled={sending} className="auth-button">
            {sending ? "Sending enquiry..." : "Send enquiry"}
          </button>
        </fieldset>
      </form>
    </section>
  );
}

export default ContactPage;
