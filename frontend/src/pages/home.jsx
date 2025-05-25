// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useGetProductByIdQuery } from '../redux/api/productApiSlice';
// import Header from '../components/header';
// import Loader from '../components/Loader';
// import Message from '../components/message';
// import ProductCard from './Products/ProductCard.jsx';
// import Products from './Products/products.jsx'; // Import the Products component
// import './home.css'; // Import the CSS file

// const Home = () => {
//   const { productId } = useParams();
//   const productIdString = productId ? String(productId) : null; // Convert to string

//   const { data: productData, isLoading, error } = productIdString
//     ? useGetProductByIdQuery(productIdString)
//     : { data: null, isLoading: false, error: null };

//   return (
//     <>
//       {!productId && <Header />}
//       {isLoading ? (
//         <Loader />
//       ) : error ? (
//         <Message variant="danger">{error?.data?.message || error.message}</Message>
//       ) : (
//         <div className="home-page">
//           {productIdString && productData ? (
//             <ProductCard product={productData} />
//           ) : (
//             <Products />
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Home;
import React from 'react';
import {useGetAllProductsQuery} from '../redux/api/productApiSlice'
import { Link, Navigate } from 'react-router-dom';
import MainHeader from '../components/mainHeader.jsx';
import Loader from '../components/Loader';
import Message from '../components/message';
import ProductCard from './Products/ProductCard.jsx';
import './home.css'; // Import the CSS file

const Home = () => {
  // Always fetch all products on Home Page
  const { data: products, isLoading, error } = useGetAllProductsQuery();

  return (
    <> 
  

      {/* <Header /> */}
      {/* <MainHeader /> */}
      <MainHeader /> 
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || "Something went wrong"}</Message>
      ) : (
        <div className="home-page">
          <h1>Special Products</h1>
          <Link to="/products" className="shop-link">Shop</Link>
          <div className="product-list">
            {Array.isArray(products) && products.map((product) => (
              <div key={product._id} className="product-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;