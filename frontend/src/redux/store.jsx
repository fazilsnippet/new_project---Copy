import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';  // Import the base apiSlice (for baseQuery setup)
import { cartSlice } from './api/cartApiSlice';  // Import the cart slice
import { categorySlice } from './api/categoryApiSlice';  // Import the category slice
import { productSlice } from './api/productApiSlice';  // Import the product slice
// import { orderApi } from './api/orderApiSlice';  // Import the order slice
import { userSlice } from './api/userApiSlice';  // Import the user slice
import { wishlistSlice } from './api/wishlistApiSlice';  // Import the wishlist slice
import authReducer from "./features/auth/authSlice"
// import paymentReducer from './features/paymentSlice';  // Use the payment reducer here
import { paymentApi } from './api/paymentApiSlice';  // Import paymentApi for handling payment-related logic

const store = configureStore({
  reducer: {
    // Integrating apiSlice and other feature-specific slices
    [apiSlice.reducerPath]: apiSlice.reducer,  // Add the base apiSlice reducer for automatic caching
    [cartSlice.reducerPath]: cartSlice.reducer,  // Add the cart slice
    [categorySlice.reducerPath]: categorySlice.reducer,  // Add the category slice
    [productSlice.reducerPath]: productSlice.reducer,  // Add the product slice
    // [orderSlice.reducerPath]: orderApi.reducer,  // Add the order slice
    // order: orderReducer, // Add the order slice reducer
    [userSlice.reducerPath]: userSlice.reducer,  // Add the user slice
    [wishlistSlice.reducerPath]: wishlistSlice.reducer,  // Add the wishlist slice

    // payment: paymentReducer,                        // <-- your slice reducer
    [paymentApi.reducerPath]: paymentApi.reducer,

    auth: authReducer,  // Authentication slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, paymentApi.middleware),  // Add both apiSlice and paymentApi middleware for handling requests
});

export default store;
