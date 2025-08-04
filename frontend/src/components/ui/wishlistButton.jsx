import React from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Solid & Outline hearts
import {
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
  useGetAdvancedWishlistQuery
} from "../../redux/api/wishlistApiSlice.js";

const WishlistButton = ({ productId, size = 20 }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: wishlistData } = useGetAdvancedWishlistQuery(
    { userId: userInfo?._id, skip: 0, limit: 100 },
    { skip: !userInfo?._id } // Skip if not logged in
  );

  const [addWishlist] = useAddProductToWishlistMutation();
  const [removeWishlist] = useRemoveProductFromWishlistMutation();

  const wishlistIds = wishlistData?.wishlist?.map((item) => item.productId) || [];
  const isInWishlist = wishlistIds.includes(productId);

  const handleToggle = async (e) => {
    e.preventDefault(); // Prevent navigation when inside a link
    if (!userInfo?._id) {
      alert("Please log in to use Wishlist");
      return;
    }
    if (isInWishlist) {
      await removeWishlist({ userId: userInfo._id, productId });
    } else {
      await addWishlist({ userId: userInfo._id, productId });
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle wishlist"
      className="p-2 rounded-full bg-white shadow hover:bg-orange-100 transition"
    >
      {isInWishlist ? (
        <FaHeart size={size} className="text-orange-500" />
      ) : (
        <FaRegHeart size={size} className="text-gray-400" />
      )}
    </button>
  );
};

export default WishlistButton;
