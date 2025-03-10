// import React, { useState } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx'; // Ensure correct import
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './products.css'; // Import the CSS file

// const Products = () => {
//   const [filters, setFilters] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data: products, error, isLoading } = useGetAllProductsQuery({ ...filters, search: searchTerm });

//   const handleFilter = (filterValues) => {
//     setFilters(filterValues);
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="products-page">
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />
//       <div className="product-list">
//         {Array.isArray(products) && products.map((product) => (
//           <ProductCard key={product._id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Products;

// import React, { useState, useCallback } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx'; // Ensure correct import
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './products.css'; // Import the CSS file

// const Products = () => {
//   const [queryParams, setQueryParams] = useState({ filters: {}, search: '' });

//   const handleFilter = useCallback((filterValues) => {
//     setQueryParams((prev) => ({ ...prev, filters: filterValues }));
//   }, []);

//   const handleSearch = useCallback((term) => {
//     setQueryParams((prev) => ({ ...prev, search: term }));
//   }, []);

//   const { data: products, error, isLoading } = useGetAllProductsQuery(queryParams);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="products-page">
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />
//       <div className="product-list">
//         {!products?.length ? (
//           <div>No products found.</div>
//         ) : (
//           products.map((product) => <ProductCard key={product._id} product={product} />)
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;
// import React, { useState, useCallback } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx'; // Ensure correct import
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './products.css'; // Import the CSS file

// const Products = () => {
//   const [queryParams, setQueryParams] = useState({ filters: {}, search: '' });

//   const handleFilter = useCallback((filterValues) => {
//     setQueryParams((prev) => ({ ...prev, filters: filterValues }));
//   }, []);

//   const handleSearch = useCallback((term) => {
//     setQueryParams((prev) => ({ ...prev, search: term }));
//   }, []);

//   const { data: products, error, isLoading } = useGetAllProductsQuery(queryParams);

//   console.log(products); // Log the response to check the data

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="products-page">
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />
//       <div className="product-list">
//         {!products?.length ? (
//           <div>No products found.</div>
//         ) : (
//           products.map((product) => <ProductCard key={product.id} product={product} />)
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;

// import React, { useState, useCallback } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx'; // Ensure correct import
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './products.css'; // Import the CSS file
// import ProductDetailPage from './ProductDetailPage.jsx'

// const Products = () => {
//   const [queryParams, setQueryParams] = useState({ filters: {}, search: '' });

//   const handleFilter = useCallback((filterValues) => {
//     setQueryParams((prev) => ({ ...prev, filters: filterValues }));
//   }, []);

//   const handleSearch = useCallback((term) => {
//     setQueryParams((prev) => ({ ...prev, search: term }));
//   }, []);

//   const { data: products, error, isLoading } = useGetAllProductsQuery(queryParams);

//   console.log(products); // Log the response to check the data

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="products-page">
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />
//       <ProductDetailPage/>
//       <div className="product-list">
//         {!products?.length ? (
//           <div><h1>No products found.</h1></div>
//         ) : (
//           products.map((product) => <ProductCard key={product._id} product={product} />)
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;
  

//testing fazil
// import React, { useState, useCallback } from 'react';
// import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
// import ProductCard from './ProductCard.jsx'; // Ensure correct import
// import ProductFilter from './ProductFilter.jsx';
// import ProductSearch from './ProductSearch.jsx';
// import './products.css'; // Import the CSS file

// const Products = () => {
//   const [queryParams, setQueryParams] = useState({ filters: {}, search: '' });

//   const handleFilter = useCallback((filterValues) => {
//     setQueryParams((prev) => ({ ...prev, filters: filterValues }));
//   }, []);

//   const handleSearch = useCallback((term) => {
//     setQueryParams((prev) => ({ ...prev, search: term }));
//   }, []);

//   const { data: products, error, isLoading } = useGetAllProductsQuery(queryParams);

//   console.log("Products API response:", products); // Debugging

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   // Ensure products is an array
//   const productList = products?.data || products || [];

//   return (
//     <div className="products-page">
//       <ProductFilter onFilter={handleFilter} />
//       <ProductSearch onSearch={handleSearch} />

//       <div className="product-list">
//         {!productList.length ? (
//           <div><h1>No products found.</h1></div>
//         ) : (
//           productList.map((product) => <ProductCard key={product._id} product={product} />)
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;

import React, { useState, useCallback } from 'react';
import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
import ProductCard from './ProductCard.jsx';
import ProductFilter from './ProductFilter.jsx';
import ProductSearch from './ProductSearch.jsx';
import './products.css'; // Import the CSS file

const Products = () => {
  const [queryParams, setQueryParams] = useState({ search: '', filters: {} });

  const handleFilter = useCallback((filterValues) => {
    setQueryParams((prev) => ({ ...prev, filters: filterValues }));
  }, []);

  const handleSearch = useCallback((term) => {
    setQueryParams((prev) => ({ ...prev, search: term }));
  }, []);

  const { data: products, error, isLoading } = useGetAllProductsQuery(queryParams);

  console.log("API Response pruducts:", products, typeof products);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ensure products is an array
  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="products-page">
      <ProductFilter onFilter={handleFilter} />
      <ProductSearch onSearch={handleSearch} />

      <div className="product-list">
        {productList.length === 0 ? (
          <h1>No products found.</h1>
        ) : (
          productList.map((product) => <ProductCard key={product._id} product={product} />)
        )}

      </div>
    </div>
  );
};

// Named export
export default Products ;