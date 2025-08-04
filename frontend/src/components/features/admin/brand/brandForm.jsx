// // BrandForm.js (shared by Create and Update)
// import React, { useEffect, useState } from "react";
// import { useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice";

// const BrandForm = ({ onSubmit, initialData = {}, isLoading = false }) => {
//   const [name, setName] = useState(initialData.name || "");
//   const [description, setDescription] = useState(initialData.description || "");
//   const [category, setCategory] = useState(initialData.category?._id || initialData.category || "");
//   const [image, setImage] = useState(null);

//   const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("description", description);
//     // formData.append("category", category);
// formData.append("category", typeof category === "object" ? category._id : category);

//     if (image) formData.append("image", image);
//     onSubmit(formData);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-black text-white p-6 rounded shadow-md w-full max-w-md"
//     >
//       <h2 className="text-xl mb-4">{initialData._id ? "Update" : "Create"} Brand</h2>

//       <div className="mb-4">
//         <label className="block mb-1">Brand Name</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="w-full p-2 rounded bg-gray-900 border border-gray-700"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1">Description</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full p-2 rounded bg-gray-900 border border-gray-700"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1">Category</label>
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//           className="w-full p-2 rounded bg-gray-900 border border-gray-700"
//         >
//           <option value="" disabled>
//             Select Category
//           </option>
//           {!isCategoryLoading &&
//             categories?.categories?.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1">Image (optional)</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImage(e.target.files[0])}
//           className="text-white"
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ${
//           isLoading ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//       >
//         {isLoading ? "Saving..." : initialData._id ? "Update" : "Create"} Brand
//       </button>
//     </form>
//   );
// };

// export default BrandForm;

import React, { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice";
import BackButton from "../../../ui/backButton.jsx";
const BrandForm = ({ onSubmit, initialData = {}, isLoading = false }) => {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [category, setCategory] = useState(initialData.category?._id || initialData.category || "");
  const [image, setImage] = useState(null);
  const [isTopBrand, setIsTopBrand] = useState(initialData.isTopBrand || false); // ✅ new state
  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", typeof category === "object" ? category._id : category);
    formData.append("isTopBrand", isTopBrand); // ✅ append to formData
    if (image) formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <form  
      onSubmit={handleSubmit}
      className="bg-black text-white p-6 rounded shadow-md w-full max-w-md"
    >
 <div className="px-2 py-2">
    <BackButton />
  </div>      <h2 className="text-xl mb-4">{initialData._id ? "Update" : "Create"} Brand</h2>

      <div className="mb-4">
        <label className="block mb-1">Brand Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-900 border border-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-900 border border-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-900 border border-gray-700"
        >
          <option value="" disabled>
            Select Category
          </option>
          {!isCategoryLoading &&
            categories?.categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-white"
        />
      </div>

      {/* ✅ Add checkbox for Top Brand */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="topBrand"
          checked={isTopBrand}
          onChange={(e) => setIsTopBrand(e.target.checked)}
          className="accent-red-600"
        />
        <label htmlFor="topBrand" className="select-none cursor-pointer">Mark as Top Brand</label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Saving..." : initialData._id ? "Update" : "Create"} Brand
      </button>
    </form>
  );
};

export default BrandForm;

