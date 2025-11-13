import React, { useRef, useState } from "react";
import "../styles/editprofile.css";

const EditProfile = () => {
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(
    "https://randomuser.me/api/portraits/men/75.jpg"
  );

  // Handle file upload + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setAvatar(imgUrl);
    }
  };

  return (
    <div className="profile-settings">
      <h1 className="title">Profile Settings</h1>

      {/* Tabs removed */}

      <div className="profile-header">
        <div className="avatar-container">
          <img className="avatar" src={avatar} alt="User Avatar" />
        </div>

        <div className="user-info">
          <h2 className="user-name">John Doe</h2>
          <p className="user-email">john.doe@example.com</p>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
        >
          Upload new photo
        </button>
      </div>

      <div className="personal-info">
        <h3 className="section-title">Personal Information</h3>

        <form className="info-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              defaultValue="John Doe"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              defaultValue="john.doe@example.com"
              className="input-field"
              readOnly
            />
            <small className="email-note">
              Your email address is used for login and cannot be changed.
            </small>
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
