import React, { useEffect, useState } from "react";
import { PostComment, User, UserReply } from "../types";
import { getProfile } from "../api";
import { getReplies, createReply } from "../api/reply";
import { useNavigate } from "react-router-dom";
import Reply from "./Reply";
import "./Comment.css";

interface CommentProps {
  comment: PostComment;
  user: User | null;
}

const Comment: React.FC<CommentProps> = ({ comment, user }) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState<UserReply[]>([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const navigate = useNavigate();

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

    const fetchReplies = async () => {
      try {
        setLoadingReplies(true);
        const repliesData = await getReplies(comment.id);
        setReplies(repliesData);
      } catch (error) {
        console.error("Failed to fetch replies:", error);
      } finally {
        setLoadingReplies(false);
      }
    };

    fetchAuthor();
    fetchReplies();
  }, [comment.authorId, comment.id]);

  const handleAuthorClick = () => {
    if (author) {
      navigate(`/profile/${author.userId}`);
    }
  };

  const handleReplyClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowReplyForm(!showReplyForm);
    setShowLoginPrompt(false);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;
    
    setSubmittingReply(true);
    try {
      await createReply({
        commentId: comment.id,
        authorId: user.userId,
        content: replyContent.trim()
      });
      
      const updatedReplies = await getReplies(comment.id);
      setReplies(updatedReplies);
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">
          {
            <span 
              className="author-fullname clickable-author"
              onClick={handleAuthorClick}
              title="View profile"
            >
              {author?.fullName || "Anonymous"}
            </span>
          }
        </span>
        <span className="comment-date">
          {comment.createdAt && new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="comment-content">
        {comment.content}
      </div>

      <div className="comment-actions">
        <button 
          className="reply-button"
          onClick={handleReplyClick}
          disabled={submittingReply}
        >
          Reply
        </button>
        {replies.length > 0 && (
          <span className="reply-count">
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </span>
        )}
      </div>

      {showLoginPrompt && (
        <div className="login-prompt">
          You must be logged in to reply to comments.
        </div>
      )}

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <textarea
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            className="reply-textarea"
            disabled={submittingReply}
          />
          <div className="reply-form-actions">
            <button 
              type="submit" 
              disabled={submittingReply || !replyContent.trim()}
              className="submit-reply-btn"
            >
              {submittingReply ? "Submitting..." : "Reply"}
            </button>
            <button 
              type="button" 
              onClick={() => setShowReplyForm(false)}
              className="cancel-reply-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loadingReplies ? (
        <div className="loading-replies">Loading replies...</div>
      ) : (
        replies.length > 0 && (
          <div className="replies-section">
            {replies.map((reply) => (
              <Reply key={reply.id} reply={reply} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Comment;