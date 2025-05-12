import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Post } from "../types";
import PostPreview from "../components/PostPreview";
import { dummyPosts } from "../dummyData";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

async function fetchPosts(query: string): Promise<{ posts: Post[] }> {
  // Not implemented yet
  if (!query) return { posts: dummyPosts };
  const filtered = dummyPosts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );
  return { posts: filtered };
}

const HomePage: React.FC = () => {
  const [postList, setPostList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery().get("q") || "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { posts } = await fetchPosts(query);

      setPostList(dummyPosts);
      setLoading(false);
    };
    load();
  }, [query]);

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
