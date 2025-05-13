import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "../types";

type EditProfileProps = {
  user: User | null;
  onSave: (updatedUser: User) => void;
};

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user is not passed as prop, try to get it from location state (from navigation)
  const initialUser: User | null = user || (location.state && location.state.user);

  const [firstName, setFirstName] = useState(initialUser?.firstName || "");
  const [lastName, setLastName] = useState(initialUser?.lastName || "");
  const [bio, setBio] = useState(initialUser?.bio || "");
  const [bioEdu, setBioEdu] = useState(initialUser?.bioEdu || "");
  const [bioWork, setBioWork] = useState(initialUser?.bioWork || "");
  const [linkedin, setLinkedin] = useState(initialUser?.linkedin || "");
  const [personalWebsite, setPersonalWebsite] = useState(initialUser?.personalWebsite || "");

  if (!initialUser) {
    return <p>No user data available.</p>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...initialUser,
      firstName,
      lastName,
      bio,
      bioEdu,
      bioWork,
      linkedin,
      personalWebsite,
    };
    onSave(updatedUser);
    navigate(-1); // Go back to previous page (ViewProfile)
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Bio:
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
            />
          </label>
        </div>
        <div>
          <label>
            Education:
            <input
              type="text"
              value={bioEdu}
              onChange={e => setBioEdu(e.target.value)}
              placeholder="e.g. University of Washington"
            />
          </label>
        </div>
        <div>
          <label>
            Work:
            <input
              type="text"
              value={bioWork}
              onChange={e => setBioWork(e.target.value)}
              placeholder="e.g. Amazon"
            />
          </label>
        </div>
        <div>
          <label>
            LinkedIn URL:
            <input
              type="url"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </label>
        </div>
        <div>
          <label>
            Personal Website:
            <input
              type="url"
              value={personalWebsite}
              onChange={e => setPersonalWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </label>
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: "1rem" }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;