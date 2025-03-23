import React from "react";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import "./AddToCart.css";

const AddToCart = ({ product }) => {
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async () => {
    if (!product || !product._id) {
      console.error("Product is undefined or missing _id:", product);
      return;
    }

    console.log("Adding product to cart:", { productId: product._id, quantity: 1 });

    try {
      const response = await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      console.log("Successfully added to cart:", response);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="add-to-cart">
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default AddToCart;
