import React, { useEffect, useState } from "react";
import { ArrowLeft, Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getInquiryById } from "../services/adminApi";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminInquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Fetch Inquiry Details
  // ==============================
  useEffect(() => {
    const loadInquiry = async () => {
      try {
        setLoading(true);

        const response = await getInquiryById(id);

        console.log("INQUIRY DETAILS API RESPONSE:", response);

        // IMPORTANT:
        // api() already returns parsed JSON.
        // Therefore:
        // response.success
        // response.inquiry
        //
        // NOT:
        // response.data.success
        // response.data.inquiry

        if (response?.success) {
          setInquiry(response?.inquiry || null);
        } else {
          console.warn(
            "Inquiry details API returned unsuccessful response:",
            response,
          );

          setInquiry(null);
        }
      } catch (err) {
        console.error("FETCH INQUIRY DETAILS ERROR:", err);

        alert(err?.data?.message || err?.message || "Failed to load inquiry.");

        setInquiry(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadInquiry();
    }
  }, [id]);

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return <AdminLoader fullPage text="Loading inquiry..." />;
  }

  // ==============================
  // No Inquiry
  // ==============================
  if (!inquiry) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#041421]">
            Inquiry not found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The inquiry may have been deleted or does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/inquiries")}
            className="mt-5 rounded-xl bg-[#042630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#041421]"
          >
            Back to Inquiries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ==============================
          BACK BUTTON
      ============================== */}
      <button
        type="button"
        onClick={() => navigate("/admin/inquiries")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inquiries
      </button>

      {/* ==============================
          PAGE HEADER
      ============================== */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#4A7272]">
            Customer Communication
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#041421]">
            Inquiry Details
          </h1>

          {inquiry.subject && (
            <p className="mt-1 text-sm text-slate-500">{inquiry.subject}</p>
          )}
        </div>

        <StatusBadge status={inquiry.status} />
      </div>

      {/* ==============================
          MAIN CONTENT
      ============================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ==============================
            CUSTOMER MESSAGE
        ============================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-bold text-[#041421]">Customer Message</h2>

          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {inquiry.message || inquiry.description || "No message provided."}
            </p>
          </div>

          {/* Date information */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap gap-6 text-xs text-slate-400">
              {inquiry.createdAt && (
                <p>
                  Created: {new Date(inquiry.createdAt).toLocaleString("en-IN")}
                </p>
              )}

              {inquiry.updatedAt && inquiry.updatedAt !== inquiry.createdAt && (
                <p>
                  Updated: {new Date(inquiry.updatedAt).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ==============================
            SIDEBAR
        ============================== */}
        <div className="space-y-6">
          {/* ==============================
              CUSTOMER
          ============================== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#4A7272]" />

              <h2 className="font-bold text-[#041421]">Customer</h2>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <p className="font-semibold text-[#041421]">
                {inquiry.user?.name || "—"}
              </p>

              <p className="flex items-start gap-2 break-all text-slate-500">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />

                {inquiry.user?.email || "—"}
              </p>

              <p className="flex items-center gap-2 text-slate-500">
                <Phone className="h-4 w-4 shrink-0" />

                {inquiry.user?.phone || "—"}
              </p>
            </div>
          </section>

          {/* ==============================
              WORKSPACE
          ============================== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#4A7272]" />

              <h2 className="font-bold text-[#041421]">Workspace</h2>
            </div>

            <div className="mt-5">
              <p className="font-semibold text-[#041421]">
                {inquiry.space?.name || "—"}
              </p>

              <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{inquiry.space?.location || "—"}</span>
              </p>

              <p className="mt-2 text-sm capitalize text-slate-500">
                Type: {inquiry.space?.workspaceType || "—"}
              </p>

              {inquiry.space?.price !== undefined && (
                <p className="mt-2 text-sm font-semibold text-[#041421]">
                  Price / Day: ₹{inquiry.space.price}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiryDetails;
