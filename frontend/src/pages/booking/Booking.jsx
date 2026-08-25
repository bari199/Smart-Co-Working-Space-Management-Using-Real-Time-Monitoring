import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import BookingForm from "../../components/booking/BookingForm";
import Loading from "../../components/common/Loading";
import { getSpaceById } from "../services/spaceService";

const Booking = () => {
  const { id } = useParams();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpace = async () => {
      try {
        const response = await getSpaceById(id);

        setSpace(response?.space || response?.data || response);
      } catch (error) {
        console.error("Load workspace error:", error);

        toast.error(error?.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSpace();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!space) {
    return <div className="p-10 text-center">Workspace not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm text-[var(--secondary)]">Reservation</p>

          <h1 className="mt-1 text-3xl font-bold">{space.name}</h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Choose whether you want to submit a booking request or contact the
            workspace owner first.
          </p>
        </div>

        <BookingForm
          space={space}
          onSuccess={() => {
            // BookingForm handles the navigation.
          }}
        />
      </div>
    </div>
  );
};

export default Booking;
