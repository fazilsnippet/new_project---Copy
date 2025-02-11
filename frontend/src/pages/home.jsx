import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetAllProductsQuery, useGetProductByIdQuery } from '../redux/api/productApiSlice';
import Header from '../components/header';
import Loader from '../components/Loader';
import Message from '../components/message';
import ProductCard from './Products/ProductCards.jsx'; // Ensure correct import
import './home.css'; // Import the CSS file

const Home = () => {
  const { productId } = useParams();
  const productIdString = productId ? String(productId) : null; // Convert to string

  const { data: productData, isLoading, error } = productIdString
    ? useGetProductByIdQuery(productIdString) 
    : useGetAllProductsQuery();

  return (
    <>
      {!productId && <Header />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="home-page">
          <h1>Special Products</h1>
          <Link to="#" className="shop-link">Shop</Link>
          <div className="product-list">
            {productIdString && productData ? (
              <ProductCard product={productData} />
            ) : (
              Array.isArray(productData) && productData.map((product) => (
                <div key={product._id} className="product-item">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
