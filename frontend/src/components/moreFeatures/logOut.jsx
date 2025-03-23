import React, { useState } from 'react';
import { useLogoutUserMutation } from '../../redux/api/userApiSlice';
import { useNavigate } from 'react-router-dom';
import './logout.css'; // Import the CSS file

const Logout = () => {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutUser, { isLoading, isError, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      navigate('/login'); // Redirect to login page after successful logout
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleConfirmLogout = () => {
    setConfirmLogout(true);
  };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
    navigate('/'); // Redirect to home page if logout is canceled
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: Failed to logout</div>;

  return (
    <div className="logout-container">
      {confirmLogout ? (
        <div className="confirm-logout">
          <p>Are you sure you want to logout?</p>
          <button onClick={handleLogout} className="confirm-button">Yes</button>
          <button onClick={handleCancelLogout} className="cancel-button">No</button>
        </div>
      ) : (
        <div>
          {isSuccess ? (
            <div>Successfully logged out</div>
          ) : (
            <button onClick={handleConfirmLogout} className="logout-button">Logout</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Logout;