import React from "react";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } from  "../../redux/api/cartApiSlice";
import { Link } from "react-router-dom";
import "./CartPage.css"; 
const CartPage = () => {
  const { data, error, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart</p>;

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateCartItem({ productId, quantity });
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      {data.cart.items.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty. <Link to="/" className="shop-link">Go shopping</Link>
        </p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.cart.items.map((item) => (
                <tr key={item.product._id}>
                  <td>{item.product.name}</td>
                  <td>${item.product.price}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}
                      className="quantity-input"
                    />
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item.product._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p className="total-price">Total Price: ${data.cart.totalPrice.toFixed(2)}</p>
            <button onClick={handleClearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
