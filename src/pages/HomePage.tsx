import React, { useEffect, useState } from "react";
import { Post } from "../types";
import PostPreview from "../components/PostPreview";
import { dummyPosts } from "../dummyData";

async function fetchPosts(): Promise<{ posts: Post[] }> {
  // Not implemented yet
  return { posts: [] };
}

const HomePage: React.FC = () => {
  const [postList, setPostList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { posts } = await fetchPosts();

      if (posts.length > 0) {
        setPostList(posts);
      } else {
        // Fallback to dummy data
        setPostList(dummyPosts);
      }
      setLoading(false);
    };
    load();
  });

  if (loading) return <div>Loading...</div>;
  if (postList.length === 0) return <div>No posts available.</div>;

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      {postList.map((post) => (
        <PostPreview key={post.pid} post={post} />
      ))}
    </div>
  );
};

export default HomePage;
