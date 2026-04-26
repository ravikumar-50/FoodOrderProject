const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("KEY", process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  console.log("Payment request body:", req.body);

  // Build compact cart metadata to persist through the Stripe session.
  // Stripe metadata values are capped at 500 chars per key, so we
  // store the items JSON under one key (fine for typical orders).
  const cartMeta = req.body.items.map((item) => ({
    name: item.foodItem.name,
    price: item.foodItem.price,
    qty: item.quantity,
    img: item.foodItem.images?.[0]?.url || "",
  }));

  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    phone_number_collection: {
      enabled: true,
    },
    line_items: req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.foodItem.name,
          images: item.foodItem.images?.[0]?.url
            ? [item.foodItem.images[0].url]
            : [],
        },
        unit_amount: item.foodItem.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery Charges",
          type: "fixed_amount",
          fixed_amount: {
            amount: 5500, // Amount in paise (e.g., 5500 = 55 INR)
            currency: "inr",
          },
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 3,
            },
          },
        },
      },
    ],
    metadata: {
      userId: req.user._id.toString(),
      cartItems: JSON.stringify(cartMeta),
      restaurant: req.body.restaurant || "",
    },
    success_url: `${process.env.FRONTEND_URL}/eats/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });

  res.status(200).json({ url: session.url });
});


// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
