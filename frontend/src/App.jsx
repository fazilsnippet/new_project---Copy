import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/register";
import Products from "./pages/Products/products.jsx";
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
        <Route path="/products/:productId" element={<Products />
} />
        <Route path="/products" element={ <Products />} />



      </Routes>
    </Router>
  );
}

export default App;

