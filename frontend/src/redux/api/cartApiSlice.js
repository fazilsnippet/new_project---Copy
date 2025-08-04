// import { apiSlice } from "./apiSlice";
// import { CART_URL } from "../constants";

// export const cartSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getCart: builder.query({
//       query: () => ({
//         url: CART_URL,
//         method: "GET",
//          keepUnusedDataFor: 200,
//       refetchOnMountOrArgChange: false,
//       }),
//       providesTags: ["Cart"],
//     }),

//    addToCart: builder.mutation({
//   query: ({ productId, quantity }) => ({
//     url: `${CART_URL}/add`,
//     method: "POST",
//     body: { productId, quantity }, 
//   }),
//   invalidatesTags: ["Cart"],
// }),
// removeFromCart: builder.mutation({
//       query: (productId) => ({
//         url: `${CART_URL}/remove/${productId}`, 
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Cart"],
//     }),
//     updateCartItem: builder.mutation({
//       query: ({ productId, quantity }) => ({
//         url: `${CART_URL}/update`, 
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ productId, quantity }), 
//       }),
//       invalidatesTags: ["Cart"],
//     }),
    
    
    

//     // removeFromCart: builder.mutation({
//     //   query: ({ productId }) => ({
//     //     url: `${CART_URL}/remove`,
//     //     method: "DELETE",
//     //     body: { productId },
//     //   }),
//     //   invalidatesTags: ["Cart"],
//     // }),
    
    

//     clearCart: builder.mutation({
//       query: () => ({
//         url: `${CART_URL}/clear`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Cart"],
//     }),
//   }),
// });

// export const {
//   useGetCartQuery,
//   useAddToCartMutation,
//   useUpdateCartItemMutation,
//   useRemoveFromCartMutation,
//   useClearCartMutation,
// } = cartSlice;

import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get entire cart
    getCart: builder.query({
      query: () => ({
        url: CART_URL,
        method: "GET",
      }),
      providesTags: ["Cart"],
      keepUnusedDataFor: 200,
      refetchOnMountOrArgChange: false,
    }),

    // ✅ Add to cart
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}/add`,
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
      
    }),

    // ✅ Update item quantity
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}/update`,
        method: "PUT",
        body: { productId, quantity }, // ✨ Don't need JSON.stringify here
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Remove a single item
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `${CART_URL}/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Clear all items
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
