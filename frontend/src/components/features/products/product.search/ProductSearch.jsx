// import React, { useState } from "react";
// import { useGetAllProductsQuery } from "../../../../redux/api/productApiSlice";

// const SearchBar = () => {
//   const [search, setSearch] = useState("");
//   const [submittedSearch, setSubmittedSearch] = useState("");

//   const { data, isLoading, isError } = useGetAllProductsQuery({
//     page: 1,
//     limit: 10,
//     search: submittedSearch,
//     filters: {}, 
//     sort: "",    
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmittedSearch(search);
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit}
//         className="flex items-center max-w-lg mx-auto mb-4"
//       >
//         <label htmlFor="voice-search" className="sr-only">
//           Search
//         </label>

//         <div className="relative w-full">
//           <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
//               ></path>
//             </svg>
//           </div>

//           <input
//             type="text"
//             id="voice-search"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//         >
//           <svg
//             viewBox="0 0 20 20"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 me-2"
//           >
//             <path
//               d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//               strokeWidth="2"
//               strokeLinejoin="round"
//               strokeLinecap="round"
//               stroke="currentColor"
//             ></path>
//           </svg>
//           Search
//         </button>
//       </form>

//       {/* Display results */}
//       {isLoading && <p className="text-center text-gray-500">Loading...</p>}
//       {isError && <p className="text-center text-red-500">Error loading products.</p>}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
//         {data?.products?.length > 0 ? (
//           data.products.map((product) => (
//             <div key={product._id} className="border p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold">{product.name}</h3>
//               <p className="text-sm text-gray-600">{product.brand}</p>
//               <p className="text-sm text-gray-800">{product.description}</p>
//             </div>
//           ))
//         ) : (
//           <p className="col-span-full text-center text-gray-500">No products found.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default SearchBar;


import React, { useState, useEffect } from "react";
import { useGetAllProductsQuery } from "../../../../redux/api/productApiSlice";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce input: update debouncedSearch only after 500ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Query with debounced search
  const { data, isLoading, isError } = useGetAllProductsQuery(
    {
      page: 1,
      limit: 10,
      search: debouncedSearch,
      filters: {},
      sort: "",
    },
    {
      skip: debouncedSearch === "", // skip if empty
    }
  );

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center max-w-lg mx-auto mb-4"
      >
        <label htmlFor="product-search" className="sr-only">
          Search
        </label>

        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      {/* Loading / error states */}
      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {isError && <p className="text-center text-red-500">Error loading products.</p>}

      {debouncedSearch && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {data.products.map((product) => (
  <div key={product._id} className="border p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold">{product.name}</h3>
    <p className="text-sm text-gray-600">
      {product.brand?.name || "Unknown Brand"}
    </p>
    <p className="text-sm text-gray-800">
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
