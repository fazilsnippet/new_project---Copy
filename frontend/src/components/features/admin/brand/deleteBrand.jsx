// DeleteBrand.jsx
import React from "react";
import { useDeleteBrandMutation } from "../../../../redux/api/adminApiSlice.js";

const DeleteBrand = ({ brandId, onDeleteSuccess }) => {
  const [deleteBrand, { isLoading, isError }] = useDeleteBrandMutation();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteBrand(brandId).unwrap();
      onDeleteSuccess();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete brand");
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      {isLoading ? "Deleting..." : "Delete Brand"}
    </button>
  );
};

export default DeleteBrand;
