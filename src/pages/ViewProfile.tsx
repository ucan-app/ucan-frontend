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

  const handleEditProfile = () => {
    navigate("/edit");
  };
  
  // ...existing code...
  return (
    <div>
      <h1>Profile</h1>
      <p>
        <strong>Username:</strong> {user.uid}
      </p>
      <p>
        <strong>First Name:</strong> {user.firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {user.lastName}
      </p>
      <p>
        <strong>Bio:</strong> {user.bio}
      </p>
      {user.bioEdu && (
        <p>
          <strong>Education:</strong> {user.bioEdu}
        </p>
      )}
      {user.bioWork && (
        <p>
          <strong>Work:</strong> {user.bioWork}
        </p>
      )}
      {user.linkedin && (
        <p>
          <strong>LinkedIn:</strong>{" "}
          <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
            {user.linkedin}
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
