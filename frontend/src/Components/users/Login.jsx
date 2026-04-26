import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    login(email, password);
    toast.success("Login successful!", {
       position: "bottom-right",
       autoClose: 2000,
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container shadow-lg">
        <h1 className="mb-3 auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to access your food orders.</p>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <Link to="/users/forgetPassword" className="forgot-password">
            Forgot Password?
          </Link>

          <button type="submit" className="btn-primary auth-btn">
            LOGIN
          </button>

          <div className="auth-footer">
            <span>New here? </span>
            <Link to="/users/signup" className="auth-link">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
