// wishlist.controller.js
import { Wishlist } from '../models/wishlist.model.js';
import { Types } from 'mongoose';

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => Types.ObjectId.isValid(id);

// Aggregation Pipeline for Wishlist
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
        'productDetails.averageRating': {
          $cond: [
            { $gt: [{ $size: { $ifNull: ['$productDetails.ratings', []] } }, 0] },
            { $avg: '$productDetails.ratings.rating' },
            0
          ]
        },
        'productDetails.totalRatings': {
          $size: { $ifNull: ['$productDetails.ratings', []] }
        },
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


// 📌 Get Wishlist
export const getAdvancedWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID.' });
    }

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

   const wishlist = await Wishlist.findOne({ user: userId })
  .populate({
    path: "items.product",
    select: "name price images", // Only return needed fields
  });

res.status(200).json({
  wishlist: wishlist?.items?.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    images: item.product.images, // Make sure images is an array
  })) || []
});

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 📌 Add Product to Wishlist
export const addProductToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid User or Product ID.' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const exists = wishlist.items.some((item) => item.product.toString() === productId);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist.' });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.status(200).json({ success: true, message: 'Product added to wishlist.', wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 📌 Remove Product from Wishlist
export const removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid IDs.' });
    }

    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ success: false, message: 'Product not found in wishlist.' });
    }

    res.status(200).json({ success: true, message: 'Product removed from wishlist.', wishlist: updatedWishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
