import SpaceCard from "./spaceCard";

const SpaceGrid = ({ spaces = [] }) => {
  if (!spaces.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-12 text-center">
        <p className="text-sm font-medium text-[var(--text)]">
          No workspaces found.
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Try adding a workspace or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {spaces.map((space, index) => (
        <div key={space?._id} className="min-w-0">
          <SpaceCard space={space} />
        </div>
      ))}
    </div>
  );
};

export default SpaceGrid;
