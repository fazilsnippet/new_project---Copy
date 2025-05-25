

import { apiSlice } from './apiSlice'; // Adjust path if needed
import { PAYMENT_URL } from '../constants'; // If you have a constants file

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({userId,items}) => ({
        url: `${PAYMENT_URL}/create-order`,
        method: 'POST',
        body: {userId, items}, 
      }),
    }),
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: `${PAYMENT_URL}/verify`,
        method: 'POST',
        body: {razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        orderId: paymentData.orderId,
        userId: paymentData.userId,},
        headers: {
          'Content-Type': 'application/json', // Important
        },
      }),
    }),
    
  }),
});

export const { 
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} = paymentApi;

// import { createSlice } from '@reduxjs/toolkit';

// const paymentSlice = createSlice({
//   name: 'payment',
//   initialState: { status: null },
//   reducers: {
//     updatePaymentStatus: (state, action) => {
//       state.status = action.payload.status;
//     }
//   }
// });

// export const { updatePaymentStatus } = paymentSlice.actions;
// export default paymentSlice.reducer;
