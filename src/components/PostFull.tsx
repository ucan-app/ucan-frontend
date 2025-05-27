import React, { useEffect, useState } from "react";
import { Post, PostComment, User } from "../types";
import CommentSection from "./CommentSection";
import { getProfile } from "../api";
import { upvotePost, downvotePost, getPost } from "../api/post";
import { useNavigate } from "react-router-dom";
import "./PostFull.css";

interface PostFullProps {
  post: Post;
  comments: PostComment[];
  onAddComment: (content: string, authorId: number) => void;
  onPostUpdate: (updatedPost: Post) => void; // Add this to handle post updates
  user: User | null;
}

const PostFull: React.FC<PostFullProps> = ({ post, comments, onAddComment, onPostUpdate, user }) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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
      await upvotePost(post.id);
      // Refresh the post to get updated vote counts
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
      await downvotePost(post.id);
      // Refresh the post to get updated vote counts
      const updatedPost = await getPost(post.id);
      onPostUpdate(updatedPost);
      setShowLoginPrompt(false);
    } catch (error) {
      console.error("Failed to downvote:", error);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="post-full">
      {/* Post Header */}
      <div className="post-full-header">
        <h2 className="post-full-title">{post.title}</h2>
        <div className="post-full-author">
          {<span 
              className="clickable-author"
              onClick={handleAuthorClick}
              title="View profile"
            >
              {author?.fullName || "Unknown User"}
            </span>}
        </div>
      </div>

      {/* Post Content */}
      <div className="post-full-content">{post.description}</div>
      
      {/* Post Metadata */}
      <div className="post-full-metadata">
        <div className="post-full-date">
          {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="post-full-votes">
          <button 
            className={`vote-button upvote-button ${!user ? 'disabled' : ''}`}
            onClick={handleUpvote}
            disabled={voting || !user}
            title={!user ? "Login to vote" : "Upvote this post"}
          >
            ↑ {post.upvote || 0}
          </button>
          <button 
            className={`vote-button downvote-button ${!user ? 'disabled' : ''}`}
            onClick={handleDownvote}
            disabled={voting || !user}
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
      
      {/* Comments Section */}
      <CommentSection
        postId={post.id}
        comments={comments}
        onAddComment={onAddComment}
        user={user}
      />
    </div>
  );
};

export default PostFull;