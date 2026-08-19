const Home = () => {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Smart Co-Working Space
        </p>

        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Find the right workspace
          <span className="block text-blue-600">for your team</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-slate-600">
          Discover flexible co-working spaces based on your team size, area,
          budget, location and required amenities.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/spaces"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Find a Workspace
          </a>

          <a
            href="/register"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium hover:bg-slate-100"
          >
            Create Account
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
