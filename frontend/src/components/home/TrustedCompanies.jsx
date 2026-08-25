const companies = [
  "NEXA",
  "TECHFLOW",
  "INNOVA",
  "WORKWISE",
  "CLOUDLAB",
  "NORTHSTAR",
];

const TrustedCompanies = () => {
  return (
    <section className="border-b border-[var(--border)] bg-white py-9">
      <div className="container-width">
        <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
          Trusted by teams and businesses
        </p>

        <div className="mt-7 grid grid-cols-2 items-center gap-5 sm:grid-cols-3 md:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company}
              className="text-center text-sm font-extrabold tracking-tight text-[var(--secondary)] opacity-75"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
