import React from "react";
import { useRemoveFromCartMutation } from "../../redux/api/cartApiSlice";
import "./RemoveFromCart.css";

const RemoveFromCart = ({ productId }) => {
  const [removeFromCart] = useRemoveFromCartMutation();

  return (
    <div className="remove-from-cart">
      <button onClick={() => removeFromCart(productId)}>Remove</button>

    </div>
  );
};

export default RemoveFromCart;
