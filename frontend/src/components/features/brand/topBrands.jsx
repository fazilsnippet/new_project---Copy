import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetTopBrandsWithProductsQuery } from "../../../redux/api/adminApiSlice.js";

const TopBrandsSlider = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetTopBrandsWithProductsQuery();

  if (isLoading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-4">Something went wrong!</p>;

  return (
    <div className="px-4 py-6">
      {/* 🔥 Main Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🔥 Shop by Top Brand
      </h2>

      {/* Horizontal Scrollable Slider */}
      <div className="flex overflow-x-auto space-x-6 scrollbar-hide px-2">
        {data?.topBrands?.map((brand) => (
          <div
            key={brand._id}
            className="flex flex-col items-center min-w-[80px] cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(`/brands/${brand._id}`)}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-red-500 shadow">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700 truncate text-center">
              {brand.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBrandsSlider;
