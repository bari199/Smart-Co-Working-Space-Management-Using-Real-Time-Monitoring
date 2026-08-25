import SpaceCard from "./spaceCard";

const SpaceGrid = ({ spaces = [] }) => {
  if (!spaces.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <p className="text-[var(--muted)]">No workspaces found.</p>
      </div>
    );
  }

  return (
   
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      
      {spaces.map((space) => (
        <SpaceCard key={space._id} space={space} />
      ))}
    </div>
  );
};

export default SpaceGrid;
