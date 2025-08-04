import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useCreateOrderMutation
} from '../../../redux/api/orderApiSlice.js';
import {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation
} from '../../../redux/api/paymentApiSlice.js';
import {
  useClearCartMutation
} from '../../../redux/api/cartApiSlice.js';

const PlaceOrderPage = ({ cartItems }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();
  const [clearCart] = useClearCartMutation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const items = cartItems.map((item) => ({
        productId: item?.product?._id,
        quantity: item?.quantity,
      }));

      if (paymentMethod === 'cod') {
  const orderRes = await createOrder({ items, paymentMethod }).unwrap();
  await clearCart();
  alert('Order placed with Cash on Delivery');
  navigate(`/cart`);
}
 else {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert('Failed to load Razorpay SDK');
          return;
        }

        const { data } = await createRazorpayOrder({ userId: userInfo._id, items });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: 'INR',
          name: 'Your Shop Name',
          description: 'Order Payment',
          order_id: data.razorpayOrderId,
          prefill: {
            name: userInfo.fullName,
            email: userInfo.email,
            contact: userInfo.phone || '',
          },
          theme: { color: '#3399cc' },
          handler: async function (response) {
            try {
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
                userId: userInfo._id,
              });

              await clearCart(); // ✅ Clear cart after payment success
              alert('Payment successful. Order placed!');
navigate(`/cart`);
            } catch (error) {
              console.error('Payment verification failed', error);
              navigate('/payment-failed');
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error('Order error:', err);
      alert(err?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
      
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded">
      <h2 className="text-xl font-bold mb-4">Place Your Order</h2>

      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block mb-2">Select Payment Method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="razorpay">Razorpay</option>
          <option value="upi" disabled>UPI (Coming soon)</option>
        </select>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
        disabled={isLoading || cartItems.length === 0}
      >
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default PlaceOrderPage;
