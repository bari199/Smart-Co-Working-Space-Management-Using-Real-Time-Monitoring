const BookingSummary = ({ space, form }) => {
  const total = Number(form?.hours || 0) * Number(space?.price || 0);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold text-[var(--text)]">
        Booking Summary
      </h2>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Workspace</p>

          <p className="font-medium text-[var(--text)]">
            {space?.name || "Workspace"}
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--muted)]">Location</p>

          <p className="font-medium text-[var(--text)]">
            {space?.location || "—"}
          </p>
        </div>

        <div className="flex justify-between border-t border-[var(--border)] pt-4">
          <span className="text-[var(--muted)]">Price / hour</span>

          <span className="font-medium">${space?.price || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--muted)]">Hours</span>

          <span className="font-medium">{form?.hours || 0}</span>
        </div>

        <div className="flex justify-between border-t border-[var(--border)] pt-4">
          <span className="font-semibold">Total</span>

          <span className="text-xl font-bold text-[var(--primary)]">
            ${total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
