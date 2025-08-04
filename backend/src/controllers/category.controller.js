import { Category } from '../models/category.model.js';
import  {Product}  from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose'; 
import { uploadOnCloudinary } from '../utils/cloudinary.js';




// 2. Get All Categories with Hierarchy and Product Counts
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentCategory",
          as: "subcategories",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          products: 0, // Exclude product details to avoid heavy response
        },
      },
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

// 3. Get Category By ID with Subcategories and Products
// const getCategoryById = asyncHandler(async (req, res) => {
//     try {
//       const { categoryId } = req.params;
  
//       // Validate ObjectId
//       if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//         return res.status(400).json({ message: "Invalid category ID" });
//       }
  
//       const category = await Category.aggregate([
//         { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
//         {
//           $lookup: {
//             from: "categories", // Subcategories lookup
//             localField: "_id",
//             foreignField: "parentCategory",
//             as: "subcategories",
//           },
//         },
//         {
//           $lookup: {
//             from: "products", // Associated products lookup
//             localField: "_id",
//             foreignField: "category",
//             as: "products",
//           },
//         },
//       ]);
  
//       if (!category.length) {
//         return res.status(404).json({ message: "Category not found" });
//       }
  
//       res.status(200).json({ category: category[0] }); // Return the first (and only) match
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching category", error: error.message });
//     }
//   });


const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const totalProducts = await Product.countDocuments({ category: categoryId });

    const products = await Product.find({ category: categoryId })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      category,
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
});



export {
  getAllCategories,
  getCategoryById,
};
