import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostFull from "../components/PostFull";
import { Post, PostComment, User } from "../types";
import { getPost } from "../api";
//import { dummyComments } from "../dummyData"; // Keep for now until we have comments API
import { getComments, createComment } from "../api/comment"; // <-- import these

interface ViewPostProps {
  user: User | null;
}

const ViewPost: React.FC<ViewPostProps> = ({ user }) => {
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
        //const postComments = dummyComments.filter(c => c.postId === postId);
        //setComments(postComments);
        
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
    } catch (err: any) {
      alert("Failed to add comment: " + (err.message || "Unknown error"));
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <PostFull post={post} comments={comments} onAddComment={handleAddComment} user={user}/>
    </div>
  );
};

export default ViewPost;