import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { user, register } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !passwordConfirm) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    register(name, email, password);
    toast.success("Account created successfully!", {
       position: "bottom-right",
       autoClose: 2000,
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container shadow-lg">
        <h1 className="mb-3 auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us to start ordering delicious food.</p>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn-primary auth-btn mt-3">
            REGISTER
          </button>

          <div className="auth-footer">
            <span>Already have an account? </span>
            <Link to="/users/login" className="auth-link">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
