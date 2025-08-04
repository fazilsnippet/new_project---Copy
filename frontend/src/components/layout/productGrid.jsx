
// import React from "react";
// import { Link } from "react-router-dom";

// const ProductPreviewGrid = ({ title, products, maxItems, buttonText, onButtonClick }) => {
//   const displayed = products.slice(0, maxItems);

//   return (
//     <div className="px-4 py-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//         {buttonText && (
//           <button
//             onClick={onButtonClick}
//             className="text-blue-600 hover:underline text-sm"
//           >
//             {buttonText}
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         {displayed.map((product) => (
//           <Link
//             to={`/products/${product._id || product.productId}`}
//             key={product._id || product.productId}
//             className="bg-white rounded-xl p-4 shadow hover:shadow-md transition block"
//           >
//             {/* ✅ Responsive image with preserved aspect ratio */}
// <div className="aspect-[4/3] w-full mb-2 bg-white flex items-center justify-center overflow-hidden rounded">
//               <img
//                 src={product.images?.[0]}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* ✅ Product details */}
//             <h3 className="text-gray-700 font-semibold">{product.name}</h3>
//             {/* <p className="text-sm text-gray-500">
//               {product.brand?.name ||"unknown"}
//             </p> */}
//             <p className="text-green-600 font-bold text-sm">₹{product.price}</p>

//             {/* Optional: Add a rating display if available */}
//             {product.rating && (
//               <div className="text-yellow-500 text-sm mt-1">
//                 ★ {product.rating.toFixed(1)} / 5
//               </div>
//             )}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductPreviewGrid;

import React from "react";
import { Link } from "react-router-dom";
import WishlistButton from "../ui/wishlistButton.jsx"

const ProductPreviewGrid = ({ title, products, maxItems, buttonText, onButtonClick }) => {
  const displayed = products.slice(0, maxItems);

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="text-blue-600 hover:underline text-sm"
          >
            {buttonText}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayed.map((product) => (
          <div
            key={product._id || product.productId}
            className="relative bg-white rounded-xl p-4 shadow hover:shadow-md transition block"
          >
            {/* ✅ WishlistButton */}
            <div className="absolute top-2 right-2 z-10">
              <WishlistButton productId={product._id || product.productId} />
            </div>

            {/* ✅ Product Link */}
            <Link to={`/products/${product._id || product.productId}`}>
              {/* Image */}
              <div className="aspect-[4/3] w-full mb-2 bg-white flex items-center justify-center overflow-hidden rounded">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product details */}
              <h3 className="text-gray-700 font-semibold">{product.name}</h3>
              <p className="text-green-600 font-bold text-sm">₹{product.price}</p>

              {/* Optional: Rating */}
              {product.rating && (
                <div className="text-yellow-500 text-sm mt-1">
                  ★ {product.rating.toFixed(1)} / 5
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPreviewGrid;
