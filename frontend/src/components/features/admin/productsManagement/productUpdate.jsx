
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useUpdateProductMutation,
//   useUpdateProductDescriptionBlocksMutation,
// } from "../../../../redux/api/adminApiSlice";
// import { useGetProductByIdQuery } from "../../../../redux/api/productApiSlice";
// import { useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice";
// import { useGetAllBrandsQuery } from "../../../../redux/api/brandApiSlice";
// import DescriptionBlocksEditor from "./descriptionBlockEditor";

// const UpdateProduct = () => {
//   const { productId } = useParams();
//   const { data: productData, isLoading } = useGetProductByIdQuery(productId);
//   const { data: categoryData } = useGetCategoriesQuery();
//   const { data: brandData } = useGetAllBrandsQuery();
//   const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
//   const [updateProductDescriptionBlocks] = useUpdateProductDescriptionBlocksMutation();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     description: "",
//     category: "",
//     brand: "",
//     stock: "",
//     images: [],
//   });

//   const [previewImages, setPreviewImages] = useState([]);
//   const [descriptionBlocks, setDescriptionBlocks] = useState([]);

//   useEffect(() => {
//     if (productData) {
//       const product = productData;
//       setFormData({
//         name: product.name || "",
//         price: product.price || "",
//         description: product.description || "",
//         category: product.category || "",
//         brand: product.brand || "",
//         stock: product.stock || "",
//         images: [],
//       });
//       setPreviewImages(product.images || []);
//       setDescriptionBlocks(product.descriptionBlocks || []);
//     }
//   }, [productData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData((prev) => ({ ...prev, images: files }));
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setPreviewImages(previews);
//   };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     // 1. Base product update
//     const updatedData = new FormData();
//     updatedData.append("name", formData.name);
//     updatedData.append("price", formData.price);
//     updatedData.append("description", formData.description);
//     updatedData.append("category", formData.category);
//     updatedData.append("brand", formData.brand);
//     updatedData.append("stock", formData.stock);

//     formData.images.forEach((image) => {
//       updatedData.append("images", image);
//     });

//     const oldImages = previewImages.filter((url) => !url.startsWith("blob:"));
//     updatedData.append("oldImages", JSON.stringify(oldImages));

//     await updateProduct({ productId, formData: updatedData }).unwrap();

//     // 2. Description blocks update
//     const blockForm = new FormData();

// descriptionBlocks.forEach((block) => {
//   blockForm.append("text", block.text);
//   blockForm.append("layout", block.layout);
//   if (block.file && (block.file instanceof File || block.file instanceof Blob)) {
//     blockForm.append("images", block.file); // ✅ CORRECT field name
//   }
// });


//     await updateProductDescriptionBlocks({ productId, formData: blockForm }).unwrap();

//     alert("Product updated successfully");
//     navigate(-1);
//   } catch (error) {
//     console.error("Update failed:", error);
//     alert("Product update failed");
//   }
// };


//   if (isLoading) return <p className="text-white">Loading product...</p>;

//   return (
//     <div className="bg-[#121212] text-white min-h-screen py-10 px-6">
//       <div className="max-w-3xl mx-auto bg-[#1e1e1e] p-6 rounded-2xl shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Update Product</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             type="text"
//             name="name"
//             placeholder="Product Name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
//             required
//           />

//           <input
//             type="number"
//             name="price"
//             placeholder="Price"
//             value={formData.price}
//             onChange={handleChange}
//             className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
//             required
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={4}
//             className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
//           />

//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
//             required
//           >
//             <option value="">Select Category</option>
//             {categoryData?.categories?.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <select
//             name="brand"
//             value={formData.brand}
//             onChange={handleChange}
//             className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
//             required
//           >
//             <option value="">Select Brand</option>
//             {brandData?.brands?.map((b) => (
//               <option key={b._id} value={b._id}>
//                 {b.name}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             name="stock"
//             placeholder="Stock"
//             value={formData.stock}
//             onChange={handleChange}
//             className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
//             required
//           />

//           <input
//             type="file"
//             name="images"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//             className="text-white"
//           />

//           <div className="flex flex-wrap gap-2">
//             {previewImages.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt="preview"
//                 className="w-20 h-20 object-cover rounded-md"
//               />
//             ))}
//           </div>

//           <DescriptionBlocksEditor
//             descriptionBlocks={descriptionBlocks}
//             setDescriptionBlocks={setDescriptionBlocks}
//           />
         
//           <button
//             type="submit"
//             disabled={isUpdating}
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition"
//           >
//             {isUpdating ? "Updating..." : "Update Product"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProduct;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useUpdateProductMutation,
//   useUpdateProductDescriptionBlocksMutation,
// } from "../../../../redux/api/adminApiSlice";
// import { useGetProductByIdQuery } from "../../../../redux/api/productApiSlice";
// import { useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice";
// import { useGetAllBrandsQuery } from "../../../../redux/api/brandApiSlice";

// const UpdateProduct = () => {
//   const { productId } = useParams();

//   const { data: productData, isLoading } = useGetProductByIdQuery(productId);
//   const { data: brandsData } = useGetAllBrandsQuery();
//   const { data: categoriesData } = useGetCategoriesQuery();

//   const [updateProduct] = useUpdateProductMutation();
//   const [updateProductDescriptionBlocks] = useUpdateProductDescriptionBlocksMutation();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     brand: "",
//     stock: "",
//     images: [],
//   });

//   const [descriptionBlocks, setDescriptionBlocks] = useState([]);

//   useEffect(() => {
//     if (productData?.product) {
//       const p = productData.product;
//       setForm({
//         name: p.name,
//         description: p.description,
//         price: p.price,
//         category: p.category?._id || "",
//         brand: p.brand?._id || "",
//         stock: p.stock,
//         images: [],
//       });

//       setDescriptionBlocks(
//         p.descriptionBlocks?.map((block) => ({
//           text: block.text,
//           layout: block.layout,
//           file: null, // No preview for existing images here
//         })) || []
//       );
//     }
//   }, [productData]);

//   const handleInputChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     setForm({ ...form, images: [...e.target.files] });
//   };

//   const handleBlockChange = (index, field, value) => {
//     const updatedBlocks = [...descriptionBlocks];
//     updatedBlocks[index][field] = value;
//     setDescriptionBlocks(updatedBlocks);
//   };

//   const handleBlockFileChange = (index, file) => {
//     const updatedBlocks = [...descriptionBlocks];
//     updatedBlocks[index].file = file;
//     setDescriptionBlocks(updatedBlocks);
//   };

//   const addNewBlock = () => {
//     setDescriptionBlocks([...descriptionBlocks, { text: "", layout: "left", file: null }]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // 1. Product main info
//       const productForm = new FormData();
//       Object.entries(form).forEach(([key, value]) => {
//         if (key === "images") {
//           value.forEach((file) => productForm.append("images", file));
//         } else {
//           productForm.append(key, value);
//         }
//       });

//       await updateProduct({ productId, formData: productForm }).unwrap();

//       // 2. Description blocks
//       const blockForm = new FormData();

//       // Add block texts and layouts
//       const blocksToSend = descriptionBlocks.map(({ text, layout }) => ({
//         text,
//         layout,
//       }));
//       blockForm.append("blocks", JSON.stringify(blocksToSend));

//       // Attach corresponding files
//       descriptionBlocks.forEach((block) => {
//         if (block.file && (block.file instanceof File || block.file instanceof Blob)) {
//           blockForm.append("files", block.file);
//         }
//       });

//       await updateProductDescriptionBlocks({ productId, formData: blockForm }).unwrap();

//       alert("Product updated successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="p-6 bg-gray-900 text-white min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Update Product</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">

//         {/* Basic Fields */}
//         <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" className="p-2 w-full bg-gray-800 border border-gray-700 rounded" />
//         <input type="text" name="description" value={form.description} onChange={handleInputChange} placeholder="Description" className="p-2 w-full bg-gray-800 border border-gray-700 rounded" />
//         <input type="number" name="price" value={form.price} onChange={handleInputChange} placeholder="Price" className="p-2 w-full bg-gray-800 border border-gray-700 rounded" />
//         <input type="number" name="stock" value={form.stock} onChange={handleInputChange} placeholder="Stock" className="p-2 w-full bg-gray-800 border border-gray-700 rounded" />

//         {/* Brand and Category Select */}
//         <select name="brand" value={form.brand} onChange={handleInputChange} className="p-2 w-full bg-gray-800 border border-gray-700 rounded">
//           <option value="">Select Brand</option>
//           {brandsData?.brands?.map((b) => (
//             <option key={b._id} value={b._id}>{b.name}</option>
//           ))}
//         </select>

//         <select name="category" value={form.category} onChange={handleInputChange} className="p-2 w-full bg-gray-800 border border-gray-700 rounded">
//           <option value="">Select Category</option>
//           {categoriesData?.categories?.map((c) => (
//             <option key={c._id} value={c._id}>{c.name}</option>
//           ))}
//         </select>

//         {/* Image Upload */}
//         <input type="file" name="images" multiple onChange={handleImageChange} className="w-full text-white" />

//         {/* Description Blocks */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">Description Blocks</h2>
//           {descriptionBlocks.map((block, index) => (
//             <div key={index} className="bg-gray-800 p-4 rounded space-y-2">
//               <textarea
//                 value={block.text}
//                 onChange={(e) => handleBlockChange(index, "text", e.target.value)}
//                 placeholder="Block Text"
//                 className="w-full bg-gray-700 p-2 rounded"
//               />
//               <select
//                 value={block.layout}
//                 onChange={(e) => handleBlockChange(index, "layout", e.target.value)}
//                 className="w-full bg-gray-700 p-2 rounded"
//               >
//                 <option value="left">Left</option>
//                 <option value="right">Right</option>
//               </select>
//               <input
//                 type="file"
//                 onChange={(e) => handleBlockFileChange(index, e.target.files[0])}
//                 className="text-white"
//               />
//             </div>
//           ))}
//           <button type="button" onClick={addNewBlock} className="bg-green-600 px-4 py-2 rounded">Add Block</button>
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition">Update Product</button>
//       </form>
//     </div>
//   );
// };

// export default UpdateProduct;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useUpdateProductMutation,
  useUpdateProductDescriptionBlocksMutation,
} from "../../../../redux/api/adminApiSlice";
import { useGetProductByIdQuery } from "../../../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../../../redux/api/categoryApiSlice";
import { useGetAllBrandsQuery } from "../../../../redux/api/brandApiSlice";

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading } = useGetProductByIdQuery(productId);
  const { data: categoryData } = useGetCategoriesQuery();
  const { data: brandData } = useGetAllBrandsQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [updateProductDescriptionBlocks] = useUpdateProductDescriptionBlocksMutation();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [descriptionBlocks, setDescriptionBlocks] = useState([]);

  // Load product info into state
  useEffect(() => {
    if (productData) {
      const product = productData;
      setFormData({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category?._id || "",
        brand: product.brand?._id || "",
        stock: product.stock || "",
        images: [],
      });

      setPreviewImages(product.images || []);

      setDescriptionBlocks(
        (product.descriptionBlocks || []).map((block) => ({
          text: block.text || "",
          layout: block.layout || "left",
          file: null,
        }))
      );
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev.filter((url) => !url.startsWith("blob:")), ...previews]);
  };

  const removePreviewImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBlockChange = (index, field, value) => {
    const updated = [...descriptionBlocks];
    updated[index][field] = value;
    setDescriptionBlocks(updated);
  };

  const handleBlockFileChange = (index, file) => {
    const updated = [...descriptionBlocks];
    updated[index].file = file;
    setDescriptionBlocks(updated);
  };

  const addNewBlock = () => {
    setDescriptionBlocks([
      ...descriptionBlocks,
      { text: "", layout: "left", file: null },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Update base product
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("price", formData.price);
      updatedData.append("description", formData.description);
      updatedData.append("category", formData.category);
      updatedData.append("brand", formData.brand);
      updatedData.append("stock", formData.stock);

      formData.images.forEach((image) => {
        updatedData.append("images", image);
      });

      const oldImages = previewImages.filter((url) => !url.startsWith("blob:"));
      updatedData.append("oldImages", JSON.stringify(oldImages));

      await updateProduct({ productId, formData: updatedData }).unwrap();

      // 2. Update description blocks
      const blockForm = new FormData();

      const blocksToSend = descriptionBlocks.map(({ text, layout }) => ({
        text,
        layout,
      }));
      blockForm.append("blocks", JSON.stringify(blocksToSend));

      descriptionBlocks.forEach((block) => {
        if (block.file && (block.file instanceof File || block.file instanceof Blob)) {
          blockForm.append("files", block.file);
        }
      });

      await updateProductDescriptionBlocks({ productId, formData: blockForm }).unwrap();

      alert("Product updated successfully");
      navigate(-1);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Product update failed");
    }
  };

  if (isLoading) return <p className="text-white">Loading product...</p>;

  return (
    <div className="bg-[#121212] text-white min-h-screen py-10 px-6">
      <div className="max-w-3xl mx-auto bg-[#1e1e1e] p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Update Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
            required
          >
            <option value="">Select Category</option>
            {categoryData?.categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
            required
          >
            <option value="">Select Brand</option>
            {brandData?.brands?.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
            required
          />

          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
          />

          <div className="flex flex-wrap gap-2">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-md"
                />
                {!img.startsWith("blob:") && (
                  <button
                    type="button"
                    onClick={() => removePreviewImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-xs px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Description Blocks</h2>
            {descriptionBlocks.map((block, index) => (
              <div
                key={index}
                className="bg-[#2c2c2c] p-4 rounded space-y-2"
              >
                <textarea
                  value={block.text}
                  onChange={(e) =>
                    handleBlockChange(index, "text", e.target.value)
                  }
                  placeholder="Block Text"
                  className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                />
                <select
                  value={block.layout}
                  onChange={(e) =>
                    handleBlockChange(index, "layout", e.target.value)
                  }
                  className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
                <input
                  type="file"
                  onChange={(e) =>
                    handleBlockFileChange(index, e.target.files[0])
                  }
                  className="text-white"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addNewBlock}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
              Add Description Block
            </button>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition"
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
