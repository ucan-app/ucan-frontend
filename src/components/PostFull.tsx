import React, { useEffect, useState } from "react";
import { Post, PostComment, User } from "../types";
import CommentSection from "./CommentSection";
import { getProfile } from "../api";

interface PostFullProps {
  post: Post;
  comments: PostComment[];
  onAddComment: (content: string, authorId: number) => void;
  user: User | null;
}

const PostFull: React.FC<PostFullProps> = ({ post, comments, onAddComment, user }) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="post-full">
      {/* Post Header */}
      <div className="post-full-header">
        <h2 className="post-full-title">{post.title}</h2>
        <div className="post-full-author">
          {loading ? "Loading author..." : `Posted by: ${author?.fullName || "Unknown User"}`}
        </div>
      </div>

      {/* Post Content */}
      <div className="post-full-content">{post.description}</div>
      
      {/* Post Metadata */}
      <div className="post-full-metadata">
        <div className="post-full-date">
          {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
        </div>
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