import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery, useGetAllProductsQuery } from "../../redux/api/productApiSlice";
import './product.css'; // Import the CSS file

const Product = () => {
  console.log("products route");
  let { productId } = useParams();
  productId = String(productId); // Ensure productId is a string

  console.log("Extracted productId from URL:", productId, typeof productId);

  const { data: product, error, isLoading } = useGetProductByIdQuery(productId);
  const { data: products, error: productsError, isLoading: productsLoading } = useGetAllProductsQuery();

  console.log("Fetched product:", product);
  console.log("Fetched products:", products);

  if (isLoading || productsLoading) return <p>Loading...</p>;
  if (error || productsError) return <p>Error: {error?.data?.message || "Something went wrong"}</p>;

  // Convert products object to an array if necessary
  const productList = Array.isArray(products) ? products : Object.values(products);

  return (
    <div>
      <div className="product-detail">
        <img src={product?.images[0]} alt={product?.name} className="product-image" />
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <p>Price: ${product?.price}</p>
      </div>
      <div className="product-list">
        <h2>All Products</h2>
        <ul>
          {productList.map((prod) => (
            <li key={prod.id}>
              <img src={prod.images[0]} alt={prod.name} className="product-image" />
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
              <p>Price: ${prod.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Product;

// import React from "react";
// import { useParams } from "react-router-dom";
// import { useGetProductByIdQuery, useGetAllProductsQuery } from "../../redux/api/productApiSlice";
// import './product.css'; // Import the CSS file

// const Product = () => {
//   console.log("products route");
//   let { productId } = useParams();
//   productId = String(productId); // Ensure productId is a string

//   console.log("Extracted productId from URL:", productId, typeof productId);

//   const { data: product, error, isLoading } = useGetProductByIdQuery(productId);
//   const { data: products, error: productsError, isLoading: productsLoading } = useGetAllProductsQuery();

//   if (isLoading || productsLoading) return <p>Loading...</p>;
//   if (error || productsError) return <p>Error: {error?.data?.message || "Something went wrong"}</p>;

//   return (
//     <div>
//       <div className="product-detail">
//         <img src={product?.images[0]} alt={product?.name} className="product-image" />
//         <h1>{product?.name}</h1>
//         <p>{product?.description}</p>
//         <p>Price: ${product?.price}</p>
//       </div>
//       <div className="product-list">
//         <h2>All Products</h2>
//         <ul>
//           {products?.map((prod) => (
//             <li key={prod.id}>
//               <img src={prod.images[0]} alt={prod.name} className="product-image" />
//               <h3>{prod.name}</h3>
//               <p>{prod.description}</p>
//               <p>Price: ${prod.price}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Product;