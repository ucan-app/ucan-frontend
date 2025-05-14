import React, { useEffect, useState } from "react";
import { Post, User } from "../types";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/auth"; // Assuming you have this function

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
        // Fetch the author details
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

  return (
    <div className="post-preview"
         onClick={handleClick}
         style={{ cursor: "pointer" }}>
      <div className="post-left">
        <img
          src="/profile_icon_black.png"
          alt="Profile"
          className="profile-icon"
        />
      </div>
      <div className="post-right">
        <div className="post-header">
          <span className="post-author">
            {loading ? "Loading..." : author?.fullName || "Unknown User"}
          </span>
        </div>
        <div className="post-title">{post.title}</div>
        <div className="post-content">
          {post.description.length > 100
            ? `${post.description.slice(0, 100)}...`
            : post.description}
        </div>
        {post.createdAt && (
          <div className="post-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPreview;