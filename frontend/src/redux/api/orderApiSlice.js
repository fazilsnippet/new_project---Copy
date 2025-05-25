import { apiSlice } from './apiSlice'; // Adjust path if needed
import { ORDER_URL } from '../constants'; // If you have a constants file

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: `${ORDER_URL}/create`, // Endpoint to create an order
        method: 'POST',
        body: orderData, // Sends the order data to the backend
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/get-order/${orderId}`, // Endpoint to get order details
        method: 'GET',
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: (updateData) => ({
        url: `${ORDER_URL}/update-status`, // Endpoint to update order status
        method: 'PATCH',
        body: updateData, // Send order status update data
      }),
    }),
  }),
});

export const { 
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation
} = orderApi;
