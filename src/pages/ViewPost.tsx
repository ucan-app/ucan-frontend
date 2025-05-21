import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostFull from "../components/PostFull";
import { Post, PostComment } from "../types";
import { getPost } from "../api";
import { dummyComments } from "../dummyData"; // Keep for now until we have comments API

const ViewPost: React.FC = () => {
  const { pid } = useParams<{ pid: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // For now, use dummy comments or empty array
        // Later you can implement a getCommentsByPostId API
        const postComments = dummyComments.filter(c => c.postId === postId);
        setComments(postComments);
        
      } catch (err: any) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, [pid]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <PostFull post={post} comments={comments} />
    </div>
  );
};

export default ViewPost;