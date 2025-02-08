// categorySlice.js
import { apiSlice } from './apiSlice'; // Import the base apiSlice setup
import { CATEGORY_URL } from '../constants'; // Import the category URL from constants

export const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new category (protected route)
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: `${CATEGORY_URL}`, // POST request to create a new category
        method: 'POST',
        body: categoryData, // Send category data
      }),
    }),

    // Get all categories with hierarchy and product counts (protected route)
    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}`, // GET request to fetch all categories
        method: 'GET',
      }),
      providesTags: ['Category'], // Tag to invalidate category data when changed
    }),

    // Get a single category by ID with subcategories and products (protected route)
    getCategoryById: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`, // GET request for a specific category
        method: 'GET',
      }),
      providesTags: (result, error, categoryId) => [{ type: 'Category', id: categoryId }],
    }),

    // Update a category by ID (protected route)
    updateCategory: builder.mutation({
      query: ({ categoryId, categoryData }) => ({
        url: `${CATEGORY_URL}/${categoryId}`, // PUT request to update category
        method: 'PUT',
        body: categoryData, // Send updated category data
      }),
      invalidatesTags: (result, error, { categoryId }) => [{ type: 'Category', id: categoryId }],
    }),

    // Delete a category by ID (protected route)
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`, // DELETE request to remove category
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { categoryId }) => [{ type: 'Category', id: categoryId }],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categorySlice;
