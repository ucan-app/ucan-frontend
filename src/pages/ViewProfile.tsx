import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "../types";
import { getProfile } from "../api";

type ViewProfileProps = {
  user: User | null; // The currently logged-in user
};

const ViewProfile: React.FC<ViewProfileProps> = ({ user: currentUser }) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // If there's a userId in the URL, fetch that user's profile
      if (userId) {
        try {
          setLoading(true);
          setError(null);
          
          const userIdNum = parseInt(userId, 10);
          if (isNaN(userIdNum)) {
            throw new Error("Invalid User ID");
          }
          
          const userData = await getProfile(userIdNum);
          setProfileUser(userData);
        } catch (err: any) {
          console.error("Failed to fetch user profile:", err);
          setError("Failed to load user profile: " + (err.message || "Unknown error"));
        } finally {
          setLoading(false);
        }
      } else {
        // If no userId in URL, show current user's profile
        setProfileUser(currentUser);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser]);

  const handleEditProfile = () => {
    navigate("/edit");
  };

  // Handle loading state when fetching a specific user
  if (loading) return <div>Loading profile...</div>;
  
  // Handle error state
  if (error) return <div className="error-message">{error}</div>;
  
  // Handle case where no user is logged in and no specific user requested
  if (!userId && !currentUser) {
    return <p>No user is logged in. Please log in to view your profile.</p>;
  }

  // Handle case where user not found
  if (!profileUser) {
    return <div>User not found.</div>;
  }

  // Check if viewing own profile (either via /profile route or /profile/:userId where userId matches current user)
  const isOwnProfile = currentUser && currentUser.userId === profileUser.userId;

  console.log("User logged in:", currentUser);
  
  return (
    <div className="user-profile">
      <h1>Profile</h1> 
      <div className="profile-info">
        <p>
          <strong>Username:</strong> @{profileUser.fullName}
        </p>
        {profileUser.bio && (
          <p>
           <strong>Bio:</strong> {profileUser.bio}
          </p>
        )}
        {profileUser.graduationYear && (
          <p>
           <strong>Graduation Year:</strong> {profileUser.graduationYear}
          </p>
        )}
        {profileUser.linkedinUrl && (
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a href={profileUser.linkedinUrl} target="_blank" rel="noopener noreferrer">
              {profileUser.linkedinUrl}
            </a>
          </p>
        )}
        {profileUser.personalWebsite && (
          <p>
            <strong>Personal Website:</strong>{" "}
            <a
              href={profileUser.personalWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profileUser.personalWebsite}
            </a>
          </p>
        )}
      </div>

      {/* Only show edit button if viewing own profile */}
      {isOwnProfile && (
        <button onClick={handleEditProfile} className="edit-profile-btn">
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ViewProfile;