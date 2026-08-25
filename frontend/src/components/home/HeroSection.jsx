import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Search, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[620px] overflow-hidden">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85"
        alt="Modern coworking workspace"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,27,35,0.94)_0%,rgba(6,38,49,0.76)_46%,rgba(6,38,49,0.32)_100%)]" />

      <div className="container-width relative flex min-h-[620px] items-center py-20">
        <div className="max-w-3xl">
          <span className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--aqua)] backdrop-blur">
            Flexible workspace marketplace
          </span>

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
            Find a workspace
            <span className="block text-[var(--aqua)]">
              that works for you.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Discover premium coworking spaces, private offices and meeting rooms
            across India — flexible, simple and built around your work.
          </p>

          {/* Search Box */}
          <div className="mt-8 rounded-2xl bg-white p-3 shadow-2xl">
            <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3">
                <MapPin
                  size={18}
                  className="shrink-0 text-[var(--secondary)]"
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Location
                  </p>

                  <input
                    type="text"
                    placeholder="City or area"
                    className="mt-0.5 w-full bg-transparent text-sm font-medium text-[var(--text)] outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3">
                <CalendarDays
                  size={18}
                  className="shrink-0 text-[var(--secondary)]"
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Date
                  </p>

                  <input
                    type="date"
                    className="mt-0.5 w-full bg-transparent text-sm font-medium text-[var(--text)] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3">
                <Users size={18} className="shrink-0 text-[var(--secondary)]" />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Space
                  </p>

                  <select className="mt-0.5 w-full bg-transparent text-sm font-medium text-[var(--text)] outline-none">
                    <option value="">Any space</option>
                    <option value="desk">Hot Desk</option>
                    <option value="private">Private Office</option>
                    <option value="meeting">Meeting Room</option>
                  </select>
                </div>
              </div>

              <Link
                to="/spaces"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
              >
                <Search size={17} />
                Search
              </Link>
            </div>
          </div>

          <Link
            to="/spaces"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[var(--aqua)]"
          >
            Explore all spaces
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
