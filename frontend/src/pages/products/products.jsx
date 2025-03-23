

// import React, { useState, useCallback } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx';
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './products.css'; // Import the CSS file

// const Products = () => {
//   const [queryParams, setQueryParams] = useState({ search: '', filters: {} });

//   const handleFilter = useCallback((filterValues) => {
//     setQueryParams((prev) => ({ ...prev, filters: filterValues }));
//   }, []);

//   const handleSearch = useCallback((term) => {
//     setQueryParams((prev) => ({ ...prev, search: term }));
//   }, []);

//   const { data: products, error, isLoading } = useGetAllProductsQuery(queryParams);


//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   // Ensure products is an array
//   const productList = Array.isArray(products) ? products : [];

//   return (
//     <div className="products-page">
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />

//       <div className="product-list">
//         {productList.length === 0 ? (
//           <h1>No products found.</h1>
//         ) : (
//           productList.map((product) => <ProductCard key={product._id} product={product} />)
//         )}

//       </div>
//     </div>
//   );
// };

// export default Products ;

// import React, { useState, useCallback } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx';
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './products.css';
// import MainHeader from '../../components/mainHeader.jsx';

// const Products = () => {
//   const [queryParams, setQueryParams] = useState({ search: '', filters: {} });

//   const handleFilter = useCallback((filterValues) => {
//     setQueryParams((prev) => ({ ...prev, filters: filterValues }));
//   }, []);

//   const handleSearch = useCallback((term) => {
//     setQueryParams((prev) => ({ ...prev, search: term }));
//   }, []);

//   const { data: products = [], error, isLoading } = useGetAllProductsQuery(queryParams);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="products-page">
//       <MainHeader/>
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />

//       <ProductCard products={products} />
//     </div>
//   );
// };

// export default Products 