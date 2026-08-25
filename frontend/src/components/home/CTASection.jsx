import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1800&q=85"
        alt="Premium coworking office"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[rgba(4,27,35,0.82)]" />

      <div className="container-width relative py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--aqua)]">
          Ready when you are
        </p>

        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
          Find the right space for
          <span className="text-[var(--aqua)]"> your next big idea.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
          Browse flexible workspaces across India's leading business
          destinations.
        </p>

        <Link
          to="/spaces"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--aqua)] px-6 py-3.5 text-sm font-bold text-[var(--primary)] transition hover:bg-white"
        >
          Explore Spaces
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
