// import { Product } from '../models/Product.js'; // Import Product model
// import { Category } from '../models/Category.js'; // Import Category model (optional, for validating categories)
// import { asyncHandler } from '../utils/asyncHandler.js';

// const  createProduct= asyncHandler(async(req, res)=> {
//     try {
//       const { name, description, price, images, category, stock } = req.body;

//       // Validate category existence
//       const categoryExists = await Category.findById(category);
//       if (!categoryExists) {
//         return res.status(400).json({ message: "Invalid category" });
//       }

//       const newProduct = new Product({
//         name,
//         description,
//         price,
//         images,
//         category,
//         stock,
//       });

//       await newProduct.save();
//       res.status(201).json({ message: "Product created successfully", product: newProduct });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   })

//   // Get all products with optional filters (category, price range, etc.)
//   const getAllProducts = asyncHandler(async(req, res)=> {
//     try {
//       const { category, minPrice, maxPrice, search, sort } = req.query;

//       const filter = {};
//       if (category) {
//         filter.category = category;
//       }
//       if (minPrice && maxPrice) {
//         filter.price = { $gte: minPrice, $lte: maxPrice };
//       }
//       if (search) {
//         filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
//       }

//       const sortBy = sort ? { [sort]: 1 } : { createdAt: -1 }; // Sort by a field (default by creation date)

//       const products = await Product.find(filter)
//         .populate('category', 'name') // Populate category details (optional)
//         .sort(sortBy);

//       res.status(200).json({ products });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   })

//   // Get a single product by ID
//   const getProductById= asyncHandler(async(req, res)=>{
//     try {
//       const product = await Product.findById(req.params.productId).populate('category', 'name');

//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       res.status(200).json({ product });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   })

//   // Update a product by ID
//  const updateProduct= asyncHandler(async(req, res)=>{
//     try {
//       const { name, description, price, images, category, stock } = req.body;

//       const updatedProduct = await Product.findByIdAndUpdate(
//         req.params.productId,
//         {
//           name,
//           description,
//           price,
//           images,
//           category,
//           stock,
//           updatedAt: Date.now(),
//         },
//         { new: true } // Return the updated document
//       );

//       if (!updatedProduct) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   })

//   // Delete a product by ID
// const deleteProduct= asyncHandler(async(req, res)=>{
//     try {
//       const product = await Product.findByIdAndDelete(req.params.productId);

//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       res.status(200).json({ message: "Product deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   })

//   // Add a rating and review to a product
// const addReview=asyncHandler(async(req, res)=>{
//     try {
//       const { rating, review } = req.body;
//       const userId = req.user.id; // Assuming the logged-in user's ID is passed in the request

//       // Validate rating range (1 to 5)
//       if (rating < 1 || rating > 5) {
//         return res.status(400).json({ message: "Rating must be between 1 and 5" });
//       }

//       const product = await Product.findById(req.params.productId);

//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       // Add the new rating and review
//       product.ratings.push({
//         userId,
//         rating,
//         review,
//       });

//       // Recalculate average rating
//       const totalRatings = product.ratings.length;
//       const sumRatings = product.ratings.reduce((sum, rating) => sum + rating.rating, 0);
//       product.rating = sumRatings / totalRatings;

//       await product.save();

//       res.status(200).json({ message: "Review added successfully", product });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   }
// )

// export{
//     deleteProduct,
//     updateProduct,
//     createProduct,
//     addReview,
//     getAllProducts,
//     getProductById,
//   };

import mongoose from "mongoose";
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;

    // Initialize filters
    const filter = {};

    // 1. Filter by Category
    if (category) filter.category = category;

    // 2. Filter by Price Range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // 3. Search by Name or Description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 4. Define Sorting
    const sortOptions = sort ? { [sort]: 1 } : { createdAt: -1 };

    // 5. Pagination Logic
    const paginationLimit = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * paginationLimit;

    // 6. Query the Database
    const products = await Product.find(filter)
      .populate("category", "name") // Populate category details
      .sort(sortOptions)
      .skip(skip) // For pagination
      .limit(paginationLimit);

    // Response
    res.status(200).json(products); // Return only the array of products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching products", error: error.message });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  console.log("Received req.params:", JSON.stringify(req.params, null, 2)); // Debugging
  let { productId } = req.params;

  // Convert productId to a string if it’s an object
  productId = String(productId);
//testing fazil
  console.log("Converted productId:", productId, typeof productId);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, images, category, stock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    { name, description, price, images, category, stock },
    { new: true } // Return updated document
  );

  if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

  res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.status(200).json({ message: "Product deleted successfully" });
});

const addReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const userId = req.user.id; // Ensure user is authenticated

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Check if user has already reviewed
  const existingReview = product.ratings.find(rating => rating.userId.toString() === userId);
  if (existingReview) {
    return res.status(400).json({ message: "User has already reviewed this product" });
  }

  product.ratings.push({ userId, rating, review });

  // Recalculate average rating
  const totalRatings = product.ratings.length;
  const sumRatings = product.ratings.reduce((sum, rating) => sum + rating.rating, 0);
  product.rating = sumRatings / totalRatings;

  await product.save();

  res.status(200).json({ message: "Review added successfully", rating: product.rating });
});

export { deleteProduct, updateProduct, createProduct, addReview, getAllProducts, getProductById };