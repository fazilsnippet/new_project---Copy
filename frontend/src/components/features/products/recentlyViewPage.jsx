// import React, { useState, useEffect } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { useGetRecentlyViewedProductsQuery } from "../../../redux/api/userApiSlice.js";
// import { Link } from "react-router-dom";

// const RecentlyViewedProductsPage = () => {
//   const LIMIT = 10;
//   const [visibleCount, setVisibleCount] = useState(LIMIT);
// const { data = [], isLoading, isError, error } = useGetRecentlyViewedProductsQuery();

//   const recentProducts = data?.recent || [];

//   const fetchMore = () => {
//     if (visibleCount < recentProducts.length) {
//       setVisibleCount((prev) => prev + LIMIT);
//     }
//   };

//   useEffect(() => {
//     setVisibleCount(LIMIT);
//   }, [data]);

//   if (isLoading) {
//     return <p className="text-center mt-4 text-gray-500">Loading recently viewed products...</p>;
//   }

//   if (isError) {
//     return <p className="text-center text-red-500">Error: {error?.data?.message || error.error}</p>;
//   }

//   const visibleProducts = recentProducts.slice(0, visibleCount);
//   const hasMore = visibleCount < recentProducts.length;

//   return (
//     <div className="px-4 py-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">
//         👀 Recently Viewed Products
//       </h2>

//       {visibleProducts.length === 0 ? (
//         <p className="text-center text-gray-500">You haven't viewed any products yet.</p>
//       ) : (
//         <InfiniteScroll
//           dataLength={visibleProducts.length}
//           next={fetchMore}
//           hasMore={hasMore}
//           loader={<p className="text-center mt-4 text-gray-500">Loading more...</p>}
//           endMessage={<p className="text-center mt-4 text-gray-500">You've reached the end.</p>}
//         >
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//             {visibleProducts.map((product) => (
//               <Link
//                 to={`/products/${product._id || product.productId}`}
//                 key={product._id || product.productId}
//                 className="bg-white rounded-xl p-4 shadow hover:shadow-md transition"
//               >
//                 <img
//                   src={product.images?.[0]}
//                   alt={product.name}
//                   className="w-full h-40 object-cover rounded mb-3"
//                 />
//                 <h3 className="font-bold text-gray-700">{product.name}</h3>
//                 <p className="text-sm text-gray-500">
//                   {product.brand?.name || product.brand || "Unknown"}
//                 </p>
//                 <p className="text-green-600 font-semibold">₹{product.price}</p>
//               </Link>
//             ))}
//           </div>
//         </InfiniteScroll>
//       )}
//     </div>
//   );
// };

// export default RecentlyViewedProductsPage;


import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetRecentlyViewedProductsQuery } from "../../../redux/api/userApiSlice.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RecentlyViewedProductsPage = () => {
  const LIMIT = 10;
  const [visibleCount, setVisibleCount] = useState(LIMIT);
  const navigate = useNavigate()
  const { data = [], isLoading, isError, error } = useGetRecentlyViewedProductsQuery();
  
  // Support both array or object format
  const recentProducts = Array.isArray(data) ? data : data?.recent || [];

  const fetchMore = () => {
    if (visibleCount < recentProducts.length) {
      setVisibleCount((prev) => prev + LIMIT);
    }
  };

  useEffect(() => {
    setVisibleCount(LIMIT);
  }, [data]);

  if (isLoading) {
    return <p className="text-center mt-6 text-gray-500">Loading recently viewed products...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        Error: {error?.data?.message || error?.message || "Something went wrong."}
      </p>
    );
  }

  const visibleProducts = recentProducts.slice(0, visibleCount);
  const hasMore = visibleCount < recentProducts.length;

  return (
    <div>
     <button
          onClick={() =>
            navigate(-1)
          }
          className="mt-2 ml-2 bg-yellow-200 hover:bg-yellow-400 px-2 py-1  rounded text-black"
        >
           back
        </button>

      {visibleProducts.length === 0 ? (
        <p className="text-center text-gray-500">You haven't viewed any products yet.</p>
      ) : (
        <InfiniteScroll
          dataLength={visibleProducts.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<p className="text-center mt-4 text-gray-500">Loading more...</p>}
          endMessage={<p className="text-center mt-4 text-gray-500">You've reached the end.</p>}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => {
              const id = product._id || product.productId;
              return (
                <Link
                  to={`/products/${id}`}
                  key={id}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {typeof product.brand === "object"
                      ? product.brand?.name
                      : product.brand || "Unknown Brand"}
                  </p>
                  <p className="text-green-600 font-bold text-sm">₹{product.price}</p>
                </Link>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default RecentlyViewedProductsPage;
