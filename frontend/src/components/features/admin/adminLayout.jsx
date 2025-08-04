// import React from 'react';
// import { NavLink, Outlet } from 'react-router-dom';
// import { FaUsers, FaBox, FaShoppingCart, FaChartBar, FaHome } from 'react-icons/fa';
// import { TbCategoryFilled } from "react-icons/tb";

// const AdminLayout = () => {
//   return (
//     <div className="flex w-full min-h-screen bg-[#0F172A] text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#1E293B] hidden md:flex flex-col p-4 space-y-6 shadow-md">
//         <h1 className="text-2xl font-bold text-purple-400 mb-6">Admin Panel</h1>
//         <nav className="flex flex-col space-y-3 text-sm">
//           <NavLink to="/admin" end className={({ isActive }) => navClass(isActive)}>
//             <FaHome className="inline mr-2" /> Dashboard
//           </NavLink>
//           <NavLink to="users" className={({ isActive }) => navClass(isActive)}>
//             <FaUsers className="inline mr-2" /> Users
//           </NavLink>
//           <NavLink to="products" className={({ isActive }) => navClass(isActive)}>
//             <FaBox className="inline mr-2" /> All Products
//           </NavLink>
//           <NavLink to="products/createProduct" className={({ isActive }) => navClass(isActive)}>
//             <FaBox className="inline mr-2" /> Create Product
//           </NavLink>
//           <NavLink to="orders" className={({ isActive }) => navClass(isActive)}>
//             <FaShoppingCart className="inline mr-2" /> Orders
//           </NavLink>
//           <NavLink to="order-data" className={({ isActive }) => navClass(isActive)}>
//             <FaChartBar className="inline mr-2" /> Order Chart
//           </NavLink>
//            <NavLink to="category/create" className={({ isActive }) => navClass(isActive)}>
//             <TbCategoryFilled  className="inline mr-2" /> Create Category
//           </NavLink>
//           <NavLink to="categories" className={({ isActive }) => navClass(isActive)}>
//             <TbCategoryFilled className="inline mr-2" /> Categories 
//           </NavLink>
          
          
//         </nav>
//       </aside>
//       {/* Main content */}
//       <div className="flex-1 p-4">
//         {/* Mobile Top Nav */}
//         <div className="md:hidden mb-4 bg-[#1E293B] p-2 rounded shadow flex items-center justify-between">
//           <span className="text-lg font-semibold text-purple-300">Admin</span>
//           <div className="space-x-4 text-sm">
//             <NavLink to="/admin" className="text-white">Dashboard</NavLink>
//             <NavLink to="/admin/users" className="text-white">Users</NavLink>
//             <NavLink to="/admin/orders" className="text-white">Orders</NavLink>
//             <NavLink to="/admin/order-data" className="text-white">Order-data</NavLink>
//           </div>
//         </div>

//         <Outlet />
//       </div>
//     </div>
//   );
// };

// const navClass = (isActive) =>
//   `px-4 py-2 rounded hover:bg-purple-600 transition ${
//     isActive ? 'bg-purple-700 font-semibold' : 'text-gray-300'
//   }`;

// export default AdminLayout;


import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUsers, FaBox, FaShoppingCart, FaChartBar, FaHome, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { TbCategoryFilled } from "react-icons/tb";

const AdminLayout = () => {
  const [openMenus, setOpenMenus] = useState({
    products: false,
    categories: false,
    orders: false,
    users: false,
    brands:false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="flex w-full min-h-screen bg-[#0F172A] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E293B] hidden md:flex flex-col p-4 space-y-6 shadow-md">
        <h1 className="text-2xl font-bold text-purple-400 mb-6">Admin Panel</h1>

        <nav className="flex flex-col space-y-3 text-sm">

          {/* Dashboard */}
          <NavLink to="/admin" end className={({ isActive }) => navClass(isActive)}>
            <FaHome className="inline mr-2" /> Dashboard
          </NavLink>

          {/* Users */}
          <button onClick={() => toggleMenu('users')} className="flex justify-between items-center px-4 py-2 rounded hover:bg-purple-600 transition text-left">
            <span><FaUsers className="inline mr-2" /> Users</span>
            {openMenus.users ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.users && (
            <div className="ml-4 flex flex-col space-y-1 text-sm">
              <NavLink to="users" className={({ isActive }) => navClass(isActive, true)}>All Users</NavLink>
            </div>
          )}

          {/* Products */}
          <button onClick={() => toggleMenu('products')} className="flex justify-between items-center px-4 py-2 rounded hover:bg-purple-600 transition text-left">
            <span><FaBox className="inline mr-2" /> Products</span>
            {openMenus.products ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.products && (
            <div className="ml-4 flex flex-col space-y-1 text-sm">
              <NavLink to="products" className={({ isActive }) => navClass(isActive, true)}>All Products</NavLink>
              <NavLink to="products/createProduct" className={({ isActive }) => navClass(isActive, true)}>Create Product</NavLink>
            </div>
          )}

          {/* Orders */}
          <button onClick={() => toggleMenu('orders')} className="flex justify-between items-center px-4 py-2 rounded hover:bg-purple-600 transition text-left">
            <span><FaShoppingCart className="inline mr-2" /> Orders</span>
            {openMenus.orders ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.orders && (
            <div className="ml-4 flex flex-col space-y-1 text-sm">
              <NavLink to="orders" className={({ isActive }) => navClass(isActive, true)}>Order List</NavLink>
              <NavLink to="order-data" className={({ isActive }) => navClass(isActive, true)}>Order Chart</NavLink>
            </div>
          )}

          {/* Categories */}
          <button onClick={() => toggleMenu('categories')} className="flex justify-between items-center px-4 py-2 rounded hover:bg-purple-600 transition text-left">
            <span><TbCategoryFilled className="inline mr-2" /> Categories</span>
            {openMenus.categories ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.categories && (
            <div className="ml-4 flex flex-col space-y-1 text-sm">
              <NavLink to="categories" className={({ isActive }) => navClass(isActive, true)}>All Categories</NavLink>
              <NavLink to="category/create" className={({ isActive }) => navClass(isActive, true)}>Create Category</NavLink>
            </div>
          )}

           <button onClick={() => toggleMenu('brands')} className="flex justify-between items-center px-4 py-2 rounded hover:bg-purple-600 transition text-left">
            <span><FaBox className="inline mr-2" /> Brands</span>
            {openMenus.brands ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.brands && (
            <div className="ml-4 flex flex-col space-y-1 text-sm">
              <NavLink to="brand/getall" className={({ isActive }) => navClass(isActive, true)}>All Brands</NavLink>
              {/* <NavLink to="products/createProduct" className={({ isActive }) => navClass(isActive, true)}>Create Product</NavLink> */}
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4">
        {/* Mobile Top Nav */}
        <div className="md:hidden mb-4 bg-[#1E293B] p-2 rounded shadow flex items-center justify-between">
          <span className="text-lg font-semibold text-purple-300">Admin</span>
          <div className="space-x-4 text-sm">
            <NavLink to="/admin" className="text-white">Dashboard</NavLink>
            <NavLink to="/admin/users" className="text-white">Users</NavLink>
            <NavLink to="/admin/orders" className="text-white">Orders</NavLink>
            <NavLink to="/admin/order-data" className="text-white">Order-data</NavLink>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

const navClass = (isActive, isSub = false) =>
  `${isSub ? 'ml-2' : ''} px-4 py-2 rounded hover:bg-purple-600 transition ${
    isActive ? 'bg-purple-700 font-semibold' : 'text-gray-300'
  }`;

export default AdminLayout;
