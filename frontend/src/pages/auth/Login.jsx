
// import React from "react";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { useLoginUserMutation } from "../../redux/api/userApiSlice"
// import { setCredentials } from "../../redux/features/auth/authSlice";
// import { toast } from "react-toastify";
// import Loader from "../../components/Loader";


// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [login, { isLoading }] = useLoginUserMutation();

//   const { userInfo } = useSelector((state) => state.auth);

//   const { search } = useLocation();
//   const sp = new URLSearchParams(search);
//   const redirect = sp.get("redirect") || "/";

//   useEffect(() => {
//     if (userInfo) {
//       navigate(redirect);
//     }
//   }, [navigate, redirect, userInfo]);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await login({ email, password }).unwrap();
//       dispatch(setCredentials({ ...res }));
//       navigate(redirect);
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
//       <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//         <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
//           <div className="max-w-md mx-auto">
//             <div>
//               <h1 className="text-2xl font-semibold text-center text-indigo-900">Sign In</h1>
//             </div>
//             <form onSubmit={submitHandler} className="divide-y divide-gray-200 space-y-4">
//               <div className="relative">
//                 <input
//                   autoComplete="off"
//                   id="email"
//                   name="email"
//                   type="email"
//                   className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
//                   placeholder="Email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <label
//                   htmlFor="email"
//                   className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
//                 >
//                   Email Address
//                 </label>
//               </div>
//               <div className="relative">
//                 <input
//                   autoComplete="off"
//                   id="password"
//                   name="password"
//                   type="password"
//                   className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <label
//                   htmlFor="password"
//                   className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
//                 >
//                   Password
//                 </label>
//               </div>
//               <div className="relative">
//                 <button
//                   disabled={isLoading}
//                   type="submit"
//                   className="bg-indigo-800 text-white rounded-md px-4 py-2 w-full hover:bg-indigo-900 transition"
//                 >
//                   {isLoading ? "Signing In..." : "Sign In"}
//                 </button>
//               </div>
//               {isLoading && <Loader />}
//               <p className="text-center font-extrabold mt-4">
//                 Don’t have an account?{' '}
//                 <Link
//                   to={redirect ? `/register?redirect=${redirect}` : "/register"}
//                   className="text-red-500 hover:underline"
//                 >
//                   Sign up
//                 </Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate("/dashboard"); // Redirect after successful login
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error.data?.message || "Login failed"}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email or Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
