// pages/order/PaymentFailedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailedPage = () => {
  return (
    <div className="max-w-lg mx-auto mt-10 bg-red-900 text-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-3 text-red-300">❌ Payment Failed</h2>
      <p className="mb-2">Your payment could not be processed.</p>
      <p className="mb-4">You can try again or contact support for help.</p>

      <div className="flex gap-4">
        <Link to="/cart" className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">
          Retry Payment
        </Link>
        <Link to="/contact" className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
