import { BadgeCheck, Clock3, CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified workspaces",
    description: "Discover spaces reviewed for quality and reliability.",
  },
  {
    icon: Clock3,
    title: "Flexible booking",
    description:
      "Book by the hour, day or according to the space availability.",
  },
  {
    icon: CreditCard,
    title: "Transparent pricing",
    description: "See clear pricing before you confirm your booking.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description: "Simple and secure online payments for every booking.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-[var(--primary)]">
      <div className="container-width">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aqua)]">
              Why Flexo
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
              A better way to find
              <span className="block text-[var(--aqua)]">
                your next workspace.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">
              Whether you need a quiet desk for a few hours or a professional
              office for your growing team, Flexo makes the search simple.
            </p>

            <Link
              to="/spaces"
              className="mt-7 inline-flex rounded-lg bg-[var(--aqua)] px-5 py-3 text-sm font-bold text-[var(--primary)] transition hover:bg-white"
            >
              Explore Workspaces
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--aqua)]/15 text-[var(--aqua)]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
