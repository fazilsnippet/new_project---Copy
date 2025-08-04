// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useCreateOrderMutation, useVerifyPaymentMutation } from '../../../redux/api/paymentApiSlice';

// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const existingScript = document.querySelector(
//       'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
//     );
//     if (existingScript) return resolve(true);

//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const PaymentPage = () => {
//   const [createOrder] = useCreateOrderMutation();
//   const [verifyPayment] = useVerifyPaymentMutation();

//   // ✅ Get logged-in user and cart items
//   const user = useSelector((state) => state.auth.user); // adjust if needed
//   const cartItems = useSelector((state) => state.cart.items); // adjust if needed

//   const handlePayment = async () => {
//     if (!user?._id || cartItems.length === 0) {
//       alert('User or cart data missing');
//       return;
//     }

//     const sdkLoaded = await loadRazorpayScript();
//     if (!sdkLoaded) {
//       alert('Razorpay SDK failed to load. Are you online?');
//       return;
//     }

//     try {
//       // Format items for backend
//       const items = cartItems.map((item) => ({
//         productId: item.productId,
//         quantity: item.quantity,
//       }));

//       // ✅ Create order on backend
//       const orderResponse = await createOrder({
//         items,
//       }).unwrap();

//       const options = {
//         key: orderResponse.key || import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ safer fallback
//         amount: orderResponse.amount,
//         currency: 'INR',
//         name: 'My E-Commerce Store',
//         description: 'Order Payment',
//         order_id: orderResponse.razorpayOrderId,
//         handler: async function (response) {
//           try {
//             const verifyRes = await verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               orderId: orderResponse.orderId,
//             }).unwrap();
//             alert('✅ Payment verified!');
//             console.log(verifyRes);
//           } catch (verifyError) {
//             alert('❌ Payment verification failed!');
//             console.error(verifyError);
//           }
//         },
//         prefill: {
//           name: user.fullName,
//           email: user.email,
//         },
//         theme: { color: '#0d9488' },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error('Error during payment:', err);
//       alert('Something went wrong during payment!');
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-bold mb-2">Complete Payment</h2>
//       <button
//         onClick={handlePayment}
//         className="bg-teal-600 text-white px-4 py-2 rounded"
//       >
//         Pay Now
//       </button>
//     </div>
//   );
// };

// export default PaymentPage;
