// import { createSlice } from "@reduxjs/toolkit";

// // Check expiration time
// const expirationTime = localStorage.getItem("expirationTime");
// const isExpired = expirationTime && Date.now() > parseInt(expirationTime);
// const token = localStorage.getItem("token");

// // Clear storage if expired
// if (!token || isExpired) {
//   localStorage.removeItem("userInfo");
//   localStorage.removeItem("token");
//   localStorage.removeItem("refreshToken");
//   localStorage.removeItem("expirationTime");
// }

// const initialState = {
//   userInfo: !isExpired && localStorage.getItem("userInfo")
//     ? JSON.parse(localStorage.getItem("userInfo"))
//     : null,
//   token: !isExpired && localStorage.getItem("token")
//     ? localStorage.getItem("token")
//     : null,
//   refreshToken: !isExpired && localStorage.getItem("refreshToken")
//     ? localStorage.getItem("refreshToken")
//     : null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const { user, accessToken, refreshToken } = action.payload;

//       // Update Redux state
//       state.userInfo = user;
//       state.token = accessToken;
//       state.refreshToken = refreshToken;

//       // Store in localStorage
//       localStorage.setItem("userInfo", JSON.stringify(user));
//       if (accessToken) localStorage.setItem("token", accessToken);
//       if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

//       // Set expiration (30 days from now)
//       const newExpirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
//       localStorage.setItem("expirationTime", newExpirationTime);
//     },
//     logout: (state) => {
//       // Clear Redux state
//       state.userInfo = null;
//       state.token = null;
//       state.refreshToken = null;

//       // Clear localStorage
//       localStorage.removeItem("userInfo");
//       localStorage.removeItem("token");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("expirationTime");
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Check expiration
const expirationTime = localStorage.getItem("expirationTime");
const isExpired = expirationTime && Date.now() > parseInt(expirationTime);
const token = localStorage.getItem("token");

if (!token || isExpired) {
  localStorage.clear();
}

const initialState = {
  userInfo: !isExpired && localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  token: !isExpired ? token : null,
  refreshToken: !isExpired && localStorage.getItem("refreshToken")
    ? localStorage.getItem("refreshToken")
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.userInfo = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem("userInfo", JSON.stringify(user));
      if (accessToken) localStorage.setItem("token", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("expirationTime", Date.now() + 30 * 24 * 60 * 60 * 1000);
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
