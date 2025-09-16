


// import { apiSlice } from './apiSlice';
// import { PRODUCT_URL } from '../constants';




// export const productSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllProducts: builder.query({
//       query: (params = {}) => { // Ensure params is always an object
//         const { search = '', filters = {} } = params;

//         let queryString = new URLSearchParams();
//         if (search) queryString.append("search", search);
//         Object.entries(filters).forEach(([key, value]) => queryString.append(key, value));

//         return `/api/products?${queryString.toString()}`;
//       },
//       providesTags: ['Product'],
//     }),
//     getProductById: builder.query({
//             query: (id) => `${PRODUCT_URL}/${id}`,
//             providesTags: ['Product'],
//           }),
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
//     getAllProducts: builder.query({
//       query: (params = {}) => {
//         const { search = '', filters = {} } = params;
//         let queryString = new URLSearchParams();
//         if (search) queryString.append("search", search);
//         Object.entries(filters).forEach(([key, value]) => queryString.append(key, value));
//         return `/api/products?${queryString.toString()}`;
        
//       },
//       providesTags: ['Product'],
// keepUnusedDataFor: 300, // cache for 5 minutes (in seconds)
//       refetchOnMountOrArgChange: false,
//     }),
    
// getAllProducts: builder.query({
//   query: ({ page = 1, limit = 12, search = '', filters = {} } = {}) => {
//     const queryString = new URLSearchParams();

//     if (search) queryString.append('search', search);
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) queryString.append(key, value);
//     });
//     queryString.append('page', page);
//     queryString.append('limit', limit);

//     return `${PRODUCT_URL}?${queryString.toString()}`;
//   },
//   providesTags: ['Product'],
//   keepUnusedDataFor: 0, // so each page is fetched fresh
//   refetchOnMountOrArgChange: true, // re-fetch when page changes
// }),


getAllProducts: builder.query({
  query: ({ page = 1, limit = 12, ...params }) => {
    const queryString = new URLSearchParams({ page, limit, ...params }).toString();
    return `${PRODUCT_URL}?${queryString}`;
  },
  serializeQueryArgs: ({ queryArgs }) => queryArgs, // ensures new query per page
  providesTags: ['Product'],
}),



    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: ['Product'],
    }),
//  getAllProducts: builder.query({
//       query: ({ page = 1, limit = 10, search = '', filters = {}, sort = '' }) => {
//         const params = new URLSearchParams();

//         if (search) params.append("search", search);
//         if (sort) params.append("sort", sort);
//         params.append("page", page);
//         params.append("limit", limit);

//         Object.entries(filters).forEach(([key, value]) => {
//           if (value) params.append(key, value);
//         });

//         return `/api/products?${params.toString()}`;
//       },
// providesTags: ['Product'],
//     }),
    // createProduct: builder.mutation({
    //   query: (newProduct) => ({
    //     url: PRODUCT_URL,
    //     method: 'POST',
    //     body: newProduct,
    //   }),
    //   invalidatesTags: ['Product'],
    // }),

 getProducts: builder.query({
  query: () => ({
    url: `${PRODUCT_URL}/products`,
    params: { limit: 5 },
  }),
  providesTags: ['Product'],
}),


    // deleteProduct: builder.mutation({
    //   query: (productId) => ({
    //     url: `${PRODUCT_URL}/${productId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    // }),

    // createReview: builder.mutation({
    //   query: ({ productId, review }) => ({
    //     url: `${PRODUCT_URL}/${productId}/review`,
    //     method: 'POST',
    //     body: review,
    //   }),
    //   invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    // }),

    // 🔍 Visual Search
   getVisualSearch: builder.mutation({
  query: (formData) => ({
    url: `${PRODUCT_URL}/search/visual`,
    method: 'POST',
    body: formData,
  }),
}),

getVoiceSearch: builder.mutation({
  query: (formData) => ({
    url: `${PRODUCT_URL}/search/voice`,
    method: 'POST',
    body: formData,
  }),
}),

getSemanticSearch: builder.mutation({
  query: (text) => ({
    url: `${PRODUCT_URL}/search/semantic`,
    method: 'POST',
    body: { query: text },
  }),
}),
// getTopSellingProducts: builder.query({
//   query: ({ limit = 20, skip = 0 } = {}) =>
//     `${PRODUCT_URL}/top-selling?limit=${limit}&skip=${skip}`,
//   method:"GET",
//   providesTags: ['Product'],
// }),

 getTopSellingProducts: builder.query({
      query: ({ limit = 20, skip = 0 }) =>
        `${PRODUCT_URL}/top-sellings?limit=${limit}&skip=${skip}`,
    }),
    getweekDayTopSellers: builder.query({
      query: ({ limit = 20, skip = 0 }) =>
        `${PRODUCT_URL}/top-sellings/7days?limit=${limit}&skip=${skip}`,
    }),
    getmonthDayTopSellers: builder.query({
      query: ({ limit = 20, skip = 0 }) =>
        `${PRODUCT_URL}/top-sellings/30days?limit=${limit}&skip=${skip}`,
    }),
getRecentProducts: builder.query({
  query: ({ limit = 20, skip = 0 }) =>
    `${PRODUCT_URL}/recent?limit=${limit}&skip=${skip}`,
  method: "GET",
  providesTags: ['Product'],
}),
getRelatedProducts: builder.query({
  query:(productId) =>
    `${PRODUCT_URL}/related/${productId}`,
  method:"GET",
  providesTags:['Product'],
}),

  }),

});



export const {
useLazyGetRelatedProductsQuery,
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  // useDeleteProductMutation,
  useCreateReviewMutation,
  useGetVisualSearchMutation,
  useGetSemanticSearchMutation,
  useGetVoiceSearchMutation,
  useGetTopSellingProductsQuery,
  useLazyGetTopSellingProductsQuery,
useLazyGetRecentProductsQuery,
useGetweekDayTopSellersQuery,
useGetmonthDayTopSellersQuery,
} = productSlice;



