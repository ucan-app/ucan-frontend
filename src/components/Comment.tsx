import React, { useEffect, useState } from "react";
import { PostComment, User } from "../types";
import { getProfile } from "../api";
import "./Comment.css";

interface CommentProps {
  comment: PostComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await getProfile(comment.authorId);
        setAuthor(userData);
      } catch (error) {
        console.error("Failed to fetch comment author:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [comment.authorId]);

  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">
          {loading ? "Loading..." : (
            <>
              <span className="author-fullname">{author?.fullName || "Anonymous"}</span>
            </>
          )}
        </span>
        <span className="comment-date">
          {comment.createdAt && new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="comment-content">
        {comment.content}
      </div>
      {/* Future: Add reply, edit, delete buttons here */}
    </div>
  );
};

export default Comment;