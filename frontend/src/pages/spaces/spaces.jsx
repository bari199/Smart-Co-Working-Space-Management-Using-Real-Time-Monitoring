import { useEffect, useState } from "react";

import SpaceGrid from "../../components/space/SpaceGrid";
import Loading from "../../components/common/Loading";
import { getSpaces } from "../../services/spaceService";

const Spaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        setLoading(true);

        const data = await getSpaces();

        setSpaces(data.spaces || data.data || data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpaces();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
          Find your workspace
        </p>

        <h1 className="text-3xl font-bold md:text-4xl">Explore Workspaces</h1>

        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Discover comfortable and flexible workspaces that fit your needs.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      ) : (
        <SpaceGrid spaces={spaces} />
      )}
    </section>
  );
};

export default Spaces;
