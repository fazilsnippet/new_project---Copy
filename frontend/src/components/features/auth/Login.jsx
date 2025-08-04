// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useLoginUserMutation } from "../../../redux/api/userApiSlice";
// import { setCredentials } from "../../../redux/features/auth/authSlice";

// const Login = () => {
//   const [identifier, setIdentifier] = useState(""); // Either email or username
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loginUser, { isLoading, error }] = useLoginUserMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Determine if input is an email or a username (basic check)
//       const payload = identifier.includes("@")
//         ? { email: identifier, password }
//         : { userName: identifier, password };

//       const userData = await loginUser(payload).unwrap();
//       dispatch(setCredentials(userData.data));
//       navigate("/");
//     } catch (err) {
//       console.error("Login failed", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-sm w-full mx-auto bg-white p-6 rounded-lg shadow space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>

//         {error && (
//           <p className="text-red-600 text-center text-sm">
//             {error.data?.message || "Login failed"}
//           </p>
//         )}

//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">
//             Email or Username
//           </label>
//           <input
//             type="text"
//             className="bg-gray-50 border border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//             placeholder="name@example.com or username"
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">
//             Password
//           </label>
//           <input
//             type="password"
//             className="bg-gray-50 border border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//             placeholder="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex justify-center">
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//           </button>
//         </div>

//         <div className="text-center py-4">
//           <h1 className="font-bold text-gray-900 mt-4">
//             Don't have an Account?
//           </h1>
//           <Link to="/register">
//             <button
//               type="button"
//               className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full py-2.5"
//             >
//               Register
//             </button>
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../../../redux/api/userApiSlice";
import { setCredentials } from "../../../redux/features/auth/authSlice";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

useEffect(() => {
  const expirationTime = localStorage.getItem("expirationTime");
  const token = localStorage.getItem("token");

  const isExpired = expirationTime && Date.now() > parseInt(expirationTime);

  // Redirect only if authenticated AND token exists AND not expired
  if (userInfo && token && !isExpired) {
    navigate(redirect);
  }
}, [userInfo, navigate, redirect]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { userName: identifier, password };

      const res = await loginUser(payload).unwrap();
      dispatch(setCredentials(res)); // res contains { user, accessToken, refreshToken }
      navigate(redirect);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full mx-auto bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>

        {error && (
          <p className="text-red-600 text-center text-sm">
            {error.data?.message || "Login failed"}
          </p>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Email or Username
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@example.com or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            className="bg-gray-50 border border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div className="text-center py-4">
          <h1 className="font-bold text-gray-900 mt-4">
            Don't have an Account?
          </h1>
          <Link to="/register">
            <button
              type="button"
              className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full py-2.5"
            >
              Register
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;


//  import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useLoginUserMutation } from "../../../redux/api/userApiSlice";
// import { setCredentials } from "../../../redux/features/auth/authSlice";

// const Login = () => {
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { userInfo } = useSelector((state) => state.auth);

//   const [loginUser, { isLoading, error }] = useLoginUserMutation();

//   const { search } = useLocation();
//   const redirect = new URLSearchParams(search).get("redirect") || "/";

//   // 🔍 Updated check matches authSlice logic
//   useEffect(() => {
//     const expirationTime = localStorage.getItem("expirationTime");
//     const token = localStorage.getItem("token");

//     const isExpired =
//       expirationTime && Date.now() > parseInt(expirationTime);

//     // Redirect only if token exists, not expired, and userInfo present
//     if (userInfo && token && !isExpired) {
//       navigate(redirect);
//     }
//   }, [userInfo, navigate, redirect]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = identifier.includes("@")
//         ? { email: identifier, password }
//         : { userName: identifier, password };

//       const res = await loginUser(payload).unwrap();
//       dispatch(setCredentials(res)); // res contains { user, accessToken, refreshToken }
//       navigate(redirect);
//     } catch (err) {
//       console.error("Login failed", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-sm w-full mx-auto bg-white p-6 rounded-lg shadow space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>

//         {error && (
//           <p className="text-red-600 text-center text-sm">
//             {error.data?.message || "Login failed"}
//           </p>
//         )}

//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">
//             Email or Username
//           </label>
//           <input
//             type="text"
//             className="bg-gray-50 border border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//             placeholder="name@example.com or username"
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">
//             Password
//           </label>
//           <input
//             type="password"
//             className="bg-gray-50 border border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//             placeholder="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex justify-center">
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//           </button>
//         </div>

//         <div className="text-center py-4">
//           <h1 className="font-bold text-gray-900 mt-4">
//             Don't have an Account?
//           </h1>
//           <Link to="/register">
//             <button
//               type="button"
//               className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full py-2.5"
//             >
//               Register
//             </button>
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
