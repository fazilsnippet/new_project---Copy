import { WISHLIST_URL } from '../constants'; // Import the wishlist URL from constants
import { apiSlice } from './apiSlice';
export const wishlistSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch advanced wishlist details for a specific user (protected route)
    getAdvancedWishlist: builder.query({
      query: ({ userId, skip = 0, limit = 20 }) => ({
        url: WISHLIST_URL, // GET request to fetch the advanced wishlist
        method: 'GET',
        params: { skip, limit }, // Pagination parameters are always included
      }),
      providesTags: ['Wishlist'], // Tag to invalidate wishlist data when changed
    }),

    // Add product to the wishlist (protected route)
    addProductToWishlist: builder.mutation({
      query: ({ userId, productId }) => ({
        url: WISHLIST_URL, // POST request to add product to wishlist
        method: 'POST',
        body: { productId }, // Send productId to add to the wishlist
      }),
      invalidatesTags: ['Wishlist'], // Invalidate wishlist cache after adding product
    }),

    // Remove product from wishlist (protected route)
    removeProductFromWishlist: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `${WISHLIST_URL}/${productId}`, // DELETE request to remove product
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'], // Invalidate wishlist cache after removal
    }),

  }),
});

export const {
  useGetAdvancedWishlistQuery,
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
} = wishlistSlice;
