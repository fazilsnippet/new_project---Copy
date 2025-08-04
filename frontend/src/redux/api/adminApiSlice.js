// import { apiSlice } from './apiSlice';
// import { ADMIN_URL } from '../constants';

// export const adminApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get all users
//     getAllUsers: builder.query({
//       query: () => `${ADMIN_URL}/users`,
//       providesTags: ['User'],
//     }),

//     // Get all products
//     getAllProducts: builder.query({
//       query: () => `${ADMIN_URL}/products`,
//       providesTags: ['Product'],
//     }),

//     // Get all reviews
//     getAllReviews: builder.query({
//       query: () => `${ADMIN_URL}/reviews`,
//       providesTags: ['Review'],
//     }),

//     // Get all orders
//     getAllOrders: builder.query({
//       query: () => `${ADMIN_URL}/orders`,
//       providesTags: ['Order'],
//     }),

//     // Analytics
//     getAdminAnalytics: builder.query({
//       query: () => `${ADMIN_URL}/analytics`,
//     }),
//     getAdminAnalyticsData: builder.query({
//       query: () => `${ADMIN_URL}/analytics-data`,
//     }),
//     getAdminDashboardData: builder.query({
//       query: () => `${ADMIN_URL}/dashboard-summary`,
//     }),

//     // Recent Data
//     getRecentOrders: builder.query({
//       query: () => `${ADMIN_URL}/recent-orders`,
//     }),
//     getRecentOrdersData: builder.query({
//       query: () => `${ADMIN_URL}/recent-orders-data`,
//     }),
//     getRecentReviews: builder.query({
//       query: () => `${ADMIN_URL}/recent-reviews`,
//     }),
//     getRecentReviewsData: builder.query({
//       query: () => `${ADMIN_URL}/recent-reviews-data`,
//     }),
//     getRecentProducts: builder.query({
//       query: () => `${ADMIN_URL}/recent-products`,
//     }),
//     getRecentProductsData: builder.query({
//       query: () => `${ADMIN_URL}/recent-products-data`,
//     }),

//     // User actions
//     banUser: builder.mutation({
//       query: (id) => ({
//         url: `${ADMIN_URL}/users/${id}/ban`,
//         method: 'PUT',
//       }),
//       invalidatesTags: ['User'],
//     }),
//     unbanUser: builder.mutation({
//       query: (id) => ({
//         url: `${ADMIN_URL}/users/${id}/unban`,
//         method: 'PUT',
//       }),
//       invalidatesTags: ['User'],
//     }),

    // // Product actions
    // hideProduct: builder.mutation({
    //   query: (id) => ({
    //     url: `${ADMIN_URL}/products/${id}/hide`,
    //     method: 'PUT',
    //   }),
    //   invalidatesTags: ['Product'],
    // }),
    // showProduct: builder.mutation({
    //   query: (id) => ({
    //     url: `${ADMIN_URL}/products/${id}/show`,
    //     method: 'PUT',
    //   }),
    //   invalidatesTags: ['Product'],
    // }),

//     // Review actions
//     hideReview: builder.mutation({
//       query: (id) => ({
//         url: `${ADMIN_URL}/reviews/${id}/hide`,
//         method: 'PUT',
//       }),
//       invalidatesTags: ['Review'],
//     }),
//     showReview: builder.mutation({
//       query: (id) => ({
//         url: `${ADMIN_URL}/reviews/${id}/show`,
//         method: 'PUT',
//       }),
//       invalidatesTags: ['Review'],
//     }),
//   }),
// });

// export const {
//   useGetAllUsersQuery,
//   useGetAllProductsQuery,
//   useGetAllReviewsQuery,
//   useGetAllOrdersQuery,

//   useGetAdminAnalyticsQuery,
//   useGetAdminAnalyticsDataQuery,
//   useGetAdminDashboardDataQuery,

//   useGetRecentOrdersQuery,
//   useGetRecentOrdersDataQuery,
//   useGetRecentReviewsQuery,
//   useGetRecentReviewsDataQuery,
//   useGetRecentProductsQuery,
//   useGetRecentProductsDataQuery,

//   useBanUserMutation,
//   useUnbanUserMutation,
//   useHideProductMutation,
//   useShowProductMutation,
//   useHideReviewMutation,
//   useShowReviewMutation,
// } = adminApi;

import { apiSlice } from './apiSlice';
import { ADMIN_URL } from '../constants';
export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === USERS ===
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, role, isBanned } = {}) => {
        let query = `?page=${page}&limit=${limit}`;
        if (role) query += `&role=${role}`;
        if (isBanned !== undefined) query += `&isBanned=${isBanned}`;
        return `${ADMIN_URL}/users${query}`;
      },
      providesTags: ['User'],
    }),
    banUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}/ban`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
    unbanUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}/unban`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),

    // === PRODUCTS ===
    getAllAdminProducts: builder.query({
      query: ({ page = 1, limit = 50, stockLt, stockGt } = {}) => {
        let query = `?page=${page}&limit=${limit}`;
        if (stockLt) query += `&stock[lt]=${stockLt}`;
        if (stockGt) query += `&stock[gt]=${stockGt}`;
        return `${ADMIN_URL}/products${query}`;
      },
      providesTags: ['Product'],
    }),
 

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${ADMIN_URL}/products/delete/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

  getProductById: builder.query({
  query: (productId) => ({
    url: `${ADMIN_URL}/products/${productId}`,
    method: 'GET',
  }),
  providesTags: ['Product'],
}),

createProduct: builder.mutation({
  query: (formData) => ({
    url: `${ADMIN_URL}/products/create`,
    method: 'POST',
    body: formData,
  }),
  invalidatesTags: ['Product'],
}),



// Product actions
    hideProduct: builder.mutation({
      query: (productId) => ({
        url: `${ADMIN_URL}/products/${productId}/hide`,
        method: 'PUT',
      }),
      invalidatesTags: ['Product'],
    }),
    showProduct: builder.mutation({
      query: (productId) => ({
        url: `${ADMIN_URL}/products/${productId}/show`,
        method: 'PUT',
      }),
      invalidatesTags: ['Product'],
    }),
    
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${ADMIN_URL}/products/update/${productId}`,
        method: "PUT",
        body: formData, // ⚠️ FormData doesn't get headers set automatically
      }),
    }),
      updateProductDescriptionBlocks: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${ADMIN_URL}/products/${productId}/descriptionblocks`,
        method: "PATCH",
        body: formData,
      }),
    }),

      // updateProduct: builder.mutation({
      //     query: ({ productId, updatedProduct }) => ({
      //       url: `${ADMIN_URL}/products/${productId}`,
      //       method: 'PUT',
      //       body: updatedProduct,
      //     }),
      //     invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
      //   }),





    // === ORDERS ===
   
   getAllOrders: builder.query({
  query: (args = {}) => {
  const { page = 1, limit = 20, from, to } = args;
  let query = `?page=${page}&limit=${limit}`;
  if (from) query += `&from=${from}`;
  if (to) query += `&to=${to}`;
  return {
    url: `${ADMIN_URL}/orders${query}`,
    method: 'GET',
  };
  },
  providesTags: ['Order'],
}),


    // === REVIEWS ===
    getAllAdminReviews: builder.query({
      query: ({ page = 1, limit = 10, isApproved, isFlagged } = {}) => {
        let query = `?page=${page}&limit=${limit}`;
        if (isApproved !== undefined) query += `&isApproved=${isApproved}`;
        if (isFlagged !== undefined) query += `&isFlagged=${isFlagged}`;
        return `${ADMIN_URL}/reviews${query}`;
      },
      providesTags: ['Review'],
    }),
    hideReview: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/reviews/${id}/hide`,
        method: 'PUT',
      }),
      invalidatesTags: ['Review'],
    }),
    showReview: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/reviews/${id}/show`,
        method: 'PUT',
      }),
      invalidatesTags: ['Review'],
    }),

    // === DASHBOARD + ANALYTICS ===
    getAdminDashboard: builder.query({
      query: () => `${ADMIN_URL}/dashboard`,
      providesTags: ['User', 'Product', 'Order', 'Review', 'Category'],
    }),
    getRecentActivity: builder.query({
      query: () => `${ADMIN_URL}/recent`,
      providesTags: ['Order', 'Review', 'Product'],
    }),

    getOrderCountByDate: builder.query({
  query: ({ from, to }) => {
    let query = '';
    if (from) query += `from=${from}&`;
    if (to) query += `to=${to}`;
    return `${ADMIN_URL}/orders/count-by-date?${query}`;
  },
  providesTags: ['Order'],
}),

//brands:
getAllBrands: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/brand/all`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

createBrand: builder.mutation({
  query: (formData) => ({
    url: `${ADMIN_URL}/brand/create`,
    method: 'POST',
    body: formData,
  }),
}),

updateBrand: builder.mutation({
  query: ({ brandId, formData }) => ({
    url: `${ADMIN_URL}/brand/update/${brandId}`,
    method: 'PUT',
    body: formData,
  }),
}),

deleteBrand: builder.mutation({
  query: (brandId) => ({
    url: `${ADMIN_URL}/brand/delete/${brandId}`,
    method: 'DELETE',
  }),
}),

 getTopBrandsWithProducts: builder.query({
      query: () => `${ADMIN_URL}/brand/topwithproducts`,
      keepUnusedDataFor: 60,
    }),

//category:

 getCategories: builder.query({
  query: () => `${ADMIN_URL}/category/all`,
  providesTags: (result) =>
    result?.categories
      ? [
          ...result.categories.map(({ _id }) => ({ type: 'Category', id: _id })),
          { type: 'Category', id: 'LIST' },
        ]
      : [{ type: 'Category', id: 'LIST' }],
}),

createCategory: builder.mutation({
  query: (formData) => ({
    url: `${ADMIN_URL}/category/create`,
    method: 'POST',
    body: formData,
  }),
}),
updateCategory: builder.mutation({
  query: ({ categoryId, formData }) => ({
    url: `${ADMIN_URL}/category/update/${categoryId}`,
    method: 'PUT',
    body: formData,
  }),
}),
deleteCategory: builder.mutation({
  query: (categoryId) => ({
    url: `${ADMIN_URL}/category/delete/${categoryId}`,
    method: 'DELETE',
  }),
}),


  })


  })

export const {
  // Queries
  useGetAllUsersQuery,
  useGetAllAdminProductsQuery,
  useGetAllOrdersQuery,
  useGetAllAdminReviewsQuery,
  useGetAdminDashboardQuery,
  useGetRecentActivityQuery,
  useGetOrderCountByDateQuery,
  useGetTopBrandsWithProductsQuery ,
  useGetAllBrandsQuery,
  useGetCategoriesQuery,
  // useGetProductByIdQuery,


  // Mutations
  useUpdateProductDescriptionBlocksMutation,
  useCreateProductMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useCreateCategoryMutation,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
useUnbanUserMutation,
  useBanUserMutation,
  useHideProductMutation,
  useShowProductMutation,
  useHideReviewMutation,
  useShowReviewMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  
} = adminApi;
