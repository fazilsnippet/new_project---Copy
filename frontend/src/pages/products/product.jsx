import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../redux/api/productApiSlice";
import './product.css'; // Import the CSS file

const Product = () => {
  let { productId } = useParams();
  productId = String(productId); // Ensure productId is a string

  console.log("Extracted productId from URL:", productId, typeof productId);

  const { data: product, error, isLoading } = useGetProductByIdQuery(productId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.data?.message || "Something went wrong"}</p>;

  return (
    <div className="product-detail">
      <h1>{product?.name}</h1>
      <p>{product?.description}</p>
      <p>Price: ${product?.price}</p>
    </div>
  );
};

export default Product;