const brands = [
  { name: "WEWORK", type: "Global Workspaces" },
  { name: "AWFIS", type: "Flexible Offices" },
  { name: "REGUS", type: "Business Centres" },
  { name: "SMARTWORKS", type: "Managed Offices" },
  { name: "INDIQUBE", type: "Enterprise Spaces" },
  { name: "BHIVE", type: "Coworking Spaces" },
];

const CoworkingBrands = () => {
  return (
    <section className="section-padding bg-[var(--background)]">
      <div className="container-width">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Great spaces, trusted brands</p>

          <h2 className="section-title mt-2">
            Top coworking brands,
            <span className="text-[var(--secondary)]"> one place.</span>
          </h2>

          <p className="section-description mt-3">
            Discover flexible workspace options from established coworking
            operators and local workspace providers.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex min-h-[115px] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-3 text-center transition hover:border-[var(--accent)] hover:shadow-md"
            >
              <span className="text-sm font-black tracking-tight text-[var(--primary)]">
                {brand.name}
              </span>

              <span className="mt-2 text-[10px] font-medium text-[var(--muted)]">
                {brand.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoworkingBrands;
