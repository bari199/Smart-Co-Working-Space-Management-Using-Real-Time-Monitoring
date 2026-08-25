const InquiryCard = ({ inquiry }) => {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">
            {inquiry.space?.name || "Workspace Inquiry"}
          </h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {inquiry.spaceType || "Workspace"}
            {" • "}
            {inquiry.seats || 0} seats
          </p>

          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {inquiry.message || "No additional requirements"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[var(--accent)]/30 px-3 py-1 text-xs font-medium text-[var(--primary)] dark:text-[var(--accent)]">
          {inquiry.status || "pending"}
        </span>
      </div>

      <div className="mt-5 grid gap-2 border-t border-[var(--border)] pt-4 text-sm sm:grid-cols-2">
        <p>
          <span className="font-medium">Name:</span> {inquiry.firstName}{" "}
          {inquiry.lastName}
        </p>

        <p>
          <span className="font-medium">Email:</span> {inquiry.email}
        </p>

        <p>
          <span className="font-medium">Mobile:</span> {inquiry.mobile}
        </p>

        <p>
          <span className="font-medium">Seats:</span> {inquiry.seats}
        </p>
      </div>

      {inquiry.reply && (
        <div className="mt-5 rounded-lg bg-[var(--accent)]/10 p-4">
          <p className="text-xs font-semibold text-[var(--secondary)]">
            Owner Reply
          </p>

          <p className="mt-1 text-sm leading-6">{inquiry.reply}</p>
        </div>
      )}
    </div>
  );
};

export default InquiryCard;
