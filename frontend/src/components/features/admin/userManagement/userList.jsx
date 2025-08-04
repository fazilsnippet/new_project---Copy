import React, { useState } from "react";
import {
  useGetAllUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
} from "../../../../redux/api/adminApiSlice";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AdminUserList = () => {
  const [roleFilter, setRoleFilter] = useState("");
  const [bannedFilter, setBannedFilter] = useState("");

  const queryParams = {
    page: 1,
    limit: 100,
    role: roleFilter || undefined,
    isBanned: bannedFilter === "" ? undefined : bannedFilter === "true",
  };

  const { data, isLoading, isError, error } = useGetAllUsersQuery(queryParams);
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();

  const handleToggleBan = async (user) => {
    try {
      if (user.isBanned) {
        await unbanUser(user._id).unwrap();
        toast.success(`${user.name} has been unbanned.`);
      } else {
        await banUser(user._id).unwrap();
        toast.success(`${user.name} has been banned.`);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Action failed");
    }
  };

  if (isLoading) return <p className="text-white p-4">Loading users...</p>;
  if (isError)
    return (
      <p className="text-red-400 p-4">
        Error: {error?.data?.message || "Something went wrong"}
      </p>
    );

  const users = data?.users || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1F47] to-[#0F172A] text-white p-4 md:p-6 lg:p-10">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#1E293B] border border-slate-600 text-white px-4 py-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          value={bannedFilter}
          onChange={(e) => setBannedFilter(e.target.value)}
          className="bg-[#1E293B] border border-slate-600 text-white px-4 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#1E293B] rounded-2xl shadow-md p-4">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs uppercase bg-[#334155] text-white">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Ban/Unban</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="bg-[#1E293B] border-b border-slate-700 hover:bg-[#2a3a54] transition"
              >
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.isAdmin ? "Admin" : "User"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`font-semibold ${
                      user.isBanned ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {format(new Date(user.createdAt), "yyyy-MM-dd")}
                </td>
                <td className="px-6 py-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!user.isBanned}
                      onChange={() => handleToggleBan(user)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-green-500 relative transition duration-300">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
                    </div>
                    <span className="ml-2 text-sm">
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-4">No users found.</p>}
      </div>
    </div>
  );
};

export default AdminUserList;
