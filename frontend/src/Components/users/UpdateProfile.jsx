import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { user, updateProfile } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill name and email fields");
      return;
    }
    
    updateProfile(name, email, avatar);
    toast.success("Profile updated successfully!", {
       position: "bottom-right",
       autoClose: 2000,
    });
    navigate('/users/me');
  };

  const onChangeAvatar = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container shadow-lg">
        <h1 className="mb-3 auth-title">Update Profile</h1>
        <p className="auth-subtitle">Keep your information up to date.</p>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <div className="avatar-upload-section">
              <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview-small" />
              <div className="custom-file-input-wrapper">
                <input
                  type="file"
                  name="avatar"
                  className="custom-file-input-hidden"
                  id="avatarUpload"
                  accept="image/*"
                  onChange={onChangeAvatar}
                />
                <label htmlFor="avatarUpload" className="btn-secondary file-upload-label">
                  Choose New Avatar
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary auth-btn mt-4">
            UPDATE PROFILE
          </button>
          
          <button type="button" className="btn-secondary auth-btn mt-2" onClick={() => navigate('/users/me')}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
