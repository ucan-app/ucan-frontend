import React, { useEffect, useState } from "react";
import { Post, User } from "../types";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api";
import ProfilePictureDisplay from "../components/ProfilePictureDisplay";
import "./PostPreview.css";

interface PostPreviewProps {
  post: Post;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await getProfile(post.creatorId);
        setAuthor(userData);
      } catch (error) {
        console.error("Failed to fetch author details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [post.creatorId]);

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to the post
    if (author) {
      navigate(`/profile/${author.userId}`);
    }
  };

  return (
    <div className="post-preview"
         onClick={handleClick}
         style={{ cursor: "pointer" }}>
      <div className="post-left">
        {loading ? (
          <div className="profile-icon-placeholder">
            <img
              src="/profile_icon_black.png"
              alt="Profile"
              className="profile-icon"
            />
          </div>
        ) : author ? (
          <div onClick={handleAuthorClick} style={{ cursor: "pointer" }}>
            <ProfilePictureDisplay
              userId={author.userId}
              userName={author.fullName}
              size="medium"
              className="post-preview-profile-picture"
            />
          </div>
        ) : (
          <img
            src="/profile_icon_black.png"
            alt="Profile"
            className="profile-icon"
          />
        )}
      </div>
      <div className="post-right">
        <div className="post-header">
          <span 
            className="post-author"
            onClick={handleAuthorClick}
            style={{ cursor: "pointer" }}
          >
            {loading ? "Loading..." : author?.fullName || "Unknown User"}
          </span>
        </div>
        <div className="post-title">{post.title}</div>
        <div className="post-content">
          {post.description.length > 100
            ? `${post.description.slice(0, 100)}...`
            : post.description}
        </div>
        <div className="post-footer">
          {post.createdAt && (
            <div className="post-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          )}
          <div className="post-votes-display">
            <span className="vote-count upvote-display">
              ↑ {post.upvote || 0}
            </span>
            <span className="vote-count downvote-display">
              ↓ {post.downvote || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;