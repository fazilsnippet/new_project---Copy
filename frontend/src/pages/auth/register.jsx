

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterUserMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice.jsx";
import { toast } from "react-toastify";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo && window.location.pathname !== "/register") {
      navigate(redirect || "/");
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!fullName) {
      toast.error("Full name is required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ fullName, userName, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-container">
      <section className="login-section">
        <div className="login-overlay">
          <div className="login-box">
            <h1 className="login-title">Register</h1>
            {isLoading && <Loader />}
            <form onSubmit={submitHandler} className="login-form">
              <div className="login-input-group">
                <label className="login-label">Full Name</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="login-input-group">
                <label className="login-label">Username</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Enter username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="login-input-group">
                <label className="login-label">Email Address</label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="login-input-group">
                <label className="login-label">Password</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="login-input-group">
                <label className="login-label">Confirm Password</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button disabled={isLoading} type="submit" className="login-button">
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
            <div className="login-footer">
              <p>
                Already have an account? {" "}
                <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="login-link">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
          alt=""
          className="login-background"
        />
      </section>
    </div>
  );
};

export default Register;
