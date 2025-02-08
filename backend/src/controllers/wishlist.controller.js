import { Wishlist } from '../models/wishlist.model.js';

import { Types } from 'mongoose';

// Helper function to check if ObjectId is valid
const isValidObjectId = (id) => Types.ObjectId.isValid(id);

// Function to get aggregation pipeline for wishlist with optional pagination
const getWishlistAggregationPipeline = (userId, skip = 0, limit = 20) => {
  return [
    { $match: { user: userId } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $addFields: {
        'productDetails.averageRating': { $avg: '$productDetails.ratings.rating' },
        'productDetails.totalRatings': { $size: '$productDetails.ratings' },
      },
    },
    {
      $group: {
        _id: '$_id',
        user: { $first: '$user' },
        items: { $push: { product: '$productDetails', addedAt: '$createdAt' } },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        user: {
          _id: '$userDetails._id',
          userName: '$userDetails.userName',
          email: '$userDetails.email',
          fullName: '$userDetails.fullName',
        },
        items: {
          productId: '$items.product._id',
          name: '$items.product.name',
          description: '$items.product.description',
          price: '$items.product.price',
          averageRating: '$items.product.averageRating',
          totalRatings: '$items.product.totalRatings',
          category: '$items.product.category',
          images: '$items.product.images',
        },
      },
    },
  ];
};

// Get advanced wishlist details
export const getAdvancedWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user's data.
    
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Valid User ID is required.' });
    }

    const { skip = 0, limit = 20 } = req.query; // Pagination: default skip 0, limit 20

    const wishlist = await Wishlist.aggregate(getWishlistAggregationPipeline(userId, parseInt(skip), parseInt(limit)));

    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ message: 'Wishlist not found or empty.' });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error('Error fetching advanced wishlist:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove product from wishlist
export const removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from URL params
    const userId = req.user._id; // User ID from authenticated request

    // Validate productId and userId
    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Valid Product ID is required.' });
    }

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Valid User ID is required.' });
    }

    // Find the wishlist and remove the item (product) from the `items` array
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { user: userId, 'items.product': productId }, // Match the user and the product in the wishlist
      { $pull: { items: { product: productId } } }, // Remove the item from the array
      { new: true } // Return the updated wishlist
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: 'Product not found in wishlist.' });
    }

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: updatedWishlist });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
