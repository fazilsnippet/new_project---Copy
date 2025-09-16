

import mongoose from "mongoose";
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Order from "../models/order.model.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";



const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const { brand, category, minPrice, maxPrice, search, sort, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = sort ? { [sort]: 1 } : { createdAt: -1 };
    const paginationLimit = parseInt(limit, 6);
    const skip = (parseInt(page, 10) - 1) * paginationLimit;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
       .populate({
  path: "brand",
  select: "name",
  match: { isActive: true } // optional condition
})
.populate({
  path: "category",
  select: "name",
  match: { isActive: true } // optional condition
})

        .sort(sortOptions)
        .skip(skip)
        .limit(paginationLimit),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      products,
      totalCount,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / paginationLimit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
});

// const getAllProducts = asyncHandler(async (req, res) => {
//   try {
//     const {
//       brand,
//       category,
//       minPrice,
//       maxPrice,
//       search,
//       sort = "createdAt:desc",
//       page = 1,
//       limit = 12
//     } = req.query;

//     const filter = {};

//     // Brand filter
//     if (brand) filter.brand = brand;

//     // Category filter
//     if (category) filter.category = category;

//     // Price range filter
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
//     }

//     // Search in name or description
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Sort parsing
//     const [sortField, sortOrder] = sort.split(":");
//     const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

//     // Pagination
//     const paginationLimit = parseInt(limit, 10);
//     const skip = (parseInt(page, 10) - 1) * paginationLimit;

//     // Query + count
//     const [products, totalCount] = await Promise.all([
//       Product.find(filter)
//         .populate({ path: "brand", select: "name", match: { isActive: true } })
//         .populate({ path: "category", select: "name", match: { isActive: true } })
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(paginationLimit),
//       Product.countDocuments(filter)
//     ]);

//     // Response
//     res.status(200).json({
//       products,
//       pagination: {
//         totalCount,
//         currentPage: parseInt(page, 10),
//         totalPages: Math.ceil(totalCount / paginationLimit),
//         limit: paginationLimit
//       },
//       filtersApplied: { brand, category, minPrice, maxPrice, search, sort }
//     });

//     res.status(200).json(products); // Now returns only an array
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "An error occurred while fetching products",
//       error: error.message,
//     });
//   }
// });


const getProductById = asyncHandler(async (req, res) => {
  console.log("Received req.params:", JSON.stringify(req.params, null, 5)); // Debugging
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
  const limit = Number(req.query.limit) || 20;

  const products = await Product.find().limit(limit);

  res.status(200).json({ products });
});






// const addReview = asyncHandler(async (req, res) => {
//   const { rating, review } = req.body;
//   const userId = req.user._id; // Ensure user is authenticated

//   if (rating < 1 || rating > 5) {
//     return res.status(400).json({ message: "Rating must be between 1 and 5" });
//   }

//   const product = await Product.findById(req.params.productId);
//   if (!product) return res.status(404).json({ message: "Product not found" });

//   // Check if user has already reviewed
//   const existingReview = product.ratings.find(rating => rating.userId.toString() === userId);
//   if (existingReview) {
//     return res.status(400).json({ message: "User has already reviewed this product" });
//   }

//   product.ratings.push({ userId, rating, review });

//   // Recalculate average rating
//   const totalRatings = product.ratings.length;
//   const sumRatings = product.ratings.reduce((sum, rating) => sum + rating.rating, 0);
//   product.rating = sumRatings / totalRatings;

//   await product.save();

//   res.status(200).json({ message: "Review added successfully", rating: product.rating });
// });





// // 🔍 Semantic Search
// const handleSemanticSearch = async (req, res) => {
//   const { query } = req.body;

//   if (!query) {
//     return res.status(400).json({ message: "Search text is required" });
//   }

//   try {
//     // Send JSON payload with query key
//     const response = await axios.post("http://localhost:8000/search/semantic", { query });

//     // Extract product IDs from response.results array
//     const productId = response.data.results.map(item => item.product._id);

//     const products = await Product.find({ _id: { $in: productId } });

//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Semantic Search Error:", error.message);
//     res.status(500).json({ message: "Semantic search failed", error: error.message });
//   }
// };

export const handleSemanticSearch = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Search text is required" });
  }

  try {
    const formData = new FormData();
    formData.append("text", text);

    const response = await axios.post("http://localhost:8000/semantic-search", formData, {
      headers: formData.getHeaders()
    });

    const productIds = response.data.similar_product_ids;

    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json(products);
  } catch (error) {
    console.error("Semantic search failed:", error.message);
    res.status(500).json({ message: "Semantic search failed", error: error.message });
  }
};


// 🖼️ Visual Search
const handleVisualSearch = async (req, res) => {
  try {
    const filePath = req.file.path;

    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:8000/visual-search", form, {
      headers: form.getHeaders(),
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("File cleanup failed:", err);
    });

    const productIds = response.data.similar_product_ids;
    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json(products);
  } catch (error) {
    console.error("Visual Search Error:", error.message);
    res.status(500).json({ message: "Visual search failed", error: error.message });
  }
};

// 🎤 Voice Search
const handleVoiceSearch = async (req, res) => {
  try {
    const filePath = req.file.path;

    const form = new FormData();
    form.append("audio", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:8000/voice-search", form, {
      headers: form.getHeaders(),
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("Audio file cleanup failed:", err);
    });

    const productIds = response.data.similar_product_ids;
    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json(products);
  } catch (error) {
    console.error("Voice Search Error:", error.message);
    res.status(500).json({ message: "Voice search failed", error: error.message });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 20;
    let skip =parseInt(req.query.skip) || 0;
    if (limit > 100) limit = 100;

const topProducts = await Order.aggregate([
  {
    $match: {
      status: { $in: ['paid', 'attempted'] },
      "products.productId": { $type: "objectId", $ne: null }
    }
  },
  { $unwind: "$products" },
  {
    $group: {
      _id: "$products.productId",
      totalSold: { $sum: "$products.quantity" }
    }
  },
  { $sort: { totalSold: -1 } },
  {$skip:skip},
  { $limit: limit },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      _id: 0,
      productId: "$product._id",
      name: "$product.name",
      brand: "$product.brand",
      images: "$product.images",
      price: "$product.price",
      totalSold: 1
    }
  }
]);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    res.status(500).json({ error: "Failed to fetch top selling products" });
  }
};




//  const getTopSellingProducts = async (req, res) => {
//   try {
//     const limit = Math.min(parseInt(req.query.limit) || 20, 100);
//     const skip = parseInt(req.query.skip) || 0;
//     const range = req.query.range || "allTime";

//     const matchFilter = buildTimeRangeMatch(range);

//     const topProducts = await Order.aggregate([
//       { $match: matchFilter },
//       { $unwind: "$products" },
//       {
//         $group: {
//           _id: "$products.productId",
//           totalSold: { $sum: "$products.quantity" },
//         },
//       },
//       { $sort: { totalSold: -1 } },
//       { $skip: skip },
//       { $limit: limit },
//       {
//         $lookup: {
//           from: "products",
//           localField: "_id",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       { $unwind: "$product" },
//       {
//         $project: {
//           _id: 0,
//           productId: "$product._id",
//           name: "$product.name",
//           brand: "$product.brand",
//           images: "$product.images",
//           price: "$product.price",
//           totalSold: 1,
//         },
//       },
//     ]);

//     return res.status(200).json(topProducts);
//   } catch (error) {
//     console.error("Error fetching top-selling products:", error);
//     res.status(500).json({ error: "Failed to fetch top-selling products." });
//   }
// };

// /**
//  * Returns a MongoDB match filter for time-based aggregation
//  */
// function buildTimeRangeMatch(range) {
//   const baseMatch = {
//     status: { $in: ["paid", "attempted"] },
//     "products.productId": { $type: "objectId", $ne: null },
//   };

//   const now = Date.now();

//   if (range === "last7days") {
//     baseMatch.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
//   } else if (range === "last30days") {
//     baseMatch.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
//   }

//   return baseMatch;
// }



const getRecentProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 }) // most recent first
      .skip(skip)
      .limit(limit)
      .populate("brand category"); // optional if needed

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching recent products:", error);
    res.status(500).json({ error: "Failed to fetch recent products" });
  }
};



 const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get the current product
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find products with same category, excluding current product
    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: currentProduct._id },
    }).limit(8); // Limit results for better UI

    res.status(200).json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export {getRelatedProducts, getRecentProducts, getTopSellingProducts , getProducts, getAllProducts, getProductById, handleVisualSearch , handleVoiceSearch };
