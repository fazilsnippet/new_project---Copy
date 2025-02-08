import mongoose from "mongoose"; 

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required model"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Self-referencing for subcategories
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Pre-save middleware to update the `updatedAt` field
categorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Category = mongoose.model("Category", categorySchema);
