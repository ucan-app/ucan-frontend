import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Post } from "../types";
import { getProfile } from "../api";
import { getPostByCreator } from "../api/post";
import ProfilePictureDisplay from "../components/ProfilePictureDisplay";
import "./ViewProfile.css";

type ViewProfileProps = {
  user: User | null; // The currently logged-in user
};

const ViewProfile: React.FC<ViewProfileProps> = ({ user: currentUser }) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
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
          
          // Use existing getProfile API with userId
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

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profileUser) return;

      try {
        setLoadingPosts(true);
        console.log("Fetching posts for user:", profileUser.userId);
        const posts = await getPostByCreator(profileUser.userId);
        console.log("Fetched user posts:", posts);
        setUserPosts(posts);
      } catch (err: any) {
        console.error("Failed to fetch user posts:", err);
        // Don't set error for posts - just log it and show empty state
        setUserPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [profileUser]);

  const handleEditProfile = () => {
    navigate("/edit");
  };

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const formatDate = (dateString: Date | string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "Unknown date";
    }
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
      
      {/* Profile Header with Picture and Basic Info */}
      <div className="profile-header">
        <ProfilePictureDisplay 
          userId={profileUser.userId}
          userName={profileUser.fullName}
          size="large"
          className="profile-main-picture"
        />
        <div className="profile-header-info">
          <h2>@{profileUser.fullName}</h2>
          {profileUser.bio && (
            <p className="profile-bio">{profileUser.bio}</p>
          )}
        </div>
      </div>

      <div className="profile-info">
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
        
        {/* Badges Section */}
        {profileUser.badges && profileUser.badges.length > 0 && (
          <div className="profile-badges">
            <p><strong>Badges:</strong></p>
            <div className="badges-container">
              {profileUser.badges.map((badge, index) => (
                <div 
                  key={`${badge.organizationName}-${index}`}
                  className={`profile-badge ${badge.validated ? 'validated' : 'unvalidated'}`}
                >
                  <span className="badge-name">{badge.organizationName}</span>
                  <span className={`validation-status ${badge.validated ? 'validated' : 'unvalidated'}`}>
                    {badge.validated ? '✓ Verified' : '⚠ Unverified'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Posts Section */}
      <div className="profile-posts">
        <h2>
          {isOwnProfile ? 'My Posts' : `${profileUser.fullName}'s Posts`} 
          ({userPosts.length})
        </h2>
        
        {loadingPosts ? (
          <div className="loading-posts">Loading posts...</div>
        ) : userPosts.length > 0 ? (
          <div className="posts-list">
            {userPosts.map((post) => (
              <div 
                key={post.id} 
                className="post-card"
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="post-card-header">
                  <div className="post-author-info">
                    <ProfilePictureDisplay 
                      userId={profileUser.userId}
                      userName={profileUser.fullName}
                      size="small"
                      className="post-author-picture"
                    />
                    <div className="post-metadata">
                      <h3 className="post-card-title">{post.title}</h3>
                      <div className="post-card-metadata">
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                        <div className="post-votes">
                          <span className="upvotes">↑ {post.upvote || 0}</span>
                          <span className="downvotes">↓ {post.downvote || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="post-card-description">
                  {post.description.length > 150 
                    ? `${post.description.substring(0, 150)}...` 
                    : post.description
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            {isOwnProfile 
              ? "You haven't created any posts yet." 
              : `${profileUser.fullName} hasn't created any posts yet.`
            }
            {isOwnProfile && (
              <div className="create-post-prompt">
                <button 
                  onClick={() => navigate('/create')}
                  className="create-post-btn"
                >
                  Create Your First Post
                </button>
              </div>
            )}
          </div>
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