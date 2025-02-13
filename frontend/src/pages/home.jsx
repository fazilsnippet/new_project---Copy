import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../redux/api/productApiSlice';
import Header from '../components/header';
import Loader from '../components/Loader';
import Message from '../components/message';
import ProductCard from './Products/ProductCards.jsx';
import Products from './Products/products.jsx'; // Import the Products component
import './home.css'; // Import the CSS file

const Home = () => {
  const { productId } = useParams();
  const productIdString = productId ? String(productId) : null; // Convert to string

  const { data: productData, isLoading, error } = productIdString
    ? useGetProductByIdQuery(productIdString)
    : { data: null, isLoading: false, error: null };

  return (
    <>
      {!productId && <Header />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="home-page">
          {productIdString && productData ? (
            <ProductCard product={productData} />
          ) : (
            <Products />
          )}
        </div>
      )}
    </>
  );
};

export default Home;