import React, { useState } from "react";
import { PostComment, User } from "../types";
import Comment from "./Comment";

interface CommentSectionProps {
  postId: number;
  comments: PostComment[];
  onAddComment: (content: string, authorId: number) => void;
  user: User | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, 
  comments, 
  onAddComment, 
  user 
}) => {
  const [commentContent, setCommentContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleCommentClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowLoginPrompt(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!commentContent.trim()) return;
    
    setAdding(true);
    try {
      await onAddComment(commentContent, user.userId);
      setCommentContent("");
      setShowLoginPrompt(false);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      {/* Comments List */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="add-comment-form">
        <form onSubmit={handleSubmit}>
          <textarea
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            placeholder={user ? "Add a comment..." : "Login to add a comment"}
            rows={3}
            className="comment-textarea"
            onClick={handleCommentClick}
            disabled={adding || !user}
          />
          <div className="comment-form-actions">
            <button 
              type="submit" 
              disabled={adding || !commentContent.trim() || !user}
              className="submit-comment-btn"
            >
              {adding ? "Adding..." : "Add Comment"}
            </button>
          </div>
        </form>
        
        {showLoginPrompt && (
          <div className="login-prompt">
            You must be logged in to leave a comment.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;