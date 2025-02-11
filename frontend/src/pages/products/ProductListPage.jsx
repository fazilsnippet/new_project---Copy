import React, { useState } from 'react';
import { useGetAllProductsQuery } from '../slices/productSlice';
import ProductCard from '../components/ProductCards';
import ProductFilter from '../components/ProductFilter';
import ProductSearch from '../components/ProductSearch';
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

  return (
    <div className="product-list-page">
      <ProductFilter onFilter={handleFilter} />
      <ProductSearch onSearch={handleSearch} />
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;