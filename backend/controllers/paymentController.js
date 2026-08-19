import crypto from "crypto";

import Booking from "../models/Booking.js";
import razorpay from "../config/razorpay.js";
import Notification from "../models/Notification.js";

// Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId).populate(
      "space",
      "name price owner",
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own booking",
      });
    }

    if (booking.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved bookings can be paid",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking is already paid",
      });
    }

    // Workspace price is treated as the booking amount
    const amount = Number(booking.space.price);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    booking.paymentAmount = amount;
    booking.razorpayOrderId = order.id;

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
      bookingId: booking._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only verify your own payment",
      });
    }

    if (booking.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${booking.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      booking.paymentStatus = "failed";

      await booking.save();

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;

    await booking.save();

    await Notification.create({
      user: booking.user,
      title: "Payment Successful",
      message: `Payment for your workspace booking was successful.`,
      type: "booking",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        bookingId: booking._id,
        orderId: booking.razorpayOrderId,
        paymentId: booking.razorpayPaymentId,
        amount: booking.paymentAmount,
        status: booking.paymentStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};
