

// import { apiSlice } from './apiSlice'; // Adjust path if needed
// import { PAYMENT_URL } from '../constants'; // If you have a constants file

// export const paymentSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     createOrder: builder.mutation({
//       query: ({userId,items}) => ({
//         url: `${PAYMENT_URL}/createPayment`,
//         method: 'POST',
//         body: {userId, items}, 
//       }),
//     }),
//     verifyPayment: builder.mutation({
//       query: (paymentData) => ({
//         url: `${PAYMENT_URL}/verify`,
//         method: 'POST',
//         body: {razorpay_order_id: paymentData.razorpay_order_id,
//         razorpay_payment_id: paymentData.razorpay_payment_id,
//         razorpay_signature: paymentData.razorpay_signature,
//         orderId: paymentData.orderId,
//         userId: paymentData.userId,},
//         headers: {
//           'Content-Type': 'application/json', 
//         },
//       }),
//     }),
    
//   }),
// });

// export const { 
//   useCreateOrderMutation,
//   useVerifyPaymentMutation,
// } = paymentSlice;





// redux/api/paymentApiSlice.js



import { apiSlice } from './apiSlice'; // Adjust path if needed
import { PAYMENT_URL } from '../constants';

export const paymentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRazorpayOrder: builder.mutation({
      query: ({ userId, items }) => ({
        url: `${PAYMENT_URL}/razorpay/create`,
        method: 'POST',
        body: { userId, items },
      }),
    }),

    verifyRazorpayPayment: builder.mutation({
      query: (paymentData) => ({
        url: `${PAYMENT_URL}/razorpay/verify`,
        method: 'POST',
        body: paymentData,
      }),
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} = paymentSlice;
