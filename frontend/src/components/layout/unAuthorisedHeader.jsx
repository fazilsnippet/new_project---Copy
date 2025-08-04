import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useGetAllProductsQuery } from "../../redux/api/productApiSlice.js";

const UnauthorizedHeader = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const menuRef = useRef();

  // Debounce input
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

  // Close on outside click
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
          <div
            className="text-xl font-bold tracking-wide cursor-pointer hover:text-orange-200 transition"
            onClick={() => navigate("/")}
          >
            FurniFlex
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => handleNavigation("/login")}
              className="hover:text-orange-200 transition"
            >
              Login
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={toggleMenu}>
            <FaBars className="text-xl" />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-In */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-[70%] bg-orange-500 z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg`}
      >
        <div className="p-4 pt-5 space-y-4 relative h-full overflow-y-auto">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-3 right-3 text-white text-xl"
          >
            <FaTimes />
          </button>

          <button
            onClick={() => handleNavigation("/login")}
            className="block w-full text-left py-2 px-2 hover:bg-orange-500 rounded"
          >
            Login
          </button>
        </div>
      </div>

      {/* Search Bar */}
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
              className="p-4 border rounded hover:shadow-md cursor-pointer"
            >
              <h4 className="text-base font-semibold">{product.name}</h4>
              <p className="text-sm text-gray-600">
                {product.brand?.name || "No brand"}
              </p>
              <p className="text-xs text-gray-500">
                {product.description || ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnauthorizedHeader;
