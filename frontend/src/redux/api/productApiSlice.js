// import { apiSlice } from './apiSlice';
// import { PRODUCT_URL } from '../constants';

// export const productSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllProducts: builder.query({
//       query: (params = {}) => {
//         const { search = '', filters = {} } = params;
//         let queryString = new URLSearchParams();

//         if (search) queryString.append("search", search);
//         Object.entries(filters).forEach(([key, value]) => {
//           if (value) queryString.append(key, value);
//         });

//         const queryStr = queryString.toString();
//         return queryStr ? `/api/products?${queryStr}` : '/api/products';
//       },
//       providesTags: ['Product'],
//     }),
//     getProductById: builder.query({
//       query: (id) => `${PRODUCT_URL}/${id}`,
//       providesTags: ['Product'],
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
//       invalidatesTags: ['Product'],
//     }),
//     deleteProduct: builder.mutation({
//       query: (productId) => ({
//         url: `${PRODUCT_URL}/${productId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Product'],
//     }),
//     createReview: builder.mutation({
//       query: ({ productId, review }) => ({
//         url: `${PRODUCT_URL}/${productId}/review`,
//         method: 'POST',
//         body: review,
//       }),
//       invalidatesTags: ['Product'],
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
      query: (params = {}) => { // Ensure params is always an object
        const { search = '', filters = {} } = params;

        let queryString = new URLSearchParams();
        if (search) queryString.append("search", search);
        Object.entries(filters).forEach(([key, value]) => queryString.append(key, value));

        return `/api/products?${queryString.toString()}`;
      },
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
            query: (id) => `${PRODUCT_URL}/${id}`,
            providesTags: ['Product'],
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

