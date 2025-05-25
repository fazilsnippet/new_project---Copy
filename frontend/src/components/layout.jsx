import React from "react";
// src/components/Layout.jsx
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            {/* Add more links as necessary */}
          </ul>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>© 2025 Your Company</p>
      </footer>
    </div>
  );
};

export default Layout;
