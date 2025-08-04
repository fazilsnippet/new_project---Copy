


import { apiSlice } from './apiSlice';
import { REVIEW_URL } from '../constants';

export const reviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // createReview: builder.mutation({
    //   query: ({ productId, rating, comment }) => ({
    //     url: `/api/reviews/create/${productId}`, // ✅ matches backend
    //     method: 'POST',
    //     body: { rating, comment },
    //   }),
    // }),

    createReview: builder.mutation({
  query: ({ productId, rating, comment }) => ({
    url: `${REVIEW_URL}/create/${productId}`, // ✅ must match backend
    method: "POST",
    body: { rating, comment }
  }),
}),

    getProductReviews: builder.query({
      query: ({ productId, limit }) =>
        `${REVIEW_URL}/${productId}${limit ? `?limit=${limit}` : ""}`,
      providesTags: ["Review"],
    }),

    // ✅ Update Review 
    updateReview: builder.mutation({
      query: ({ reviewId, reviewData }) => ({
        url: `${REVIEW_URL}/update/${reviewId}`,
        method: 'PUT',
        body: reviewData,
      }),
    }),

    // ✅ Delete Review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `${REVIEW_URL}/delete/${reviewId}`,
        method: 'DELETE',
      }),
    }),
getAllReviews: builder.query({
  query: ({ limit = 10, page = 1 }) => ({
    url: `${REVIEW_URL}/all?limit=${limit}&page=${page}`,
    method: 'GET',
  }),
}),

  }),
});

// ✅ Export hooks
export const {
  useCreateReviewMutation,
  useGetProductReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
} = reviewSlice;
