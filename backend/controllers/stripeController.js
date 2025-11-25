import Stripe from "stripe";
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// Create a PaymentIntent for an order and return the client secret to the client
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500);
    throw new Error("Stripe secret key is not configured");
  }

  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
      userId: order.user.toString(),
    },
    automatic_payment_methods: { enabled: true },
  });

  res.status(201).json({ clientSecret: paymentIntent.client_secret });
});

// Process a test payment for an order using Stripe's pm_card_visa test card
const processTestPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500);
    throw new Error("Stripe secret key is not configured");
  }

  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "usd",
    payment_method: "pm_card_visa",
    confirm: true,
    metadata: {
      orderId: order._id.toString(),
      userId: order.user.toString(),
    },
  });

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paymentIntent.id,
    status: paymentIntent.status,
    update_time: new Date(paymentIntent.created * 1000).toISOString(),
    email_address: req.user.email,
  };

  const updatedOrder = await order.save();

  res.status(200).json({ order: updatedOrder, paymentIntent });
});

export { createPaymentIntent, processTestPayment };
