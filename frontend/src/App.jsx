// import Login from "./pages/auth/Login.jsx";
// import Register from "./pages/auth/register";
// // import Products from "./pages/Products/products.jsx";
// import ProductDetailPage from "./pages/Products/ProductDetailPage.jsx";
// //  import Cart from "./pages/cart/cart.jsx";
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/home"; // Example Home Page
// import ProductListPage from "./pages/Products/ProductListPage.jsx";
// // import CartPage from "./components/cart/CartPage.jsx"
// import CartPage from "./pages/cart/cartpage.jsx";
// // import PaymentGateway from "./components/paymentGateway.jsx";
// import Payment from "./components/payment.jsx";
// import OrderComponent from "./pages/orders/order.jsx";
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/products/:productId" element={<ProductDetailPage/>} />
//         <Route path="/products" element={ <ProductListPage />} />
//         <Route path="/payments" element={<Payment/>}/>
//         {/* <Route path="/products" element={ <Products />} /> */}
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/orders" element={<OrderComponent />} />



//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; // Example Home Page
import ProductDetailPage from "./pages/Products/ProductDetailPage.jsx";
import ProductListPage from "./pages/Products/ProductListPage.jsx";
import CartPage from "./pages/cart/cartpage.jsx";
// import OrderComponent from './components/payment.jsx';
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/register";
import PaymentPage from "./pages/payment/payment.jsx";
import UserProfile from "./components/userProfile.jsx";
function App() {
  return (
    

    <Router>
      <Routes>
        {/* Wrap the routes in Layout if needed */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* <Route path="/orders" element={<OrderComponent />} /> */}
          <Route path="/payments" element={<PaymentPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/profile" element={<UserProfile />} />

      </Routes>
    </Router>
  );
}

export default App;
