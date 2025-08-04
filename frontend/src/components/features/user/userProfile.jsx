import React, { useEffect, useState } from 'react';
import { useFetchUserProfileQuery, useLogoutUserMutation } from '../../../redux/api/userApiSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { data, isLoading, isError, error, refetch } = useFetchUserProfileQuery();
  const [logoutUser, { isLoading: isLoggingOut, isError: logoutError, isSuccess: logoutSuccess }] = useLogoutUserMutation();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      console.log("Fetched User Profile Data:", data);
    }
  }, [data]);

  const handleUpdate = () => refetch();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      navigate('/login');
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const profile = data?.data;

  if (isLoading) return <p className="text-center py-10 text-gray-500">Loading profile...</p>;
  if (isError) return <p className="text-center text-blue-500 py-6">Error: {error?.message || 're-login'}</p>;

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Profile Image */}
        {profile?.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
            No Image
          </div>
        )}

        {/* Profile Details */}
        <div className="w-full space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
            <p><span className="font-semibold">Full Name:</span> {profile?.fullName}</p>
            <p><span className="font-semibold">Username:</span> {profile?.userName}</p>
            <p><span className="font-semibold">Email:</span> {profile?.email}</p>
            <p><span className="font-semibold">Location:</span> {profile?.address?.street}, {profile?.address?.city}, {profile?.address?.state}</p>
            <p><span className="font-semibold">Postal Code:</span> {profile?.address?.postalCode}</p>
            <p><span className="font-semibold">Country:</span> {profile?.address?.country}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={handleUpdate}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Update Profile
            </button>

            {confirmLogout ? (
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmLogout(true)}
                className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>

          {isLoggingOut && <p className="text-sm text-gray-400">Logging out...</p>}
          {logoutError && <p className="text-sm text-red-500">Error logging out.</p>}
          {logoutSuccess && <p className="text-sm text-green-500">Logged out successfully.</p>}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
