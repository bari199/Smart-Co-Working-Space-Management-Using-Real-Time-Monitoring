const InquiryCard = ({ inquiry }) => {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{inquiry.subject || "Inquiry"}</h3>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {inquiry.message || "No message"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[var(--accent)]/30 px-3 py-1 text-xs font-medium text-[var(--primary)] dark:text-[var(--accent)]">
          {inquiry.status || "Open"}
        </span>
      </div>

      {inquiry.reply && (
        <div className="mt-5 rounded-lg bg-[var(--accent)]/10 p-4">
          <p className="text-xs font-semibold text-[var(--secondary)]">
            Owner Reply
          </p>

          <p className="mt-1 text-sm">{inquiry.reply}</p>
        </div>
      )}
    </div>
  );
};

export default InquiryCard;
