import React, { useState } from "react";
import { PostComment, User } from "../types";
import Comment from "./Comment";
import "./CommentSection.css";

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
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleCommentClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCommentForm(!showCommentForm);
    setShowLoginPrompt(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentContent.trim()) return;
    
    setAdding(true);
    try {
      await onAddComment(commentContent, user.userId);
      setCommentContent("");
      setShowCommentForm(false); // Hide form after successful submission
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
      
      {/* Add Comment Button */}
      <div className="add-comment-button-section">
        <button 
          className="add-comment-button"
          onClick={handleCommentClick}
          disabled={adding}
        >
          Add Comment
        </button>
        
        {showLoginPrompt && (
          <div className="login-prompt">
            You must be logged in to leave a comment.
          </div>
        )}
      </div>

      {/* Add Comment Form (shown when button is clicked) */}
      {showCommentForm && (
        <div className="add-comment-form">
          <form onSubmit={handleSubmit}>
            <textarea
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="comment-textarea"
              disabled={adding}
              autoFocus // Automatically focus when form appears
            />
            <div className="comment-form-actions">
              <button 
                type="submit" 
                disabled={adding || !commentContent.trim()}
                className="submit-comment-btn"
              >
                {adding ? "Adding..." : "Add Comment"}
              </button>
              <button 
                type="button" 
                onClick={() => setShowCommentForm(false)}
                className="cancel-comment-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Comments List */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} user={user} />
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;