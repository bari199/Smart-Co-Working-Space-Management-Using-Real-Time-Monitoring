import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getSpaceById } from "../../services/spaceService";
import Loading from "../../components/common/Loading";

const SpaceDetails = () => {
  const { id } = useParams();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpace = async () => {
      try {
        setLoading(true);

        const data = await getSpaceById(id);

        setSpace(data.space || data.data || data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpace();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <Loading />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <h2 className="text-xl font-semibold">Workspace not found</h2>

          <p className="mt-2 text-[var(--muted)]">
            {error || "This workspace is no longer available."}
          </p>

          <Link
            to="/spaces"
            className="mt-5 inline-block rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to Workspaces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {space.image ? (
            <img
              src={space.image}
              alt={space.name}
              className="h-full min-h-[350px] w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[350px] items-center justify-center bg-[var(--accent)]/20 text-[var(--secondary)]">
              No Image
            </div>
          )}
        </div>

        <div>
          <span className="rounded-full bg-[var(--accent)]/30 px-3 py-1 text-sm font-medium text-[var(--primary)] dark:text-[var(--accent)]">
            {space.workspaceType || "Workspace"}
          </span>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{space.name}</h1>

          <p className="mt-4 leading-7 text-[var(--muted)]">
            {space.description}
          </p>

          <div className="mt-6 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p>
              <span className="font-semibold">Location:</span> {space.location}
            </p>

            <p>
              <span className="font-semibold">Area:</span> {space.area}
            </p>

            <p>
              <span className="font-semibold">Capacity:</span> {space.capacity}
            </p>

            <p>
              <span className="font-semibold">Price:</span> ₹{space.price}
            </p>
          </div>

          {space.amenities?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Amenities</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {space.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[var(--border)] bg-[var(--accent)]/10 px-3 py-1.5 text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            to="/login"
            className="mt-8 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Book This Space
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpaceDetails;
