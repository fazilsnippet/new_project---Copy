// cartSlice.js
import { apiSlice } from './apiSlice'; // Import the base apiSlice setup
import { CART_URL } from '../constants'; // Import the cart URL from constants

export const cartSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Add an item to the cart (protected route)
    addToCart: builder.mutation({
      query: (cartItemData) => ({
        url: `${CART_URL}/add`, // POST request to add item to the cart
        method: 'POST',
        body: cartItemData, // Send cart item data
      }),
    }),

    // Get the cart for the logged-in user (protected route)
    getCart: builder.query({
      query: () => ({
        url: `${CART_URL}`, // GET request to fetch the user's cart
        method: 'GET',
      }),
      providesTags: ['Cart'], // Tag to invalidate cart data when changed
    }),

    // Update the quantity of an item in the cart (protected route)
    updateCartItem: builder.mutation({
      query: (updateData) => ({
        url: `${CART_URL}/update`, // PUT request to update cart item quantity
        method: 'PUT',
        body: updateData, // Send updated cart item data
      }),
      invalidatesTags: ['Cart'], // Invalidate cart cache after update
    }),

    // Remove an item from the cart (protected route)
    removeCartItem: builder.mutation({
      query: (itemId) => ({
        url: `${CART_URL}/remove`, // DELETE request to remove item from cart
        method: 'DELETE',
        body: { itemId }, // Send item ID to remove
      }),
      invalidatesTags: ['Cart'], // Invalidate cart cache after removal
    }),

    // Clear the cart (protected route)
    clearCart: builder.mutation({
      query: () => ({
        url: `${CART_URL}/clear`, // DELETE request to clear the entire cart
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'], // Invalidate cart cache after clearing
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartSlice;
