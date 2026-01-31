declare module '@paypal/checkout-server-sdk';
declare module 'nodemailer';

// allow importing some SDKs without types in this workspace
declare module 'stripe' {
  const Stripe: any;
  export default Stripe;
}

declare module 'razorpay' {
  const Razorpay: any;
  export default Razorpay;
} 
