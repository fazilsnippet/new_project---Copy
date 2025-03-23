// import { BASE_URL } from "../constants";
// import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react"

// const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// export const apiSlice = createApi({
//   baseQuery,
//   credentials: "include",
//   tagTypes: ["Product", "Order", "User", "Category","Cart","Wishlist"],
//   endpoints: () => ({}),
// });

import { BASE_URL } from "../constants";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // 👈 Ensures cookies are sent with requests
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category", "Cart", "Wishlist"],
  endpoints: () => ({}),
});


// import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "../constants";
// import { logout, setCredentials } from "../features/auth/authSlice";

// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const token = localStorage.getItem("accessToken");

//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }

//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error?.status === 401) {
//     // Token expired, attempt refresh
//     const refreshResult = await baseQuery(
//       { url: "/users/refresh-token", method: "POST" },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data) {
//       // Save new tokens
//       api.dispatch(setCredentials(refreshResult.data));

//       // Retry the original request
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout()); // Logout user if refresh fails
//     }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithReauth, // Use modified baseQuery
//   tagTypes: ["Product", "Order", "User", "Category", "Cart", "Wishlist"],
//   endpoints: () => ({}),
// });
