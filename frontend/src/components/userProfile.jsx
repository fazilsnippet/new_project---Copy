import React from 'react';
import { useFetchUserProfileQuery } from '../redux/api/userApiSlice';
import './userProfile.css'; // Import the CSS file

const UserProfile = () => {
  const { data: userProfile, error, isLoading } = useFetchUserProfileQuery();

  return (
    <div className="user-profile">
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error.message}</div>}
      {userProfile && (
        <div className="profile-details">
          <h2 className="profile-title">User Profile</h2>
          <p className="profile-item">Name: {userProfile?.fullName}</p>
          <p className="profile-item">Email: {userProfile?.email}</p>
          <p className="profile-item">Phone: {userProfile?.phone}</p>
          <p className="profile-item">
            Profile Picture: <img src={userProfile?.profilePicture} alt="Profile" className="profile-picture" />
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;