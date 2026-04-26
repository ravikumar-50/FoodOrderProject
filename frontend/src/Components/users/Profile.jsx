import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Profile = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card text-center">
          <h2>Please login to view your profile</h2>
          <Link to="/users/login" className="btn-primary mt-3">Login</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/users/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card shadow-lg">
        <div className="profile-header">
          <img src={user.avatar} alt={user.name} className="profile-avatar-large" />
          <div className="profile-title-section">
            <h1>My Profile</h1>
            <p>Welcome back, {user.name}!</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <label>Full Name</label>
            <p>{user.name}</p>
          </div>

          <div className="detail-group">
            <label>Email Address</label>
            <p>{user.email}</p>
          </div>

          <div className="detail-group">
            <label>User ID</label>
            <p className="user-id">{user.id}</p>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/users/me/update" className="btn-secondary text-center no-decoration">
            Edit Profile
          </Link>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
