import React from "react";
import { useGetCartQuery, useClearCartMutation } from "../../redux/api/cartApiSlice";
import CartItem from "./CartItem";
import "./Cart.css"; 

const Cart = () => {
  const { data, isLoading, error } = useGetCartQuery();
  const [clearCart] = useClearCartMutation();

  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart</p>;

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {data?.cart.items.length > 0 ? (
        <>
          {data.cart.items.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
          <div className="cart-footer">
            <p>Total: ${data.cart.totalPrice}</p>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>,
        console.log("your cart is empty")
      )}
    </div>
  );
};

export default Cart;
