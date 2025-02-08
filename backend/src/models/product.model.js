// import mongoose from "mongoose";
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   images: [{ type: String }], // Array of image URLs
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//   stock: { type: Number, default: 0 },
//   ratings: [{
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     rating: { type: Number, min: 1, max: 5 },
//     review: { type: String },
//     createdAt: { type: Date, default: Date.now }
//   }],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Index for faster search
// productSchema.index({ name: 'text', description: 'text' });

// productSchema.aggregate([
//   { $unwind: "$ratings" },
//   { $group: {
//     _id: "$_id",
//     averageRating: { $avg: "$ratings.rating" },
//     totalRatings: { $sum: 1 }
//   }},
//   { $addFields: { averageRating: { $ifNull: ["$averageRating", 0] } } }
// ]);

// export const Product = mongoose.model('Product', productSchema);


import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand:{type: String, default:"unknown"},
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }], // Array of image URLs
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    stock: { type: Number, default: 0 },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Index for faster search
productSchema.index({ name: 'text', description: 'text' });

// Static method for calculating ratings
productSchema.statics.calculateRatings = function () {
  return this.aggregate([
    { $unwind: "$ratings" },
    {
      $group: {
        _id: "$_id",
        averageRating: { $avg: "$ratings.rating" },
        totalRatings: { $sum: 1 }
      }
    },
    { $addFields: { averageRating: { $ifNull: ["$averageRating", 0] } } }
  ]);
};

export const Product = mongoose.model('Product', productSchema);

