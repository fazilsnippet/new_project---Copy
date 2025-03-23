import React from "react";
import { useUpdateCartItemMutation, useRemoveFromCartMutation } from "../../redux/api/cartApiSlice";
import './CartItem.css';

const CartItem = ({ item }) => {
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  if (!item || !item.product) {
    console.error("CartItem received undefined item:", item);
    return null; // Prevent rendering if item is missing
  }

  const quantity = item?.quantity ?? 1; // Default to 1 if undefined

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity > 0) {
      try {
        await updateCartItem({ productId: item.product._id, quantity: newQuantity }).unwrap();
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.product._id).unwrap();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.product.image} alt={item.product.name} />
      <div className="cart-item-details">
        <h3>{item.product.name}</h3>
        <p>Price: ${item.product.price}</p>
        <div className="cart-actions">
          <button onClick={() => handleUpdateQuantity(quantity - 1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => handleUpdateQuantity(quantity + 1)}>+</button>
          <button onClick={handleRemove}>Remove</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
