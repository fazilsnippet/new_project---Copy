import React, { useState } from 'react';
import { useGetAllOrdersQuery } from '../../../../redux/api/adminApiSlice.js';
import { format } from 'date-fns';

export default function AllOrderTable() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 20,
    from: '',
    to: '',
  });

  const { data, isLoading } = useGetAllOrdersQuery(query);

  const orders = data?.orders || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / query.limit);

  const handleDateFilter = () => {
    setQuery((prev) => ({
      ...prev,
      page: 1, // reset to first page
    }));
  };

  const handleFromChange = (e) => {
    query((prev) => ({
      ...prev,
      from: e.target.value,
    }));
  };

  const handleToChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      to: e.target.value,
    }));
  };

  const handlePrevPage = () => {
    setQuery((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  };

  const handleNextPage = () => {
    setQuery((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, totalPages),
    }));
  };

  return (
    <div className="p-4">
      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex flex-col">
          <label className="text-sm mb-1">From Date</label>
          <input
            type="date"
            value={query.from}
            onChange={handleFromChange}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">To Date</label>
          <input
            type="date"
            value={query.to}
            onChange={handleToChange}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={handleDateFilter}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          Apply Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2">
                    {(query.page - 1) * query.limit + idx + 1}
                  </td>
                  <td className="px-4 py-2">
                    
                    {order.userId?.email || order.userId?.userName || 'Guest'}
                  </td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">₹{order.totalAmount}</td>
                  <td className="px-4 py-2">
                    {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePrevPage}
          disabled={query.page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page <strong>{query.page}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={handleNextPage}
          disabled={query.page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
