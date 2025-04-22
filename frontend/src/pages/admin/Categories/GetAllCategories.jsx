import React from "react";
import { useGetCategoriesQuery } from "../../../redux/api/categoryApiSlice.js";


const GetAllCategories = () => {
  const { data, error, isLoading } = useGetCategoriesQuery();

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold">All Categories</h2>
      
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error fetching categories</p>}

      <ul className="mt-2">
        {data?.categories?.length > 0 ? (
          data.categories.map((category) => (
            <li key={category?._id} className="p-2 bg-gray-100 rounded mb-2">
              <strong>Name:</strong> {category?.name || "N/A"} <br />
              <strong>Description:</strong> {category?.description || "N/A"} <br />
              <strong>Subcategories:</strong> {category?.subcategories?.length || 0} <br />
              <strong>Products Count:</strong> {category?.productCount || 0}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No categories found</p>
        )}
      </ul>
    </div>
  );
};

export default GetAllCategories;
