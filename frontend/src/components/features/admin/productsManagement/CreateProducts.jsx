// import React, { useState, useEffect } from 'react';
// import { useCreateProductMutation } from "../../../../redux/api/productApiSlice.js";
// import { useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice.js";
// import { useNavigate } from 'react-router-dom';

// const CreateProduct = () => {
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [brand, setBrand] = useState("");
//   const [description, setDescription] = useState("");
//   const [name, setName] = useState("");
//   const [stock, setStock] = useState(0);
//   const [price, setPrice] = useState();
//   const [category, setCategory] = useState("");
//   const navigate = useNavigate();
//   const [CreateProduct] = useCreateProductMutation();
//   const { data, isLoading, error } = useGetCategoriesQuery();

//   const handleFiles = (selectedFiles) => {
//     const validImages = selectedFiles.filter((file) => file.type.startsWith("image/"));
//     const newPreviews = validImages.map((file) => URL.createObjectURL(file));
//     setImages((prev) => [...prev, ...validImages]);
//     setImagePreviews((prev) => [...prev, ...newPreviews]);
//   };

//   const uploadFileHandler = (e) => {
//     handleFiles(Array.from(e.target.files));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     handleFiles(Array.from(e.dataTransfer.files));
//   };

//   const handleDragOver = (e) => e.preventDefault();

//   const removeImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const productData = new FormData();
//       images.forEach((image) => productData.append("images", image));
//       productData.append("name", name);
//       productData.append("description", description);
//       productData.append("brand", brand);
//       productData.append("stock", parseInt(stock));
//       productData.append("price", parseFloat(price));
//       productData.append("category", category);

//       const { data } = await CreateProduct(productData);
//       if (!data) {
//         console.error("Please provide the required credentials for product creation");
//       } else {
//         navigate("/admin/products");
//       }
//     } catch (error) {
//       console.error(error || "product creation failed !!!! ");
//     }
//   };

//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [imagePreviews]);

//   return (
//     <div className="container xl:mx-[9rem] sm:mx-[0]">
//       <div className="flex flex-col md:flex-row">
//         <div className="md:w-3/4 p-3">
//           <div className="h-12 text-white text-xl font-bold mb-4">Create Product</div>

//           <div
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             className="border-dashed border-2 border-gray-600 p-6 rounded-lg text-center text-white cursor-pointer hover:bg-[#1a1a1a] transition duration-300"
//           >
//             <label className="block text-white font-bold">
//               {images.length > 0 ? `${images.length} file(s) selected` : "Drag & Drop or Click to Upload Product Images"}
//               <input
//                 type="file"
//                 name="images"
//                 accept="image/*"
//                 multiple
//                 onChange={uploadFileHandler}
//                 className="hidden"
//               />
//             </label>
//             <div className="flex flex-wrap mt-4 gap-3 justify-center">
//               {imagePreviews.map((src, idx) => (
//                 <div key={idx} className="relative group">
//                   <img
//                     src={src}
//                     alt={`preview-${idx}`}
//                     className="w-24 h-24 object-cover rounded-lg border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(idx)}
//                     className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full px-2 py-0 text-xs hidden group-hover:block"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="p-3">
//             <div className="flex flex-wrap gap-4">
//               <div>
//                 <label htmlFor="name">Name</label>
//                 <input
//                   type="text"
//                   className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="price">Price</label>
//                 <input
//                   type="number"
//                   className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="brand">Brand</label>
//                 <input
//                   type="text"
//                   className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
//                   value={brand}
//                   onChange={(e) => setBrand(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="stock">Stock</label>
//                 <input
//                   type="number"
//                   className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
//                   value={stock}
//                   onChange={(e) => setStock(e.target.value)}
//                 />
//               </div>
//               <div className="w-full">
//                 <label htmlFor="category">Category</label>
//                 {isLoading ? (
//                   <p className="text-gray-400">Loading categories...</p>
//                 ) : error ? (
//                   <p className="text-red-500">Failed to load categories</p>
//                 ) : (
//                   <select
//                     id="category"
//                     className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                   >
//                     <option value="">Select a category</option>
//                     {data?.categories?.map((c) => (
//                       <option key={c._id} value={c._id}>{c.name}</option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//             </div>

//             <label htmlFor="description">Description</label>
//             <textarea
//               className="p-2 mb-3 w-full bg-[#101011] border rounded-lg text-white"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>

//             <button
//               onClick={handleSubmit}
//               className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProduct;

import React, { useState, useEffect } from 'react';
import { useCreateProductMutation } from "../../../../redux/api/adminApiSlice.js";
import { useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice.js";
import { useGetAllBrandsQuery } from '../../../../redux/api/brandApiSlice.js';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../ui/backButton.jsx';

const CreateProduct = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  
  const navigate = useNavigate();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  
  const { data, isLoading, error } = useGetCategoriesQuery();
  const { data: brandData, isLoading: brandLoading, error: brandError } = useGetAllBrandsQuery();

  const handleFiles = (selectedFiles) => {
    const validImages = selectedFiles.filter((file) => file.type.startsWith("image/"));
    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...validImages]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const uploadFileHandler = (e) => {
    handleFiles(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      images.forEach((image) => productData.append("images", image));
      productData.append("name", name);
      productData.append("description", description);
      productData.append("brand", brand);
      productData.append("stock", parseInt(stock));
      productData.append("price", parseFloat(price));
      productData.append("category", category);

      const res = await createProduct(productData).unwrap();
      console.log("Success:", res);
      navigate(-1);
    } catch (error) {
      console.error("Product creation failed", error);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="container mx-auto px-4 relative">
      
      {/* ✅ Freeze Screen Overlay when processing */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black px-6 py-4 rounded-lg shadow-lg">
            <p className="font-medium">Creating Product...</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-4">
        
        {/* ✅ Back Button */}
        <BackButton />
        
        <div className="h-12 text-white text-xl font-bold mb-4 mt-2">
          Create Product
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* File Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-dashed border-2 border-gray-600 p-6 rounded-lg text-center text-white cursor-pointer hover:bg-[#1a1a1a] transition duration-300"
          >
            <label className="block text-white font-bold">
              {images.length > 0
                ? `${images.length} file(s) selected`
                : "Drag & Drop or Click to Upload Product Images"}
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
            <div className="flex flex-wrap mt-4 gap-3 justify-center">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full px-2 py-0 text-xs hidden group-hover:block"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Brand Select */}
            <div>
              <label htmlFor="brand" className="text-sm text-gray-400">Brand</label>
              {brandLoading ? (
                <p className="text-sm text-gray-300">Loading brands...</p>
              ) : brandError ? (
                <p className="text-sm text-red-500">Failed to load brands</p>
              ) : (
                <select
                  id="brand"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Select a brand</option>
                  {brandData?.brands?.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-2">
              <label htmlFor="category">Category</label>
              {isLoading ? (
                <p className="text-gray-400">Loading categories...</p>
              ) : error ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <select
                  id="category"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {data?.categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description">Description</label>
            <textarea
              className="p-2 mb-3 w-full bg-[#101011] border rounded-lg text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
