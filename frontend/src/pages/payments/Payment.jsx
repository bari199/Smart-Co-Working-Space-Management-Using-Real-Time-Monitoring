import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Loading from "../../components/common/Loading";

import { createPaymentOrder, verifyPayment } from "../services/paymentService";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(true);

  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setScriptLoading(false);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => {
        setScriptLoading(false);
      };

      script.onerror = () => {
        setScriptLoading(false);

        toast.error("Failed to load payment gateway");
      };

      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!bookingId) {
      toast.error("Invalid booking");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment gateway is not ready");
      return;
    }

    try {
      setLoading(true);

      const response = await createPaymentOrder(bookingId);

      const { order, key, payment } = response;

      const options = {
        key,

        amount: order.amount,

        currency: order.currency,

        name: "SmartSpace",

        description: "Workspace Booking Payment",

        order_id: order.id,

        handler: async function (paymentResponse) {
          try {
            toast.loading("Verifying payment...", {
              id: "payment-verification",
            });

            const verification = await verifyPayment({
              bookingId,

              razorpay_payment_id: paymentResponse.razorpay_payment_id,

              razorpay_order_id: paymentResponse.razorpay_order_id,

              razorpay_signature: paymentResponse.razorpay_signature,
            });

            toast.dismiss("payment-verification");

            if (verification.success) {
              toast.success("Payment successful!");

              navigate("/dashboard/bookings");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.dismiss("payment-verification");

            toast.error(error.message || "Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);

            toast.info("Payment cancelled");
          },
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          bookingId,
          paymentId: payment?.id || "",
        },

        theme: {
          color: "#062631",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);

        toast.error(response.error?.description || "Payment failed");

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      toast.error(error.message || "Unable to start payment");

      setLoading(false);
    }
  };

  if (scriptLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="border-b border-[var(--border)] p-6">
            <p className="text-sm font-medium text-[var(--secondary)]">
              Secure Payment
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">
              Complete Your Payment
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Your payment is securely processed through Razorpay.
            </p>
          </div>

          <div className="p-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--muted)]">Booking ID</p>

              <p className="mt-1 break-all font-medium text-[var(--text)]">
                {bookingId}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-[var(--accent)]/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  ₹
                </div>

                <div>
                  <p className="font-semibold text-[var(--text)]">
                    Razorpay Secure Checkout
                  </p>

                  <p className="text-sm text-[var(--muted)]">
                    UPI, Cards, Net Banking and supported payment methods
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay Securely"}
            </button>

            <p className="mt-4 text-center text-xs text-[var(--muted)]">
              You will be redirected to Razorpay secure checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
