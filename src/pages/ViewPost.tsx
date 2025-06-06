import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostFull from "../components/PostFull";
import { Post, PostComment, User } from "../types";
import { getPost } from "../api";
import { getComments, createComment } from "../api/comment";
import { useNotifications } from "../contexts/NotificationContext";

interface ViewPostProps {
  user: User | null;
}

const ViewPost: React.FC<ViewPostProps> = ({ user }) => {
  const { pid } = useParams<{ pid: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshNotifications } = useNotifications();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!pid) {
          throw new Error("Post ID is missing");
        }
        
        const postId = parseInt(pid, 10);
        if (isNaN(postId)) {
          throw new Error("Invalid Post ID");
        }
        
        // Fetch the post from the API
        const postData: Post = await getPost(postId);
        setPost(postData);
        
        // Fetch comments from backend
        const postComments = await getComments(postId);
        setComments(postComments);

      } catch (err: any) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post/comments: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, [pid]);

  // Handler to add a new comment
  const handleAddComment = async (content: string, authorId: number) => {
    if (!post) return;
    try {
      await createComment({ postId: post.id, authorId, content });
      // Refresh comments after adding
      const updatedComments = await getComments(post.id);
      setComments(updatedComments);
      
      // Trigger notification refresh for the post author
      refreshNotifications();
    } catch (err: any) {
      alert("Failed to add comment: " + (err.message || "Unknown error"));
    }
  };

  // Handler to update post after voting or editing
  const handlePostUpdate = (updatedPost: Post) => {
    setPost(updatedPost);
  };

  // Handler for post deletion
  const handlePostDelete = () => {
    // Navigate to home page after successful deletion
    navigate("/", { 
      state: { 
        message: "Post deleted successfully" 
      }
    });
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <PostFull 
        post={post} 
        comments={comments} 
        onAddComment={handleAddComment} 
        onPostUpdate={handlePostUpdate}
        onPostDelete={handlePostDelete}
        user={user}
      />
    </div>
  );
};

export default ViewPost;