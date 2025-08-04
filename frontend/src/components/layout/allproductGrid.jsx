

// import React from "react";
// import { Link } from "react-router-dom";

// // Skeleton component for loading placeholders
// const ProductSkeleton = () => {
//   return (
//     <div className="animate-pulse bg-[#EFE9D3] rounded-2xl shadow-md">
//       <div className="aspect-[3/4] bg-gray-300 rounded-t-2xl"></div>
//       <div className="px-4 pt-3 pb-4">
//         <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//         <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
//         <div className="h-5 bg-gray-300 rounded w-1/3"></div>
//       </div>
//     </div>
//   );
// };

// const ProductGridTemplate = ({
//   items = [],
//   title = "Product Collection",
//   subtitle = "Browse our curated selection of premium items.",
//   totalCount,
//   inViewRef,
//   isFetching,
//   currentPage,
//   totalPages,
//   showHeader = true,
//   showCount = true,
// }) => {
//   return (
//     <section>
//       <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        
//         {/* Header */}
//         {showHeader && (
//           <header>
//             <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
//             <p className="mt-4 max-w-md text-gray-500">{subtitle}</p>
//           </header>
//         )}

//         {/* Count Info */}
//         {showCount && (
//           <div className="mt-8">
//             <p className="text-sm text-gray-500">
//               Showing <span>{items.length}</span> of {totalCount || "..."}
//             </p>
//           </div>
//         )}

//         {/* Product Grid */}
//         <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {items.map((product) => (
//             <li key={product._id} className="w-full">
//               <Link
//                 to={`/products/${product._id}`}
//                 className="group relative block w-full overflow-hidden rounded-2xl bg-[#EFE9D3] shadow-md hover:shadow-lg transition"
//               >
//                 {/* Wishlist Icon */}
//                 <div className="absolute top-2 right-2 z-10">
//                   <button
//                     aria-label="Add to wishlist"
//                     className="p-1 rounded-full bg-white shadow hover:bg-orange-100 transition"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-orange-500"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M12 21.35l-1.45-1.32C5.4 15.36 
//                       2 12.28 2 8.5 2 5.41 
//                       4.42 3 7.5 3c1.74 0 3.41.81 
//                       4.5 2.09C13.09 3.81 
//                       14.76 3 16.5 3 19.58 3 
//                       22 5.41 22 8.5c0 3.78-3.4 
//                       6.86-8.55 11.54L12 21.35z"/>
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Product Image */}
//                 <div className="aspect-[3/4] overflow-hidden">
//                   <img
//                     src={product.images?.[0]}
//                     alt={`Image of ${product.name}`}
//                     className="block w-full h-full object-cover object-center rounded-t-2xl transition duration-500 group-hover:scale-105"
//                   />
//                 </div>

//                 {/* Product Info */}
//                 <div className="px-4 pt-3 pb-4 text-orange-500">
//                   <h3 className="text-base font-semibold truncate">{product.name}</h3>
//                   <p className="text-sm mt-1">Brand: {product.brand?.name || "Unknown"}</p>
//                   <p className="mt-2 text-lg font-bold">₹{product.price}</p>
//                 </div>
//               </Link>
//             </li>
//           ))}

//           {/* Infinite Scroll Trigger */}
//           {currentPage < totalPages && (
//             <li ref={inViewRef} className="col-span-full h-10"></li>
//           )}

//           {/* Skeleton Loader for fetching */}
//           {isFetching &&
//             Array.from({ length: 4 }).map((_, index) => (
//               <li key={`skeleton-${index}`}>
//                 <ProductSkeleton />
//               </li>
//             ))}
//         </ul>
//       </div>
//     </section>
//   );
// };

// export default ProductGridTemplate;

import React from "react";
import { Link } from "react-router-dom";
import WishlistButton from "../ui/wishlistButton.jsx"
const ProductSkeleton = () => (
  <div className="animate-pulse bg-[#EFE9D3] rounded-2xl shadow-md">
    <div className="aspect-[3/4] bg-gray-300 rounded-t-2xl"></div>
    <div className="px-4 pt-3 pb-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-5 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

const ProductGridTemplate = ({
  items = [],
  title = "Product Collection",
  subtitle = "Browse our curated selection of premium items.",
  totalCount,
  inViewRef,
  isFetching,
  currentPage,
  totalPages,
  showHeader = true,
  showCount = true,
}) => {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        {showHeader && (
          <header>
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
            <p className="mt-4 max-w-md text-gray-500">{subtitle}</p>
          </header>
        )}

        {/* Count Info */}
        {showCount && (
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Showing <span>{items.length}</span> of {totalCount || "..."}
            </p>
          </div>
        )}

        {/* Product Grid */}
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <li key={product._id} className="w-full">
              <div className="group relative block w-full overflow-hidden rounded-2xl bg-[#EFE9D3] shadow-md hover:shadow-lg transition">
                
                {/* ✅ WishlistButton */}
                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton productId={product._id} />
                </div>

                {/* Product Link */}
                <Link to={`/products/${product._id}`}>
                  {/* Product Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.images?.[0]}
                      alt={`Image of ${product.name}`}
                      className="block w-full h-full object-cover object-center rounded-t-2xl transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="px-4 pt-3 pb-4 text-orange-500">
                    <h3 className="text-base font-semibold truncate">{product.name}</h3>
                    <p className="text-sm mt-1">
                      Brand: {product.brand?.name || "Unknown"}
                    </p>
                    <p className="mt-2 text-lg font-bold">₹{product.price}</p>
                  </div>
                </Link>
              </div>
            </li>
          ))}

          {/* Infinite Scroll Trigger */}
          {currentPage < totalPages && (
            <li ref={inViewRef} className="col-span-full h-10"></li>
          )}

          {/* Skeleton Loader */}
          {isFetching &&
            Array.from({ length: 4 }).map((_, index) => (
              <li key={`skeleton-${index}`}>
                <ProductSkeleton />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default ProductGridTemplate;
