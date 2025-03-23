// import React, { useState } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx';
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './ProductListPage.css'; // Import the CSS file

// const ProductListPage = () => {
//   const [filters, setFilters] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data, error, isLoading } = useGetAllProductsQuery({ ...filters, search: searchTerm });
//   const products = data?.products || [];  // Handle cases where data is undefined
  

//   const handleFilter = (filterValues) => {
//     setFilters(filterValues);
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   // Ensure products is an array
//   const productList = Array.isArray(products) ? products : Object.values(products);

//   return (
//     <div className="product-list-page">
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />
//       <div className="product-list">
//         {productList.map((product) => (
//           <ProductCard key={product._id || product.id || product.name} product={product} />
//         ))}
//       </div>
//     </div>
//   );}

// export default ProductListPage

// import React, { useState } from "react";
// import { useGetAllProductsQuery } from "../../redux/api/productApiSlice";
// import ProductCard from "./ProductCard.jsx";
// import ProductFilter from "./ProductFilter.jsx";
// import ProductSearch from "./ProductSearch.jsx";
// import "./ProductListPage.css"; // Import the CSS file
// import MainHeader from "../../components/mainHeader.jsx";
// const ProductListPage = () => {
//   const [filters, setFilters] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const { data, error, isLoading } = useGetAllProductsQuery({
//     ...filters,
//     search: searchTerm,
//   });
//   const products = data?.products || [];

//   const handleFilter = (filterValues) => {
//     setFilters(filterValues);
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   // Ensure products is an array
//   const productList = Array.isArray(products) ? products : Object.values(products);

//   return (
//     <div className="product-list-page">
//       <h2 className="page-title">Featured Products</h2>
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />
//       <div className="product-list">
//         {productList.slice(0, 12).map((product) => (
//           <ProductCard key={product._id || product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductListPage;
import React, { useState, useCallback } from "react";
import { useGetAllProductsQuery } from "../../redux/api/productApiSlice";
import ProductCard from "./ProductCard.jsx";
import ProductFilter from "./ProductFilter.jsx";
import ProductSearch from "./ProductSearch.jsx";
import "./ProductListPage.css"; // Import the CSS file
import MainHeader from "../../components/mainHeader.jsx";

const ProductListPage = () => {
  // Merging filters & search term into one state object
  const [queryParams, setQueryParams] = useState({ search: '', filters: {} });

  const handleFilter = useCallback((filterValues) => {
    setQueryParams((prev) => ({ ...prev, filters: filterValues }));
  }, []);

  const handleSearch = useCallback((term) => {
    setQueryParams((prev) => ({ ...prev, search: term }));
  }, []);

  const { data: products = [], error, isLoading } = useGetAllProductsQuery(queryParams);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="products-page">
      <MainHeader/>
      <ProductFilter onFilter={handleFilter} />
      <ProductSearch onSearch={handleSearch} />

      <ProductCard products={products} />
    </div>
  );
};

export default ProductListPage;
