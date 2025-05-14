import React from "react";
import { User } from "../types";
import { useNavigate } from "react-router-dom";

type ViewProfileProps = {
  user: User | null; // Accept null in case no user is logged in
};

const ViewProfile: React.FC<ViewProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  
  if (!user) {
    return <p>No user is logged in. Please log in to view your profile.</p>;
  }
  console.log("User logged in:", user);
  const handleEditProfile = () => {
    navigate("/edit");
  };
  
  return (
    <div>
      <h1>Profile</h1> 
      {user.bio && (
        <p>
         <strong>Bio:</strong> {user.bio}
        </p>
      )}
      {user.graduationYear && (
        <p>
         <strong>Graduation Year:</strong> {user.graduationYear}
        </p>
      )}
      {user.linkedinUrl && (
        <p>
          <strong>LinkedIn:</strong>{" "}
          <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
            {user.linkedinUrl}
          </a>
        </p>
      )}
      {user.personalWebsite && (
        <p>
          <strong>Personal Website:</strong>{" "}
          <a
            href={user.personalWebsite}
            target="_blank"
            rel="noopener noreferrer"
          >
            {user.personalWebsite}
          </a>
        </p>
      )}

      <button onClick={handleEditProfile}>
        Edit Profile
      </button>
    </div>
  );
};

export default ViewProfile;
