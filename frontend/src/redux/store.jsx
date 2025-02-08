// import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./api/apiSlice";
// import { productSlice } from "./api/productApiSlice";
// import { orderSlice } from "./api/orderApiSlice";
// import { userSlice } from "./api/userApiSlice";
// import { categorySlice } from "./api/categoryApiSlice";
// import { cartSlice } from "./api/cartApiSlice";

// const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     [productSlice.reducerPath]: productSlice.reducer,
//     [orderSlice.reducerPath]: orderSlice.reducer,
//     [userSlice.reducerPath]: userSlice.reducer,
//     [categorySlice.reducerPath]: categorySlice.reducer,
//     [cartSlice.reducerPath]: cartSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice'; // Import the base apiSlice (for baseQuery setup)
import { cartSlice } from './api/cartApiSlice'; // Import the cart slice
import { categorySlice } from './api/categoryApiSlice'; // Import the category slice
import { productSlice } from './api/productApiSlice'; // Import the product slice
import { orderSlice } from './api/orderApiSlice'; // Import the order slice
import { userSlice } from './api/userApiSlice'; // Import the user slice
import { wishlistSlice } from './api/wishlistApiSlice'; // Import the wishlist slice
import authReducer from "./features/auth/authSlice"
const store = configureStore({
  reducer: {
    // Integrating apiSlice and other feature-specific slices
    [apiSlice.reducerPath]: apiSlice.reducer, // Add the base apiSlice reducer for automatic caching
    [cartSlice.reducerPath]: cartSlice.reducer, // Add the cart slice
    [categorySlice.reducerPath]: categorySlice.reducer, // Add the category slice
    [productSlice.reducerPath]: productSlice.reducer, // Add the product slice
    [orderSlice.reducerPath]: orderSlice.reducer, // Add the order slice
    [userSlice.reducerPath]: userSlice.reducer, // Add the user slice
    [wishlistSlice.reducerPath]: wishlistSlice.reducer, // Add the wishlist slice
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add the apiSlice middleware for caching and handling requests
});

export default store;
