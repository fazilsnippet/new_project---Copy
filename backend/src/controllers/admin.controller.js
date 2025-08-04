// import { Admin } from '../models/admin.model.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// // Securely generate JWT tokens
// const generateToken = (admin) => {
//   return jwt.sign({ id: admin._id, role: admin.role, permissions: admin.permissions }, process.env.JWT_SECRET, {
//     expiresIn: '1h',
//   });
// };

// // Create a new admin (Only Super Admin can create admins)
// const createAdmin = asyncHandler(async (req, res) => {
//   if (req.user.role !== "Super Admin") {
//     return res.status(403).json({ message: 'Access denied. Only Super Admins can create new admins.' });
//   }

//   const { name, email, password, role, permissions } = req.body;

//   const existingAdmin = await Admin.findOne({ email });
//   if (existingAdmin) {
//     return res.status(400).json({ message: 'Admin already exists' });
//   }

//   const newAdmin = new Admin({
//     name,
//     email,
//     password, // No need to hash, it's handled in the model
//     role,
//     permissions,
//   });

//   await newAdmin.save();
//   res.status(201).json({ message: 'Admin created successfully' });
// });

// // Authenticate admin & return JWT token
// const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const admin = await Admin.findOne({ email });
//   if (!admin) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   // Check if the account is locked
//   if (admin.isAccountLocked()) {
//     return res.status(403).json({ message: 'Account is locked. Try again later.' });
//   }

//   // Verify password
//   const isMatch = await admin.comparePassword(password);
//   if (!isMatch) {
//     admin.failedLoginAttempts += 1;

//     // Lock account if too many failed attempts
//     if (admin.failedLoginAttempts >= 5) {
//       admin.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
//     }
//     await admin.save();
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   // Reset failed login attempts & update last login
//   admin.failedLoginAttempts = 0;
//   admin.accountLockedUntil = null;
//   admin.lastLogin = Date.now();
//   await admin.save();

//   // Generate token
//   const token = generateToken(admin);

//   // Set token in HttpOnly Cookie (secure way)
//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Secure only in production
//     sameSite: 'strict',
//     maxAge: 60 * 60 * 1000, // 1 hour
//   });

//   res.status(200).json({ message: 'Login successful' });
// });

// // Get all admins (Only Super Admin can view all admins)
// const getAllAdmins = asyncHandler(async (req, res) => {
//   if (req.user.role !== "Super Admin") {
//     return res.status(403).json({ message: 'Access denied' });
//   }

//   const admins = await Admin.find({}, '-password'); // Exclude passwords
//   res.status(200).json(admins);
// });

// // Get a single admin by ID (Only Super Admin or self)
// const getAdminById = asyncHandler(async (req, res) => {
//   const { adminId } = req.params;

//   if (req.user.role !== "Super Admin" && req.user._id !== adminId) {
//     return res.status(403).json({ message: 'Access denied' });
//   }

//   const admin = await Admin.findById(adminId, '-password');
//   if (!admin) {
//     return res.status(404).json({ message: 'Admin not found' });
//   }

//   res.status(200).json(admin);
// });

// // Update admin details (Only Super Admin or self)
// const updateAdmin = asyncHandler(async (req, res) => {
//   const { adminId } = req.params;
//   let updates = req.body;

//   if (req.user.role !== "Super Admin" && req.user._id !== adminId) {
//     return res.status(403).json({ message: 'Access denied' });
//   }

//   // Ensure password is hashed if updated
//   if (updates.password) {
//     updates.password = await bcrypt.hash(updates.password, 10);
//   }

//   const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, { new: true, select: '-password' });
//   if (!updatedAdmin) {
//     return res.status(404).json({ message: 'Admin not found' });
//   }

//   res.status(200).json(updatedAdmin);
// });

// // Soft delete an admin (Only Super Admin can deactivate admins)
// const deleteAdmin = asyncHandler(async (req, res) => {
//   const { adminId } = req.params;

//   if (req.user.role !== "Super Admin") {
//     return res.status(403).json({ message: 'Access denied' });
//   }

//   const admin = await Admin.findById(adminId);
//   if (!admin) {
//     return res.status(404).json({ message: 'Admin not found' });
//   }

//   // Instead of permanent delete, mark admin as inactive
//   admin.isActive = false;
//   await admin.save();

//   res.status(200).json({ message: 'Admin deactivated successfully' });
// });

// export {
//   createAdmin,
//   loginAdmin,
//   getAllAdmins,
//   getAdminById,
//   updateAdmin,
//   deleteAdmin,
// };



// import {User} from '../models/user.model.js';
// import {Product} from '../models/product.model.js';
// import {Review} from '../models/review.model.js';
// import Order from '../models/order.model.js';


// export const getAllUsers = async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// };

// export const banUser = async (req, res) => {
//   const user = await User.findById(req.params.id);
//   user.isBanned = true;
//   await user.save();
//   res.json({ message: 'User banned' });
// };

// export const unbanUser = async (req, res) => {
//   const user = await User.findById(req.params.id);
//   user.isBanned = false;
//   await user.save();
//   res.json({ message: 'User unbanned' });
// };

// export const hideProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   product.isHidden = true;
//   await product.save();
//   res.json({ message: 'Product hidden' });
// };

// export const showProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   product.isHidden = false;
//   await product.save();
//   res.json({ message: 'Product shown' });
// };

// export const hideReview = async (req, res) => {
//   const review = await Review.findById(req.params.id);
//   review.isHidden = true;
//   await review.save();
//   res.json({ message: 'Review hidden' });
// };

// export const showReview = async (req, res) => {
//   const review = await Review.findById(req.params.id);
//   review.isHidden = false;
//   await review.save();
//   res.json({ message: 'Review shown' });
// };
// export const getAllOrders = async (req, res) => {
//   // Assuming you have an Order model
//   const orders = await Order.find().populate('user', 'name email'); // Populate user details
//   res.json(orders);
// };
// export const getAllProducts = async (req, res) => {
//   const products = await Product.find().populate('category', 'name'); // Populate category details
//   res.json(products);
// };
// export const getAllReviews = async (req, res) => {
//   const reviews = await Review.find().populate('user', 'name email').populate('product', 'name'); // Populate user and product details
//   res.json(reviews);
// };
// export const getAdminAnalytics = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalProducts = await Product.countDocuments();
//     const totalReviews = await Review.countDocuments();
//     const totalOrders = await Order.countDocuments();

//     res.json({
//       totalUsers,
//       totalProducts,
//       totalReviews,
//       totalOrders,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching admin analytics', error });
//   }
// };
// export const getRecentOrders = async (req, res) => {
//   try {
//     const recentOrders = await Order.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'name email'); // Populate user details

//     res.json(recentOrders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching recent orders', error });
//   }
// };
// export const getRecentReviews = async (req, res) => {
//   try {
//     const recentReviews = await Review.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'name email')
//       .populate('product', 'name'); // Populate user and product details

//     res.json(recentReviews);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching recent reviews', error });
//   }
// };
// export const getRecentProducts = async (req, res) => {
//   try {
//     const recentProducts = await Product.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('category', 'name'); // Populate category details

//     res.json(recentProducts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching recent products', error });
//   }
// };

// export const getAdminAnalyticsData = async (req, res) => {
//   try {
//     const [orders, users, products, reviews] = await Promise.all([
//       getAllOrders(req, res),
//       getAllUsers(req, res),
//       getAllProducts(req, res),
//       getAllReviews(req, res),
//     ]);

//     const stats = {
//       totalUsers: users.length,
//       totalProducts: products.length,
//       totalOrders: orders.length,
//       totalReviews: reviews.length,
//       hiddenProducts: products.filter(p => p.isHidden).length,
//       hiddenReviews: reviews.filter(r => r.isHidden).length,
//       bannedUsers: users.filter(u => u.isBanned).length,
//     };

//     res.json(stats);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching admin analytics data', error });
//   }
// };
// export const getRecentOrdersData = async (req, res) => {
//   try {
//     const recentOrders = await getRecentOrders(req, res);
//     res.json(recentOrders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching recent orders', error });
//   }
// };
// export const getRecentReviewsData = async (req, res) => {
//   try {
//     const recentReviews = await getRecentReviews(req, res);
//     res.json(recentReviews);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching recent reviews', error });
//   }
// };
// export const getRecentProductsData = async (req, res) => {
//   try {
//     const recentProducts = await getRecentProducts(req, res);
//     res.json(recentProducts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching recent products', error });
//   }
// };

// export const getAdminDashboardData = async (req, res) => {
//   try {
//     const [orders, users, products, reviews] = await Promise.all([
//       Order.find(),
//       User.find(),
//       Product.find(),
//       Review.find(),
//     ]);

//     const stats = {
//       totalUsers: users.length,
//       totalProducts: products.length,
//       totalCategories: new Set(products.map(p => p.category?.toString())).size,
//       totalOrders: orders.length,
//       totalReviews: reviews.length,
//       hiddenProducts: products.filter(p => p.isHidden).length,
//       hiddenReviews: reviews.filter(r => r.isHidden).length,
//       bannedUsers: users.filter(u => u.isBanned).length,
//     };

//     res.json(stats);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching admin dashboard data', error });
//   }
// };


// adminController.js

import {User} from '../models/user.model.js';
import {Product} from '../models/product.model.js';
import {Review} from '../models/review.model.js';
import { Brand } from '../models/brand.model.js';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Category } from '../models/category.model.js';
import mongoose from 'mongoose';
import fs from "fs";

export const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const orderLimit = parseInt(req.query.orderLimit) || 5;
    const productLimit = parseInt(req.query.productLimit) || 5;

    const [
      totalUsers,
      bannedUsers,
      verifiedUsers,
      unverifiedUsers,
      recentUsers,

      totalProducts,
      hiddenProducts,
      lowStock,
      outOfStock,
      recentProducts,
      topSelling,
      mostViewed,

      totalOrders,
      completedOrders,
      pendingOrders,
      returnedOrders,
      recentOrders,
      todayOrders,
      monthRevenue,
      todayRevenue,

      totalReviews,
      flaggedReviews,
      hiddenReviews,
      averageRating,
      recentReviews,

      totalCategories,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
      User.find().sort({ createdAt: -1 }).limit(5).lean(),

      Product.countDocuments(),
      Product.countDocuments({ isHidden: true }),
      Product.countDocuments({ stock: { $lt: 10, $gt: 0 } }),
      Product.countDocuments({ stock: 0 }),
      Product.find().sort({ createdAt: -1 }).limit(productLimit).populate({ path: "category", select: "name" }),
      Product.find().sort({ salesCount: -1 }).limit(productLimit).lean(),
      Product.find().sort({ views: -1 }).limit(productLimit).lean(),

      Order.countDocuments(),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'returned' }),
      Order.find().sort({ createdAt: -1 }).limit(orderLimit).populate("userId" , "name").lean(),
      Order.countDocuments({ createdAt: { $gte: today } }),

      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]),
      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },

      ]),

      Category.countDocuments,
      
      Review.countDocuments(),
      Review.countDocuments({ isFlagged: true }),
      Review.countDocuments({ isHidden: true }),
      Review.aggregate([{ $group: { _id: null, avgRating: { $avg: "$rating" } } }]),
      Review.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").populate("product", "name").lean()
    ]);

    res.json({
      users: {
        total: totalUsers,
        banned: bannedUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        recent: recentUsers
      },
      products: {
        total: totalProducts,
        hidden: hiddenProducts,
        lowStock,
        outOfStock,
        recent: recentProducts,
        topSelling,
        mostViewed
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        returned: returnedOrders,
        today: todayOrders,
        recent: recentOrders
      },
      revenue: {
        today: todayRevenue[0]?.total || 0,
        thisMonth: monthRevenue[0]?.total || 0
      },
      reviews: {
        total: totalReviews,
        flagged: flaggedReviews,
        hidden: hiddenReviews,
        averageRating: Number(averageRating[0]?.avgRating || 0).toFixed(2),
        recent: recentReviews
      },
      categories:{
        total:totalCategories,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load admin dashboard", error });
  }
};




export const getAllAdminOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const filter = {};

    // Optional: filter by order status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Optional: filter by date range
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) {
        filter.createdAt.$gte = new Date(req.query.from);
      }
      if (req.query.to) {
        const toDate = new Date(req.query.to);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    // ✅ Fetch orders with populated user info
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'userName email') 
      .lean();

      const total = await Order.countDocuments(filter);
      
      res.json({ total, orders });
    } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export 
const createProduct = asyncHandler(async (req, res) => {
  const { description, price, category, name, stock, brand } = req.body;
  const images = req.files; // Multer stores files in `req.files`

  try {
    // 1. Validate Required Fields
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!price) return res.status(400).json({ message: "Price is required" });
    if (!category) return res.status(400).json({ message: "Category is required" });
    if (!images || images.length === 0) return res.status(400).json({ message: "Images are required" });

    // 2. Validate Category Existence
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }
    const brandExists = await Brand.findById(brand);
    if(!brandExists){
      return res.status(400).json({message:"invalid brand name"})
    }

    // 3. Upload Images to Cloudinary
    const uploadedImages = [];
    
    for (const file of images) {
      const uploadedImage = await uploadOnCloudinary(file.path);
      if (!uploadedImage?.secure_url) {
        return res.status(500).json({ message: "Failed to upload images" });
      }
      uploadedImages.push(uploadedImage.secure_url);
    }

    // 4. Create the Product
    const newProduct = new Product({
      name,
      description,
      price,
      images: uploadedImages, // Store Cloudinary URLs
      category,
      stock,
      brand,
    });

    await newProduct.save();

    // 5. Response
    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while creating the product",
      error: error.message,
    });
  }
});

export const getAllProducts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query['stock[lt]']) filter.stock = { $lt: Number(req.query['stock[lt]']) };
  if (req.query['stock[gt]']) filter.stock = { ...(filter.stock || {}), $gt: Number(req.query['stock[gt]']) };

  const products = await Product.find(filter).sort(sort).skip(skip).limit(limit).lean();
  const total = await Product.countDocuments(filter);
  res.json({ total, products });
};

export const deleteProduct = asyncHandler(async (req, res) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.status(200).json({ message: "Product deleted successfully" });
});


export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, brand } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  if (!name || !price || !category || !stock || !brand) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let images = [];

  // 1. Parse old image URLs from the form data (stringified array)
  if (req.body.oldImages) {
    try {
      const parsed = JSON.parse(req.body.oldImages);
      if (Array.isArray(parsed)) images = parsed;
    } catch {
      console.warn("Could not parse oldImages");
    }
  }

  // 2. Handle newly uploaded files
  if (req.files?.length) {
    try {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadOnCloudinary(file.path);

          // Clean up local file after upload
          fs.unlink(file.path, (err) => {
            if (err) console.error("Failed to delete local file:", err);
          });

          return result?.secure_url;
        })
      );

      images = [...images, ...uploadedImages.filter(Boolean)];
    } catch (error) {
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

  // 3. Update the product in the database
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    { name, description, price, category, stock, brand, images },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});



export const getProductById = asyncHandler(async (req, res) => {
  console.log("Received req.params:", JSON.stringify(req.params, null, 2)); // Debugging
  let { productId } = req.params;

  // Convert productId to a string if it’s an object
  productId = String(productId);


  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;

  const products = await Product.find().limit(limit);

  res.status(200).json({ products });
});

export const hideProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.isHidden = true;
  await product.save();
  res.json({ message: 'Product hidden' });
};

export const showProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.isHidden = false;
  await product.save();
  res.json({ message: 'Product shown' });
};

export const hideReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  review.isHidden = true;
  await review.save();
  res.json({ message: 'Review hidden' });
};

export const showReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  review.isHidden = false;
  await review.save();
  res.json({ message: 'Review shown' });
};



export const updateProductDescriptionBlocks = async (req, res) => {
  try {
    const productId = req.params.productId;
    const blocks = JSON.parse(req.body.blocks); // must be stringified JSON
    const files = req.files;

    if (!Array.isArray(blocks)) {
      return res.status(400).json({ message: "Invalid description blocks data." });
    }

    const uploadedBlocks = await Promise.all(
      blocks.map(async (block, index) => {
        if (!block.layout || !block.text) {
          throw new Error("Each block must have layout and text.");
        }

        const file = files[index];
        if (!file) throw new Error("Missing image file.");

        const uploadResult = await uploadOnCloudinary(file.path);
        return {
          layout: block.layout,
          text: block.text,
          image: uploadResult.secure_url,
        };
      })
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { descriptionBlocks: uploadedBlocks },
      { new: true }
    );

    res.status(200).json({
      message: "Description blocks updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getAllPayments = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.method) filter.method = req.query.method;

  const payments = await Payment.find(filter).sort(sort).skip(skip).limit(limit).lean();
  const total = await Payment.countDocuments(filter);
  res.json({ total, payments });
};

export const getAllReviews = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.isApproved) filter.isApproved = req.query.isApproved === 'true';
  if (req.query.isFlagged) filter.isFlagged = req.query.isFlagged === 'true';
  
  const reviews = await Review.find(filter).sort(sort).skip(skip).limit(limit).lean();
  const total = await Review.countDocuments(filter);
  res.json({ total, reviews });
};


export const getRecentActivity = async (req, res) => {
  try {
    const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

      const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('product', 'name');
      
      const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name');

      const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');
      
      res.json({
        recentOrders,
        recentReviews,
        recentProducts,
        recentUsers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch recent activity', error: err });
    }
  };
  
  export const getOrderCountByDate = async (req, res) => {
    const { from, to } = req.query;
    
    const match = {};
    if (from || to) {
      match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const result = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } } // chronological order
  ]);
  
  res.json(result);
};

export const banUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBanned = true;
  await user.save();
  res.json({ message: 'User banned' });
};


export const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};

  // 🔍 Handle role filter
  if (req.query.role === 'admin') filter.isAdmin = true;
  if (req.query.role === 'user') filter.isAdmin = false;

  // 🔍 Handle banned status filter
  if (req.query.isBanned !== undefined)
    filter.isBanned = req.query.isBanned === 'true';

  const users = await User.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .select(
      '-password -refreshToken -isAdmin -passwordResetToken -passwordResetExpires'
    );

  const total = await User.countDocuments(filter);

  res.json({ total, users });
};

export const unbanUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBanned = false;
  await user.save();
  res.json({ message: 'User unbanned' });
};

//brand-controller:

export const updateBrand = asyncHandler(async (req, res) => {
  const { name, description, category , isTopBrand } = req.body;
  const { brandId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(brandId)) {
    throw new ApiError(400, "Invalid brand ID");
  }

  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  // Upload new image if provided
  let image = brand.image;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult.secure_url) {
      throw new ApiError(500, "Image upload failed");
    }
    image = uploadResult.secure_url;
  }

  brand.name = name?.toLowerCase() || brand.name;
  brand.description = description || brand.description;
  brand.image = image;
  brand.category = category || brand.category;
brand.isTopBrand = isTopBrand !== undefined ? isTopBrand : brand.isTopBrand;

  await brand.save();

  res.status(200).json({
    success: true,
    message: "Brand updated successfully",
    brand,
  });
});


export const deleteBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(brandId)) {
    throw new ApiError(400, "Invalid brand ID");
  }

  const brand = await Brand.findByIdAndDelete(brandId);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
});

export const createBrand = asyncHandler(async (req, res) => {
  try {
    const { name, description, isTopBrand = false } = req.body;
    let { category } = req.body;

    if (!name || !category) {
      throw new ApiError(400, "Name and category are required");
    }

    if (typeof category === "string") {
      try {
        const parsed = JSON.parse(category);
        category = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        category = [category];
      }
    }

    const isValidCategoryIds = category.every(id =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!isValidCategoryIds) {
      throw new ApiError(400, "Invalid category ID(s)");
    }

    const existing = await Brand.findOne({ name: name.toLowerCase() });
    if (existing) {
      throw new ApiError(409, "Brand already exists");
    }

    if (!req.file) {
      throw new ApiError(400, "Image file is required");
    }

    const uploadResponse = await uploadOnCloudinary(req.file.path);
    if (!uploadResponse?.secure_url) {
      throw new ApiError(500, "Failed to upload image");
    }

    const brand = await Brand.create({
      name: name.toLowerCase(),
      image: uploadResponse.secure_url,
      description,
      category,
      // isTopBrand: isTopBrand === "true" || isTopBrand === true,
       isTopBrand: Boolean(isTopBrand)
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });

  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});



export const getTopBrandsWithLatestProducts = async (req, res) => {
  try {
    // Fetch top brands
    const topBrands = await Brand.find({ isTopBrand: true });

    const brandProductMap = await Promise.all(
      topBrands.map(async (brand) => {
        const latestProducts = await Product.find({
          brand: brand._id,
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(5);

        return {
          _id: brand._id,
          name: brand.name,
          image: brand.image,
          description: brand.description,
          products: latestProducts,
        };
      })
    );

    res.status(200).json({ topBrands: brandProductMap });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top brands with products" });
  }
};



//category-controller:


export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory, isActive } = req.body;
const image = req.files
  try {
    // Validate Parent Category
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({ message: "Invalid parent category" });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { name, description, parentCategory, isActive , image},
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Ensure No Products Are Associated Before Deletion
    const products = await Product.find({ category: categoryId });
    if (products.length > 0) {
      return res.status(400).json({ message: "Cannot delete category with associated products" });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

 export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required!" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Category image is required!" });
  }

  // Upload image to Cloudinary
  const imageUrl = await uploadOnCloudinary(req.file.path);
  if (!imageUrl) {
    return res.status(500).json({ message: "Image upload failed" });
  }

  // Check if parent category is valid
  let parent = null;
  if (parentCategory) {
    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) {
      return res.status(400).json({ message: "Invalid parent category ID" });
    }
    parent = parentCategory;
  }

  const category = new Category({
    name,
    image: imageUrl, // ✅ Save Cloudinary image URL
    description,
    parentCategory: parent || null,
  });

  await category.save();

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});