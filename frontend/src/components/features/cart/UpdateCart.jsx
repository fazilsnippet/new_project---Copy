import React from "react";
import { useUpdateCartItemMutation } from "../../../redux/api/cartApiSlice";

const UpdateCart = ({ item }) => {
  const [updateCartItem] = useUpdateCartItemMutation();

  if (!item || !item.product) {
    console.error("UpdateCart received undefined item:", item);
    return null; // Prevent rendering if item is undefined
  }

  const quantity = item?.quantity ?? 1; // Default to 1 if undefined

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem({ productId: item.product._id, quantity: Number(newQuantity) })
        .unwrap()
        .catch((error) => console.error("Error updating cart:", error));
    }
  };

  return (
    <div className="update-cart">
      <button onClick={() => handleUpdateQuantity(quantity - 1)}>-</button>
      <span>{quantity}</span>
      <button onClick={() => handleUpdateQuantity(quantity + 1)}>+</button>
    </div>
  );
};

export default UpdateCart;

