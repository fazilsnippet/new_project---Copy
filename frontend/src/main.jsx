import "./index.css";
import App from "./App";
import ReactDom from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import React from "react";
import Homepage from "./pages/Home";
import ProductDetails from "./pages/products/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";

import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "/login", element: <Login /> },
//       { path: "/register", element: <Register /> },
//       { index: true, element: <Homepage /> },
//       { path: "/wishlist", element: <Wishlist /> },
//       { path: "/product/:id", element: <ProductDetails /> },
//       { path: "/cart", element: <Cart /> },
//     ],
//   },
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Homepage />} />
      <Route path= "/wishlist" element={<Wishlist />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      </Route>))

ReactDom.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
