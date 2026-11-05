//libraries
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

//components
import { ArrowLeft, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import EnquiryStatusBadge from "../components/shared/EnquiryStatusBadge";

//api
import API from "../../../api/api";

//context
import { useAuth } from "../../../context/AuthContext";

//utils
import formatChatTime from "../../../utils/formatChatTime";

function EnquiryChatSessionPage() {
  const { enquiryNumber } = useParams();
  const { profile, role } = useAuth();
  const recipientRole = role === 3 ? "Customer" : "Designer";
  const userId = profile?.id;
  const sessionKey = `${role}/${userId}/${enquiryNumber}`;
  const [enquiry, setEnquiry] = useState(null);
  const enquiryId = enquiry?.enquiry_id;
  const [messages, setMessages] = useState([]);
  const conversationRef = useRef(null);
  const messageInputRef = useRef(null);
  const pendingActionRef = useRef(null);
  const pollingRequestRef = useRef(null);
  const [loadedSessionKey, setLoadedSessionKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const [participantNames, setParticipantNames] = useState({ sessionKey: null, names: {} });
  const recipientId = role === 3 ? enquiry?.user_id : enquiry?.designer_id;
  const participantIds = loadedSessionKey === sessionKey && enquiry
    ? [...new Set([recipientId, ...messages.map((message) => message.sender_id)]
      .filter((id) => typeof id === "string" && id && id !== userId))].sort().join(",")
    : "";
  const names = participantNames.sessionKey === sessionKey ? participantNames.names : {};
  const recipientName = names[recipientId] || participantIds.split(",").map((id) => names[id]).find(Boolean);
  const recipientLabel = recipientName || recipientRole;

  useEffect(() => {
    let isActive = true;

    const loadEnquiryChatSession = async () => {
      setLoading(true);
      setError("");
      setEnquiry(null);
      setMessages([]);
      setMessageText("");
      setMessageError("");
      setSending(false);
      setCompleting(false);
      setCompletionError("");
      setRefreshing(false);
      setRefreshError("");
      setLoadedSessionKey(sessionKey);

      if (userId == null || userId === "") {
        setError("We couldn't identify your account. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get_user_enquiries(userId, role);
        if (!isActive) return;
        if (!Array.isArray(response.data)) {
          throw new Error("Your enquiries were returned in an unexpected format.");
        }

        const selectedEnquiry = response.data.find((item) => item?.enquiry_number === enquiryNumber);
        if (!selectedEnquiry) {
          setError("This enquiry could not be found in your account.");
          return;
        }

        const chatResponse = await API.get_enquiry_messages(selectedEnquiry.enquiry_id);
        if (!isActive) return;
        if (!Array.isArray(chatResponse.data)) {
          throw new Error("Your messages were returned in an unexpected format.");
        }

        setEnquiry(selectedEnquiry);
        setMessages(chatResponse.data);
      } catch (error) {
        if (!isActive) return;
        const detail = error.response?.data?.detail;
        const message =
          detail?.message ||
          error.response?.data?.message ||
          (typeof detail === "string" ? detail : "") ||
          error.message ||
          "Unable to load this enquiry. Please try again.";
        setError(message);
        toast.error(message, { autoClose: 5000 });
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadEnquiryChatSession();
    return () => {
      isActive = false;
      if (pendingActionRef.current) pendingActionRef.current.cancelled = true;
      pendingActionRef.current = null;
      if (pollingRequestRef.current) pollingRequestRef.current.cancelled = true;
      pollingRequestRef.current = null;
    };
  }, [userId, role, enquiryNumber, sessionKey, retry]);

  useEffect(() => {
    if (!participantIds || !userId || ![3, 4].includes(role)) return;
    let active = true;
    setParticipantNames({ sessionKey, names: {} });
    const loadParticipantNames = async () => {
      const ids = participantIds.split(",");
      const results = await Promise.allSettled(ids.map((id) => API.getUserDetailsAPI(id)));
      if (!active) return;
      const loadedNames = {};
      results.forEach((result, index) => {
        if (result.status !== "fulfilled") return;
        const user = result.value.data?.user ?? result.value.data;
        if (user?.id !== ids[index]) return;
        const name = [user.first_name, user.last_name]
          .filter((part) => typeof part === "string" && part.trim())
          .map((part) => part.trim()).join(" ");
        if (name) loadedNames[user.id] = name;
      });
      setParticipantNames({ sessionKey, names: loadedNames });
    };
    loadParticipantNames();
    return () => { active = false; };
  }, [participantIds, sessionKey, userId, role, retry]);

  useEffect(() => {
    if (!loading && conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [loading, messages]);

  useEffect(() => {
    if (!sending) messageInputRef.current?.focus({ preventScroll: true });
  }, [sending]);

  const cancelConversationPoll = () => {
    if (!pollingRequestRef.current) return;
    pollingRequestRef.current.cancelled = true;
    pollingRequestRef.current = null;
    setRefreshing(false);
  };

  const sendEnquiryMessage = async (event) => {
    event.preventDefault();
    const message = messageText.trim();
    if (!message || pendingActionRef.current || !enquiry || enquiry.status === "Completed") return;

    cancelConversationPoll();
    const request = { cancelled: false };
    pendingActionRef.current = request;
    setSending(true);
    setMessageError("");
    let messageSent = false;

    try {
      await API.post_enquiry_message(userId, message, enquiry.enquiry_id, enquiry.design_id);
      if (request.cancelled) return;

      messageSent = true;
      setMessageText("");
      // Show the confirmed message immediately, then reload the server timestamps and replies.
      setMessages((current) => [...current, {
        sender_id: userId,
        message,
        enquiry_id: enquiry.enquiry_id,
        created_at: new Date().toISOString(),
        role,
      }]);

      const response = await API.get_enquiry_messages(enquiry.enquiry_id);
      if (request.cancelled) return;
      if (!Array.isArray(response.data)) {
        throw new Error("Your messages were returned in an unexpected format.");
      }
      setMessages(response.data);
    } catch (error) {
      if (request.cancelled) return;
      const detail = error.response?.data?.detail;
      const errorMessage =
        detail?.message ||
        error.response?.data?.message ||
        (typeof detail === "string" ? detail : "") ||
        "Unable to send your message. Please try again.";
      setMessageError(messageSent
        ? "Your message was sent, but replies could not be refreshed. The conversation will update automatically."
        : errorMessage);
    } finally {
      if (!request.cancelled) {
        pendingActionRef.current = null;
        setSending(false);
      }
    }
  };

  const refreshEnquiryConversation = useCallback(async () => {
    if (!enquiryId || pendingActionRef.current || pollingRequestRef.current) return;

    const request = { cancelled: false };
    pollingRequestRef.current = request;
    setRefreshing(true);
    setRefreshError("");

    try {
      const [chatResponse, enquiryResponse] = await Promise.all([
        API.get_enquiry_messages(enquiryId),
        API.get_user_enquiries(userId, role),
      ]);
      if (request.cancelled) return;
      if (!Array.isArray(chatResponse.data) || !Array.isArray(enquiryResponse.data)) {
        throw new Error("Your conversation was returned in an unexpected format.");
      }

      const updatedEnquiry = enquiryResponse.data.find((item) => item?.enquiry_id === enquiryId);
      if (!updatedEnquiry) throw new Error("This enquiry could not be found in your account.");

      // Keep the current message list when nothing changed, preserving its scroll position.
      setMessages((current) => JSON.stringify(current) === JSON.stringify(chatResponse.data) ? current : chatResponse.data);
      setEnquiry(updatedEnquiry);
    } catch (error) {
      if (request.cancelled) return;
      const detail = error.response?.data?.detail;
      const message =
        detail?.message ||
        error.response?.data?.message ||
        (typeof detail === "string" ? detail : "") ||
        "Unable to update the conversation. Retrying automatically.";
      setRefreshError(message);
    } finally {
      if (!request.cancelled) {
        pollingRequestRef.current = null;
        setRefreshing(false);
      }
    }
  }, [enquiryId, userId, role]);

  useEffect(() => {
    if (!enquiryId || loading || loadedSessionKey !== sessionKey) return undefined;

    const interval = setInterval(() => {
      refreshEnquiryConversation();
    }, 5000);

    return () => clearInterval(interval);
  }, [enquiryId, loading, loadedSessionKey, sessionKey, refreshEnquiryConversation]);

  const completeEnquiry = async () => {
    if (role !== 3 || !enquiry || enquiry.status === "Completed" || pendingActionRef.current) return;

    cancelConversationPoll();
    const request = { cancelled: false };
    pendingActionRef.current = request;
    setCompleting(true);
    setCompletionError("");

    try {
      await API.change_enquiry_status(enquiry.enquiry_id);
      if (request.cancelled) return;
      setEnquiry((current) => ({ ...current, status: "Completed" }));
      setMessageText("");
      setMessageError("");
    } catch (error) {
      if (request.cancelled) return;
      const detail = error.response?.data?.detail;
      const message =
        detail?.message ||
        error.response?.data?.message ||
        (typeof detail === "string" ? detail : "") ||
        "Unable to complete this enquiry. Please try again.";
      setCompletionError(message);
    } finally {
      if (!request.cancelled) {
        pendingActionRef.current = null;
        setCompleting(false);
      }
    }
  };

  const sendMessageOnEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  };

  const retryEnquiryChatSession = () => {
    setRetry((attempt) => attempt + 1);
  };

  const awaitingEnquiryDetails = loading || loadedSessionKey !== sessionKey;

  return (
    <section className="auth-card w-full max-w-none" aria-labelledby="enquiry-chat-title" aria-busy={awaitingEnquiryDetails}>
      <ToastContainer />
      <Link to="/dashboard?tab=enquiries" className="mb-6 inline-flex items-center gap-2 font-semibold text-sage-700 hover:text-ink">
        <ArrowLeft size={18} aria-hidden="true" /> Back to enquiries
      </Link>
      <p className="auth-eyebrow">{!awaitingEnquiryDetails && enquiry ? `Enquiry ${enquiry.enquiry_number}` : "Enquiry conversation"}</p>
      <h1 id="enquiry-chat-title">Enquiry chat</h1>
      {awaitingEnquiryDetails ? (
        <p role="status" className="py-10 text-center text-ink/70">Loading enquiry...</p>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-sage-200/60 p-8 text-center text-ink/70">
          <p>{error}</p>
          {userId != null && userId !== "" && (
            <button type="button" onClick={retryEnquiryChatSession} className="mt-3 font-semibold text-sage-700 underline">
              Try again
            </button>
          )}
        </div>
      ) : enquiry && (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-sage-200/60 p-5">
            <div className="min-w-0">
              <h2 className="break-words text-xl font-semibold text-ink">{enquiry.title}</h2>
              <p className="mt-1 break-words text-sm font-medium text-sage-700">{enquiry.company_name}</p>
              <p className="mt-2 text-sm text-ink/70">Chat with <span className="capitalize">{recipientLabel}</span> about this design.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <EnquiryStatusBadge status={enquiry.status} />
              {role === 3 && enquiry.status !== "Completed" && (
                <button
                  type="button"
                  onClick={completeEnquiry}
                  disabled={sending || completing}
                  className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 size={16} aria-hidden="true" /> {completing ? "Completing..." : "Mark as completed"}
                </button>
              )}
            </div>
          </div>
          {completionError && <p role="alert" className="mb-6 text-sm text-red-700">{completionError}</p>}
          <div className="overflow-hidden rounded-2xl border border-sage-200/60">
            <div className="border-b border-sage-200/60 px-5 py-4">
              <h2 className="font-semibold text-ink">Conversation</h2>
            </div>
            {refreshError && <p role="alert" className="border-b border-sage-200/60 px-5 py-3 text-sm text-red-700">{refreshError}</p>}
            <div
              ref={conversationRef}
              role="region"
              aria-label="Conversation messages"
              aria-busy={refreshing}
              tabIndex={0}
              className="h-96 max-h-[55vh] overflow-y-auto overscroll-contain bg-sage-50 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-700 sm:p-6"
            >
              {messages.length > 0 ? (
                <ol className="space-y-4" aria-label="Enquiry messages">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender_id === userId;

                    return (
                      <li key={`${message.sender_id}-${message.created_at}-${index}`} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%] ${isOwnMessage ? "rounded-br-sm bg-sage-700 text-white" : "rounded-bl-sm border border-sage-200/60 bg-white text-ink"}`}>
                          <p className={`mb-1 text-xs font-semibold capitalize ${isOwnMessage ? "text-white/80" : "text-sage-700"}`}>
                            {isOwnMessage ? "You" : names[message.sender_id] || recipientRole}
                          </p>
                          <p className="whitespace-pre-wrap break-words text-sm">{message.message}</p>
                          <time dateTime={message.created_at} className={`mt-2 block text-right text-xs ${isOwnMessage ? "text-white/70" : "text-ink/60"}`}>
                            {formatChatTime(message.created_at)}
                          </time>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <MessageCircle size={36} className="mb-4 text-sage-700" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-ink">No messages yet</h3>
                  <p className="mt-2 text-sm text-ink/70">Your conversation with <span className="capitalize">{recipientLabel}</span> will appear here.</p>
                </div>
              )}
            </div>
            {enquiry.status === "Completed" ? (
              <p className="border-t border-sage-200/60 p-5 text-center text-sm text-ink/70">
                This enquiry is completed. You can still view the conversation.
              </p>
            ) : (
              <form onSubmit={sendEnquiryMessage} aria-label="Send enquiry message" className="border-t border-sage-200/60 p-5">
                <label htmlFor="enquiry-message" className="auth-label">Message to <span className="capitalize">{recipientLabel}</span></label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  rows={3}
                  ref={messageInputRef}
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={sendMessageOnEnter}
                  disabled={sending || completing}
                  aria-describedby="enquiry-message-help"
                  placeholder="Type your message..."
                  className="auth-input resize-y disabled:cursor-not-allowed disabled:bg-sage-50"
                />
                <p id="enquiry-message-help" className="mt-2 text-xs text-ink/60">Enter to send. Shift+Enter for a new line.</p>
                {messageError && <p role="alert" className="mt-3 text-sm text-red-700">{messageError}</p>}
                <div className="mt-3 flex justify-end">
                  <button type="submit" disabled={sending || completing || !messageText.trim()} className="inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                    <Send size={16} aria-hidden="true" /> {sending ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default EnquiryChatSessionPage;
