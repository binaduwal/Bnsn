# Stripe Payment Integration Setup

This guide will help you set up Stripe payments for the word purchase feature.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm/yarn installed

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Client URL (for payment redirects)
CLIENT_URL=http://localhost:3000
```

## Getting Your Stripe Keys

1. **Stripe Secret Key:**
   - Log into your Stripe Dashboard
   - Go to Developers > API keys
   - Copy your "Secret key" (starts with `sk_test_` for test mode)
   - Add it to `STRIPE_SECRET_KEY` in your `.env` file

2. **Webhook Secret (Optional for development):**
   - In Stripe Dashboard, go to Developers > Webhooks
   - Create a new webhook endpoint
   - Set the endpoint URL to: `https://your-domain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook signing secret and add it to `STRIPE_WEBHOOK_SECRET`

## Testing the Integration

1. **Test Mode:** Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

2. **Test the Flow:**
   - Start your server: `npm run dev`
   - Navigate to the purchase page
   - Click "Purchase Now"
   - Complete payment with test card
   - Verify words are added to user account

## Production Setup

1. **Switch to Live Mode:**
   - Replace test keys with live keys from Stripe Dashboard
   - Update `STRIPE_SECRET_KEY` to live secret key (starts with `sk_live_`)

2. **Webhook Configuration:**
   - Set up webhook endpoint for your production domain
   - Configure webhook events for payment processing
   - Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

3. **Security:**
   - Ensure HTTPS is enabled
   - Validate webhook signatures in production
   - Monitor payment logs in Stripe Dashboard

## API Endpoints

- `POST /api/payments/create-checkout-session` - Create Stripe checkout session
- `POST /api/payments/confirm-payment` - Confirm payment and add words
- `POST /api/payments/webhook` - Handle Stripe webhook events

## Troubleshooting

1. **Payment Intent Creation Fails:**
   - Check Stripe secret key is correct
   - Verify amount is in cents (multiply by 100)
   - Check Stripe account is active

2. **Webhook Issues:**
   - Verify webhook endpoint URL is accessible
   - Check webhook secret is correct
   - Monitor webhook logs in Stripe Dashboard

3. **Word Count Not Updated:**
   - Check payment confirmation endpoint
   - Verify user authentication
   - Check database connection

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com) 