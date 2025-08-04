// import React, { useState } from 'react';
// import { useGetAllUserOrdersQuery } from '../../../redux/api/orderApiSlice.js';
// import { format } from 'date-fns';

// const UserOrders = () => {
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const { data = {}, isLoading, error } = useGetAllUserOrdersQuery({ page, limit });

//   const orders = data?.orders || data?.data || [];
//   const totalPages = data?.totalPages || 1;

//   if (isLoading) return <p>Loading orders...</p>;
//   if (error) return <p>Failed to load orders.</p>;

//   return (
//     <div className="p-4 bg-gray-900 text-white rounded-md">
//       <h2 className="text-2xl font-bold mb-4">🧾 My Orders</h2>

//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b border-gray-700">
//               <th className="py-2 px-3">#</th>
//               <th className="py-2 px-3">Date</th>
//               <th className="py-2 px-3">Status</th>
//               <th className="py-2 px-3">Total</th>
//               <th className="py-2 px-3">Items</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order, i) => (
//               <tr key={order._id} className="border-b border-gray-800">
//                 <td className="py-2 px-3">{(page - 1) * limit + i + 1}</td>
//                 <td className="py-2 px-3">{format(new Date(order.createdAt), 'yyyy-MM-dd')}</td>
//                 <td className="py-2 px-3 capitalize">{order.status}</td>
//                 <td className="py-2 px-3">₹{(order.totalAmount / 100).toFixed(2)}</td>
//                 <td className="py-2 px-3">{order.products?.length || 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <div className="mt-4 flex items-center gap-4">
//         <button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           disabled={page === 1}
//           className="bg-blue-500 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={page === totalPages}
//           className="bg-blue-500 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserOrders;

// pages/order/OrderDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../../../redux/api/orderApiSlice.js';
import { format } from 'date-fns';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetOrderDetailsQuery(id);

  const order = data?.data;

  if (isLoading) return <p className="text-white p-4">Loading order...</p>;
  if (isError || !order) return <p className="text-red-500 p-4">Failed to load order details.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-900 text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📦 Order Details</h2>

      <p className="mb-2">Order ID: <span className="font-mono">{order._id}</span></p>
      <p className="mb-2">Status: <span className="capitalize text-green-400">{order.status}</span></p>
      <p className="mb-2">Payment Method: {order.paymentMethod}</p>
      <p className="mb-2">Total: ₹{(order.totalAmount / 100).toFixed(2)}</p>
      <p className="mb-2">Placed on: {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Items:</h3>
        <ul className="list-disc ml-6">
          {order.products.map((item, idx) => (
            <li key={idx}>
              {item.productId?.name || item.productId} × {item.quantity}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/orders"
        className="inline-block mt-6 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        ← Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetailPage;
