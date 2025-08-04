import React, { useState } from "react";
import { useDeleteCategoryMutation } from "../../../../redux/api/adminApiSlice.js";


const DeleteCategory = () => {
  const [categoryId, setCategoryId] = useState("");

  const [deleteCategory, { isLoading, isError, error }] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    try {
      await deleteCategory(categoryId).unwrap();
      alert("Category deleted successfully!");
      setCategoryId("");
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold">Delete Category</h2>
      <input
        type="text"
        placeholder="Enter Category ID"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={handleDelete} disabled={isLoading} className="bg-red-500 text-white p-2 rounded">
        {isLoading ? "Deleting..." : "Delete Category"}
      </button>
      {isError && <p className="text-red-500">{error.data?.message || "Error occurred"}</p>}
    </div>
  );
};

export default DeleteCategory;
