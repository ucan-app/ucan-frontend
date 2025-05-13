import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostFull from "../components/PostFull";
import { Post, PostComment } from "../types";
import { dummyPosts, dummyComments } from "../dummyData";

async function fetchPostAndComments(
  pid: number
): Promise<{ post: Post | null; comments: PostComment[] }> {
  // Not implemented yet
  return { post: null, comments: [] };
}

const ViewPost: React.FC = () => {
  const { pid } = useParams<{ pid: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const id = Number(pid);
      const { post, comments } = await fetchPostAndComments(id);

      if (post) {
        setPost(post);
        setComments(comments);
      } else {
        // Fallback to dummy data
        const dummyPost = dummyPosts.find((p) => p.pid === id) || dummyPosts[0];
        const dummyComms = dummyComments.filter((c) => c.pid === dummyPost.pid);
        setPost(dummyPost);
        setComments(dummyComms);
      }
      setLoading(false);
    };
    load();
  }, [pid]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <PostFull post={post} comments={comments} />
    </div>
  );
};

export default ViewPost;
