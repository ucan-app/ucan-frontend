import React from "react";
import { Post, calculatePostScore } from "../types";
import { useNavigate } from "react-router-dom";

interface PostPreviewProps {
  post: Post;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${post.pid}`);
  };

  return (
    <div
      className="post-preview"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="post-preview-header">
        <span className="post-preview-title">{post.title}</span>
        <span className="post-preview-score">
          Score: {calculatePostScore(post)}
        </span>
      </div>
      <div className="post-preview-content">{post.content}</div>
      <div className="post-preview-date">
        {post.createdAt instanceof Date
          ? post.createdAt.toLocaleDateString()
          : new Date(post.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default PostPreview;
