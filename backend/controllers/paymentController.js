import crypto from "crypto";

import razorpay from "../config/razorpay.js";

import Payment from "../models/Payments.js";
import Booking from "../models/Booking.js";
import Space from "../models/Space.js";

const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate("space")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to pay for this booking",
      });
    }

    if (booking.status === "cancelled" || booking.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be paid",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking is already paid",
      });
    }

    if (!booking.space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const amount = Number(
      booking.totalPrice || booking.price || booking.space.price,
    );

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount",
      });
    }

    /*
      If a previous unpaid payment exists,
      create a fresh Razorpay order for a new payment attempt.
    */

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: userId.toString(),
        spaceId: booking.space._id.toString(),
      },
    });

    const payment = await Payment.findOneAndUpdate(
      {
        booking: booking._id,
      },
      {
        booking: booking._id,
        user: userId,
        amount,
        currency: "INR",
        razorpayOrderId: razorpayOrder.id,
        status: "created",
        razorpayPaymentId: "",
        razorpaySignature: "",
        failureReason: "",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    booking.paymentStatus = "pending";
    booking.razorpayOrderId = razorpayOrder.id;

    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Payment order created",
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
      booking: {
        id: booking._id,
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      bookingId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (
      !bookingId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment verification data",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment verification",
      });
    }

    /*
      IMPORTANT:
      Use the order ID stored in our database,
      not blindly trust the order ID from frontend.
    */

    if (
      !booking.razorpayOrderId ||
      booking.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order",
      });
    }

    const payment = await Payment.findOne({
      booking: booking._id,
      razorpayOrderId: booking.razorpayOrderId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        payment,
      });
    }

    const body = `${booking.razorpayOrderId}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const signaturesMatch =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature),
      );

    if (!signaturesMatch) {
      payment.status = "failed";
      payment.failureReason = "Invalid payment signature";

      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.paidAt = new Date();

    await payment.save();

    booking.paymentStatus = "paid";
    booking.status =
      booking.status === "pending" ? "confirmed" : booking.status;

    booking.razorpayPaymentId = razorpay_payment_id;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
      booking,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

const getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({
      booking: bookingId,
      user: req.user._id,
    }).populate("booking");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load payment",
    });
  }
};

export { createPaymentOrder, verifyPayment, getPaymentByBooking };
