import React from "react";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useNavigate } from "react-router-dom";
import { categoryIcons, defaultCategoryIcon } from "../../utils/categoryIcons.jsx";
import { normalizeCategoryName } from "../../utils/normalize";

const CategoryList = () => {
  const { data, isLoading, isError, error } = useGetCategoriesQuery();
  const categories = data?.categories || [];
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Categories</h1>

        {isLoading && <p className="text-gray-500">Loading categories...</p>}
        {isError && (
          <p className="text-red-500">
            {error?.data?.message || "Failed to load categories."}
          </p>
        )}

        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          {categories.map((cat) => {
            const normalized = normalizeCategoryName(cat.name);
            const localIcon = categoryIcons[normalized] || defaultCategoryIcon;

            return (
              <div
                key={cat._id}
                onClick={() => navigate(`/categories/${cat._id}`)}
                className="flex-shrink-0 flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 bg-orange-200 rounded-full overflow-hidden flex items-center justify-center shadow-md hover:shadow-lg transition">
                  <img
                    src={localIcon}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-center text-gray-700 mt-2 font-medium">
                  {cat.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
