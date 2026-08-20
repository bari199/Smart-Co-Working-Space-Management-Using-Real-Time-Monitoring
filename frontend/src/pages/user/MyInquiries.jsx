import { useEffect, useState } from "react";
import { toast } from "sonner";

import InquiryCard from "../../components/inquiry/InquiryCard";
import Loading from "../../components/common/Loading";
import { getMyInquiries } from "../../services/inquiryService";

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const data = await getMyInquiries();

        setInquiries(data.inquiries || data.data || data || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInquiries();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Inquiries</h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          View your workspace inquiries and replies.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : inquiries.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-semibold">No inquiries yet</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Your inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry._id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInquiries;
