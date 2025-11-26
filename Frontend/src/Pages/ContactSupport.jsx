import React from "react";
import "../styles/contactsupport.css";

export default function ContactSupport() {
  return (
    <div className="support-container">
      <h2>Contact Support</h2>
      <p className="subtitle">
        Fill out the form below to submit a support request.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email address" />
        </div>

        <div className="form-group">
          <label>Type of Request</label>
          <select>
            <option>Select request type</option>
            <option>Issue</option>
            <option>Bug Report</option>
            <option>Account Help</option>
          </select>
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input type="text" placeholder="Enter subject" />
        </div>
      </div>

      <div className="form-group">
        <label>Detailed Description</label>
        <textarea placeholder="Describe your issue in detail..."></textarea>
      </div>

      <div className="upload-box">
        <p>Click to upload or drag & drop</p>
      </div>

      <button className="submit-btn">Submit Request</button>

      <div className="contact-info">
        <p>Response within 24 hours</p>
        <p>support@example.com</p>
        <p>+1 (555) 123-4567</p>
      </div>
    </div>
  );
}

