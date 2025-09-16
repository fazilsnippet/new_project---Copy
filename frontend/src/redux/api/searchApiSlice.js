import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    searchProducts: builder.mutation({
      query: (text) => ({
        url: '/search',
        method: 'POST',
        body: { text },
      }),
    }),
  }),
});

export const { useSearchProductsMutation } = searchApi;