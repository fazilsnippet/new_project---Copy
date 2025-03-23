// import { apiSlice } from './apiSlice';
// import { CART_URL } from '../constants';

// export const cartSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Add an item to the cart
//     addToCart: builder.mutation({
//       query: (cartItemData) => ({
//         url: CART_URL,
//         method: 'POST',
//         body: cartItemData,
//       }),
//       invalidatesTags: ['Cart'],
//     }),

//     // Get the cart for the logged-in user
//     getCart: builder.query({
//       query: () => ({
//         url: CART_URL,
//         method: 'GET',
//       }),
//       providesTags: ['Cart'],
//     }),

//     // Update the quantity of an item in the cart
//     updateCartItem: builder.mutation({
//       query: ({ productId, quantity }) => ({
//         url: CART_URL, // Backend expects body, not URL param
//         method: 'PUT',
//         body: { productId, quantity }, // Ensure correct key names
//       }),
//       invalidatesTags: ['Cart'],
//     }),

//     // Remove an item from the cart
//     removeCartItem: builder.mutation({
//       query: (productId) => ({
//         url: CART_URL,
//         method: 'DELETE',
//         body: { productId }, // Backend expects productId in body
//       }),
//       invalidatesTags: ['Cart'],
//     }),

//     // Clear the cart
//     clearCart: builder.mutation({
//       query: () => ({
//         url: `${CART_URL}/clear`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Cart'],
//     }),
//   }),
// });

// export const {
//   useAddToCartMutation,
//   useGetCartQuery,
//   useUpdateCartItemMutation,
//   useRemoveCartItemMutation,
//   useClearCartMutation,
// } = cartSlice;

import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => CART_URL,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (cartData) => ({
        url: `${CART_URL}/add`,
        method: "POST",
        body: cartData, // No need for manual headers
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}/update`, // Ensure correct endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }), // Send as body, NOT params
      }),
      invalidatesTags: ["Cart"],
    }),
    
    
    

    // removeFromCart: builder.mutation({
    //   query: ({ productId }) => ({
    //     url: `${CART_URL}/remove`,
    //     method: "DELETE",
    //     body: { productId },
    //   }),
    //   invalidatesTags: ["Cart"],
    // }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `${CART_URL}/remove/${productId}`, // Send productId as a URL parameter
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    
    

    clearCart: builder.mutation({
      query: () => ({
        url: `${CART_URL}/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartSlice;
