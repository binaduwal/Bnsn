import { Router } from 'express';
import Joi from 'joi';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { stripeService } from '../services/stripe';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});
import { User } from '../models';
import { createError } from '../middleware/errorHandler';

const router = Router();

const createCheckoutSessionSchema = Joi.object({
  amount: Joi.number().required().min(1).max(1000),
});

const confirmPaymentSchema = Joi.object({
  paymentIntentId: Joi.string().required(),
});

// Create checkout session for word purchase
router.post('/create-checkout-session', 
  authenticateToken, 
  validateBody(createCheckoutSessionSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        return next(createError('User not found in request', 401));
      }

      const { amount } = req.body;
      const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      
      const session = await stripeService.createCheckoutSession(
        amount,
        `${baseUrl}/dashboard/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/dashboard/purchase/cancel`
      );

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Confirm payment and update user word count
router.post('/confirm-payment', 
  authenticateToken, 
  validateBody(confirmPaymentSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        return next(createError('User not found in request', 401));
      }

      const { paymentIntentId } = req.body;
      
      // Verify payment with Stripe
      const paymentIntent = await stripeService.confirmPayment(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return next(createError('Payment not completed', 400));
      }

      // Update user's word count
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(createError('User not found', 404));
      }

      // Add 100,000 words to user's account
      const wordsToAdd = 100000;
      user.totalWords += wordsToAdd;
      user.wordsLeft += wordsToAdd;

      await user.save();

      res.json({
        success: true,
        data: {
          message: 'Payment confirmed and words added successfully',
          wordsAdded: wordsToAdd,
          newTotalWords: user.totalWords,
          newWordsLeft: user.wordsLeft,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Webhook to handle Stripe events
router.post('/webhook', async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).send('Webhook signature verification failed');
    }

    let event;
    try {
      if (!stripe) {
        throw new Error('Stripe is not configured');
      }
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment succeeded:', session.id);
        // You can add additional logic here to update user word count
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    return next(error);
  }
});

export default router; 