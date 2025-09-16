

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetAllProductsQuery } from "../../../../redux/api/productApiSlice";

// const SearchBar = () => {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const navigate = useNavigate();

//   // Debounce logic
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [search]);

//   // Fetch products
//   const { data, isLoading, isError } = useGetAllProductsQuery(
//     {
//       page: 1,
//       limit: 10,
//       search: debouncedSearch,
//       filters: {},
//       sort: "",
//     },
//     {
//       skip: debouncedSearch === "",
//     }
//   );

//   // Navigate to product page & reset search input
//   const handleProductClick = (id) => {
//     navigate(`/products/${id}`);
//     setSearch("");            // Clear input
//     setDebouncedSearch("");   // Clear debounced state (collapses results)
//   };

//   return (
//     <>
//       {/* Search Input */}
//       <form
//         onSubmit={(e) => e.preventDefault()}
//         className="flex items-center max-w-4xl mx-auto"
//       >
//         <label htmlFor="product-search" className="sr-only">
//           Search
//         </label>

//         <div className="relative w-full">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg
//               viewBox="0 0 21 21"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-4 h-4 text-gray-500 dark:text-gray-400"
//             >
//               <path
//                 d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
//                 strokeWidth="2"
//                 strokeLinejoin="round"
//                 strokeLinecap="round"
//                 stroke="currentColor"
//               />
//             </svg>
//           </div>

//           <input
//             type="text"
//             id="product-search"
//             className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </form>

//       {/* Status messages */}
//       <div className="max-w-6xl px-4 mx-auto mt-4">
//         {isLoading && <p className="text-center text-gray-500">Loading...</p>}
//         {isError && (
//           <p className="text-center text-red-500">Error loading products.</p>
//         )}
//         {debouncedSearch &&
//           !isLoading &&
//           !isError &&
//           (!data || data.products?.length === 0) && (
//             <p className="text-center text-gray-500">No products found.</p>
//           )}
//       </div>

//       {/* Search Results */}
//       {debouncedSearch && data?.products?.length > 0 && (
//         <div className="grid max-w-6xl grid-cols-1 gap-4 px-4 mx-auto mt-4 sm:grid-cols-2 lg:grid-cols-3">
//           {data.products.map((product) => (
//             <div
//               key={product._id}
//               className="p-4 transition border rounded-lg shadow cursor-pointer hover:shadow-md"
//               onClick={() => handleProductClick(product._id)}
//             >
//               <h3 className="text-lg font-semibold">{product.name}</h3>
//               <p className="text-sm text-gray-600">
//                 {product.brand?.name || "Unknown Brand"}
//               </p>
//               <p className="text-sm text-gray-800 line-clamp-2">
//                 {typeof product.description === "string"
//                   ? product.description
//                   : JSON.stringify(product.description)}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default SearchBar;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchProductsMutation } from "../../../../redux/api/searchApiSlice";
const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [triggerSearch, { data, isLoading, isError }] = useSearchProductsMutation();
  const navigate = useNavigate();

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Trigger search when debouncedSearch changes
  useEffect(() => {
    if (debouncedSearch) {
      triggerSearch(debouncedSearch);
    }
  }, [debouncedSearch, triggerSearch]);

  // Navigate to product page & reset search input
  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
    setSearch("");
    setDebouncedSearch("");
  };

  return (
    <>
      {/* Search Input */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center max-w-4xl mx-auto"
      >
        <label htmlFor="product-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
            >
              <path
                d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="currentColor"
              />
            </svg>
          </div>
          <input
            type="text"
            id="product-search"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      {/* Status messages */}
      <div className="max-w-6xl px-4 mx-auto mt-4">
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {isError && (
          <p className="text-center text-red-500">Error loading products.</p>
        )}
        {debouncedSearch &&
          !isLoading &&
          !isError &&
          (!data || !data.results || data.results.length === 0) && (
            <p className="text-center text-gray-500">No products found.</p>
          )}
      </div>

      {/* Search Results */}
      {debouncedSearch && data?.results?.length > 0 && (
        <div className="grid max-w-6xl grid-cols-1 gap-4 px-4 mx-auto mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.results.map((product) => (
            <div
              key={product._id}
              className="p-4 transition border rounded-lg shadow cursor-pointer hover:shadow-md"
              onClick={() => handleProductClick(product._id)}
            >
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">
                {product.brand?.name || "Unknown Brand"}
              </p>
              <p className="text-sm text-gray-800 line-clamp-2">
                {typeof product.description === "string"
                  ? product.description
                  : JSON.stringify(product.description)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchBar;