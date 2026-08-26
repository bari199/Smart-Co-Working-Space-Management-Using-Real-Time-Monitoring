import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  Ruler,
  Wifi,
  Coffee,
  Car,
  Snowflake,
  Printer,
  Projector,
  Monitor,
  ShieldCheck,
  Sparkles,
  Building2,
} from "lucide-react";
import { getSpaceById } from "../services/spaceService";
import Loading from "../../components/common/Loading";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../context/authContext";

// Maps common amenity keywords to an icon. Falls back to Sparkles for
// anything we don't recognize so new amenities never render blank.
const AMENITY_ICON_MAP = [
  { match: ["wifi", "internet"], icon: Wifi },
  { match: ["coffee", "tea", "pantry", "cafe"], icon: Coffee },
  { match: ["parking", "car"], icon: Car },
  { match: ["ac", "air conditioning", "cooling"], icon: Snowflake },
  { match: ["print", "scanner"], icon: Printer },
  { match: ["projector", "screen"], icon: Projector },
  { match: ["monitor", "display"], icon: Monitor },
  { match: ["security", "cctv", "guard"], icon: ShieldCheck },
  { match: ["reception", "building", "lobby"], icon: Building2 },
];

const getAmenityIcon = (amenity = "") => {
  const lower = amenity.toLowerCase();
  const found = AMENITY_ICON_MAP.find(({ match }) =>
    match.some((keyword) => lower.includes(keyword)),
  );
  return found ? found.icon : Sparkles;
};

// Used only when the workspace record has no businessHours of its own,
// so the section always has something sensible to show.
const DEFAULT_BUSINESS_HOURS = [
  { day: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

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

  const businessHours = space.businessHours?.length
    ? space.businessHours
    : DEFAULT_BUSINESS_HOURS;

  const mapQuery = encodeURIComponent(space.location || space.name);

  // The booking / inquiry card is reused verbatim in the sidebar.
  const renderBookingActions = () => {
    if (!isAuthenticated) {
      return (
        <button
          onClick={() =>
            navigate("/login", {
              state: { from: `/spaces/${space._id}` },
            })
          }
          className="w-full rounded-lg bg-[var(--primary)] px-5 py-3 font-medium text-white"
        >
          Login to Book
        </button>
      );
    }

    if (isOwner) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--accent)]/10 p-4">
          <p className="font-medium text-[var(--text)]">
            This is your workspace
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            You cannot book your own workspace.
          </p>
          <button
            onClick={() => navigate("/owner/spaces")}
            className="mt-3 w-full rounded-lg border border-[var(--secondary)] px-4 py-2 text-sm font-medium text-[var(--secondary)]"
          >
            Manage My Spaces
          </button>
        </div>
      );
    }

    if (space.availability !== "available") {
      return (
        <button
          disabled
          className="w-full cursor-not-allowed rounded-lg bg-gray-400 px-5 py-3 font-medium text-white"
        >
          Space Unavailable
        </button>
      );
    }

    return (
      <div className="grid gap-3">
        <button
          onClick={() => navigate(`/spaces/${space._id}/book`)}
          className="w-full rounded-lg bg-[var(--primary)] px-5 py-3 font-medium text-white"
        >
          Book Now
        </button>
        <button
          onClick={() => navigate(`/spaces/${space._id}/inquiry`)}
          className="w-full rounded-lg border border-[var(--secondary)] px-5 py-3 font-medium text-[var(--secondary)]"
        >
          Make an Inquiry
        </button>
      </div>
    );
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* HEADER */}
        <div className="mb-6">
          <span className="rounded-full bg-[var(--accent)]/30 px-3 py-1 text-sm font-medium text-[var(--primary)] dark:text-[var(--accent)]">
            {space.workspaceType || "Workspace"}
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{space.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-[var(--muted)]">
            <MapPin size={16} className="shrink-0" />
            {space.location}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* MAIN CONTENT */}
          <div className="space-y-10 lg:col-span-2">
            {/* IMAGE (single) */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              {space.image ? (
                <img
                  src={space.image}
                  alt={space.name}
                  className="h-full max-h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[350px] items-center justify-center bg-[var(--accent)]/20 text-[var(--secondary)]">
                  No Image
                </div>
              )}
            </div>

            {/* ABOUT */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                About this workspace
              </h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {space.description ||
                  "No description provided for this workspace yet."}
              </p>
            </div>

            {/* AMENITIES */}
            {space.amenities?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">
                  Amenities
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {space.amenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm"
                      >
                        <Icon
                          size={18}
                          className="shrink-0 text-[var(--primary)]"
                        />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LOCATION */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                Location
              </h2>
              <p className="mt-3 flex items-start gap-2 text-[var(--muted)]">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[var(--primary)]"
                />
                {space.location}
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]">
                <iframe
                  title="Workspace location"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* BUSINESS HOURS */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                Business Hours
              </h2>
              <div className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                {businessHours.map((slot) => (
                  <div
                    key={slot.day}
                    className="flex items-center justify-between px-5 py-3.5 text-sm"
                  >
                    <span className="flex items-center gap-2 text-[var(--text)]">
                      <Clock size={16} className="text-[var(--primary)]" />
                      {slot.day}
                    </span>
                    <span className="text-[var(--muted)]">{slot.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR: quick facts + booking actions */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-2xl font-bold text-[var(--text)]">
                ₹{space.price}
                <span className="text-sm font-normal text-[var(--muted)]">
                  {" "}
                  / booking
                </span>
              </p>

              <div className="mt-5 space-y-3 border-t border-[var(--border)] pt-5 text-sm">
                <p className="flex items-center gap-2 text-[var(--muted)]">
                  <Users size={16} className="text-[var(--primary)]" />
                  Capacity:{" "}
                  <span className="text-[var(--text)]">{space.capacity}</span>
                </p>
                <p className="flex items-center gap-2 text-[var(--muted)]">
                  <Ruler size={16} className="text-[var(--primary)]" />
                  Area:{" "}
                  <span className="text-[var(--text)]">{space.area} sq ft</span>
                </p>
                <p className="flex items-center gap-2 text-[var(--muted)]">
                  <ShieldCheck size={16} className="text-[var(--primary)]" />
                  Availability:{" "}
                  <span className="capitalize text-[var(--text)]">
                    {space.availability}
                  </span>
                </p>
              </div>

              <div className="mt-6">{renderBookingActions()}</div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SpaceDetails;
