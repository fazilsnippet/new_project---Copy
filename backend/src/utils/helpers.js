import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";

// Check if a string is a valid MongoDB ObjectId
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Find a cart by userId
export const findCartByUser = async (userId) => {
  try {
    // Find the cart associated with the userId
    return await Cart.findOne({ user: userId });
  } catch (error) {
    // Handle errors, possibly logging or re-throwing
    throw new Error("Error finding the cart for the user");
  }
};

//try this better approach 
/*import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";

// Check if a string is a valid MongoDB ObjectId
export const isValidObjectId = (id) => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
};

// Find a cart by userId using aggregation
export const findCartByUser = async (userId) => {
  try {
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid userId provided");
    }

    // Use aggregation for optimized query
    const cart = await Cart.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Find cart for the user
      { $limit: 1 }, // Return only one result
      { $project: { _id: 1, user: 1, items: 1, totalPrice: 1 } } // Include only necessary fields
    ]);

    return cart.length > 0 ? cart[0] : null;
  } catch (error) {
    console.error("Error finding cart for user:", error.message);
    throw new Error("Failed to retrieve the cart");
  }
};*/
