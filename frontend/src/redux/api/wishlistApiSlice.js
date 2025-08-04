// redux/api/wishlistApiSlice.js
import { WISHLIST_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const wishlistSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get wishlist (supports pagination)
    getAdvancedWishlist: builder.query({
      query: ({ userId, skip = 0, limit = 20 }) => ({
        url: WISHLIST_URL,
        method: 'GET',
        params: { skip, limit }, // Backend already handles this
      }),
      providesTags: (result) =>
        result?.wishlist
          ? [
              ...result.wishlist.map((item) => ({ type: 'Wishlist', id: item.productId })),
              { type: 'Wishlist', id: 'LIST' },
            ]
          : [{ type: 'Wishlist', id: 'LIST' }],
    }),

    // ✅ Add product to wishlist
    addProductToWishlist: builder.mutation({
      query: ({ userId, productId }) => ({
        url: WISHLIST_URL,
        method: 'POST',
        body: { userId, productId },
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    // ✅ Remove product from wishlist
    removeProductFromWishlist: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `${WISHLIST_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Wishlist', id: productId },
        { type: 'Wishlist', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAdvancedWishlistQuery,
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
} = wishlistSlice;
