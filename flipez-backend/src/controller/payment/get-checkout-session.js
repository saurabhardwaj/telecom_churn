const { custom } = require('joi');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const getCheckoutSession = async (req) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        
        "card",
  
      ],
      line_items: [
        {
            price: process.env.STRIPE_PRICE_ID, // Fixed price ID from Stripe
            quantity: 1,
        },
    ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/pay-download?is_success=true`,
      cancel_url: `${process.env.APP_URL}/pay-download`,
      customer_email: req.user.email
    });
    return req.sendResponse(200, session);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = getCheckoutSession;
