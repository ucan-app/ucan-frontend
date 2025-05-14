import React from "react";
import { Post } from "../types";
import { useNavigate } from "react-router-dom";

interface PostPreviewProps {
  post: Post;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  const navigate = useNavigate();

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
          <span className="post-author">Name</span>
          <span className="post-role">badge</span>
        </div>
        <div className="post-title">{post.title}</div>
        <div className="post-content">
          {post.description.length > 100
            ? `${post.description.slice(0, 100)}...`
            : post.description}
        </div>
      </div>
    </div>
  );
};

export default PostPreview;