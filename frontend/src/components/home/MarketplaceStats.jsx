const stats = [
  {
    value: "1,800+",
    label: "Workspaces",
  },
  {
    value: "25+",
    label: "Cities",
  },
  {
    value: "1,000+",
    label: "Businesses",
  },
  {
    value: "4.8/5",
    label: "Average Rating",
  },
];

const MarketplaceStats = () => {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--background)]">
      <div className="container-width grid grid-cols-2 divide-x divide-y divide-[var(--border)] sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-10 text-center sm:px-6">
            <p className="text-3xl font-black tracking-tight text-[var(--primary)] sm:text-4xl">
              {stat.value}
            </p>

            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketplaceStats;
