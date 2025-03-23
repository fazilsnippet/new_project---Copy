import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import './mainHeader.css'; 


const MainHeader = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <h1>logo</h1>
        </div>
        <SearchBar />
        <nav className="nav-links">
          <Link to="/wishlist" className="nav-link">Wishlist</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;