import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findCartByUser, isValidObjectId } from "../utils/helpers.js"; // Importing the helper functions

// 1. Add Item to Cart
const addToCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity } = req.body;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const [product, cart] = await Promise.all([
    Product.findById(productId),
    findCartByUser(userId),
  ]);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: `Only ${product.stock} units available` });
  }

  if (!cart) {
    const newCart = new Cart({
      user: userId,
      items: [{ product: productId, quantity }],
      totalPrice: product.price * quantity,
    });
    await newCart.save();
  } else {
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalPrice += product.price * quantity;
    await cart.save();
  }

  res.status(200).json({ message: "Item added to cart" });
});

// 2. Get Cart for User
const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const cart = await Cart.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productDetails",
                      cond: { $eq: ["$$this._id", "$$item.product"] },
                    },
                  },
                  0,
                ],
              },
              quantity: "$$item.quantity",
            },
          },
        },
      },
    },
    { $project: { productDetails: 0 } },
  ]);

  if (!cart.length) {
    return res.status(200).json({ cart: { items: [], totalPrice: 0 } });
  }

  res.status(200).json({ cart: cart[0] });
});

// 3. Update Item Quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity } = req.body;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const cart = await findCartByUser(userId);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(item => item.product.toString() === productId);
  if (!item) {
    return res.status(404).json({ message: "Product not in cart" });
  }

  const product = await Product.findById(productId);
  if (product.stock < quantity) {
    return res.status(400).json({ message: `Only ${product.stock} units available` });
  }

  const priceDifference = product.price * (quantity - item.quantity);
  item.quantity = quantity;
  cart.totalPrice += priceDifference;

  await cart.save();

  res.status(200).json({ message: "Cart updated successfully" });
});

// 4. Remove Item from Cart
const removeCartItem = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const cart = await findCartByUser(userId);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Product not in cart" });
  }

  const item = cart.items[itemIndex];
  cart.totalPrice -= item.quantity * item.product.price;
  cart.items.splice(itemIndex, 1);

  await cart.save();

  res.status(200).json({ message: "Item removed from cart" });
});

// 5. Clear Cart
const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const cart = await findCartByUser(userId);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  res.status(200).json({ message: "Cart cleared successfully" });
});

export { addToCart, getCart, updateCartItem, removeCartItem, clearCart };

