import React from "react";
import { useGetAllProductsQuery } from "../../../redux/api/productApiSlice.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const CategoryProductsSlider = ({ category, currentProductId }) => {
  const { data, isLoading, isError } = useGetAllProductsQuery(
    { category, limit: 12 }
  );

  const categoryProducts = data?.products?.filter(
    (p) => p._id !== currentProductId
  );

  if (isLoading) {
    return <div className="text-center py-6 text-gray-500">Loading similar products...</div>;
  }

  if (isError || !categoryProducts?.length) {
    return <div className="text-center py-6 text-gray-400">No similar products found.</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">More in {category}</h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {categoryProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <Link
              to={`/products/${product._id}`}
              className="block bg-white p-3 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="aspect-[4/3] w-full mb-2 flex items-center justify-center overflow-hidden rounded">
                <img
                  src={product?.images?.[0] || "/placeholder.jpg"}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {product?.name || "Unnamed Product"}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {product?.brand?.name || product?.brand || "Unknown Brand"}
              </p>
              <p className="text-green-600 font-bold text-sm">
                ₹{product?.price ?? "N/A"}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryProductsSlider;
