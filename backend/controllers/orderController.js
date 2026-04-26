const Order = require("../models/order");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");

//setting up config file
dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a new order   =>  /api/v1/eats/orders/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { session_id } = req.body;

  // Retrieve the Stripe Checkout session (with shipping & customer details)
  const session = await stripe.checkout.sessions.retrieve(session_id);
  console.log("Stripe session:", session);

  // --- Build order items from the metadata we stored at checkout ---
  let orderItems = [];
  try {
    const cartMeta = JSON.parse(session.metadata.cartItems || "[]");
    orderItems = cartMeta.map((item) => ({
      name: item.name,
      quantity: item.qty,
      image: item.img || "",
      price: item.price,
      fooditem: null, // no DB ref when cart is local-only
    }));
  } catch (e) {
    // Fallback: pull line items from Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session_id);
    orderItems = lineItems.data.map((li) => ({
      name: li.description,
      quantity: li.quantity,
      image: "",
      price: li.amount_total / 100 / li.quantity,
      fooditem: null,
    }));
  }

  // Delivery info from Stripe shipping details
  const shipping = session.shipping_details || {};
  const addr = shipping.address || {};
  let deliveryInfo = {
    address: [addr.line1, addr.line2].filter(Boolean).join(" ") || "N/A",
    city: addr.city || "N/A",
    phoneNo: session.customer_details?.phone || "N/A",
    postalCode: addr.postal_code || "N/A",
    country: addr.country || "N/A",
  };

  let paymentInfo = {
    id: session.payment_intent,
    status: session.payment_status,
  };

  // Prevent duplicate orders for the same Stripe session
  const existingOrder = await Order.findOne({ "paymentInfo.id": paymentInfo.id });
  if (existingOrder) {
    return res.status(200).json({
      success: true,
      order: existingOrder,
    });
  }

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo,
    deliveryCharge: +(session.shipping_cost?.amount_subtotal || 0) / 100,
    itemsPrice: +(session.amount_subtotal || 0) / 100,
    finalTotal: +(session.amount_total || 0) / 100,
    user: req.user.id,
    restaurant: session.metadata.restaurant || undefined,
    paidAt: Date.now(),
  });
  console.log("Order created:", order);

  res.status(200).json({
    success: true,
    order,
  });
});

// Get single order   =>   /api/v1/eats/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders   =>   /api/v1/eats/orders/me/myOrders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Get the user ID from req.user
  const userId = new ObjectId(req.user.id);
  // Find orders for the specific user using the retrieved user ID
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
