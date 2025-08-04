// import express from 'express';
// import {
//   createAdmin,
//   loginAdmin,
//   getAllAdmins,
//   getAdminById,
//   updateAdmin,
//   deleteAdmin,
// } from '../controllers/admin.controller.js';
// import { verifyJWT } from '../middleware/auth.middleware.js'; // Add appropriate middleware

// const adminRouter = express.Router();

// // Route to create a new admin (restricted to Super Admin)
// adminRouter.post('/admins', verifyJWT,  createAdmin);

// // Route for admin login
// adminRouter.post('/admins/login', loginAdmin);

// // Route to get all admins (restricted to Super Admin)
// adminRouter.get('/admins', verifyJWT, getAllAdmins);

// // Route to get a single admin by ID (restricted to Super Admin)
// adminRouter.get('/admins/:adminId', verifyJWT,  getAdminById);

// // Route to update admin details (restricted to Super Admin)
// adminRouter.put('/admins/:adminId', verifyJWT,  updateAdmin);

// // Route to delete an admin (restricted to Super Admin)
// adminRouter.delete('/admins/:adminId', verifyJWT,  deleteAdmin);

// export default adminRouter;


//2nd
// import express from 'express';
// import {
//   getAllUsers,
//   banUser,
//   unbanUser,
//   hideProduct,
//   showProduct,
//   hideReview,
//   showReview,
//   getAllOrders,
//   getAllProducts,
//   getAllReviews,
//   getAdminAnalytics,
//   getAdminDashboardData,
//   getRecentOrders,
//   getRecentReviews,
//   getRecentProducts,
//   getAdminAnalyticsData,
//   getRecentOrdersData,
//   getRecentReviewsData,
//   getRecentProductsData,
// } from '../controllers/admin.controller.js';

// const adminRouter = express.Router();

// // User management
// adminRouter.get('/users', getAllUsers);
// adminRouter.put('/users/:id/ban', banUser);
// adminRouter.put('/users/:id/unban', unbanUser);

// // Product visibility
// adminRouter.get('/products', getAllProducts);
// adminRouter.put('/products/:id/hide', hideProduct);
// adminRouter.put('/products/:id/show', showProduct);
// adminRouter.get('/recent-products', getRecentProducts);
// adminRouter.get('/recent-products-data', getRecentProductsData);

// // Review visibility
// adminRouter.get('/reviews', getAllReviews);
// adminRouter.put('/reviews/:id/hide', hideReview);
// adminRouter.put('/reviews/:id/show', showReview);
// adminRouter.get('/recent-reviews', getRecentReviews);
// adminRouter.get('/recent-reviews-data', getRecentReviewsData);

// // Order management
// adminRouter.get('/orders', getAllOrders);
// adminRouter.get('/recent-orders', getRecentOrders);
// adminRouter.get('/recent-orders-data', getRecentOrdersData);

// // Dashboard / Analytics
// adminRouter.get('/analytics', getAdminAnalytics);
// adminRouter.get('/dashboard-data', getAdminDashboardData);
// adminRouter.get('/analytics-data', getAdminAnalyticsData);

// export default adminRouter;


import express from 'express';
import {
getAdminDashboard,getAllUsers,getAllAdminOrders,getAllProducts,getAllPayments,getAllReviews,
getRecentActivity,getOrderCountByDate,banUser,unbanUser,updateProduct,deleteProduct,createProduct,
getProductById,createCategory, updateCategory, deleteCategory,createBrand,updateBrand,deleteBrand,
showProduct,hideProduct,showReview,hideReview, getTopBrandsWithLatestProducts, updateProductDescriptionBlocks,
} from '../controllers/admin.controller.js';

import { getAllBrands } from '../controllers/brand.controller.js';
import { getAllCategories } from '../controllers/category.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const adminRouter = express.Router();

// 🧠 Main summary endpoint
adminRouter.get('/dashboard',  getAdminDashboard);



adminRouter.get('/orders/count-by-date', getOrderCountByDate);

// 🧾 Orders
adminRouter.get('/orders', getAllAdminOrders);

// 💳 Payments
adminRouter.get('/payments', getAllPayments);

// ⭐ Reviews
adminRouter.get('/reviews',  getAllReviews);

adminRouter.get('/recent', getRecentActivity); 



// 👥 Users (with pagination, filter, sort support)
adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:id/ban', banUser);
adminRouter.put('/users/:id/unban', unbanUser);

// 📦 Products
adminRouter.get('/products',  getAllProducts);
adminRouter.post("/products/create", upload.array("images", 10), createProduct); // You must also define createProduct controller
adminRouter.delete("/products/delete/:productId", deleteProduct);
adminRouter.put("/products/update/:productId",upload.array("images", 10),updateProduct);
adminRouter.get("/products/:productId", getProductById);
adminRouter.put('/products/:productId/hide', hideProduct);
adminRouter.put('/products/:productId/show', showProduct);
// adminRouter.put("/products/:productId/descriptionblocks",upload.array("images"), );
adminRouter.patch("/products/:productId/descriptionblocks",upload.array("files"), updateProductDescriptionBlocks );


//brand
adminRouter.get('/brand/all', getAllBrands); 
adminRouter.post("/brand/create", upload.single("image"), createBrand);
adminRouter.put("/brand/update/:brandId", upload.single("image"), updateBrand)
adminRouter.delete("/brand/delete/:brandId", deleteBrand)
adminRouter.get("/brand/topwithproducts", getTopBrandsWithLatestProducts);


//category
adminRouter.get('/category/all', getAllCategories);
adminRouter.post("/category/create", upload.single("image"), createCategory);
adminRouter.put("/category/update/:categoryId", upload.single("image"), updateCategory);
adminRouter.delete("/category/delete/:categoryId", deleteCategory);
adminRouter.put('/category/:id/hide', hideReview);
adminRouter.put('/category/:id/show', showReview);


export default adminRouter;

