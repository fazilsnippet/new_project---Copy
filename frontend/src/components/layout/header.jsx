import React, { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { useGetAllProductsQuery } from "../../redux/api/productApiSlice.js";
import hero from "../ui/hero.jsx"
const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const menuRef = useRef();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Search API
  const { data, isLoading, isError } = useGetAllProductsQuery(
    {
      page: 1,
      limit: 10,
      search: debouncedSearch,
      filters: {},
      sort: "",
    },
    {
      skip: debouncedSearch === "",
    }
  );

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setMenuOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-orange-500 text-white shadow-md backdrop-blur-sm border-b border-orange-600">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Brand */}
          <div
            className="text-xl font-bold tracking-wide cursor-pointer hover:text-orange-200 transition"
            onClick={() => navigate("/")}
          >
            FurniFlex
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => handleNavigation("/users/profile")}
              className="hover:text-orange-200 transition"
            >
              <FaUser className="inline mr-1" /> Profile
            </button>
            <button
              onClick={() => handleNavigation("/cart")}
              className="hover:text-orange-200 transition"
            >
              <FaShoppingCart className="inline mr-1" /> Cart
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={toggleMenu}>
            <FaBars className="text-xl" />
          </button>
        </div>
      </header>

      {/* Backdrop Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-In Dropdown */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-[70%] bg-orange-500 z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg`}
      >
        <div className="p-4 pt-5 space-y-4 relative h-full overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-3 right-3 text-white text-xl"
          >
            <FaTimes />
          </button>

          {/* Links */}
          <button
            onClick={() => handleNavigation("/users/profile")}
            className="block w-full text-left py-2 px-2 hover:bg-orange-500 rounded"
          >
            <FaUser className="inline mr-2" /> Profile
          </button>
          <button
            onClick={() => handleNavigation("/cart")}
            className="block w-full text-left py-2 px-2 hover:bg-orange-500 rounded"
          >
            <FaShoppingCart className="inline mr-2" /> Cart
          </button>
        </div>
      </div>

      {/* Search Bar Below Header */}
      <div className="w-full bg-orange-500 py-4 px-4 shadow-sm sticky top-[64px] z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {debouncedSearch && (
        <div className="bg-white text-black mt-2 max-w-6xl mx-auto rounded shadow p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {isLoading && (
            <p className="text-sm text-gray-500 col-span-full">Loading...</p>
          )}
          {isError && (
            <p className="text-sm text-red-500 col-span-full">
              Error loading products.
            </p>
          )}
          {!isLoading && data?.products?.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">
              No products found.
            </p>
          )}
        {data?.products?.map((product) => (
  <div
    key={product._id}
    onClick={() => handleProductClick(product._id)}
    className="flex items-center gap-4 p-3 border rounded hover:shadow-md cursor-pointer"
  >
    <img
      src={product.images?.[0] || "/placeholder.jpg"}
      alt={product.name}
      className="w-16 h-16 object-cover rounded"
    />
    <div>
      <p className="text-base font-medium text-gray-900">
        {product.name || "Unnamed Product"}
      </p>
      {/* <p className="text-sm text-gray-600">{product.brand?.brand || "No brand"}</p> */}
      <p className="text-sm text-gray-500">{product.category?.name || "No category"}</p>
    </div>
  </div>
))}


        </div>
      )}

      {/* Hero Section Below Header */}
      <div>
      </div>
    </div>
  );
};

export default Header;
