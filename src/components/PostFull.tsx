import React, { useEffect, useState } from "react";
import { Post, PostComment, User } from "../types";
import CommentSection from "./CommentSection";
import { getProfile } from "../api";
import { upvotePost, downvotePost, getPost, deletePost, updatePost } from "../api/post";
import { useNavigate } from "react-router-dom";
import "./PostFull.css";

interface PostFullProps {
  post: Post;
  comments: PostComment[];
  onAddComment: (content: string, authorId: number) => void;
  onPostUpdate: (updatedPost: Post) => void;
  onPostDelete?: () => void; // New prop for handling post deletion
  user: User | null;
}

const PostFull: React.FC<PostFullProps> = ({ 
  post, 
  comments, 
  onAddComment, 
  onPostUpdate, 
  onPostDelete,
  user 
}) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDescription, setEditDescription] = useState(post.description);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

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

  // Reset edit fields when post changes
  useEffect(() => {
    setEditTitle(post.title);
    setEditDescription(post.description);
  }, [post.title, post.description]);

  const handleAuthorClick = () => {
    if (author) {
      navigate(`/profile/${author.userId}`);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    setVoting(true);
    try {
      await upvotePost(post.id, user.userId);
      const updatedPost = await getPost(post.id);
      onPostUpdate(updatedPost);
      setShowLoginPrompt(false);
    } catch (error) {
      console.error("Failed to upvote:", error);
    } finally {
      setVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    setVoting(true);
    try {
      await downvotePost(post.id, user.userId);
      const updatedPost = await getPost(post.id);
      onPostUpdate(updatedPost);
      setShowLoginPrompt(false);
    } catch (error) {
      console.error("Failed to downvote:", error);
    } finally {
      setVoting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(post.title);
    setEditDescription(post.description);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title and description cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const updatedPost = await updatePost(post.id, editTitle.trim(), editDescription.trim());
      onPostUpdate(updatedPost);
      setIsEditing(false);
      console.log("Post updated successfully");
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deletePost(post.id);
      console.log("Post deleted successfully");
      
      // Navigate back to home or call onPostDelete if provided
      if (onPostDelete) {
        onPostDelete();
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Check if current user is the post author
  const isPostOwner = user && user.userId === post.creatorId;

  return (
    <div className="post-full">
      {/* Post Header */}
      <div className="post-full-header">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title-input"
            placeholder="Post title"
            disabled={saving}
          />
        ) : (
          <h2 className="post-full-title">{post.title}</h2>
        )}
        
        <div className="post-full-author-section">
          <div className="post-full-author">
            <span 
              className="clickable-author"
              onClick={handleAuthorClick}
              title="View profile"
            >
              {author?.fullName || "Unknown User"}
            </span>
          </div>
          
          {/* Post Actions - Only show if user owns the post */}
          {isPostOwner && !isEditing && (
            <div className="post-actions">
              <button 
                className="edit-post-btn"
                onClick={handleEdit}
                title="Edit post"
              >
                Edit
              </button>
              <button 
                className="delete-post-btn"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete post"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
          
          {/* Edit Actions - Show when editing */}
          {isEditing && (
            <div className="edit-actions">
              <button 
                className="save-edit-btn"
                onClick={handleSaveEdit}
                disabled={saving || !editTitle.trim() || !editDescription.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button 
                className="cancel-edit-btn"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="post-full-content">
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-description-textarea"
            placeholder="Post description"
            rows={6}
            disabled={saving}
          />
        ) : (
          <>
            {post.description}
            
            {/* Post Image */}
            {post.imageUrl && (
              <div className="post-image-container">
                <img 
                  src={post.imageUrl} 
                  alt="Post image"
                  className="post-image"
                  onError={(e) => {
                    console.error("Failed to load post image:", post.imageUrl);
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Post Metadata */}
      <div className="post-full-metadata">
        <div className="post-full-date">
          {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="post-full-votes">
          <button 
            className={`vote-button upvote-button ${!user ? 'disabled' : ''}`}
            onClick={handleUpvote}
            disabled={voting || !user || isEditing}
            title={!user ? "Login to vote" : "Upvote this post"}
          >
            ↑ {post.upvote || 0}
          </button>
          <button 
            className={`vote-button downvote-button ${!user ? 'disabled' : ''}`}
            onClick={handleDownvote}
            disabled={voting || !user || isEditing}
            title={!user ? "Login to vote" : "Downvote this post"}
          >
            ↓ {post.downvote || 0}
          </button>
        </div>
        {showLoginPrompt && (
          <div className="login-prompt">
            You must be logged in to vote on posts.
          </div>
        )}
      </div>
      
      {/* Comments Section - Hide when editing */}
      {!isEditing && (
        <CommentSection
          postId={post.id}
          comments={comments}
          onAddComment={onAddComment}
          user={user}
        />
      )}
    </div>
  );
};

export default PostFull;