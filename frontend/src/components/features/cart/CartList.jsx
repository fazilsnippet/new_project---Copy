// import React from "react";
// import { useGetCartQuery } from "../../redux/api/cartApiSlice";



// const CartList = () => {
//   const { data, isLoading, isError } = useGetCartQuery();

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error fetching cart items.</p>;

//   const cart = data?.cart ?? { items: [] };

//   return (
//     <div className="cart-list">
//       <h2>Shopping Cart</h2>
//       {cart.items.length > 0 ? (
//         cart.items.map((item) => (
//           <div key={item.product?._id} className="cart-item">
//             <p>{item.product?.name} - {item.quantity}</p>
//           </div>
//         ))
//       ) : (
//         <p>Your cart is empty.</p>
//       )}
//     </div>
//   );
// };

// export default CartList;z
import React from "react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../../../redux/api/cartApiSlice";
import { Link } from "react-router-dom";
import CheckoutForm from '../payment/checkout.jsx'

const CartList = () => {
  const { data, error, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart: {error?.data?.message || "Unknown error"}</p>;

  const cartItems = data?.cart?.items || [];

 const handleQuantityChange = async (productId, quantity) => {
  if (quantity < 1 || quantity > 10) {
    alert("Quantity must be between 1 and 10");
    return;
  }

  try {
    await updateCartItem({ productId, quantity }).unwrap();
  } catch (err) {
    console.error("Update cart error:", err);
    alert(err?.data?.message || "Failed to update item quantity");
  }
};

  const handleRemoveItem = async (productId) => {
  try {
    await removeFromCart(productId).unwrap();
  } catch (err) {
    console.error("Remove cart item error:", err);
    alert(err?.data?.message || "Failed to remove item");
  }
};

  const handleClearCart = async () => {
  try {
    await clearCart().unwrap();
  } catch (err) {
    console.error("Clear cart error:", err);
    alert(err?.data?.message || "Failed to clear cart");
  }
};

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty. <Link to="/products" className="shop-link">Go shopping</Link>
        </p>
      ) : (
        <>
          <table className="cart-table w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product._id} className="text-center border-b">
                  <td>
                    <img
                      src={item.product.images?.[0] || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td>{item.product.name}</td>
                  <td>${item.product.price}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}
                      className="w-16 border p-1 text-center"
                    />
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary mt-6 text-right">
            <p className="total-price text-xl font-semibold">
              Total: ${data.cart.totalPrice.toFixed(2)}
            </p>
            <CheckoutForm cartItems={cartItems} />
            <button
              onClick={handleClearCart}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartList;
