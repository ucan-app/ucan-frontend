import React from "react";
import { PostComment } from "../types";

const Comment: React.FC<{ comment: PostComment }> = ({ comment }) => (
  <div className="comment">
    <div className="comment-content">{comment.content}</div>
    <div className="comment-date">
      {comment.createdAt instanceof Date
        ? comment.createdAt.toLocaleDateString()
        : new Date(comment.createdAt).toLocaleDateString()}
    </div>
  </div>
);

export default Comment;