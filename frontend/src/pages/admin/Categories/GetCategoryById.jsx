import React, { useState } from "react";
import { useGetCategoryByIdQuery } from "../../../redux/api/categoryApiSlice.js";


const GetCategoryById = () => {
  const [categoryId, setCategoryId] = useState("");
  const { data, error, isLoading } = useGetCategoryByIdQuery(categoryId, { skip: !categoryId });

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold">Get Category by ID</h2>
      <input
        type="text"
        placeholder="Enter Category ID"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 w-full"
      />
      
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error fetching category</p>}

      {data?.category ? (
        <div className="p-2 bg-gray-100 rounded mt-2">
          <p><strong>ID:</strong> {data?.category?._id || "N/A"}</p>
          <p><strong>Name:</strong> {data?.category?.name || "N/A"}</p>
          <p><strong>Description:</strong> {data?.category?.description || "N/A"}</p>
          <p><strong>Parent Category:</strong> {data?.category?.parentCategory || "None"}</p>
          <p><strong>Subcategories:</strong> {data?.category?.subcategories?.length || 0}</p>
          <p><strong>Products Count:</strong> {data?.category?.products?.length || 0}</p>
        </div>
      ) : (
        !isLoading && <p className="text-gray-500">No category found</p>
      )}
    </div>
  );
};

export default GetCategoryById;
