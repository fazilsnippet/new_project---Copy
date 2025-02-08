
// productSlice.js
import { apiSlice } from './apiSlice'; // Import the base apiSlice setup
import { PRODUCT_URL } from '../constants';// Import the product URL from constants

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products (public route)
    getAllProducts: builder.query({
      query: () => PRODUCT_URL, // Use PRODUCT_URL for fetching all products
      providesTags: ['Product'], // This tag will help to manage cache and invalidate data
    }),
    

    // Get prodduct by ID
    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`, // Use PRODUCT_URL + productId
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    // Create a new product (protected route)
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: PRODUCT_URL, // POST request to create a new product
        method: 'POST',
        body: newProduct, // Send the new product data
      }),
      invalidatesTags: ['Product'], // Invalidate product cache after creating a new product
    }),

    // Update a product by ID (protected route)
    updateProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: `${PRODUCT_URL}/${productId}`, // PUT request with productId
        method: 'PUT',
        body: updatedProduct, // Send updated product data
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    // Delete a product by ID (protected route)
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`, // DELETE request with productId
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    // Add a review to a product (protected route)
    createReview: builder.mutation({
      query: ({ productId, review }) => ({
        url: `${PRODUCT_URL}/${productId}/review`, // POST request to add review
        method: 'POST',
        body: review, // Send review data
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
} = productSlice;
