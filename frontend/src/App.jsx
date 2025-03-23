import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/register";
// import Products from "./pages/Products/products.jsx";
import ProductDetailPage from "./pages/Products/ProductDetailPage.jsx";
//  import Cart from "./pages/cart/cart.jsx";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; // Example Home Page
import ProductListPage from "./pages/Products/ProductListPage.jsx";
import CartPage from "./components/cart/CartPage.jsx"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:productId" element={<ProductDetailPage/>} />
        <Route path="/products" element={ <ProductListPage />} />

        {/* <Route path="/products" element={ <Products />} /> */}
        <Route path="/cart" element={<CartPage />} />



      </Routes>
    </Router>
  );
}

export default App;

