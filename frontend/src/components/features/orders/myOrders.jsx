import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllUserOrdersQuery } from '../../../redux/api/orderApiSlice';
import { format } from 'date-fns';

const UserOrders = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data = {}, isLoading, error } = useGetAllUserOrdersQuery({ page, limit });

  const orders = data?.orders || data?.data || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Failed to load orders.</p>;

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md">
      <h2 className="text-2xl font-bold mb-4">🧾 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">Items</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order._id} className="border-b border-gray-800">
                <td className="py-2 px-3">{(page - 1) * limit + i + 1}</td>
                <td className="py-2 px-3">{format(new Date(order.createdAt), 'yyyy-MM-dd')}</td>
                <td className="py-2 px-3 capitalize">{order.status}</td>
                <td className="py-2 px-3">₹{(order.totalAmount / 100).toFixed(2)}</td>
                <td className="py-2 px-3">{order.products?.length}</td>
                <td className="py-2 px-3">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-blue-500 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserOrders;
