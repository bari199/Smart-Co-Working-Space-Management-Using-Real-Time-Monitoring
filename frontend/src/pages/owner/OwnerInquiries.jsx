import { useEffect, useState } from "react";
import { toast } from "sonner";

import Loading from "../../components/common/Loading";
import { api } from "../services/api";

const OwnerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      // IMPORTANT:
      // Backend route = /api/inquiries/owner/inquiries
      const data = await api("/inquiries/owner/inquiries");

      setInquiries(data?.inquiries || data?.data || []);
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

  /* =======================================================
     REPLY
  ======================================================= */

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
      toast.error(error?.message || "Failed to send reply");
    } finally {
      setReplyingId(null);
    }
  };

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = async (id) => {
    try {
      await api(`/inquiries/${id}/close`, {
        method: "PUT",
      });

      toast.success("Inquiry closed");

      await fetchInquiries();
    } catch (error) {
      toast.error(error?.message || "Failed to close inquiry");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-medium text-[var(--secondary)]">Owner</p>

          <h1 className="mt-1 text-3xl font-bold text-[var(--text)]">
            Owner Inquiries
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            Questions and workspace requests from your customers.
          </p>
        </div>

        {/* EMPTY */}
        {inquiries.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              No inquiries yet
            </h2>

            <p className="mt-2 text-[var(--muted)]">
              Customer inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry._id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                {/* TOP */}
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      {inquiry.space?.name || "Workspace Inquiry"}
                    </h2>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {inquiry.space?.location || "Location unavailable"}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-[var(--accent)]/30 px-3 py-1 text-sm font-medium capitalize text-[var(--primary)]">
                    {inquiry.status || "pending"}
                  </span>
                </div>

                {/* CUSTOMER */}
                <div className="mt-6 grid gap-4 rounded-xl bg-[var(--accent)]/10 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-[var(--muted)]">First Name</p>

                    <p className="mt-1 font-medium text-[var(--text)]">
                      {inquiry.firstName || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">Last Name</p>

                    <p className="mt-1 font-medium text-[var(--text)]">
                      {inquiry.lastName || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">Email</p>

                    <p className="mt-1 break-all font-medium text-[var(--text)]">
                      {inquiry.email || inquiry.user?.email || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">Mobile</p>

                    <p className="mt-1 font-medium text-[var(--text)]">
                      {inquiry.mobile || inquiry.user?.phone || "—"}
                    </p>
                  </div>
                </div>

                {/* REQUIREMENT */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border)] p-4">
                    <p className="text-xs text-[var(--muted)]">Space Type</p>

                    <p className="mt-1 font-semibold text-[var(--text)]">
                      {inquiry.spaceType ||
                        inquiry.space?.workspaceType ||
                        "Workspace"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] p-4">
                    <p className="text-xs text-[var(--muted)]">
                      Number of Seats
                    </p>

                    <p className="mt-1 font-semibold text-[var(--text)]">
                      {inquiry.seats || 0}
                    </p>
                  </div>
                </div>

                {/* MESSAGE */}
                {inquiry.message && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      Message
                    </p>

                    <p className="mt-2 rounded-xl border border-[var(--border)] p-4 text-sm leading-6 text-[var(--muted)]">
                      {inquiry.message}
                    </p>
                  </div>
                )}

                {/* OWNER REPLY */}
                {inquiry.reply && (
                  <div className="mt-5 rounded-xl bg-[var(--accent)]/10 p-5">
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      Your Reply
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text)]">
                      {inquiry.reply}
                    </p>
                  </div>
                )}

                {/* REPLY FORM */}
                {inquiry.status !== "closed" && (
                  <div className="mt-6 border-t border-[var(--border)] pt-5">
                    <textarea
                      value={replyingId === inquiry._id ? replyText : ""}
                      onFocus={() => {
                        setReplyingId(inquiry._id);
                      }}
                      onChange={(e) => {
                        setReplyingId(inquiry._id);
                        setReplyText(e.target.value);
                      }}
                      rows={3}
                      placeholder="Write a reply to the customer..."
                      className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                    />

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleReply(inquiry._id)}
                        disabled={
                          replyingId === inquiry._id && !replyText.trim()
                        }
                        className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Send Reply
                      </button>

                      <button
                        onClick={() => handleClose(inquiry._id)}
                        className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)]"
                      >
                        Close Inquiry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerInquiries;
