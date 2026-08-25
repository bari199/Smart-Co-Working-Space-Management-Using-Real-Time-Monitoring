import { ArrowRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

const SpaceCard = ({ space }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--accent)]/15">
        {space.image ? (
          <img
            src={space.image}
            alt={space.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[var(--secondary)]">
            No image
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[var(--text)]">
          {space.workspaceType || "Workspace"}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-bold text-[var(--text)]">
            {space.name}
          </h3>

          {space.rating && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--secondary)]">
              <Star size={13} fill="currentColor" />
              {space.rating}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-[var(--muted)]">
          <MapPin size={13} />
          {space.location}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-[var(--border)] pt-4">
          <div>
            <span className="text-lg font-extrabold text-[var(--text)]">
              ₹{space.price}
            </span>

            <span className="text-xs text-[var(--muted)]">/ day</span>
          </div>

          <Link
            to={`/spaces/${space._id}`}
            className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
          >
            View Space
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SpaceCard;
