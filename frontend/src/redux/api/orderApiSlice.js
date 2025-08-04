import { apiSlice } from './apiSlice'; // Adjust path if needed
import { ORDER_URL } from '../constants'; // If you have a constants file

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
  createOrder: builder.mutation({
  query: ({ items, paymentMethod }) => ({
    url: `${ORDER_URL}/create`,
    method: 'POST',
    body: { items, paymentMethod },
  }),
  keepUnusedDataFor: 200,
  refetchOnMountOrArgChange: false,
}),

    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/getorder/${orderId}`, 
        method: 'GET',
      }),
      keepUnusedDataFor: 300,
   refetchOnMountOrArgChange: false,
    }),

    updateOrderStatus: builder.mutation({
      query: (updateData) => ({
        url: `${ORDER_URL}/updatestatus`, // Endpoint to update order status
        method: 'PATCH',
        body: updateData, // Send order status update data
      }),
    }),
    
    getAllUserOrders: builder.query({
      query: ({ page = 1, limit = 20, from, to }) => {
        let query = `?page=${page}&limit=${limit}`;
        if (from) query += `&from=${from}`;
        if (to) query += `&to=${to}`;
        return {
          url: `${ORDER_URL}/getallorders${query}`, // Endpoint to get all orders
          method: 'GET',
        };
      },
      providesTags: ['Order'], 
      keepUnusedDataFor: 500,
 refetchOnMountOrArgChange: false,
}),
   

  
  }),
});

export const { 
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useGetAllUserOrdersQuery,
} = orderApi;
