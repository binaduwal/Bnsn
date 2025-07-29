# Word Purchase Feature

This document describes the word purchase feature that allows users to buy additional words for content generation.

## Overview

The word purchase feature integrates Stripe payments to allow users to purchase 100,000 words for $10. When a user runs out of words, they can click on the word count in the header to navigate to the purchase page.

## Features

- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Word Count Management**: Automatic addition of 100,000 words after successful payment
- **User-Friendly UI**: Modern, responsive design with loading states
- **Error Handling**: Comprehensive error handling for failed payments
- **Success/Cancel Pages**: Dedicated pages for payment outcomes

## File Structure

### Server Side
```
server/
├── src/
│   ├── services/
│   │   └── stripe.ts                 # Stripe service for payment processing
│   ├── routes/
│   │   └── payments.ts               # Payment API endpoints
│   ├── scripts/
│   │   └── testPayment.ts            # Payment flow test script
│   └── index.ts                      # Main server file (updated with payment routes)
├── STRIPE_SETUP.md                   # Stripe configuration guide
└── package.json                      # Updated with Stripe dependencies
```

### Client Side
```
client/
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── purchase/
│   │           ├── page.tsx          # Main purchase page
│   │           ├── success/
│   │           │   └── page.tsx      # Payment success page
│   │           └── cancel/
│   │               └── page.tsx      # Payment cancel page
│   ├── services/
│   │   └── paymentApi.ts             # Payment API client functions
│   └── components/
│       └── layout/
│           └── Header.tsx            # Updated with clickable word count
```

## API Endpoints

### Create Checkout Session
- **URL**: `POST /api/payments/create-checkout-session`
- **Auth**: Required
- **Body**: `{ amount: number }`
- **Response**: `{ sessionId: string, url: string }`

### Confirm Payment
- **URL**: `POST /api/payments/confirm-payment`
- **Auth**: Required
- **Body**: `{ paymentIntentId: string }`
- **Response**: `{ message: string, wordsAdded: number, newTotalWords: number, newWordsLeft: number }`

### Webhook
- **URL**: `POST /api/payments/webhook`
- **Auth**: None (Stripe signature verification)
- **Purpose**: Handle Stripe events (payment success/failure)

## User Flow

1. **User clicks word count** in the header
2. **Redirected to purchase page** (`/dashboard/purchase`)
3. **Clicks "Purchase Now"** button
4. **Redirected to Stripe Checkout** for payment
5. **After payment**:
   - Success: Redirected to success page, words added to account
   - Cancel: Redirected to cancel page, no charges made
6. **Return to dashboard** with updated word count

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Client URL
CLIENT_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
# Server
cd server
npm install stripe @types/stripe

# Client (no additional dependencies needed)
cd ../client
```

### 3. Test the Integration

```bash
# Test payment flow
cd server
npm run test:payment

# Start the servers
npm run dev  # Server
cd ../client && npm run dev  # Client
```

### 4. Test with Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Any future expiry date and 3-digit CVC**

## Styling

The feature uses Tailwind CSS with a dark theme that matches the existing application:

- **Background**: Gradient from gray-900 to gray-800
- **Cards**: Semi-transparent with backdrop blur
- **Buttons**: Gradient from blue-500 to purple-500
- **Hover effects**: Scale transforms and color transitions
- **Loading states**: Spinner animations

## Error Handling

- **Network errors**: Toast notifications with error messages
- **Payment failures**: Dedicated error pages with retry options
- **Invalid payments**: Server-side validation and user feedback
- **Webhook failures**: Logging and graceful degradation

## Security Considerations

- **Stripe signature verification** for webhooks
- **Authentication required** for payment endpoints
- **Input validation** with Joi schemas
- **HTTPS required** in production
- **No sensitive data** stored locally

## Monitoring

- **Payment logs** in Stripe Dashboard
- **Server logs** for payment processing
- **Webhook event logging** for debugging
- **User word count updates** tracked in database

## Future Enhancements

- **Multiple word packages** (50K, 100K, 200K words)
- **Subscription model** for recurring payments
- **Usage analytics** and spending reports
- **Bulk purchase discounts**
- **Team/enterprise pricing**

## Troubleshooting

### Common Issues

1. **Payment Intent Creation Fails**
   - Check Stripe secret key
   - Verify amount is in cents
   - Check Stripe account status

2. **Webhook Not Working**
   - Verify webhook endpoint URL
   - Check webhook secret
   - Monitor webhook logs

3. **Words Not Added**
   - Check payment confirmation
   - Verify user authentication
   - Check database connection

### Debug Commands

```bash
# Test payment flow
npm run test:payment

# Check server logs
npm run dev

# Verify environment variables
echo $STRIPE_SECRET_KEY
```

## Support

For issues related to:
- **Stripe**: [Stripe Support](https://support.stripe.com)
- **Application**: Check server logs and Stripe Dashboard
- **Development**: Use test cards and development mode 