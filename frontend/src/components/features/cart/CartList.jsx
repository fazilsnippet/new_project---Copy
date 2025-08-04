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

// export default CartList;


import React from "react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../../../redux/api/cartApiSlice";
import { Link } from "react-router-dom";
import { FiTrash } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckoutForm from "../payment/checkout.jsx";

const CartList = () => {
  const { data, error, isLoading, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  if (isLoading) return <p className="text-center py-10">Loading cart...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">
        Error: {error?.data?.message || "Unknown error"}
      </p>
    );

  const cartItems = data?.cart?.items || [];

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return toast.info("Minimum quantity is 1");
    if (newQuantity > 10) return toast.info("Maximum quantity is 10");

    try {
      await updateCartItem({ productId, quantity: newQuantity }).unwrap();
      await refetch();
    } catch (err) {
      console.error("Update cart error:", err);
      toast.error(err?.data?.message || "Failed to update item quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId).unwrap();
    } catch (err) {
      console.error("Remove cart item error:", err);
      toast.error(err?.data?.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
    } catch (err) {
      console.error("Clear cart error:", err);
      toast.error(err?.data?.message || "Failed to clear cart");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <p className="text-gray-600">{cartItems.length} Items</p>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{" "}
          <Link to="/products" className="text-blue-600 underline">
            Go shopping
          </Link>
        </p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col md:flex-row justify-between items-center gap-4 border p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img
                    src={item.product.images?.[0] || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div>
                    <p className="font-semibold text-lg">{item.product.name}</p>
                    <p className="text-sm text-gray-500">{item.product.color || "Color Variant"}</p>
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="mt-1 text-sm text-red-500 hover:underline flex items-center gap-1"
                    >
                      <FiTrash size={14} /> Remove
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                  {/* Quantity Control */}
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity - 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
                      disabled={item.quantity <= 1}
                    >
                      <AiOutlineMinus />
                    </button>
                    <span className="px-4 py-1 bg-gray-50 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity + 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
                      disabled={item.quantity >= 10}
                    >
                      <AiOutlinePlus />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-800">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Cart Summary */}
          <div className="bg-white border rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-700 border-b pb-4">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${data.cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$10</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${(data.cart.totalPrice + 10).toFixed(2)}</span>
              </div>
            </div>

            {/* TODO: Optionally add Promo Code or Shipping Select later */}

            <div className="mt-4">
              <CheckoutForm cartItems={cartItems} />
            </div>

            <button
              onClick={handleClearCart}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Clear Cart
            </button>

            <Link
              to="/products"
              className="mt-3 w-full block text-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
