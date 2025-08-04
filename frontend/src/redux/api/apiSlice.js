
// import { BASE_URL } from '../constants';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   credentials: 'include',
// });

// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: ['Product', 'Payment', 'Order', 'User', 'Category', 'Cart', 'Wishlist', 'Review', 'Admin', 'Brand'],
//   endpoints: () => ({}),
// });

import { BASE_URL } from '../constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../features/auth/authSlice.jsx';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // send cookies for refresh token
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If access token expired
  if (result?.error?.status === 401) {
    console.warn("Access token expired, attempting refresh...");

    // Attempt to refresh access token
    const refreshResult = await rawBaseQuery(
      { url: '/users/refreshtoken', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { accessToken, refreshToken } = refreshResult.data.data;

      // Update Redux + localStorage
      api.dispatch(setCredentials({
        user: api.getState().auth.userInfo,
        accessToken,
        refreshToken
      }));

      // Retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      console.error("Refresh failed, logging out...");
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Product', 'Payment', 'Order', 'User', 'Category',
    'Cart', 'Wishlist', 'Review', 'Admin', 'Brand'
  ],
  endpoints: () => ({}),
});
