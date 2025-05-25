


import React from 'react';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '../../redux/api/paymentApiSlice';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handlePayment = async () => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      const orderResponse = await createOrder({
        userId: '67443470fe25bc2f43dc41c1',
        items: [
          { productId: '67c59b9e07e0abd0114c5f78', price: 299, quantity: 2 },
        ]
      }).unwrap();

      const options = {
        key: 'rzp_test_M5G23jRxyXikwk', // Your test key
        amount: orderResponse.amount,
        currency: 'INR',
        name: 'Test Store',
        description: 'Test Transaction',
        order_id: orderResponse.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderResponse.orderId,
              userId: '67443470fe25bc2f43dc41c1'
            }).unwrap();
            alert('Payment verified successfully!');
            console.log(verifyRes);
          } catch (verifyError) {
            alert('Payment verification failed!');
            console.error(verifyError);
          }
        },
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error during payment:', err);
      alert('Something went wrong during payment!');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Test Razorpay Payment</h2>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
