import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const HostCTA = () => {
  return (
    <section className="bg-white py-16">
      <div className="container-width">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--primary)] px-6 py-12 sm:px-10 lg:px-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--secondary)]/30 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex max-w-2xl gap-5">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--aqua)]/15 text-[var(--aqua)] sm:flex">
                <Building2 size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--aqua)]">
                  For workspace owners
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Have an amazing workspace?
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/65">
                  List your space on Flexo and connect with businesses looking
                  for flexible workspace.
                </p>
              </div>
            </div>

            <Link
              to="/register?role=owner"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--aqua)] px-5 py-3 text-sm font-bold text-[var(--primary)] transition hover:bg-white"
            >
              Become a Host
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostCTA;
