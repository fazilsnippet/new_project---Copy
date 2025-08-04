// // ReviewController.js
// import { Order } from "../models/order.model.js";
// import { Review } from "../models/review.model.js";

// // ✅ Create Review
// export const createReview = async (req, res) => {
//   const userId = req.user._id;
//   const productId = req.body.productId;

//   try {
//     // 1. Check if user purchased this product
//     const hasPurchased = await Order.findOne({
//       user: userId,
//       "items.product": productId,
//       status: { $in: ["delivered", "completed"] }
//     });

//     if (!hasPurchased) {
//       return res.status(403).json({ message: "Only verified buyers can review." });
//     }

//     // 2. Check for existing review
//     const existingReview = await Review.findOne({ user: userId, product: productId });
//     if (existingReview) {
//       return res.status(400).json({ message: "You have already reviewed this product." });
//     }

//     const { rating, comment } = req.body;

//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({ message: "Rating must be between 1 and 5." });
//     }

//     if (!comment || comment.trim() === "") {
//       return res.status(400).json({ message: "Comment cannot be empty." });
//     }

//     const review = new Review({
//       user: userId,
//       product: productId,
//       rating,
//       comment,
//       hasPurchased: true
//     });

//     const savedReview = await review.save();
//     res.status(201).json(savedReview);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating review", error });
//   }
// };

// // ✅ Get All Reviews for a Product
// export const getReviews = async (req, res) => {
//   const productId = req.params.productId;

//   if (!productId) {
//     return res.status(400).json({ message: "Product ID is required" });
//   }

//   try {
//     const reviews = await Review.find({ product: productId })
//       .populate("user", "name email")
//       .exec();

//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching reviews", error });
//   }
// };



// // ✅ Update Review
// export const updateReview = async (req, res) => {
//   const reviewId = req.params.reviewId;
//   const { rating, comment } = req.body;

//   if (!reviewId) {
//     return res.status(400).json({ message: "Review ID is required" });
//   }

//   try {
//     const review = await Review.findById(reviewId);
//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // ✅ Check if the user is the owner or admin
//     if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Unauthorized to update this review" });
//     }

//     review.rating = rating || review.rating;
//     review.comment = comment || review.comment;

//     const updatedReview = await review.save();
//     res.status(200).json(updatedReview);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating review", error });
//   }
// };

// // ✅ Delete Review
// export const deleteReview = async (req, res) => {
//   const reviewId = req.params.reviewId;

//   if (!reviewId) {
//     return res.status(400).json({ message: "Review ID is required" });
//   }

//   try {
//     const review = await Review.findById(reviewId);
//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // ✅ Check if the user is the owner or admin
//     if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Unauthorized to delete this review" });
//     }

//     await review.deleteOne();
//     res.status(200).json({ message: "Review deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting review", error });
//   }
// };


import  Order  from "../models/order.model.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js"; 

// ✅ Create Review
// export const createReview = async (req, res) => {
//   const userId = req.user._id;
//   const productId = req.params.productId; // ✅ Correct source

//   try {
//     const hasPurchased = await Order.findOne({
//       user: userId,
//       "items.product": productId,
//       status: { $in: ["delivered", "paid",] }
//     });

//     if (!hasPurchased) {
//       return res.status(403).json({ message: "Only verified buyers can review." });
//     }

//     const existingReview = await Review.findOne({ user: userId, product: productId });
//     if (existingReview) {
//       return res.status(400).json({ message: "You have already reviewed this product." });
//     }

//     const { rating, comment } = req.body;

//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({ message: "Rating must be between 1 and 5." });
//     }
//     if (!comment?.trim()) {
//       return res.status(400).json({ message: "Comment cannot be empty." });
//     }

//     const review = new Review({
//       user: userId,
//       product: productId,
//       rating,
//       comment,
//       isVerifiedPurchase: true
//     });

//     const savedReview = await review.save();

//     await Product.updateRatingStats(productId);

//     res.status(201).json(savedReview);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating review", error });
//   }
// };


//only for testing without buying rating , for production use the upper one
export const createReview = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  try {
    // ⚠️ TEMP: Skip purchase check for testing
    // const hasPurchased = await Order.findOne(...)

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    if (!comment?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
      isVerifiedPurchase: true // Force verified for testing
    });

    const savedReview = await review.save();
    await Product.updateRatingStats(productId);

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};




export const getReviews = async (req, res) => {
  const productId = req.params.productId;
  const limit = parseInt(req.query.limit) || 0; // 0 means no limit

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const reviews = await Review.find({ product: productId })
      .populate({ path: "user", select: "name" })
      .sort({ createdAt: -1 }) // newest first
      .limit(limit) // apply limit if provided
      .exec();

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};


// ✅ Update Review
export const updateReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const { rating, comment } = req.body;

  if (!reviewId) {
    return res.status(400).json({ message: "Review ID is required" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ Check if the user is the owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    const updatedReview = await review.save();

    // 🔁 Update product ratings
    await Product.updateRatingStats(review.product);

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

// ✅ Delete Review
export const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  if (!reviewId) {
    return res.status(400).json({ message: "Review ID is required" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ Check if the user is the owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    const productId = review.product;
    await review.deleteOne();

    // 🔁 Update product ratings
    await Product.updateRatingStats(productId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

export const getAllReviews = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  try {
    const reviews = await Review.find()
      .populate({ path: "user", select: "name email" })
      .populate({ path: "product", select: "name" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      reviews,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
