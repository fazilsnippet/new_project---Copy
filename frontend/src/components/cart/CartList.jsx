import React from "react";
import { useGetCartQuery } from "../../redux/api/cartApiSlice";
import "./CartList.css";

const CartList = () => {
  const { data, isLoading, isError } = useGetCartQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching cart items.</p>;

  // ✅ Ensure correct data structure
  const cart = data?.cart ?? { items: [] };

  return (
    <div className="cart-list">
      <h2>Shopping Cart</h2>
      {cart.items.length > 0 ? (
        cart.items.map((item) => (
          <div key={item.product?._id} className="cart-item">
            <p>{item.product?.name} - {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartList;
