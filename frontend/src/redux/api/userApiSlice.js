

// // userSlice.js
// import { apiSlice } from './apiSlice'; // Import the base apiSlice setup
// import {USERS_URL} from '../constants'
// export const userSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Register user (public route)
//     registerUser: builder.mutation({
//       query: (userData) => ({
//         url: `${USERS_URL}/register`, // POST request to register a new user
//         method: 'POST',
//         body: userData, // Send user registration data
//       }),
//     }),

   
//     loginUser: builder.mutation({
//       query: (credentials) => ({
//         url: `${USERS_URL}/login`,
//         method: "POST",
//         body: credentials,
//         credentials: "include", // Ensure cookies are sent
//       }),
//       transformResponse: (response) => {
//         console.log("Login Response:", response);
//         localStorage.setItem("accessToken", response.accessToken);
//         return response;
//       },
//     }),
    

//     // Logout user (protected route)
//     logoutUser: builder.mutation({
//       query: () => ({
//         url: `${USERS_URL}/logout`, 
//         method: 'POST',
//       }),
      
//     }),

//     // Refresh access token (public route)
//     refreshToken: builder.mutation({
//       query: () => ({
//         url: `${USERS_URL}/refresh-token`, // POST request to refresh access token
//         method: 'POST',
//       }),
//     }),

//     // Change password (protected route)
//     changePassword: builder.mutation({
//       query: (passwordData) => ({
//         url: `${USERS_URL}/change-password`, // PUT request to change password
//         method: 'PUT',
//         body: passwordData, // Send current and new password details
//       }),
//     }),

//     // Update account details (protected route)
//     updateAccount: builder.mutation({
//       query: (updateData) => ({
//         url: `${USERS_URL}/update-account`, // PUT request to update user account
//         method: 'PUT',
//         body: updateData, // Send updated account details (e.g., userName, fullName, address, phone)
//       }),
//     }),

//     // Reset password (public route)
//     resetPassword: builder.mutation({
//       query: (resetData) => ({
//         url: `${USERS_URL}/reset-password`, // POST request to reset password
//         method: 'POST',
//         body: resetData, // Send reset token and new password
//       }),
//     }),
 
//     // Fetch user profile (protected route)
//     fetchUserProfile: builder.query({
//       query: () => ({
//         url: `${USERS_URL}/profile`, // GET request to fetch the logged-in user's profile
//         method: 'GET',
//       }),
//       providesTags: ['User'],
//     }),
    
//   }),
// });

// export const {
//   useRegisterUserMutation,
//   useLoginUserMutation,
//   useLogoutUserMutation,
//   useRefreshTokenMutation,
//   useChangePasswordMutation,
//   useUpdateAccountMutation,
//   useResetPasswordMutation,
//   useFetchUserProfileQuery,
// } = userSlice;

import { apiSlice } from './apiSlice';  // Import the base apiSlice setup
import { USERS_URL } from '../constants'; // Ensure this is the correct path for your URL constants

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register user (public route)
    registerUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/register`, // POST request to register a new user
        method: 'POST',
        body: userData, // Send user registration data
      }),
    }),

    // Login user (public route)
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: credentials,
        credentials: 'include', // Ensure cookies are sent (if used for JWT)
      }),
      transformResponse: (response) => {
        console.log("Login Response:", response);
        // Store the access token in localStorage for further requests
        localStorage.setItem("token", response.accessToken);  // Store the token under 'token'
        return response;
      },
    }),

    // Logout user (protected route)
    logoutUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      // Optionally clear localStorage or cookies here when the user logs out
      transformResponse: () => {
        localStorage.removeItem("token");  // Clear token on logout
        return null;
      },
    }),

    // Refresh access token (public route)
    refreshToken: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/refresh-token`, // POST request to refresh access token
        method: 'POST',
      }),
    }),

    // Change password (protected route)
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: `${USERS_URL}/change-password`, // PUT request to change password
        method: 'PUT',
        body: passwordData, // Send current and new password details
      }),
    }),

    // Update account details (protected route)
    updateAccount: builder.mutation({
      query: (updateData) => ({
        url: `${USERS_URL}/update-account`, // PUT request to update user account
        method: 'PUT',
        body: updateData, // Send updated account details (e.g., userName, fullName, address, phone)
      }),
    }),

    // Reset password (public route)
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: `${USERS_URL}/reset-password`, // POST request to reset password
        method: 'POST',
        body: resetData, // Send reset token and new password
      }),
    }),

    // Fetch user profile (protected route)
    fetchUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`, // GET request to fetch the logged-in user's profile
        method: 'GET',
      }),
      providesTags: ['User'], // Cache the user data under 'User' tag
    }),
  }),

  
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useUpdateAccountMutation,
  useResetPasswordMutation,
  useFetchUserProfileQuery,
} = userSlice;
