// import React, { useState } from "react";
// import { useUpdateCategoryMutation, useGetCategoryByIdQuery } from "../../../redux/api/categoryApiSlice.js";


// const UpdateCategory = ({ categoryId }) => {
//   const { data } = useGetCategoryByIdQuery(categoryId, { skip: !categoryId });
//   const [updateCategory] = useUpdateCategoryMutation();

//   const [name, setName] = useState(data?.category?.name || "");
//   const [description, setDescription] = useState(data?.category?.description || "");

//   const handleUpdate = async () => {
//     await updateCategory({ categoryId, categoryData: { name, description } });
//   };

//   return (
//     <div className="p-4 border rounded shadow">
//       <h2 className="text-lg font-semibold">Update Category</h2>
//       <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" />
//       <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mt-2" />
//       <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 mt-2 rounded">Update</button>
//     </div>
//   );
// };

// export default UpdateCategory;

import React, { useState, useEffect } from "react";
import { 
  useUpdateCategoryMutation, 
  useGetCategoryByIdQuery 
} from "../../../redux/api/categoryApiSlice.js";


const UpdateCategory = ({ categoryId: propCategoryId }) => {
  const [categoryId, setCategoryId] = useState(propCategoryId || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  // Fetch category details if categoryId exists
  const { data, isLoading: isFetching, error: fetchError } = useGetCategoryByIdQuery(categoryId, {
    skip: !categoryId, // Skip API call if no categoryId is set
  });

  // Pre-fill form fields when data is available
  useEffect(() => {
    if (data?.category) {
      setName(data.category.name || "");
      setDescription(data.category.description || "");
      setParentCategory(data.category.parentCategory || "");
    }
  }, [data]);

  // Mutation hook for updating category
  const [updateCategory, { isLoading: isUpdating, isError, error }] = useUpdateCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please enter a category ID.");
      return;
    }

    try {
      await updateCategory({ 
        categoryId, 
        categoryData: { name, description, parentCategory } 
      }).unwrap();
      alert("Category updated successfully!");
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold">Update Category</h2>

      {/* Category ID Input (Only needed if prop is not provided) */}
      {!propCategoryId && (
        <input
          type="text"
          placeholder="Enter Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="border p-2 w-full"
        />
      )}

      {/* Loading and Error Messages */}
      {isFetching && <p className="text-blue-500">Fetching category details...</p>}
      {fetchError && <p className="text-red-500">Error fetching category: {fetchError.data?.message || "Unknown error"}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="New Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="New Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="New Parent Category (optional)"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Update Button */}
        <button type="submit" disabled={isUpdating} className="bg-green-500 text-white p-2 rounded">
          {isUpdating ? "Updating..." : "Update Category"}
        </button>
      </form>

      {/* Display API Errors */}
      {isError && <p className="text-red-500">{error?.data?.message || "Error updating category"}</p>}
    </div>
  );
};

export default UpdateCategory;
