import { createSlice } from '@reduxjs/toolkit';
import { orderApi } from '../api/orderApiSlice'; // Import the order API slice

const initialState = {
  status: 'idle',
  error: null,
  currentOrder: null,
  orderDetails: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.status = 'idle';
      state.error = null;
      state.currentOrder = null;
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        orderApi.endpoints.createOrder.matchPending,
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        orderApi.endpoints.createOrder.matchFulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.currentOrder = action.payload; // Update with new order data
        }
      )
      .addMatcher(
        orderApi.endpoints.createOrder.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error;
        }
      )
      .addMatcher(
        orderApi.endpoints.getOrderDetails.matchFulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.orderDetails = action.payload; // Update order details
        }
      )
      .addMatcher(
        orderApi.endpoints.getOrderDetails.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error;
        }
      )
      .addMatcher(
        orderApi.endpoints.updateOrderStatus.matchFulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.orderDetails = { ...state.orderDetails, ...action.payload }; // Update order details after status change
        }
      )
      .addMatcher(
        orderApi.endpoints.updateOrderStatus.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error;
        }
      );
  },
});

export const { resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
