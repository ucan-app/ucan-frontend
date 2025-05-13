import React from "react";
import { User } from "../types";

type ViewProfileProps = {
  user: User | null; // Accept null in case no user is logged in
};

const ViewProfile: React.FC<ViewProfileProps> = ({ user }) => {
  if (!user) {
    return <p>No user is logged in. Please log in to view your profile.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {user.uid}</p>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Bio:</strong> {user.bio}</p>
      <p><strong>Education:</strong> {user.bioEdu}</p>
      <p><strong>Work:</strong> {user.bioWork}</p>
      <p>
        <strong>LinkedIn:</strong>{" "}
        <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
          {user.linkedin}
        </a>
      </p>
    </div>
  );
};

export default ViewProfile;