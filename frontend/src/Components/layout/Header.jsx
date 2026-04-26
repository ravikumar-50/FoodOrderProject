import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { UserContext } from "../../context/UserContext";

const Header = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Real-time search by updating URL
    if (e.target.value.trim()) {
      navigate(`/?search=${encodeURIComponent(e.target.value)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <header className="header sticky-top">
      <div className="header-content">
        
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <h2>Foodie<span>Express</span></h2>
          </Link>
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for delicious food..."
            value={searchTerm}
            onChange={handleSearch}
            className="header-search-input"
          />
        </div>

        {/* Cart Icon & User Session */}
        <div className="user-cart-container">
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒 Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
          
          <div className="user-auth-section">
            {user ? (
              <div className="user-profile">
                <Link to="/users/me" className="profile-link">
                  <img src={user.avatar} alt="Avatar" className="user-avatar" />
                  <span className="user-name">{user.name}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/users/login'); }} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/users/login" className="login-link">
                Login
              </Link>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;