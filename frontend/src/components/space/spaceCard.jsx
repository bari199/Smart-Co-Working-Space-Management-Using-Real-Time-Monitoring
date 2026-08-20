import { Link } from "react-router-dom";

const SpaceCard = ({ space }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-1 hover:shadow-md">
      <div className="h-48 overflow-hidden bg-[var(--accent)]/20">
        {space.image ? (
          <img
            src={space.image}
            alt={space.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--secondary)]">
            No Image
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">
            {space.name}
          </h3>

          <span className="rounded-full bg-[var(--accent)]/30 px-3 py-1 text-xs font-medium text-[var(--primary)] dark:text-[var(--accent)]">
            {space.workspaceType || "Workspace"}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-[var(--muted)]">
          {space.description || "A comfortable workspace for your needs."}
        </p>

        <div className="space-y-1 text-sm text-[var(--muted)]">
          <p>
            <span className="font-medium text-[var(--text)]">Location:</span>{" "}
            {space.location}
          </p>

          <p>
            <span className="font-medium text-[var(--text)]">Capacity:</span>{" "}
            {space.capacity}
          </p>

          <p>
            <span className="font-medium text-[var(--text)]">Price:</span> ₹
            {space.price}
          </p>
        </div>

        <Link
          to={`/spaces/${space._id}`}
          className="mt-5 block rounded-lg bg-[var(--primary)] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SpaceCard;
