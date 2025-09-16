

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/homePage.jsx"; // Example Home Page
// import ProductCard from "./components/ui/productCard.jsx";
// import ProductListPage from "./components/features/products/ProductsPage.jsx";
// import Login from "./components/features/auth/Login.jsx";
// import Register from "./components/features/auth/register.jsx";
// // import PaymentPage from "./components/features/payment/payment.jsx";
// import UserProfile from "./components/features/user/userProfile.jsx";
// import CartPage from "./components/features/cart/CartList.jsx";
// import CreateProduct from "./components/features/admin/productsManagement/CreateProducts.jsx"
// import AddToCart from "./components/features/cart/AddToCart.jsx";
// import CartList from "./components/features/cart/CartList.jsx";
// import Dashboard from "./components/features/admin/adminAnalytics/adminDashBoard.jsx";
// import UserTable from "./components/features/admin/userManagement/Ban&UnbanUser.jsx";
// import OrderCountChart from "./components/features/admin/orderManagement/orderData.jsx";
// import AllOrderTable from "./components/features/admin/orderManagement/getAllOrders.jsx";
// import CheckoutForm from "./components/features/payment/checkout.jsx";
// import PaymentFailedPage from "./components/features/payment/paymentFaild.jsx";
// import OrderDetailPage from "./components/features/orders/orderDetails.jsx";
// import UserOrders from "./components/features/orders/myOrders.jsx"
// import OrderSuccessPage from "./components/features/payment/orderSuccessPage.jsx";
// import CheckoutPage from "./pages/checkoutPage.jsx";

// function App() {
//   return ( 
    

//     <Router>

//       <Routes>
// {/*basic routes */}   

//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/products" element={<ProductListPage />} />




// {/*Protected routes*/}        

//           {/* <Route path="/search/visual" element={<VisualSearch />} />
//           <Route path="/search/voice" element={<VoiceSearch />} /> */}
//           {/* <Route path="/search/semantic" element={<SemanticSearch />} /> */}
//           {/* <Route path="/payments" element={<PaymentPage />} /> */}
//           <Route path="/checkout" element={<CheckoutPage />} />
//           <Route path="/users/profile" element={<UserProfile />} />
//           <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
//           <Route path="/cart" element={<CartList />} />
//           <Route path="/payment-failed" element={<PaymentFailedPage />} />
//           <Route path="/orders/:id" element={<OrderDetailPage />} />
//           <Route path="/orders" element={<UserOrders />} />


// {/*admin routes*/ }  
//       <Route path="/products/:productId" element={<ProductCard />} />
//       <Route path="/products/createProduct" element={<CreateProduct />} />
//       <Route path="/admin" element={<Dashboard />} />
//       <Route path="/admin/order-data" element={<OrderCountChart />} />
//       <Route path="/admin/orders" element={<AllOrderTable />} />
//       <Route path="/admin/userManagement" element={<UserTable />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/homePage.jsx";
import ProductCard from "./components/ui/productCard.jsx";
import ProductListPage from "./components/features/products/ProductsPage.jsx";
import Login from "./components/features/auth/Login.jsx";
import Register from "./components/features/auth/register.jsx";
import UserProfile from "./components/features/user/userProfile.jsx";
import CartList from "./components/features/cart/CartList.jsx";
import Dashboard from "./components/features/admin/adminAnalytics/adminDashBoard.jsx";
import OrderCountChart from "./components/features/admin/orderManagement/orderData.jsx";
import AllOrderTable from "./components/features/admin/orderManagement/getAllOrders.jsx";
import PaymentFailedPage from "./components/features/payment/paymentFaild.jsx";
import OrderDetailPage from "./components/features/orders/orderDetails.jsx";
import UserOrders from "./components/features/orders/myOrders.jsx";
import OrderSuccessPage from "./components/features/payment/orderSuccessPage.jsx";
import CheckoutPage from "./pages/checkoutPage.jsx";
import AdminUserList from "./components/features/admin/userManagement/userList.jsx";
import AdminLayout from "./components/features/admin/adminLayout.jsx";
import CreateCategory from "./components/features/admin/CategoriesManagement/CreateCategory.jsx";
import GetAllCategories from "./components/features/admin/CategoriesManagement/GetAllCategories.jsx";
import UpdateCategory from "./components/features/admin/CategoriesManagement/UpdateCategory.jsx";
// import CategoryList from "./components/layout/allCategories.jsx";
import TopSellingProducts from "./components/features/products/topselling.jsx";
import CategoryProducts from "./components/layout/categoryProducts.jsx";
import CategoryList from "./components/layout/Categories.jsx";
import DeleteCategory from "./components/features/admin/CategoriesManagement/DeleteCategory.jsx";
import GetAllProducts from "./components/features/admin/productsManagement/AllProducts.jsx";
import UpdateProduct from "./components/features/admin/productsManagement/productUpdate.jsx";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './index.css'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CreateBrand from "./components/features/admin/brand/createBrand.jsx";
import DeleteBrand from "./components/features/admin/brand/deleteBrand.jsx";
import BrandList from "./components/features/admin/brand/allBrands.jsx";
import ViewBrand from "./components/features/admin/brand/viewBrand.jsx";
import UpdateBrandWrapper from "./components/features/admin/brand/updarebrandwraper.jsx";
import RecentProductsList from "./components/features/products/recentProducts.jsx";
import CreateProduct from "./components/features/admin/productsManagement/CreateProducts.jsx"
import RecentlyViewedProductsPage from "./components/features/products/recentlyViewPage.jsx";
import BrandProductsPage from "./components/features/products/getProductByBrand.jsx";
import ReviewForm from "./components/features/reiveiw/reviewForm.jsx";
import AllReviewsPage from "./components/features/reiveiw/allReviewPage.jsx";
import WishlistPage from "./components/ui/wishlistPage.jsx"
function App() {

  return (
    
    <Router>
        <Routes>

        {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
          <Route path="/products" element={<ProductListPage />} />
           <Route path="/products/recent" element={<RecentProductsList />} />
           <Route path="/brands/:brandId" element={<BrandProductsPage />} />

          <Route path="/products/:productId" element={<ProductCard />} />
          <Route path="/categories" element={<CategoryList/>}/>
          <Route path="/topSeller" element={<TopSellingProducts />} />
          <Route path="/categories/:id" element={<CategoryProducts/>}/>

        {/* Protected Routes */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/users/profile" element={<UserProfile />} />
          <Route path="/ordersuccess/:orderId" element={<OrderSuccessPage />} />
          <Route path="/cart" element={<CartList />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/recentlyviewed" element={<RecentlyViewedProductsPage />}  />
          <Route path="/review/create/:productId" element={<ReviewForm />}  />
          <Route path="/review/:productId" element ={<AllReviewsPage/>}/>
          <Route path="/wishlist/get" element={<WishlistPage/>}/>



       <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="products/update" element={<ProductListPage />} />

            <Route path="products" element={<GetAllProducts />} />
            <Route path="products/createProduct" element={<CreateProduct />} />
            <Route path="products/update/:productId" element={<UpdateProduct />} />

            <Route path="order-data" element={<OrderCountChart />} />
            <Route path="orders" element={<AllOrderTable />} />
            <Route path="category/create" element={<CreateCategory />} />
            <Route path="categories" element={<GetAllCategories />} />
            <Route path="categories/:categoryId/edit" element={<UpdateCategory />} />
            <Route path="categories/:categoryId/delete" element={<DeleteCategory />} />

            <Route path="brand/create" element={<CreateBrand />} />
            <Route path="brand/delete" element={<DeleteBrand />} />
            {/* <Route path="brand/update/:brandId" element={<UpdateBrand />} /> */}
            <Route path="brand/getall" element={<BrandList />} />
            <Route path="brand/view/:brandId" element={<ViewBrand />} />

<Route path="brand/update/:brandId" element={
  <UpdateBrandWrapper />}/>

            {/* <Route path="brand/:brandId" element={<BrandList />} /> */}


            
      </Route>





      </Routes>
    </Router>
  );
}

export default App;
