import React, { useEffect, useState } from 'react';
import { useCreateOrderMutation } from '../../../redux/api/orderApiSlice.js';
import { useFetchUserProfileQuery } from '../../../redux/api/userApiSlice.js';
import { useVerifyRazorpayPaymentMutation } from '../../../redux/api/paymentApiSlice.js';
import { useClearCartMutation } from '../../../redux/api/cartApiSlice.js';
import { loadRazorpay } from '../../../utils/razorpay';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../../../components/features/user/address.jsx';

const CheckoutForm = ({ cartItems }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();
  const [clearCart] = useClearCartMutation();
  const navigate = useNavigate();

  const { data: userData, isLoading: isUserLoading } = useFetchUserProfileQuery();

  const handlePlaceOrder = async () => {
    try {
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        alert("Cart is empty. Please add items before placing an order.");
        return;
      }

      const response = await createOrder({
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod.toLowerCase(),
      }).unwrap();

      if (paymentMethod === 'razorpay' || paymentMethod === 'upi') {
        const isRazorpayLoaded = await loadRazorpay();
        if (!isRazorpayLoaded) {
          alert('Failed to load Razorpay SDK');
          return;
        }

        const razorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.amount,
          currency: 'INR',
          name: 'Your Shop Name',
          description: 'Order Payment',
          order_id: response.razorpayOrderId,
          handler: async function (res) {
            try {
              await verifyRazorpayPayment({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                orderId: response.orderId,
                userId: userData?.data?._id,
              });
              await clearCart();
              alert('Payment successful. Order placed!');
              navigate(`/ordersuccess/${response.orderId}`);
            } catch (error) {
              console.error('Payment verification failed', error);
              navigate('/payment-failed');
            }
          },
          prefill: {
            name: userData?.data?.fullName || '',
            email: userData?.data?.email || '',
            contact: userData?.data?.address?.phone || '',
          },
          theme: { color: '#3399cc' },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      } else {
        // For COD
        await clearCart();
        alert('COD Order placed successfully!');
        navigate(`/cart`);
      }
    } catch (err) {
      console.error('Order error:', err);
      alert(err?.data?.message || 'Failed to place order');
    }
  };

  const address = userData?.data?.address || {};
  const isAddressComplete = address &&
    address.street &&
    address.city &&
    address.state &&
    address.postalCode &&
    address.country &&
    address.phone;

  return (
    <div className="checkout-form bg-gray-900 text-white p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">Shipping & Payment</h2>

      {isUserLoading ? (
        <p>Loading user info...</p>
      ) : isAddressComplete ? (
        <div className="mb-4 bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Shipping Address:</h3>
          <p>{userData.data.fullName}</p>
          <p>{address.street}, {address.city}</p>
          <p>{address.state}, {address.country} - {address.postalCode}</p>
          <p>Phone: {address.phone}</p>
        </div>
      ) : (
        <p className="text-yellow-300 mb-2">⚠️ No address found. Please add one before placing order.</p>
      )}

      <button
        onClick={() => setShowAddressForm(!showAddressForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        {showAddressForm ? 'Hide Address Form' : 'Register / Update Address'}
      </button>

      {showAddressForm && (
        <div className="mb-4">
          <AddressForm />
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="payment" className="block mb-1">Select Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="razorpay">Razorpay</option>
          <option value="upi">UPI</option>
        </select>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isLoading || !isAddressComplete}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
      >
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default CheckoutForm;
