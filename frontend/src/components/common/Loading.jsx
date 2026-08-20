const Loading = () => {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--secondary)]" />
    </div>
  );
};

export default Loading;
