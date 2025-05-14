import React, { useEffect, useState } from "react";
import { Post, PostComment, User } from "../types";
import Comment from "./Comment";
import { getProfile } from "../api/auth"; // Assuming you have this function

interface PostFullProps {
  post: Post;
  comments: PostComment[];
}

const PostFull: React.FC<PostFullProps> = ({ post, comments }) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        // Fetch the author details
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
      <div className="post-full-header">
        <h2 className="post-full-title">{post.title}</h2>
        <div className="post-full-author">
          {loading ? "Loading author..." : `Posted by: ${author?.fullName || "Unknown User"}`}
        </div>
      </div>
      <div className="post-full-content">{post.description}</div>
      <div className="post-full-date">
        {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
      </div>
      
      <div className="post-full-comments">
        <h3>Comments ({comments.length})</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostFull;