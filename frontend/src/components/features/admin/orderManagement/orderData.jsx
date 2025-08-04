// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   useCreateOrderMutation,
//   useGetUserOrdersQuery,
//   useUpdateOrderStatusMutation,
//   useDeleteOrderMutation,
// } from '../../../redux/api/orderApiSlice';

// const OrderComponent = () => {
//   const [items, setItems] = useState([]); // Track items in the order
//   const [orderStatus, setOrderStatus] = useState(''); // Track order status for updating
//   const [paymentStatus, setPaymentStatus] = useState(''); // Track payment status
//   const [orderIdToUpdate, setOrderIdToUpdate] = useState(null);

//   // Example cart items (this could be fetched from the Redux store if available)
//   const exampleItems = [
//     { productId: 'productId1', quantity: 2 },
//     { productId: 'productId2', quantity: 1 },
//   ];

//   // Fetch user orders (assuming userId is available in state)
//   const userId = useSelector((state) => state.auth.userId); // Adjust according to your auth state

//   // Fetch orders from the backend
//   const { data: userOrders, error: fetchOrdersError, isLoading: loadingOrders } = useGetUserOrdersQuery(userId);

//   // Create a new order
//   const [createOrder, { isLoading: creatingOrder, error: createOrderError }] = useCreateOrderMutation();

//   // Update order status
//   const [updateOrderStatus, { isLoading: updatingStatus, error: updateStatusError }] = useUpdateOrderStatusMutation();

//   // Delete an order
//   const [deleteOrder, { isLoading: deletingOrder, error: deleteOrderError }] = useDeleteOrderMutation();

//   // Handle create order
//   const handleCreateOrder = async () => {
//     try {
//       const orderData = {
//         items: items, // Now using items to create the order
//       };
//       const response = await createOrder(orderData).unwrap();
//       console.log('Order created successfully:', response);
//     } catch (error) {
//       console.error('Failed to create order:', error.message);
//     }
//   };

//   // Handle update order status
//   const handleUpdateOrderStatus = async () => {
//     try {
//       if (!orderIdToUpdate || !orderStatus) return;

//       await updateOrderStatus({ orderId: orderIdToUpdate, orderStatus, paymentStatus }).unwrap();
//       console.log('Order status updated');
//     } catch (error) {
//       console.error('Failed to update order status:', error.message);
//     }
//   };

//   // Handle delete order
//   const handleDeleteOrder = async (orderId) => {
//     try {
//       await deleteOrder(orderId).unwrap();
//       console.log('Order deleted successfully');
//     } catch (error) {
//       console.error('Failed to delete order:', error.message);
//     }
//   };

//   useEffect(() => {
//     // Here, we can initialize the items from a cart if available
//     setItems(exampleItems); // For demonstration purposes, setting items statically
//   }, []); // This effect runs once when the component mounts

//   return (
//     <div className="order-component">
//       <h2>Manage Orders</h2>
      
//       {/* Create Order Section */}
//       <div className="create-order">
//         <h3>Create Order</h3>
//         <button onClick={handleCreateOrder} disabled={creatingOrder}>
//           {creatingOrder ? 'Creating Order...' : 'Create Order'}
//         </button>
//         {createOrderError && <p className="error">{createOrderError.message}</p>}
//       </div>

//       {/* User Orders */}
//       <div className="user-orders">
//         <h3>Your Orders</h3>
//         {loadingOrders ? (
//           <p>Loading orders...</p>
//         ) : fetchOrdersError ? (
//           <p className="error">{fetchOrdersError.message}</p>
//         ) : (
//           <ul>
//             {userOrders?.map((order) => (
//               <li key={order._id} className="order-item">
//                 <div>
//                   <p>Order ID: {order._id}</p>
//                   <p>Status: {order.status}</p>
//                   <p>Amount: ₹{order.amount / 100}</p>
//                   <button onClick={() => setOrderIdToUpdate(order._id)}>
//                     Update Status
//                   </button>
//                   <button onClick={() => handleDeleteOrder(order._id)} disabled={deletingOrder}>
//                     {deletingOrder ? 'Deleting...' : 'Delete Order'}
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Update Order Status */}
//       <div className="update-status">
//         <h3>Update Order Status</h3>
//         <input
//           type="text"
//           placeholder="Order Status"
//           value={orderStatus}
//           onChange={(e) => setOrderStatus(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Payment Status"
//           value={paymentStatus}
//           onChange={(e) => setPaymentStatus(e.target.value)}
//         />
//         <button onClick={handleUpdateOrderStatus} disabled={updatingStatus}>
//           {updatingStatus ? 'Updating Status...' : 'Update Status'}
//         </button>
//         {updateStatusError && <p className="error">{updateStatusError.message}</p>}
//       </div>
//     </div>
//   );
// };

// export default OrderComponent;
import React, { useState } from 'react';
import { useGetOrderCountByDateQuery } from '../../../../redux/api/adminApiSlice.js';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { format } from 'date-fns';


export default function OrderCountChart() {
  // Today's date in YYYY-MM-DD format
  const today = format(new Date(), 'yyyy-MM-dd');

  // Filter state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(today); // default 'to' = today

  // Fetch data from API
  const { data = [], isLoading } = useGetOrderCountByDateQuery({ from, to });

  // Ensure today's data is present in dataset
  const chartDataset = [...data];
  const todayExists = chartDataset.some((item) => item._id === today);
  if (!todayExists) {
    chartDataset.push({ _id: today, count: 0 });
  }

  // Sort chronologically
  chartDataset.sort((a, b) => new Date(a._id) - new Date(b._id));

  // Highlight today's bar in green, others in indigo
  const barColors = chartDataset.map((item) =>
    item._id === today ? '#22C55E' : '#6366F1'
  );

  // Chart.js dataset
  const chartData = {
    labels: chartDataset.map((item) => item._id),
    datasets: [
      {
        label: 'Orders',
        data: chartDataset.map((item) => item.count),
        backgroundColor: barColors,
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Daily Orders',
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
      },
      x: {
        ticks: { font: { size: 12 }, maxRotation: 45 },
      },
    },
  };

  return (
    <div className="flex gap-4 p-4">
      {/* Chart Container: 1/2 screen width & height */}
      <div
        className="border shadow rounded bg-white"
        style={{ width: '50vw', height: '50vh', padding: '12px' }}
      >
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col text-xs">
            <label className="mb-1 font-medium">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border px-2 py-1 rounded text-xs"
            />
          </div>
          <div className="flex flex-col text-xs">
            <label className="mb-1 font-medium">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border px-2 py-1 rounded text-xs"
            />
          </div>
        </div>

        {/* Chart */}
        {isLoading ? (
          <p className="text-xs text-center mt-12">Loading chart...</p>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
