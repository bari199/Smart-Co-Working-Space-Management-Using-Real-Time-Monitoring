import { motion } from "framer-motion";
import { Mail, Phone, Users, MessageSquareText } from "lucide-react";

const InquiryCard = ({ inquiry }) => {
  const status = inquiry?.status || "pending";

  const statusStyles = {
    pending:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    approved:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    replied:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const currentStatusStyle =
    statusStyles[status.toLowerCase()] || statusStyles.pending;

  const fullName =
    `${inquiry?.firstName || ""} ${inquiry?.lastName || ""}`.trim() || "N/A";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
            {initials || "W"}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[var(--text)] sm:text-[15px]">
              {inquiry?.space?.name || "Workspace Inquiry"}
            </h3>

            <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
              {inquiry?.spaceType || "Workspace"}
              <span className="mx-1.5">•</span>
              {inquiry?.seats || 0} seats
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize sm:text-xs ${currentStatusStyle}`}
        >
          {status}
        </span>
      </div>

      {/* Message */}
      <div className="px-4 pb-4 sm:px-5">
        <div className="rounded-xl bg-[var(--background)] px-3.5 py-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[var(--muted)]">
            <MessageSquareText size={14} />
            <span className="text-[11px] font-semibold uppercase tracking-wide">
              Message
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-5 text-[var(--text)]">
            {inquiry?.message || "No additional requirements provided."}
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="border-t border-[var(--border)] px-4 py-3.5 sm:px-5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {/* Name */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surfaceAlt)] text-[var(--muted)]">
              <Users size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                Name
              </p>
              <p className="truncate text-xs font-medium text-[var(--text)]">
                {fullName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surfaceAlt)] text-[var(--muted)]">
              <Mail size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                Email
              </p>
              <p className="truncate text-xs font-medium text-[var(--text)]">
                {inquiry?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surfaceAlt)] text-[var(--muted)]">
              <Phone size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                Mobile
              </p>
              <p className="truncate text-xs font-medium text-[var(--text)]">
                {inquiry?.mobile || "N/A"}
              </p>
            </div>
          </div>

          {/* Seats */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surfaceAlt)] text-[var(--muted)]">
              <Users size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                Seats
              </p>
              <p className="text-xs font-medium text-[var(--text)]">
                {inquiry?.seats || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Reply */}
      {inquiry?.reply && (
        <div className="border-t border-[var(--border)] px-4 py-3.5 sm:px-5">
          <div className="rounded-xl border border-[var(--primary)]/15 bg-[var(--primary)]/5 px-3.5 py-3 dark:bg-[var(--primary)]/10">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
                <MessageSquareText size={13} />
              </div>

              <p className="text-[11px] font-semibold text-[var(--primary)]">
                Owner Reply
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-[var(--text)]">
              {inquiry.reply}
            </p>
          </div>
        </div>
      )}
    </motion.article>
  );
};

export default InquiryCard;
