// import { createSlice } from '@reduxjs/toolkit';
// import { paymentApi } from '../api/paymentApiSlice';

// const initialState = {
//   status: 'idle', 
//   error: null,
//   currentOrder: null,
// };

// const paymentSlice = createSlice({
//   name: 'payment',
//   initialState,
//   reducers: {
//     resetOrder: (state) => {
//       state.status = 'idle';
//       state.error = null;
//       state.currentOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addMatcher(
//         paymentApi.endpoints.createOrder.matchPending,
//         (state) => {
//           state.status = 'loading';
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.createOrder.matchFulfilled,
//         (state, action) => {
//           state.status = 'succeeded';
//           state.currentOrder = action.payload;
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.createOrder.matchRejected,
//         (state, action) => {
//           state.status = 'failed';
//           state.error = action.error;
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.verifyPayment.matchFulfilled,
//         (state) => {
//           state.status = 'succeeded';
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.verifyPayment.matchRejected,
//         (state, action) => {
//           state.status = 'failed';
//           state.error = action.error;
//         }
//       );
//   },
// });

// export const { resetOrder } = paymentSlice.actions;

// export default paymentSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';
// import { paymentApi } from '../api/paymentApiSlice'; // Import the payment API slice

// const initialState = {
//   status: 'idle',
//   error: null,
//   currentOrder: null,
// };

// const paymentSlice = createSlice({
//   name: 'payment',
//   initialState,
//   reducers: {
//     resetOrder: (state) => {
//       state.status = 'idle';
//       state.error = null;
//       state.currentOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addMatcher(
//         paymentApi.endpoints.createOrder.matchPending,
//         (state) => {
//           state.status = 'pending';
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.createOrder.matchFulfilled,
//         (state, action) => {
//           state.status = 'succeeded';
//           state.currentOrder = action.payload;
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.createOrder.matchRejected,
//         (state, action) => {
//           state.status = 'failed';
//           state.error = action.error;
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.verifyPayment.matchFulfilled,
//         (state, action) => {
//           state.status = 'succeeded';
//           state.currentOrder = { ...state.currentOrder, status: 'completed' };
//         }
//       )
//       .addMatcher(
//         paymentApi.endpoints.verifyPayment.matchRejected,
//         console.log("rejected success"), 
//         (state, action) => {
//           state.status = 'failed';
//           state.error = action.error;
//         }
//       );
//   },
// });

// export const { resetOrder } = paymentSlice.actions;

// export default paymentSlice.reducer;
