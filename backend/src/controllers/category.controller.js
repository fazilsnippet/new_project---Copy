import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// 1. Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  try {
    // Validate Required Fields
    if (!name) {
      return res.status(400).json({ message: "Category name is required!!!!" });
    }

    // Check if Parent Category Exists
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({ message: "Invalid parent category" });
      }
    }

    // Create Category
    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
    });

    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});

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
const getCategoryById = asyncHandler(async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
  
      const category = await Category.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
        {
          $lookup: {
            from: "categories", // Subcategories lookup
            localField: "_id",
            foreignField: "parentCategory",
            as: "subcategories",
          },
        },
        {
          $lookup: {
            from: "products", // Associated products lookup
            localField: "_id",
            foreignField: "category",
            as: "products",
          },
        },
      ]);
  
      if (!category.length) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(200).json({ category: category[0] }); // Return the first (and only) match
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching category", error: error.message });
    }
  });

// 4. Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory, isActive } = req.body;

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
      { name, description, parentCategory, isActive },
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

// 5. Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
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

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
