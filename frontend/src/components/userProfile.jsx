import React, { useEffect } from 'react';
import { useFetchUserProfileQuery } from '../redux/api/userApiSlice'; // Correct path if needed

const UserProfile = () => {
  // Fetch the user profile using the RTK Query hook
  const { data, isLoading, isError, error, refetch } = useFetchUserProfileQuery();

  // Log to see what data you're getting from the backend
  useEffect(() => {
    if (data) {
      console.log("Fetched User Profile Data:", data);
    }
  }, [data]);  // Log whenever the data changes

  // Loading state
  if (isLoading) return <p>Loading profile...</p>;

  // Error handling
  if (isError) return <p>Error: {error?.message || 'Something went wrong'}</p>;

  // Access profile data correctly
  const profile = data?.data; // The data returned is an object (not an array)

  // Handle the "refresh profile" functionality
  const handleRefresh = () => {
    refetch();  // Manually trigger the refetch
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p><strong>Full Name:</strong> {profile?.fullName}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>User Name:</strong> {profile?.userName}</p>
        <p><strong>Location:</strong> {profile?.address?.street}, {profile?.address?.city}, {profile?.address?.state}</p>
        <p><strong>Postal Code:</strong> {profile?.address?.postalCode}</p>
        <p><strong>Country:</strong> {profile?.address?.country}</p>
        {profile?.profilePicture && (
          <img src={profile.profilePicture} alt="Profile" className="profile-image" />
        )}
      </div>

      {/* Refresh Profile Button */}
      <button onClick={handleRefresh}>Refresh Profile</button>
    </div>
  );
};

export default UserProfile;
