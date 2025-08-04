// src/pages/CartPage.jsx
import React from "react";
import { useGetCartQuery } from "../redux/api/cartApiSlice.js";
import CheckoutForm from "../components/features/payment/checkout.jsx"; // adjust path as needed

const CartPage = () => {
  const { data, isLoading, error } = useGetCartQuery();

  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart: {error.message}</p>;

  const cartItems = data?.items || [];

  return (
    <div className="cart-page">
      {/* other cart content */}

      {/* ✅ Passing cartItems to CheckoutForm */}
      <CheckoutForm cartItems={cartItems} />
    </div>
  );
};

export default CartPage;
