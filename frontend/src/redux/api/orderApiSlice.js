// orderSlice.js
import { apiSlice } from './apiSlice'; // Import the base apiSlice setup
import { ORDERS_URL } from '../constants';
export const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new order (protected route)
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: ORDERS_URL, // POST request to create a new order
        method: 'POST',
        body: orderData, // Send order data
      }),
    }),

    // Get all orders for a specific user (protected route)
    getUserOrders: builder.query({
      query: (userId) => ({
        url: `${ORDERS_URL}/user/${userId}`, // GET request to fetch user orders
        method: 'GET',
      }),
      providesTags: ['Order'], // Tag to invalidate order data when changed
    }),

    // Update order status (protected route, admin)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/${orderId}`, // PUT request to update order status
        method: 'PUT',
        body: { status }, // Send the updated status
      }),
      invalidatesTags: ['Order'], // Invalidate order cache after status update
    }),

    // Get summary of all orders (admin route)
    getOrderSummary: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/summary`, // GET request for order summary (admin)
        method: 'GET',
      }),
      providesTags: ['OrderSummary'], // Provide a separate cache tag for order summary
    }),

    // Delete an order (protected route, admin)
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`, // DELETE request to remove an order
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'], // Invalidate order cache after deletion
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderSummaryQuery,
  useDeleteOrderMutation,
} = orderSlice;
