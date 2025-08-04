import React, { useState } from "react";
import {  useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice";
import {useCreateCategoryMutation} from "../../../../redux/api/adminApiSlice.js"
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  const navigate = useNavigate();
  const [createCategory, { isLoading, error }] = useCreateCategoryMutation();
  const { data: categoryData, isLoading: isCategoriesLoading, error: categoryError } = useGetCategoriesQuery();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        isActive,
        parentCategory: parentCategory || null,
      };

      const result = await createCategory(payload).unwrap();
      console.log("Category created:", result);
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="h-12 text-white text-xl font-bold mb-4">Create Category</h2>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-white mb-1">Name</label>
              <input
                id="name"
                type="text"
                className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="parentCategory" className="block text-white mb-1">Parent Category (optional)</label>
              {isCategoriesLoading ? (
                <p className="text-gray-400">Loading categories...</p>
              ) : categoryError ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <select
                  id="parentCategory"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <option value="">None</option>
                  {categoryData?.categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-white mb-1">Description</label>
            <textarea
              id="description"
              className="p-4 w-full border rounded-lg bg-[#101011] text-white"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-pink-600"
            />
            <label htmlFor="isActive" className="text-white">Active Category</label>
          </div>

          <button
            type="submit"
            className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 text-white hover:bg-pink-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Category"}
          </button>

          {error && (
            <p className="text-red-500 mt-2">
              Error: {error?.data?.message || error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
