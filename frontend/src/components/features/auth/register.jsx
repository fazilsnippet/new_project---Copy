

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useRegisterUserMutation } from "../../../redux/api/userApiSlice";
// import { setCredentials } from "../../../redux/features/auth/authSlice";
// import { toast } from "react-toastify";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     userName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const { fullName, userName, email, password, confirmPassword } = formData;

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userInfo } = useSelector((state) => state.auth);

//   const [registerUser, { isLoading, error }] = useRegisterUserMutation();

//   const { search } = useLocation();
//   const redirect = new URLSearchParams(search).get("redirect") || "/";

//   useEffect(() => {
//     if (userInfo) navigate(redirect);
//   }, [userInfo, navigate, redirect]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await registerUser({ fullName, userName, email, password }).unwrap();
//       dispatch(setCredentials(res)); // res = { user, accessToken, refreshToken }
//       toast.success("Registration successful");
//       navigate(redirect);
//     } catch (err) {
//       toast.error(err?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
//       <h2 className="text-2xl font-bold text-center text-blue-700">Register</h2>

//       {error && <p className="text-red-600 text-sm">{error.data?.message}</p>}

//       <input
//         type="text"
//         name="fullName"
//         placeholder="Full Name"
//         value={fullName}
//         onChange={handleChange}
//         className="input"
//         required
//       />
//       <input
//         type="text"
//         name="userName"
//         placeholder="Username"
//         value={userName}
//         onChange={handleChange}
//         className="input"
//         required
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={email}
//         onChange={handleChange}
//         className="input"
//         required
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={password}
//         onChange={handleChange}
//         className="input"
//         required
//       />
//       <input
//         type="password"
//         name="confirmPassword"
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChange={handleChange}
//         className="input"
//         required
//       />

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="btn-primary w-full"
//       >
//         {isLoading ? "Registering..." : "Register"}
//       </button>

//       <div className="text-center">
//         <p>Already have an account?</p>
//         <Link to="/login" className="text-blue-700">Login</Link>
//       </div>
//     </form>
//   );
// };

// export default Register;


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterUserWithOtpMutation, useSendSignupOtpMutation } from "../../../redux/api/userApiSlice";
import { setCredentials } from "../../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const { fullName, userName, email, password, confirmPassword, otp } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [sendOtp, { isLoading: sendingOtp }] = useSendSignupOtpMutation();
  const [registerUser, { isLoading: registering, error }] = useRegisterUserWithOtpMutation();

  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, navigate, redirect]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }
    try {
      await sendOtp(email).unwrap();
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser({ fullName, userName, email, password, otp }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Registration successful");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center text-blue-700">Register</h2>

      {error && <p className="text-red-600 text-sm">{error.data?.message}</p>}

      <input type="text" name="fullName" placeholder="Full Name" value={fullName} onChange={handleChange} className="input" required />
      <input type="text" name="userName" placeholder="Username" value={userName} onChange={handleChange} className="input" required />
      <div className="flex gap-2">
        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} className="input flex-1" required />
        {!otpSent && (
          <button type="button" onClick={handleSendOtp} disabled={sendingOtp} className="btn-secondary">
            {sendingOtp ? "Sending..." : "Send OTP"}
          </button>
        )}
      </div>
      <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} className="input" required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={handleChange} className="input" required />

      {otpSent && (
        <input type="text" name="otp" placeholder="Enter OTP" value={otp} onChange={handleChange} className="input" required />
      )}

      <button type="submit" disabled={registering || !otpSent} className="btn-primary w-full">
        {registering ? "Registering..." : "Register"}
      </button>

      <div className="text-center">
        <p>Already have an account?</p>
        <Link to="/login" className="text-blue-700">Login</Link>
      </div>
    </form>
  );
};

export default Register;
