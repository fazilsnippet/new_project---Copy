import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../../redux/api/orderApiSlice.js";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Redirect if no orderId
  useEffect(() => {
    if (!orderId) {
      navigate("/orders");
    }
  }, [orderId, navigate]);

  const {
    data,
    isLoading,
    isError,
    error
  } = useGetOrderDetailsQuery(orderId, {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-white">
        Loading order details...
      </div>
    );
  }

  if (isError) {
    const errMsg = error?.data?.message || "Order not found.";
    return (
      <div className="text-red-500 p-4">
        ❌ {errMsg}{" "}
        <Link to="/orders" className="text-blue-400 underline">
          View My Orders
        </Link>
      </div>
    );
  }

  const order = data?.data;
  if (!order) {
    return (
      <div className="text-red-500 p-4">
        ❌ No order data found.{" "}
        <Link to="/orders" className="text-blue-400 underline">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-900 text-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">
        🎉 Order Placed Successfully!
      </h2>

      <div className="space-y-2 text-sm">
        <p><strong>Order ID:</strong> <span className="font-mono">{order._id}</span></p>
        <p><strong>Status:</strong> <span className="text-green-400">{order.status}</span></p>
        <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase()}</p>
        <p><strong>Total Amount:</strong> ₹{(order.totalAmount / 100).toFixed(2)}</p>
        {order.createdAt && (
          <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        )}
      </div>

      {order.shippingAddress && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Shipping Address:</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
          <p>{order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.postalCode}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Products:</h3>
        {order.products?.length > 0 ? (
          <ul className="list-disc ml-6 space-y-2">
            {order.products.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <img
                  src={item.productId?.images?.[0]}
                  alt={item.productId?.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <span>
                  {item.productId?.name} × {item.quantity || 1} — ₹{(item.productId?.price / 100).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found in this order.</p>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          to="/orders"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
