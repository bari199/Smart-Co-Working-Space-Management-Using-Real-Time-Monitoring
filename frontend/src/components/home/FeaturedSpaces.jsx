import { ArrowRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

const spaces = [
  {
    id: "premium-cabin",
    name: "Premium Private Cabin",
    city: "Bengaluru",
    price: "₹800",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "modern-office",
    name: "Modern Team Office",
    city: "Mumbai",
    price: "₹1,200",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "creative-space",
    name: "Creative Workspace",
    city: "Pune",
    price: "₹650",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "meeting-room",
    name: "Executive Meeting Room",
    city: "Delhi",
    price: "₹900",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
  },
];

const FeaturedSpaces = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Featured spaces</p>

            <h2 className="section-title mt-2">
              Workspaces ready
              <span className="text-[var(--secondary)]"> when you are.</span>
            </h2>

            <p className="section-description mt-3 max-w-xl">
              Explore carefully selected spaces designed for focused work,
              creative sessions, meetings and growing teams.
            </p>
          </div>

          <Link
            to="/spaces"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--secondary)]"
          >
            Browse all spaces
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((space) => (
            <article
              key={space.id}
              className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={space.image}
                  alt={space.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[var(--text)]">
                  Featured
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-bold text-[var(--text)]">
                    {space.name}
                  </h3>

                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--secondary)]">
                    <Star size={13} fill="currentColor" />
                    {space.rating}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-xs text-[var(--muted)]">
                  <MapPin size={13} />
                  {space.city}
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-[var(--border)] pt-4">
                  <div>
                    <span className="text-lg font-extrabold text-[var(--text)]">
                      {space.price}
                    </span>

                    <span className="text-xs text-[var(--muted)]">/ hour</span>
                  </div>

                  <Link
                    to={`/spaces/${space.id}`}
                    className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
                  >
                    View Space
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
