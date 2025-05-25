

// import { BASE_URL } from '../constants';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   prepareHeaders: (headers) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },
//   credentials: 'include',
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error?.status === 401 || result?.error?.status === 403) {
//     const refreshResult = await baseQuery(`${USERS_URL}/refresh-token`, api, extraOptions);

//     if (refreshResult?.data?.accessToken) {
//       localStorage.setItem('token', refreshResult.data.accessToken);
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithReauth,

//   // baseQuery,
//   tagTypes: ['Product', 'Payment', 'Order', 'User', 'Category', 'Cart', 'Wishlist'],
//   endpoints: () => ({}),
// });

// // import { BASE_URL } from '../constants';
// // import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// // import { USERS_URL } from '../constants';
// // import { logout } from '../features/auth/authSlice';

// // const baseQuery = fetchBaseQuery({
// //   baseUrl: BASE_URL,
// //   credentials: 'include', // ✅ send cookies on every request
// // });

// // const baseQueryWithReauth = async (args, api, extraOptions) => {
// //   let result = await baseQuery(args, api, extraOptions);

// //   if (result?.error?.status === 401 || result?.error?.status === 403) {
// //     const refreshResult = await baseQuery(`${USERS_URL}/refresh-token`, api, extraOptions);

// //     if (refreshResult?.data) {
// //       // No need to store token in localStorage if using cookies
// //       result = await baseQuery(args, api, extraOptions);
// //     } else {
// //       api.dispatch(logout());
// //     }
// //   }

// //   return result;
// // };

// // export const apiSlice = createApi({
// //   baseQuery: baseQueryWithReauth,
// //   tagTypes: ['Product', 'Payment', 'Order', 'User', 'Category', 'Cart', 'Wishlist'],
// //   endpoints: () => ({}),
// // });



// import { BASE_URL } from "../constants";
// import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   credentials: "include", // 👈 Ensures cookies are sent with requests
// });

// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: ["Product", "Payment","Order", "User", "Category", "Cart", "Wishlist"],
//   endpoints: () => ({}),
// });


import { BASE_URL } from '../constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Payment', 'Order', 'User', 'Category', 'Cart', 'Wishlist'],
  endpoints: () => ({}),
});
