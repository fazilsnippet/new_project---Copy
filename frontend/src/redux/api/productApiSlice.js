// import { apiSlice } from './apiSlice';
// import { PRODUCT_URL } from '../constants';

// export const productSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllProducts: builder.query({
//       query: () => PRODUCT_URL,
//       providesTags: ['Product'],
//     }),

//     getProductById: builder.query({
//       query: (productId) => {
//         productId = String(productId); // Convert to string here
//         console.log("Making API request with productId:", productId, typeof productId);
//         return `/api/products/${productId}`;
//       },
//       providesTags: (result, error, productId) => [{ type: 'Product', id: String(productId) }],
//     }),
    

//     createProduct: builder.mutation({
//       query: (newProduct) => ({
//         url: PRODUCT_URL,
//         method: 'POST',
//         body: newProduct,
//       }),
//       invalidatesTags: ['Product'],
//     }),

//     updateProduct: builder.mutation({
//       query: ({ productId, updatedProduct }) => ({
//         url: `${PRODUCT_URL}/${productId}`,
//         method: 'PUT',
//         body: updatedProduct,
//       }),
//       invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
//     }),

//     deleteProduct: builder.mutation({
//       query: (productId) => ({
//         url: `${PRODUCT_URL}/${productId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
//     }),

//     createReview: builder.mutation({
//       query: ({ productId, review }) => ({
//         url: `${PRODUCT_URL}/${productId}/review`,
//         method: 'POST',
//         body: review,
//       }),
//       invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
//     }),
//   }),
// });

// export const {
//   useGetAllProductsQuery,
//   useGetProductByIdQuery,
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
//   useCreateReviewMutation,
// } = productSlice;

import { apiSlice } from './apiSlice';
import { PRODUCT_URL } from '../constants';

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => PRODUCT_URL,
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (productId) => `/api/products/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: PRODUCT_URL,
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, updatedProduct }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: 'PUT',
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    createReview: builder.mutation({
      query: ({ productId, review }) => ({
        url: `${PRODUCT_URL}/${productId}/review`,
        method: 'POST',
        body: review,
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
