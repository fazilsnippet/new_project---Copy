import React, { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import SearchBar from "../features/products/product.search/ProductSearch.jsx"; // Adjust path if needed

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNavigation = (path) => {
    navigate(path);
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
            className="block w-full text-left py-2 px-2 hover:bg-orange-600 rounded"
          >
            <FaUser className="inline mr-2" /> Profile
          </button>
          <button
            onClick={() => handleNavigation("/cart")}
            className="block w-full text-left py-2 px-2 hover:bg-orange-600 rounded"
          >
            <FaShoppingCart className="inline mr-2" /> Cart
          </button>
        </div>
      </div>

      {/* Search Bar Component */}
      <div className="sticky top-[64px] z-40 bg-orange-500 py-4 px-4">
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
