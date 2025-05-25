

// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetProductByIdQuery } from "../../redux/api/productApiSlice";
// import ProductReview from "./ProductReview";
// import AddToCart from "../../components/cart/AddToCart.jsx";
// import "./ProductDetailPage.css"; // Import the CSS file

// const ProductDetailPage = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { data: product, error, isLoading } = useGetProductByIdQuery(productId);
  
//   const [currentImage, setCurrentImage] = useState(0);

//   if (isLoading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">Error: {error.message}</div>;

//   // Image slider handlers
//   const nextImage = () => {
//     setCurrentImage((prev) => (prev + 1) % product.images.length);
//   };

//   const prevImage = () => {
//     setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
//   };

//   // Navigate to Cart
//   const handleAddToCart = () => {
//     navigate("/cart");
//   };

//   // Navigate to Payment with Product Data
//   const handleBuyNow = () => {
//     navigate("/payment", { state: { product } });
//   };

//   return (
//     <div className="product-detail-page">
//       {/* Product Image Section */}
//       <div className="image-gallery">
//         <button className="prev-button" onClick={prevImage}>‹</button>
//         <div className="image-zoom-container">
//           <img
//             src={product?.images?.[currentImage] || "/placeholder.jpg"}
//             alt={product?.name}
//             className="product-main-image"
//           />
//         </div>
//         <button className="next-button" onClick={nextImage}>›</button>
//       </div>

//       {/* Thumbnail Images */}
//       <div className="thumbnail-container">
//         {product?.images?.map((img, index) => (
//           <img
//             key={index}
//             src={img}
//             alt={`Thumbnail ${index}`}
//             className={`thumbnail ${index === currentImage ? "active" : ""}`}
//             onClick={() => setCurrentImage(index)}
//           />
//         ))}
//       </div>

//       {/* Product Information */}
//       <div className="product-info">
//         <h1 className="product-title">{product.name}</h1>
//         <p className="product-description">{product.description}</p>
//         <p className="product-price">${product.price}</p>
//         <div className="buttons">
//           <button className="add-to-cart" onClick={AddToCart}>Add to Cart</button>
//           <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
//         </div>
//       </div>

//       {/* Scroll to Product Details */}
//       <div className="product-details">
//         <h2>Product Details</h2>
//         <p>{product.details}</p>
//       </div>

//       {/* Product Reviews */}
//       {/* <ProductReview productId={product._id} reviews={product.ratings} /> */}
//     </div>
//   );
// };

// export default ProductDetailPage;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../../redux/api/productApiSlice";
import CartList from "../../components/cart/CartList.jsx";
import AddToCart from "../../components/cart/AddToCart.jsx";
import "./ProductDetailPage.css"; // Import the CSS file
import PaymentComponent from "../payment/payment.jsx"; // Import the Payment component
const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, error, isLoading } = useGetProductByIdQuery(productId);
  
  const [currentImage, setCurrentImage] = useState(0);
  const [showAddToCart, setShowAddToCart] = useState(false); // State to control AddToCart rendering

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!product) return <div className="error">Product not found</div>;

  console.log("Fetched Product:", product); // Debugging

  // Image slider handlers
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    setShowAddToCart(true); // Show AddToCart component
    console.log("Successfully added to cart");
  };

  // Navigate to Payment with Product Data
  const handleBuyNow = () => {
    navigate("/payments", { state: { product } })
    
  };

  return (
    <div className="product-detail-page">
      {/* Product Image Section */}
      <div className="image-gallery">
        <button className="prev-button" onClick={prevImage}>‹</button>
        <div className="image-zoom-container">
          <img
            src={product?.images?.[currentImage] || "/placeholder.jpg"}
            alt={product?.name}
            className="product-main-image"
          />
        </div>
        <button className="next-button" onClick={nextImage}>›</button>
      </div>

      {/* Thumbnail Images */}
      <div className="thumbnail-container">
        {product?.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`thumbnail ${index === currentImage ? "active" : ""}`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>

      {/* Product Information */}
      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price}</p>
        <div className="buttons">
          <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>

      {/* Scroll to Product Details */}
      <div className="product-details">
        <h2>Product Details</h2>
        <p>{product.details}</p>
      </div>

      {/* Conditionally render AddToCart component */}
      {showAddToCart && product && <AddToCart product={product} />}
      <CartList product={product} />
    </div>
  );
};

export default ProductDetailPage;
