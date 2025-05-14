import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "../types";
import { updateProfile

 } from "../api/auth";
type EditProfileProps = {
  user: User | null;
  onSave: (updatedUser: User) => void;
};

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user is not passed as prop, try to get it from location state (from navigation)
  const initialUser: User | null = user || (location.state && location.state.user);

  //const [firstName, setFirstName] = useState(initialUser?.firstName || "");
  const [fullname, setFullName] = useState(initialUser?.fullname || "");
  const [bio, setBio] = useState(initialUser?.bio || "");
  //const [bioEdu, setBioEdu] = useState(initialUser?.bioEdu || "");
  //const [bioWork, setBioWork] = useState(initialUser?.bioWork || "");
  const [graduationYear, setGraduationYear] = useState(initialUser?.graduationYear || "");
  const [linkedinUrl, setLinkedin] = useState(initialUser?.linkedinUrl || "");
  const [personalWebsite, setPersonalWebsite] = useState(initialUser?.personalWebsite || "");

  if (!initialUser) {
    return <p>No user data available.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...initialUser,
      id: initialUser.id,
      userid: initialUser.userid,
      fullname: initialUser.fullname,
      linkedinUrl,
      personalWebsite,
      bio,
      graduationYear: parseInt(graduationYear as string, 10),
      badges: initialUser.badges,
      //createdAt: initialUser.createdAt,
      //updatedAt: new Date().toISOString()
    };
    try {
        const savedUser = await updateProfile(updatedUser); // <-- Call backend
        onSave(savedUser); // Update parent state if neededs
        localStorage.setItem("currentUser", JSON.stringify(savedUser)); // Persist user
        navigate(-1); // Go back to profile page
    } catch (err) {
        alert("Failed to update profile: " + (err as Error).message);
    }
  };
  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
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
            Gradutation Year:
            <input
              type="text"
              value={graduationYear}
              onChange={e => setGraduationYear(e.target.value)}
              placeholder="e.g. 2024"
            />
          </label>
        </div>
        <div>
          <label>
            LinkedIn URL:
            <input
              type="url"
              value={linkedinUrl}
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