
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