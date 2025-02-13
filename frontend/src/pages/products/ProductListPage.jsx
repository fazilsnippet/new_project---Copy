import React, { useState } from 'react';
import { useGetAllProductsQuery } from '../../redux/api/productApiSlice';
import ProductCard from './ProductCards.jsx';
import ProductFilter from './ProductFilter.jsx';
import ProductSearch from './ProductSearch.jsx';
import './ProductListPage.css'; // Import the CSS file

const ProductListPage = () => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const { data: products, error, isLoading } = useGetAllProductsQuery({ ...filters, search: searchTerm });

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ensure products is an array
  const productList = Array.isArray(products) ? products : Object.values(products);

  return (
    <div className="product-list-page">
      <ProductFilter onFilter={handleFilter} />
      <ProductSearch onSearch={handleSearch} />
      <div className="product-list">
        {productList.map((product) => (
          <ProductCard key={product._id || product.id || product.name} product={product} />
        ))}
      </div>
    </div>
  );}

export default ProductListPage