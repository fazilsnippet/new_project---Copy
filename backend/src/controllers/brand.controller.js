
import { Brand } from "../models/brand.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";




// @desc    Get all brands
export const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().populate("category", "name");
  res.status(200).json({ success: true, brands });
});



export const getBrandById = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(brandId)) {
    throw new ApiError(400, "Invalid brand ID");
  }

const brand = await Brand.findById(brandId).populate("category", "name");

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  // Ensure consistent shape in response for frontend (category._id always exists)
  const responseBrand = {
    ...brand.toObject(),
    category: {
      _id: brand.category?._id || brand.category,
      name: brand.category?.name || "",
    },
  };

  res.status(200).json({ success: true, brand: responseBrand });
});


export const getProductsByBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12; // default 12 products

  if (!brandId) {
    throw new ApiError(400, "Brand ID is required");
  }

  // Count total products for pagination info
  const totalProducts = await Product.countDocuments({
    brand: brandId,  });

  // Fetch products for the brand with pagination
  const products = await Product.find({ brand: brandId })
    .select("-__v")
    .populate("brand", "name image")
    .populate("category", "name")
    .skip((page - 1) * limit)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          totalProducts,
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
        },
      },
      "Products fetched successfully"
    )
  );
});
