import { apiSlice } from "./apiSlice";
import { BRAND_URL } from "../constants";

export const brandSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // createBrand: builder.mutation({
    //   query: (formData) => ({
    //     url: `${BRAND_URL}/create`,
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["Brand"],
    // }),

    // ✅ Get a single brand by ID (brandId is passed as arg)
    getBrand: builder.query({
      query: (brandId) => ({
        url: `${BRAND_URL}/${brandId}`,
        method: "GET",
      }),
      providesTags: ["Brand"],
      keepUnusedDataFor: 200,
      refetchOnMountOrArgChange: false,
    }),

    // ✅ Get all brands
    getAllBrands: builder.query({
      query: () => ({
        url: `${BRAND_URL}/getAllBrands`,
        method: "GET",
      }),
      providesTags: ["Brand"],
    }),
getProductsByBrand: builder.query({
  query: ({ brandId, page = 1, limit = 12 }) =>
    `${BRAND_URL}/${brandId}/products?page=${page}&limit=${limit}`,
  transformResponse: (response) => ({
    products: response.data.products,
    pagination: response.data.pagination,
  }),
}),


    // ✅ Delete brand by ID (brandId passed as arg)
    // deleteBrand: builder.mutation({
    //   query: (brandId) => ({
    //     url: `${BRAND_URL}/delete/${brandId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Brand"],
    // }),

    // ✅ Update brand by ID
    // updateBrand: builder.mutation({
    //   query: ({ brandId, body }) => ({
    //     url: `${BRAND_URL}/update/${brandId}`,
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["Brand"],
    // }),

//     updateBrand: builder.mutation({
//   query: ({ brandId, body }) => ({
//     url: `${BRAND_URL}/update/${brandId}`,
//     method: "PUT",
//     body, 
//   }),
//   invalidatesTags: ["Brand"],
// }),


     getBrandById: builder.query({
      query: (brandId) => `${BRAND_URL}/${brandId}`,
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),
    getTopBrands: builder.query({
      query: () => `${BRAND_URL}/top`, // Example endpoint
      keepUnusedDataFor:300,
    }),
  }),

  
});

export const {
  useGetProductsByBrandQuery,
  useGetBrandByIdQuery,
  // useCreateBrandMutation,
  useGetBrandQuery,
  useGetAllBrandsQuery,
  useGetTopBrandsQuery ,
  // useDeleteBrandMutation,
  // useUpdateBrandMutation,
} = brandSlice;
