// import React from 'react';
// import { Link } from 'react-router-dom';
// import './productCard.css'
// const ProductCard = ({ product }) => {
//   return (
//     <div className="product-card">
//       <Link to={`/products/${product._id}`}>
//         <img src={product.images[0]} alt={product.name} />
//         <h3>{product.name}</h3>
//         <p>{product.price}</p>
//       </Link>
//     </div>
//   );
// };

// export default ProductCard;

import React from 'react';
import { Link } from 'react-router-dom';
import './productCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.images[0]} alt={product.name} className="product-image" />
        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;