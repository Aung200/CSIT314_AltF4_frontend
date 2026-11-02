//libraries
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//components
import { MessageCircle, Send } from "lucide-react";

//api
import API from "../../../../api/api";

//context
import { useAuth } from "../../../../context/AuthContext";

function DesignEnquiryForm({ designId }) {
  const { isLoggedIn, profile, role } = useAuth();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messageRef = useRef(null);
  const requestRef = useRef(null);
  const userId = profile?.id;

  useEffect(() => {
    setFormOpen(false);
    setMessage("");
    setSending(false);
    return () => {
      if (requestRef.current) requestRef.current.cancelled = true;
      requestRef.current = null;
    };
  }, [designId, userId, role, isLoggedIn]);

  useEffect(() => {
    if (formOpen) messageRef.current?.focus();
  }, [formOpen]);

  const submitDesignEnquiry = async (event) => {
    event.preventDefault();
    if (!isLoggedIn || role !== 4 || !userId || requestRef.current) return;
    if (!message.trim()) {
      toast.error("Please enter a message for the designer.", { autoClose: 5000 });
      return;
    }
    const request = { cancelled: false };
    requestRef.current = request;
    setSending(true);
    try {
      // The backend creates the enquiry when its ID is null.
      await API.post_enquiry_message(userId, message.trim(), null, designId);
      if (request.cancelled) return;
      setMessage("");

      let chatPath = "/dashboard?tab=enquiries";
      try {
        const response = await API.get_user_enquiries(userId, role);
        if (request.cancelled) return;
        const matches = Array.isArray(response.data) ? response.data.filter((enquiry) => enquiry.design_id === designId && enquiry.status !== "Completed") : [];
        if (matches.length === 1 && matches[0].enquiry_number) {
          chatPath = `/dashboard/enquiries/${encodeURIComponent(matches[0].enquiry_number)}`;
        }
      } catch {
        // Delivery succeeded. The enquiries tab can load the new session again.
      }
      if (!request.cancelled) navigate(chatPath);
    } catch (error) {
      if (request.cancelled) return;
      const detail = error.response?.data?.detail;
      const errorMessage = (typeof detail === "string" ? detail : detail?.message) || error.response?.data?.message || "Unable to send your enquiry. Please try again.";
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      if (!request.cancelled) {
        requestRef.current = null;
        setSending(false);
      }
    }
  };

  return (
    <section aria-labelledby="design-enquiry-title" className="rounded-2xl border border-sage-200/60 bg-sage-50 p-5 sm:p-6">
      <h2 id="design-enquiry-title" className="text-lg font-semibold text-ink">Interested in this design?</h2>
      <p className="mb-5 mt-2 text-sm leading-relaxed text-ink/70">Get in touch with the designer to discuss your home and ideas.</p>
      {!isLoggedIn ? (
        <Link to="/auth/login" className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-3 font-semibold text-white hover:bg-ink"><MessageCircle size={18} aria-hidden="true" /> Log in to enquire</Link>
      ) : role !== 4 ? (
        <p className="text-sm text-ink/70">Sign in with a customer account to send an enquiry.</p>
      ) : !userId ? (
        <p className="text-sm text-ink/70">Please sign in again to send your enquiry.</p>
      ) : !formOpen ? (
        <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-3 font-semibold text-white hover:bg-ink"><MessageCircle size={18} aria-hidden="true" /> Enquire</button>
      ) : (
        <form onSubmit={submitDesignEnquiry} aria-label="Enquire about this design" aria-busy={sending}>
          <label htmlFor="new-design-enquiry-message" className="auth-label">Message to designer</label>
          <textarea id="new-design-enquiry-message" ref={messageRef} value={message} onChange={(event) => setMessage(event.target.value)} required disabled={sending} rows={5} placeholder="Tell the designer about your project..." className="auth-input resize-y disabled:opacity-50" />
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={() => setFormOpen(false)} disabled={sending} className="rounded-full border border-sage-200 px-5 py-2.5 font-semibold text-sage-700 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={sending || !message.trim()} className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2.5 font-semibold text-white hover:bg-ink disabled:opacity-50"><Send size={16} aria-hidden="true" />{sending ? "Sending..." : "Send enquiry"}</button>
          </div>
        </form>
      )}
    </section>
  );
}

export default DesignEnquiryForm;
