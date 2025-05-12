import React from "react";
import { Post } from "../types";

interface PostPreviewProps {
  post: Post;
  onClick?: () => void;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post, onClick }) => {
  return (
    <div className="post-preview" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="post-preview-header">
        <span className="post-preview-title">{post.title}</span>
        <span className="post-preview-score">Score: {post.score}</span>
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