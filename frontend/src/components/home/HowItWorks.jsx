import {
  CalendarCheck,
  Search,
  CreditCard,
  BriefcaseBusiness,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find your space",
    description:
      "Search by city, location, workspace type or your preferred setup.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose your time",
    description:
      "Select the date and hours that work best for you or your team.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Book securely",
    description:
      "Review your booking and complete the payment through a secure checkout.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Start working",
    description: "Arrive at your workspace and get straight to what matters.",
    icon: BriefcaseBusiness,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-width">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Simple by design</p>

          <h2 className="section-title mt-2">
            Find your workspace
            <span className="text-[var(--secondary)]">
              {" "}
              in four easy steps.
            </span>
          </h2>

          <p className="section-description mt-3">
            No complicated process. Search, choose, book and get to work.
          </p>
        </div>

        <div className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-5">
          <div className="absolute left-[12%] right-[12%] top-9 hidden border-t border-dashed border-[var(--accent)] md:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative z-10 text-center">
                <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-[var(--accent)] bg-[var(--background)] text-[var(--secondary)]">
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                <span className="mt-4 block text-[10px] font-black tracking-[0.18em] text-[var(--accent)]">
                  STEP {step.number}
                </span>

                <h3 className="mt-2 text-base font-bold text-[var(--text)]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-[230px] text-sm leading-6 text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
