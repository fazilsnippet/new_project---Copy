import React, { useEffect, useState } from "react";
import {
  useGetCategoryByIdQuery,
  useGetCategoriesQuery,
} from "../../../../redux/api/categoryApiSlice";
import {useUpdateCategoryMutation} from "../../../../redux/api/adminApiSlice.js"
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { data: categoryDetail, isLoading, error } = useGetCategoryByIdQuery({ id: categoryId });
  const { data: allCategories, isLoading: loadingCategories } = useGetCategoriesQuery();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (categoryDetail?.category) {
      const c = categoryDetail.category;
      setName(c.name || "");
      setDescription(c.description || "");
      setParentCategory(c.parentCategory?._id || ""); // ensure only _id, not object
      setIsActive(c.isActive !== false);
    }
  }, [categoryDetail]);

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("isActive", isActive);
    
    if (parentCategory) {
      formData.append("parentCategory", parentCategory); // ✅ only append if present
    }

    if (image) {
      formData.append("image", image);
    }

    await updateCategory({
      categoryId,
      categoryData: formData,
    }).unwrap();

    toast.success("Category updated successfully.");
    navigate("/admin/categories");
  } catch (err) {
    toast.error(err?.data?.message || "Failed to update category.");
  }
};


  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl text-white font-bold mb-6">Edit Category</h2>

        {isLoading ? (
          <p className="text-gray-400">Loading category...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error?.data?.message || error.message}</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-white mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="parentCategory" className="block text-white mb-1">Parent Category (optional)</label>
                {loadingCategories ? (
                  <p className="text-gray-400">Loading categories...</p>
                ) : (
                  <select
                    id="parentCategory"
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                  >
                    <option value="">None</option>
                    {allCategories?.categories
                      ?.filter((c) => c._id !== categoryId)
                      .map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
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

            <div>
              <label htmlFor="image" className="block text-white mb-1">Category Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="text-white"
                onChange={(e) => setImage(e.target.files[0])}
              />

              {/* Show existing image if present and no new file selected */}
              {categoryDetail?.category?.image && !image && (
                <img
                  src={categoryDetail.category.image}
                  alt="Current category"
                  className="mt-4 h-24 w-24 object-cover rounded border"
                />
              )}

              {/* Show uploaded file name */}
              {image && (
                <p className="text-sm text-gray-300 mt-2">{image.name}</p>
              )}
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
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Category"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCategory;
