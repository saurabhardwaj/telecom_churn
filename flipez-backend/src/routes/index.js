const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const propertyDetailsRoutes = require('./property-details');
const imageRoutes = require('./image');
const investmentDetailsRoutes = require('./investment-details');
const paymentRoutes = require('./payment');
const { sendResponse } = require('../lib/responseHandler');
const isAuthenticated = require('../lib/auth/isAuthenticated');
const PaymentModel = require("../controller/payment/payment.model");
const UserModel = require('../controller/user/user.model');
const InvestmentDetailsModel = require('../controller/investment-details/investment-details.model');
const PropertyDetailsModel = require('../controller/property-details/property-details.model');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('API running...!!!');
  });

  app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
  
    let event;
  
    try {
        // Verify the event using the webhook secret
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const user = await UserModel.findOne({ email: session.customer_email });
            const investmentDetails = await InvestmentDetailsModel.findOne({ user: user._id, status: 'pending' });
            // Call your database update function
            await PaymentModel.create({
              amount: 5,
              investmentId: investmentDetails._id,
              user: user._id,
              stripe: {
                paymentId: session.payment_intent,
                email: session.customer_email,
                amount: session.amount_total / 100, // Amount in dollars
                currency: session.currency,
                status: session.payment_status,
              }
            })
            await InvestmentDetailsModel.findAndUpdate({ user: user._id, status: 'pending' }, { $set: { status: 'paid' } });
            await PropertyDetailsModel.findAndUpdate({ user: user._id, status: 'pending' }, { $set: { status: 'paid' } });
            break;
  
        // Add other event types as needed
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
  
    res.status(200).end();
  });
  app.use(bodyParser.json({ limit: '10mb', extended: true }));
  app.use((req, res, next) => {
    req.sendResponse = sendResponse.bind(null, req, res, next);
    next();
  });

  app.use('/', authRoutes);
  // validate user authentication
  app.use('/image', imageRoutes);
  app.use(isAuthenticated);
  app.use('/property-details', propertyDetailsRoutes);
  app.use('/user', userRoutes);
  app.use('/investment-details', investmentDetailsRoutes);
  app.use('/payment', paymentRoutes);

  // catch 404 and forward to error handler
  app.use((req, res) => {
    res.status(404).send({ error: `Not Found. Accessing route - ${req.path} For ${req.method}` });
  });
};
