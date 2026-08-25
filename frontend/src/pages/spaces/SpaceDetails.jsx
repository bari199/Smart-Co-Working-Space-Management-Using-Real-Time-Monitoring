import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { getSpaceById } from "../services/spaceService";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/authContext";

const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpace = async () => {
      try {
        setLoading(true);

        const data = await getSpaceById(id);

        setSpace(data?.space || data?.data || data);
      } catch (error) {
        setError(error.message || "Failed to load workspace");
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

  /*
   * Check whether logged-in user owns this workspace.
   *
   * space.owner may be:
   * 1. ObjectId string
   * 2. populated object { _id, name, email }
   */
  const ownerId =
    typeof space.owner === "object" ? space.owner?._id : space.owner;

  const currentUserId = user?._id || user?.id;

  const isOwner =
    isAuthenticated &&
    currentUserId &&
    ownerId &&
    String(currentUserId) === String(ownerId);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* IMAGE */}
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

        {/* DETAILS */}
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
              <span className="font-semibold">Area:</span> {space.area} sq ft
            </p>

            <p>
              <span className="font-semibold">Capacity:</span> {space.capacity}
            </p>

            <p>
              <span className="font-semibold">Price:</span> ₹{space.price}
            </p>

            <p>
              <span className="font-semibold">Availability:</span>{" "}
              {space.availability}
            </p>
          </div>

          {/* AMENITIES */}
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

          {/* BOOKING ACTION */}
          <div className="mt-8">
            {!isAuthenticated ? (
              <button
                onClick={() =>
                  navigate("/login", {
                    state: {
                      from: `/spaces/${space._id}`,
                    },
                  })
                }
                className="rounded-lg bg-[var(--primary)] px-5 py-3 font-medium text-white"
              >
                Login to Book
              </button>
            ) : isOwner ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--accent)]/10 p-4">
                <p className="font-medium text-[var(--text)]">
                  This is your workspace
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  You cannot book your own workspace.
                </p>

                <button
                  onClick={() => navigate("/owner/spaces")}
                  className="mt-3 rounded-lg border border-[var(--secondary)] px-4 py-2 text-sm font-medium text-[var(--secondary)]"
                >
                  Manage My Spaces
                </button>
              </div>
            ) : space.availability !== "available" ? (
              <button
                disabled
                className="cursor-not-allowed rounded-lg bg-gray-400 px-5 py-3 font-medium text-white"
              >
                Space Unavailable
              </button>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => navigate(`/spaces/${space._id}/book`)}
                  className="rounded-lg bg-[var(--primary)] px-5 py-3 font-medium text-white"
                >
                  Book Now
                </button>

                <button
                  onClick={() => navigate(`/spaces/${space._id}/inquiry`)}
                  className="rounded-lg border border-[var(--secondary)] px-5 py-3 font-medium text-[var(--secondary)]"
                >
                  Make an Inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpaceDetails;
