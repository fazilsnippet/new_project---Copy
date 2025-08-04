import React from "react";
import { useAddToCartMutation } from "../../../redux/api/cartApiSlice";

const AddToCart = ({ productId, quantity }) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      console.log("Sending to cart:", { productId, quantity });
      await addToCart({ productId, quantity }).unwrap();
      alert("Product added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full"
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default AddToCart;
