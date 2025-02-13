import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/register";
import Product from "./pages/Products/product.jsx";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; // Example Home Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:productId" element={<Product />} />
        <Route path="/products" element={<Product />} />



      </Routes>
    </Router>
  );
}

export default App;

