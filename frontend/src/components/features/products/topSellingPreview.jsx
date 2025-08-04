// // TopSellingPreview.jsx
// import React, { useEffect, useState } from "react";
// import { useGetTopSellingProductsQuery } from "../../../redux/api/productApiSlice.js";
// import { useNavigate } from "react-router-dom";

// const TopSellingPreview = () => {
//   const navigate = useNavigate();
//   const { data, isLoading, isError, error } = useGetTopSellingProductsQuery({ limit: 20 });
//   const [maxItems, setMaxItems] = useState(4);

//   useEffect(() => {
//     const updateMaxItems = () => {
//       setMaxItems(window.innerWidth >= 768 ? 6 : 4);
//     };
//     updateMaxItems();
//     window.addEventListener("resize", updateMaxItems);
//     return () => window.removeEventListener("resize", updateMaxItems);
//   }, []);

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p className="text-red-500">Error: {error?.data?.error || error.message}</p>;

//   const products = Array.isArray(data) ? data.slice(0, maxItems) : [];

//   return (
//     <div className="px-4 py-6 max-w-6xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-semibold text-gray-800">🔥 Top Selling Products</h2>
//         <button
//           onClick={() => navigate("/topseller")}
//           className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition text-sm"
//         >
//           View All
//         </button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <div key={product.productId} className="bg-white rounded-xl p-4 shadow">
//             <img src={product.images?.[0]} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
//             <h3 className="font-bold text-gray-700">{product.name}</h3>
//             <p className="text-sm text-gray-500">{product.brand}</p>
//             <p className="text-green-600 font-semibold">₹{product.price}</p>
//             <p className="text-sm text-gray-500 mt-1">Sold: {product.totalSold}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TopSellingPreview;


// components/widgets/TopSellingPreview.jsx


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTopSellingProductsQuery } from "../../../redux/api/productApiSlice.js";
import ProductPreviewGrid from "../../layout/productGrid.jsx";

const TopSellingPreview = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetTopSellingProductsQuery({ limit: 20 });
  const [maxItems, setMaxItems] = useState(4);

  useEffect(() => {
    const updateMaxItems = () => {
      setMaxItems(window.innerWidth >= 768 ? 6 : 4);
    };
    updateMaxItems();
    window.addEventListener("resize", updateMaxItems);
    return () => window.removeEventListener("resize", updateMaxItems);
  }, []);

  if (isLoading) return <p className="text-center py-6">Loading top sellers...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error: {error?.data?.error || error.message}</p>;

  return (
    <ProductPreviewGrid
      title="🔥 Top Selling Products"
      buttonText="View All"
      onButtonClick={() => navigate("/topseller")}
      products={Array.isArray(data) ? data : []}
      maxItems={maxItems}
    />
  );
};

export default TopSellingPreview;
