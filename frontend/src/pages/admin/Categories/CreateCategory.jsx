import React, { useState } from "react";
import { useCreateCategoryMutation } from "../../../redux/api/categoryApiSlice.js";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [isActive, setIsActive] = useState(true); 

  const [createCategory, { isLoading, error }] = useCreateCategoryMutation();

  const handleCreate = async () => {
    await createCategory({ name, description, parentCategory, isActive });
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold">Create Category</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2 w-full" />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full mt-2" />
      <input type="text" value={parentCategory} onChange={(e) => setParentCategory(e.target.value)} placeholder="Parent Category ID (Optional)" className="border p-2 w-full mt-2" />
      <label className="block mt-2">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mr-2" />
        Active Category
      </label>
      <button onClick={handleCreate} className="bg-green-500 text-white p-2 mt-2 rounded">{isLoading ? "Creating..." : "Create"}</button>
      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
    </div>
  );
};

export default CreateCategory;
