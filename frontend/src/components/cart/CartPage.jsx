import React from "react";
import CartList from "./CartList.jsx";
import ClearCart from "./ClearCart.jsx";
import AddToCart from "./AddToCart.jsx";
import RemoveFromCart from "./RemoveFromCart.jsx";
import UpdateCart from "./UpdateCart.jsx";

import "./CartPage.css";

const CartPage = () => {
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <CartList />
      <ClearCart />
      <AddToCart />
      <RemoveFromCart />
      <UpdateCart />
    </div>
  );
};

export default CartPage;
