import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useGetAdvancedWishlistQuery,
  useRemoveProductFromWishlistMutation,
} from "../../redux/api/wishlistApiSlice.js";
import { FaHeart } from "react-icons/fa";
import AddToCart from "../features/cart/AddToCart.jsx";
const WishlistPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetAdvancedWishlistQuery(
    { userId: userInfo?._id },
    { skip: !userInfo?._id }
  );
  const [removeProduct] = useRemoveProductFromWishlistMutation();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading wishlist...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500">Error loading wishlist.</p>
      </div>
    );

  const wishlistItems = data?.wishlist || [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaHeart className="text-orange-500" /> My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-xl shadow-inner">
          <FaHeart className="text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => (
            <div
              key={item.productId}
              className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative"
            >
              {/* Product Image */}
              <Link to={`/products/${item.productId}`}>
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 truncate">
                  {item.name}
                </h2>
                <p className="text-orange-500 font-bold mt-1">₹{item.price}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 px-4 pb-4">
                <button
                  onClick={() =>
                    removeProduct({
                      userId: userInfo._id,
                      productId: item.productId,
                    })
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  <FaHeart /> Remove
                </button>

                {/* ✅ Dedicated AddToCartButton */}
                <AddToCart product={item} className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
