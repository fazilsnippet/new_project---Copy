// import React, { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { format, parseISO } from 'date-fns';
// import {
//   useGetAllOrdersQuery,
//   useGetAdminDashboardQuery,
//   useGetRecentActivityQuery,
//   useGetAllUsersQuery
// } from '../../../../redux/api/adminApiSlice.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-[#1E293B] rounded-2xl shadow-md p-4 ${className}`}>{children}</div>
// );

// const CardContent = ({ children }) => <div className="space-y-2">{children}</div>;

// const Dashboard = () => {
//   const { data: ordersData = {} } = useGetAllOrdersQuery({ page: 1 });
//   const { data: dashboardData = {} } = useGetAdminDashboardQuery();
//   const { data: recentActivity = {} } = useGetRecentActivityQuery();
//   const { data: usersData = {} } = useGetAllUsersQuery();

//   const recentOrders = recentActivity.recentOrders || [];
//   const recentReviews = recentActivity.recentReviews || [];
//   const recentProducts = recentActivity.recentProducts || [];
//   const recentUsers = recentActivity.recentUsers || [];

//   const revenueToday = dashboardData?.revenue?.today || 0;
//   const revenueThisMonth = dashboardData?.revenue?.thisMonth || 0;

//   const [viewMode, setViewMode] = useState("monthly");

//   const groupRevenue = (ordersData.orders || []).reduce((acc, order) => {
//     const key =
//       viewMode === "monthly"
//         ? format(parseISO(order.createdAt), "yyyy-MM")
//         : format(parseISO(order.createdAt), "yyyy-MM-dd");
//     acc[key] = (acc[key] || 0) + order.totalPrice;
//     return acc;
//   }, {});


//   const revenueChart = {
//     labels: Object.keys(groupRevenue),
//     datasets: [
//       {
//         label: 'Revenue',
//         data: Object.values(groupRevenue),
//         borderColor: '#5B2EFF',
//         fill: false,
//       },
//     ],
//   };

//   const stats = [
//     { title: 'Total Products', value: dashboardData.products?.total || 0 },
//     { title: 'Total Orders', value: dashboardData.orders?.total || 0 },
//     { title: 'Total Categories', value: dashboardData.products?.totalCategories || 0 },
//     { title: 'Total Reviews', value: dashboardData.reviews?.total || 0 },
//     { title: 'Hidden Products', value: dashboardData.products?.hidden || 0 },
//     { title: 'Hidden Reviews', value: dashboardData.reviews?.hidden || 0 },
//     { title: 'Banned Users', value: dashboardData.users?.banned || 0 },
//     { title: 'Active Users', value: (dashboardData.users?.total || 0) - (dashboardData.users?.banned || 0) },
//     { title: 'Revenue Today', value: `$${revenueToday.toFixed(2)}` },
//     { title: 'Revenue This Month', value: `$${revenueThisMonth.toFixed(2)}` },
//     { title: 'Total Users', value: usersData.users?.length || 0 },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#1F1F47] to-[#0F172A] text-white p-4 md:p-6 lg:p-10">
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Admin</h1>
//         <button className="mt-4 lg:mt-0 bg-purple-600 px-4 py-2 rounded text-sm hover:bg-purple-700 transition">Create report</button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
//         {stats.map((stat, index) => (
//           <Card key={index}>
//             <CardContent>
//               <h2>{stat.title}</h2>
//               <p className="text-green-400 text-xl font-semibold">{stat.value}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="flex gap-4 mb-4">
//         <button
//           onClick={() => setViewMode('monthly')}
//           className={`px-4 py-2 rounded ${viewMode === 'monthly' ? 'bg-purple-600' : 'bg-slate-600'}`}
//         >
//           Monthly
//         </button>
//         <button
//           onClick={() => setViewMode('daily')}
//           className={`px-4 py-2 rounded ${viewMode === 'daily' ? 'bg-purple-600' : 'bg-slate-600'}`}
//         >
//           Daily
//         </button>
//       </div>

//       <Card>
//         <CardContent>
//           <h2 className="text-lg font-semibold mb-2">Revenue ({viewMode})</h2>
//           <Line data={revenueChart} />
//         </CardContent>
//       </Card>

//       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
//             <ul className="text-sm space-y-2">
//               {recentOrders.map((order) => (
//                 <li key={order._id}>
//                   #{order._id} - {new Date(order.createdAt).toLocaleString()} - <span className={order.status?.toLowerCase() === 'paid' ? 'text-green-400' : 'text-yellow-400'}>{order.status}</span> - ${order.totalPrice?.toFixed(2)}
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold mb-2">Recent Reviews</h2>
//             <ul className="text-sm space-y-2">
//               {recentReviews.map((review) => (
//                 <li key={review._id}>
//                   {review.user?.name} on {review.product?.name}: {review.rating}★ - {review.comment?.slice(0, 40)}
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold mb-2">Recent Products</h2>
//             <ul className="text-sm space-y-2">
//               {recentProducts.map((product) => (
//                 <li key={product._id}>
//                   {product.name} - {new Date(product.createdAt).toLocaleDateString()}
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold mb-2">Recent Users</h2>
//             <ul className="text-sm space-y-2">
//               {recentUsers.map((user) => (
//                 <li key={user._id}>
//                   {user.name} - {user.email} - {new Date(user.createdAt).toLocaleDateString()}
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  useGetAllOrdersQuery,
  useGetAdminDashboardQuery,
  useGetRecentActivityQuery,
  useGetAllUsersQuery,
  useGetCategoriesQuery,
  useGetAllBrandsQuery,
} from '../../../../redux/api/adminApiSlice.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-[#1E293B] rounded-2xl shadow-md p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children }) => <div className="space-y-2">{children}</div>;

const Dashboard = () => {
  const { data: ordersData = {} } = useGetAllOrdersQuery({ page: 1 });
  const { data: dashboardData = {} } = useGetAdminDashboardQuery();
  const { data: recentActivity = {} } = useGetRecentActivityQuery();
  const { data: usersData = {} } = useGetAllUsersQuery();
  const {data: categoryData={}} = useGetCategoriesQuery();
  const {data:brandData={}}= useGetAllBrandsQuery();

  const recentOrders = recentActivity.recentOrders || [];
  const recentReviews = recentActivity.recentReviews || [];
  const recentProducts = recentActivity.recentProducts || [];
  const recentUsers = recentActivity.recentUsers || [];

  const revenueToday = dashboardData?.revenue?.today || 0;
  const revenueThisMonth = dashboardData?.revenue?.thisMonth || 0;

  const [viewMode, setViewMode] = useState("monthly");

  const groupRevenue = (ordersData.orders || []).reduce((acc, order) => {
    const key =
      viewMode === "monthly"
        ? format(parseISO(order.createdAt), "yyyy-MM")
        : format(parseISO(order.createdAt), "yyyy-MM-dd");
    acc[key] = (acc[key] || 0) + order.totalPrice;
    return acc;
  }, {});

  const revenueChart = {
    labels: Object.keys(groupRevenue),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(groupRevenue),
        borderColor: '#5B2EFF',
        fill: false,
      },
    ],
  };

  const stats = [
    { title: 'Total Products', value: dashboardData.products?.total || 0 },
    { title: 'Total Orders', value: dashboardData.orders?.total || 0 },
    { title: 'Total Categories', value: categoryData.categories?.totalCategories || 0 },
    { title: 'Total Reviews', value: dashboardData.reviews?.total || 0 },
    { title: 'Hidden Products', value: dashboardData.products?.hidden || 0 },
    { title: 'Hidden Reviews', value: dashboardData.reviews?.hidden || 0 },
    { title: 'Banned Users', value: dashboardData.users?.banned || 0 },
    { title: 'Active Users', value: (dashboardData.users?.total || 0) - (dashboardData.users?.banned || 0) },
    { title: 'Revenue Today', value: `$${revenueToday.toFixed(2)}` },
    { title: 'Revenue This Month', value: `$${revenueThisMonth.toFixed(2)}` },
    { title: 'Total Users', value: usersData.users?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1F47] to-[#0F172A] text-white p-4 md:p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Admin</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent>
              <h2>{stat.title}</h2>
              <p className="text-green-400 text-xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setViewMode('monthly')}
          className={`px-4 py-2 rounded ${viewMode === 'monthly' ? 'bg-purple-600' : 'bg-slate-600'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setViewMode('daily')}
          className={`px-4 py-2 rounded ${viewMode === 'daily' ? 'bg-purple-600' : 'bg-slate-600'}`}
        >
          Daily
        </button>
      </div>

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Revenue ({viewMode})</h2>
          <Line data={revenueChart} />
        </CardContent>
      </Card>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              Recent Orders
              <Link to="/admin/orders" className="text-sm text-blue-400 hover:underline">View all</Link>
            </h2>
            <ul className="text-sm space-y-2">
              {recentOrders.map((order) => (
                <li key={order._id}>
                  #{order._id} - {new Date(order.createdAt).toLocaleString()} - <span className={order.status?.toLowerCase() === 'paid' ? 'text-green-400' : 'text-yellow-400'}>{order.status}</span> - ${order.totalPrice?.toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              Recent Reviews
              <Link to="/admin/reviews" className="text-sm text-blue-400 hover:underline">View all</Link>
            </h2>
            <ul className="text-sm space-y-2">
              {recentReviews.map((review) => (
                <li key={review._id}>
                  {review.user?.name} on {review.product?.name}: {review.rating}★ - {review.comment?.slice(0, 40)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              Recent Products
              <Link to="/admin/products" className="text-sm text-blue-400 hover:underline">View all</Link>
            </h2>
            <ul className="text-sm space-y-2">
              {recentProducts.map((product) => (
                <li key={product._id}>
                  {product.name} - {new Date(product.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              Recent Users
              <Link to="/admin/users" className="text-sm text-blue-400 hover:underline">View all</Link>
            </h2>
            <ul className="text-sm space-y-2">
              {recentUsers.map((user) => (
                <li key={user._id}>
                  {user.name} - {user.email} - {new Date(user.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
