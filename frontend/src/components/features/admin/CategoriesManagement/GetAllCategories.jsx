import React from "react";
import {
  useGetCategoriesQuery,
} from "../../../../redux/api/categoryApiSlice";
import {useDeleteCategoryMutation} from "../../../../redux/api/adminApiSlice.js"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditCategory from "./UpdateCategory"

const GetAllCategories = () => {
  const { data, error, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const navigate = useNavigate();
  

  const handleDelete = async (categoryId) => {
    const confirm = window.confirm("Are you sure you want to delete this category?");
    if (!confirm) return;

    try {
      await deleteCategory(categoryId).unwrap();
      toast.success("Category deleted successfully.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-xl text-white font-bold mb-6">All Categories</h2>

        {isLoading && <p className="text-gray-400">Loading categories...</p>}
        {error && (
          <p className="text-red-500">
            Error fetching categories: {error?.data?.message || error.message}
          </p>
        )}

        {data?.categories?.length > 0 ? (
          <ul className="space-y-4">
            {data.categories.map((category) => (
              <li
                key={category._id}
                className="bg-[#101011] p-5 rounded-lg border border-gray-700 text-white shadow hover:shadow-md transition duration-200"
              >
                <div className="mb-2">
                  <span className="font-semibold">Name:</span> {category.name}
                </div>

                {category.description && (
                  <div className="mb-2">
                    <span className="font-semibold">Description:</span> {category.description}
                  </div>
                )}

                <div className="mb-2">
                  <span className="font-semibold">Products Count:</span> {category.productCount}
                </div>

                <div>
                  <span className="font-semibold">Subcategories:</span>{" "}
                  {category.subcategories?.length > 0 ? (
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {category.subcategories.map((sub) => (
                        <li key={sub._id} className="text-gray-300">
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>

                {/* ✅ Edit / Delete Buttons */}
                <div className="mt-4 flex gap-4">
                  {/* <button onClick={() => EditCategory(category._id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-medium"
                  >
                    Edit
                  </button> */}

           <button
  onClick={() => navigate(`/admin/categories/${category._id}/edit`)}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-medium"
>
  Edit
</button>


                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p className="text-gray-500">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default GetAllCategories;
