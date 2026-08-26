import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/common/Loading";
import { api } from "../services/api";

const OwnerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // =====================================================
  // FETCH INQUIRIES
  // =====================================================

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      const data = await api("/inquiries/owner/inquiries");

      setInquiries(
        data?.inquiries || data?.data?.inquiries || data?.data || [],
      );
    } catch (error) {
      console.error("Owner inquiries error:", error);

      toast.error(error?.message || "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // =====================================================
  // REPLY
  // =====================================================

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      setReplyingId(id);

      await api(`/inquiries/${id}/reply`, {
        method: "PUT",
        body: JSON.stringify({
          reply: replyText.trim(),
        }),
      });

      toast.success("Reply sent successfully");

      setReplyText("");
      setReplyingId(null);

      await fetchInquiries();
    } catch (error) {
      console.error("Reply error:", error);

      toast.error(error?.message || "Failed to send reply");
    } finally {
      setReplyingId(null);
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = async (id) => {
    try {
      await api(`/inquiries/${id}/close`, {
        method: "PUT",
      });

      toast.success("Inquiry closed");

      await fetchInquiries();
    } catch (error) {
      console.error("Close inquiry error:", error);

      toast.error(error?.message || "Failed to close inquiry");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <Loading />;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[var(--background)] px-3 py-5 sm:px-4">
      <div className="mx-auto max-w-6xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--secondary)]">
            Owner
          </p>

          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[var(--popover-foreground)] sm:text-3xl">
            Owner Inquiries
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Questions and workspace requests from your customers.
          </p>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {inquiries.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center">
            <h2 className="text-lg font-semibold text-[var(--popover-foreground)]">
              No inquiries yet
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Customer inquiries will appear here.
            </p>
          </div>
        ) : (
          /* =================================================
             INQUIRY LIST
          ================================================= */

          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry?._id}
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  shadow-sm
                "
              >
                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <div className="flex flex-col justify-between gap-2 border-b border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-[var(--popover-foreground)]">
                      {inquiry?.space?.name || "Workspace Inquiry"}
                    </h2>

                    <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                      {inquiry?.space?.location || "Location unavailable"}
                    </p>
                  </div>

                  <span
                    className="
                      w-fit
                      rounded-full
                      bg-[var(--accent)]/20
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      capitalize
                      text-[var(--primary)]
                    "
                  >
                    {inquiry?.status || "pending"}
                  </span>
                </div>

                {/* =================================================
                    CARD BODY
                ================================================= */}

                <div className="px-4 py-3">
                  {/* =================================================
                      CUSTOMER INFORMATION
                  ================================================= */}

                  <div
                    className="
                      grid
                      gap-2
                      rounded-lg
                      bg-[var(--accent)]/10
                      p-3
                      sm:grid-cols-2
                      lg:grid-cols-4
                    "
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] text-[var(--muted)]">
                        First Name
                      </p>

                      <p className="mt-0.5 truncate text-xs font-medium text-[var(--popover-foreground)]">
                        {inquiry?.firstName || "—"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] text-[var(--muted)]">
                        Last Name
                      </p>

                      <p className="mt-0.5 truncate text-xs font-medium text-[var(--popover-foreground)]">
                        {inquiry?.lastName || "—"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] text-[var(--muted)]">Email</p>

                      <p className="mt-0.5 truncate text-xs font-medium text-[var(--popover-foreground)]">
                        {inquiry?.email || inquiry?.user?.email || "—"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] text-[var(--muted)]">Mobile</p>

                      <p className="mt-0.5 truncate text-xs font-medium text-[var(--popover-foreground)]">
                        {inquiry?.mobile || inquiry?.user?.phone || "—"}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      REQUIREMENTS
                  ================================================= */}

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-[var(--border)] px-3 py-2.5">
                      <p className="text-[10px] text-[var(--muted)]">
                        Space Type
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-[var(--popover-foreground)]">
                        {inquiry?.spaceType ||
                          inquiry?.space?.workspaceType ||
                          "Workspace"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[var(--border)] px-3 py-2.5">
                      <p className="text-[10px] text-[var(--muted)]">
                        Number of Seats
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-[var(--popover-foreground)]">
                        {inquiry?.seats || 0}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      MESSAGE
                  ================================================= */}

                  {inquiry?.message && (
                    <div className="mt-3">
                      <p className="mb-1 text-xs font-semibold text-[var(--popover-foreground)]">
                        Message
                      </p>

                      <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
                        <p className="text-xs leading-5 text-[var(--muted)]">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      OWNER REPLY
                  ================================================= */}

                  {inquiry?.reply && (
                    <div className="mt-3 rounded-lg bg-[var(--accent)]/10 px-3 py-2.5">
                      <p className="text-xs font-semibold text-[var(--primary)]">
                        Your Reply
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--popover-foreground)]">
                        {inquiry.reply}
                      </p>
                    </div>
                  )}

                  {/* =================================================
                      REPLY FORM
                  ================================================= */}

                  {inquiry?.status !== "closed" && (
                    <div className="mt-3 border-t border-[var(--border)] pt-3">
                      <textarea
                        value={replyingId === inquiry?._id ? replyText : ""}
                        onFocus={() => {
                          setReplyingId(inquiry?._id);
                        }}
                        onChange={(e) => {
                          setReplyingId(inquiry?._id);
                          setReplyText(e.target.value);
                        }}
                        rows={2}
                        placeholder="Write a reply to the customer..."
                        className="
                          w-full
                          resize-none
                          rounded-lg
                          border
                          border-[var(--border)]
                          bg-[var(--surface)]
                          px-3
                          py-2
                          text-xs
                          text-[var(--popover-foreground)]
                          outline-none
                          placeholder:text-[var(--muted)]
                          focus:border-[var(--primary)]
                          focus:ring-1
                          focus:ring-[var(--primary)]/20
                        "
                      />

                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleReply(inquiry?._id)}
                          disabled={
                            replyingId === inquiry?._id && !replyText.trim()
                          }
                          className="
                            rounded-md
                            bg-[var(--primary)]
                            px-3.5
                            py-1.5
                            text-xs
                            font-semibold
                            text-[var(--primary-foreground)]
                            transition
                            hover:opacity-90
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {replyingId === inquiry?._id
                            ? "Sending..."
                            : "Send Reply"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleClose(inquiry?._id)}
                          className="
                            rounded-md
                            border
                            border-[var(--border)]
                            px-3.5
                            py-1.5
                            text-xs
                            font-semibold
                            text-[var(--popover-foreground)]
                            transition
                            hover:border-[var(--accent)]
                            hover:bg-[var(--background)]
                          "
                        >
                          Close Inquiry
                        </button>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      CLOSED STATUS
                  ================================================= */}

                  {inquiry?.status === "closed" && (
                    <div className="mt-3 border-t border-[var(--border)] pt-2">
                      <p className="text-[10px] font-medium text-[var(--muted)]">
                        This inquiry has been closed.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerInquiries;
