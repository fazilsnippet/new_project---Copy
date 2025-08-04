import React from "react";
import { useClearCartMutation } from "../../redux/api/cartApiSlice";

const ClearCart = () => {
  const [clearCart] = useClearCartMutation();

  return (
    <div className="clear-cart">
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default ClearCart;
