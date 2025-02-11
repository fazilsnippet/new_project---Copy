

// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, userName, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate("/home");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="login-container">
      <section className="login-section">
        <div className="login-overlay">
          <div className="login-box">
            <h1 className="login-title">Sign In</h1>
            {error && (
              <p className="login-error">
                {error.data?.message || "Login failed"}
              </p>
            )}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-input-group">
                <label htmlFor="email" className="login-label">
                  Email or Username
                </label>
                <input
                  type="text"
                  id="email"
                  className="login-input"
                  placeholder="Enter email or username"
                  value={email || userName}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setUserName(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="login-input-group">
                <label htmlFor="password" className="login-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="login-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="login-button"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <div className="login-footer">
              <p>
                Don't have an Account yet? {" "}
                <Link to="/register" className="login-link">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt=""
          className="login-background"
        />
      </section>
    </div>
  );
};

export default Login;