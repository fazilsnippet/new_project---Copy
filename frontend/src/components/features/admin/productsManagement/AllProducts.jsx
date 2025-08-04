import React, { useState } from "react";
import {
  useGetAllAdminProductsQuery,
  useDeleteProductMutation,
} from "../../../../redux/api/adminApiSlice.js";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import { FiEdit, FiTrash } from "react-icons/fi";

const GetAllProducts = () => {
  const { data, isLoading } =   useGetAllAdminProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data?.products?.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description?.slice(0, 50)}...</p>
              <p className="text-sm mt-1">₹ {product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <div className="flex justify-between items-center mt-3">
                <Link to={`/admin/products/update/${product._id}`} className="text-blue-600 hover:underline flex items-center gap-1">
                  <FiEdit /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:underline flex items-center gap-1"
                >
                  <FiTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllProducts;
