import React from 'react';
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
import "./productcard.css"
const ProductCard = ({ product }) => {
  console.log("ProductCard Data:", product); // Debugging

  if (!product || !product._id) return null;

  return (
    <div className="product-card">
      <img src={product.images?.[0] || "/placeholder.png"} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;


//testing
// const ProductCard = ({ product }) => {
//   console.log("ProductCard Data:", product); // Check if product is valid

//   if (!product || !product._id) return null;

//   return (
//     <div className="product-card">
//       <img src={product.images?.[0]} alt={product.name} />
//       <h3>{product.name}</h3>
//       <p>{product.price}</p>
//     </div>
//   );
// };


// export default ProductCard;