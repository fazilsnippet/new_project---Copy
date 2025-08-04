

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

import { apiSlice } from './apiSlice';  
import { USERS_URL } from '../constants'; 
export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // Register user
    // registerUser: builder.mutation({
    //   query: (userData) => ({
    //     url: `${USERS_URL}/register`,
    //     method: 'POST',
    //     body: userData,
    //   }),
    //   transformResponse: (response) => {
    //     const { accessToken, refreshToken, user } = response;

    //     // Store tokens (optional: move to setCredentials if you want a single place)
    //     if (accessToken) localStorage.setItem("token", accessToken);
    //     if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    //     return { user, accessToken, refreshToken };
    //   }
    // }),

    sendSignupOtp: builder.mutation({
      query: (email) => ({
        url: `${USERS_URL}/register/sendotp`,
        method: "POST",
        body: { email },
      }),
    }),

    // Register user with OTP
    registerUserWithOtp: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: userData,
      }),
      transformResponse: (response) => {
        const { accessToken, refreshToken, user } = response;

        // Store tokens
        if (accessToken) localStorage.setItem("token", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        return { user, accessToken, refreshToken };
      }
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: credentials,
        credentials: 'include', // Send cookies if backend uses them
      }),
      transformResponse: (response) => {
        const { accessToken, refreshToken, user } = response;

        if (accessToken) localStorage.setItem("token", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        return { user, accessToken, refreshToken };
      }
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      transformResponse: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expirationTime");
        return null;
      },
    }),

    // Refresh token
    refreshToken: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/refreshtoken`,
        method: 'POST',
      }),
    }),

    // Change password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: `${USERS_URL}/changepassword`,
        method: 'PUT',
        body: passwordData,
      }),
    }),

    // Update account details
    updateAccount: builder.mutation({
      query: (updateData) => ({
        url: `${USERS_URL}/updateaccount`,
        method: 'PUT',
        body: updateData,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: `${USERS_URL}/resetpassword`,
        method: 'POST',
        body: resetData,
      }),
    }),

    // Fetch profile
    fetchUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // Update address
    updateUserAddress: builder.mutation({
      query: (addressData) => ({
        url: `${USERS_URL}/updateaddress`,
        method: 'PUT',
        body: addressData,
      }),
      invalidatesTags: ['User'],
    }),

    // Recently viewed products
    addRecentlyViewedProduct: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/products/${productId}/addrecentlyviewedproduct`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['User'],
    }),

    getRecentlyViewedProducts: builder.query({
      query: () => `${USERS_URL}/recentlyviewedproducts`,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterUserWithOtpMutation,
  useSendSignupOtpMutation,
  // useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useUpdateAccountMutation,
  useResetPasswordMutation,
  useFetchUserProfileQuery,
  useUpdateUserAddressMutation,
  useAddRecentlyViewedProductMutation,
  useGetRecentlyViewedProductsQuery,
} = userSlice;
