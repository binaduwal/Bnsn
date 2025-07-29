import { stripeService } from '../services/stripe';

async function testPaymentFlow() {
  try {
    console.log('🧪 Testing Payment Flow...\n');

    // Test creating a checkout session
    console.log('1. Creating checkout session...');
    const session = await stripeService.createCheckoutSession(
      10, // $10
      'http://localhost:3000/dashboard/purchase/success',
      'http://localhost:3000/dashboard/purchase/cancel'
    );
    
    console.log('✅ Checkout session created successfully');
    console.log('Session ID:', session.id);
    console.log('Checkout URL:', session.url);
    console.log('');

    // Test creating a payment intent
    console.log('2. Creating payment intent...');
    const paymentIntent = await stripeService.createPaymentIntent(10);
    
    console.log('✅ Payment intent created successfully');
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Amount:', paymentIntent.amount / 100, 'USD');
    console.log('Status:', paymentIntent.status);
    console.log('');

    console.log('🎉 Payment flow test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Set up your Stripe environment variables');
    console.log('2. Test the full flow in the browser');
    console.log('3. Use test card: 4242 4242 4242 4242');

  } catch (error) {
    console.error('❌ Payment flow test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPaymentFlow();
}

export { testPaymentFlow }; 