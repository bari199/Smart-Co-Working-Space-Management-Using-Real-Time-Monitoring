import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const SpaceCard = ({ space }) => {
  return (
    <article className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surfaceAlt)]">
        {space?.image ? (
          <img
            src={space.image}
            alt={space?.name || "Workspace"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-[var(--muted)]">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="truncate text-base font-bold text-[var(--text)]">
          {space?.name || "Unnamed Workspace"}
        </h3>

        {/* Location */}
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-[var(--muted)]">
          <MapPin size={14} className="shrink-0 text-[var(--primary)]" />

          <span className="truncate">
            {space?.location || "Location not available"}
          </span>
        </div>

        {/* Description */}
        {space?.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-5 text-[var(--muted)]">
            {space.description}
          </p>
        )}

        {/* Bottom */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          {/* Price */}
          <div>
            <div className="flex items-baseline">
              <span className="text-lg font-extrabold text-[var(--text)]">
                ₹{Number(space?.price || 0).toLocaleString()}
              </span>

              <span className="ml-1 text-xs text-[var(--muted)]">/ day</span>
            </div>
          </div>

          {/* View Button */}
          <Link
            to={`/spaces/${space?._id}`}
            className="group/button inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--primary)] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90"
          >
            <span>View Space</span>

            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover/button:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SpaceCard;
