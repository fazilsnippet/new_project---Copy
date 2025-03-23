// import React from 'react';
// import { Link } from "react-router-dom";
// import "./productcard.css";

// const ProductCard = ({ products }) => {
//   if (!products || products.length === 0) return null;

//   return (
//     <div className="product-card-container">
//       <h2 className="product-card-title">Featured Products</h2>
//       <div className="product-card-grid">
//         {products.map((product) => (
//           <div key={product._id} className="product-card">
//             <Link to={`/products/${product._id}`} className="product-card-link">
//               <img
//                 src={product.images?.[0] || "/placeholder.png"}
//                 alt={product.name}
//                 className="product-card-image"
//               />
//               <div className="product-card-content">
//                 <h3 className="product-card-name">{product.name}</h3>
//                 <p className="product-card-description">{product.description}</p>
//                 <div className="product-card-footer">
//                   <span className="product-card-price">${product.price.toFixed(2)}</span>
//                 </div>
//               </div>
//             </Link>
//             <Link to={`/products/${product._id}`} className="product-card-button">
//               View Details
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import "./productcard.css";

const ProductCard = ({ products }) => {
  const [addToCart] = useAddToCartMutation()

  const [zoomedImage, setZoomedImage] = useState(null);

  if (!products || products.length === 0) return null;

  const handleImageDoubleClick = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <div className="product-card-container">
      <h2 className="product-card-title">Featured Products</h2>
      <div className="product-card-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/products/${product._id}`} className="product-card-link">
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="product-card-image"
                onDoubleClick={() => handleImageDoubleClick(product.images?.[0] || "/placeholder.png")}
              />
              <div className="product-card-content">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-description">{product.description}</p>
                <div className="product-card-footer">
                  <span className="product-card-price">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </Link>
            <div>
      <h3>{product.name}</h3>
      <button onClick={() => addToCart({ productId: product._id, quantity: 1 })}>
        Add to Cart
      </button>
    </div>
            <Link to={`/products/${product._id}`} className="product-card-button">
              View Details
            </Link>
          </div>
          
        ))}
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div className="zoom-modal" onClick={closeZoom}>
          <div className="zoom-modal-content">
            <img src={zoomedImage} alt="Zoomed Product" className="zoomed-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
