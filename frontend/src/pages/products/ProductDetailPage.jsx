import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../redux/api/productApiSlice';
import ProductReview from './ProductReview';
import './ProductDetailPage.css'; // Import the CSS file

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { data: product, error, isLoading } = useGetProductByIdQuery(productId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="product-detail-page">
      <img src={product.images[0]} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <ProductReview productId={product._id} reviews={product.ratings} />
    </div>
  );
};

export default ProductDetailPage;
