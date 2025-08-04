// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetProductsByBrandQuery } from "../../../redux/api/brandApiSlice.js";

// const BrandProductsPage = () => {
//   const { brandId } = useParams();
//   const navigate = useNavigate();

//   const { data, isLoading, error } = useGetProductsByBrandQuery({ brandId, page: 1 });

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Failed to load products</p>;

//   return (
//     <div className="p-4 max-w-screen-xl mx-auto">
//       {/* ✅ Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
//       >
//         ← Back
//       </button>

//       <h2 className="text-2xl font-bold mb-4">Products for this Brand</h2>
      
//       {data?.products?.length ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {data.products.map((product) => (
//             <div key={product._id} className="border rounded-lg p-2 shadow hover:scale-105 transition">
//               <img
//                 src={product.images[0]}
//                 alt={product.name}
//                 className="w-full h-40 object-cover rounded"
//               />
//               <h3 className="mt-2 font-medium">{product.name}</h3>
//               <p className="text-green-600 font-bold">₹{product.price}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No products found for this brand.</p>
//       )}
//     </div>
//   );
// };

// export default BrandProductsPage;


import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductsByBrandQuery } from "../../../redux/api/brandApiSlice.js";

const BrandProductsPage = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProductsByBrandQuery({ brandId, page: 1 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load products</p>;

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Products for this Brand</h2>
      
      {data?.products?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-2 shadow hover:scale-105 transition cursor-pointer"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
                onClick={() => navigate(`/products/${product._id}`)} // ✅ Navigate on click
              />
              <h3 className="mt-2 font-medium">{product.name}</h3>
              <p className="text-green-600 font-bold">₹{product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found for this brand.</p>
      )}
    </div>
  );
};

export default BrandProductsPage;
