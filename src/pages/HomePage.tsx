import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Post } from "../types";
import PostPreview from "../components/PostPreview";
import "../components/PostPreview.css";
import { getAllPosts } from "../api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HomePage: React.FC = () => {
  const [postList, setPostList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = useQuery().get("q") || "";
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAllPosts(page, size);
        
        // If search query exists, filter the posts client-side
        // In a real app, you might want to add search functionality to the backend
        const filteredPosts = query 
          ? response.content.filter(post => 
              post.title.toLowerCase().includes(query.toLowerCase())
            )
          : response.content;
        
        setPostList(prev => page === 0 ? filteredPosts : [...prev, ...filteredPosts]);
        setHasMore(!response.last);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to load posts: " + (err.message || "Unknown error"));
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [query, page, size]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (loading && page === 0) return <div>Loading posts...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (postList.length === 0) return <div>No posts available.</div>;

  return (
    <div className="home-page">
      <div className="posts-container">
        {postList.map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
      
      {hasMore && (
        <div className="load-more">
          <button 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;

/*import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Post } from "../types";
import PostPreview from "../components/PostPreview";
import "../components/PostPreview.css";
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
      const { posts: postList } = await fetchPosts(query);

      setPostList(postList);
      setLoading(false);
    };
    load();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (postList.length === 0) return <div>No posts available.</div>;

  return (
    <div>
      {postList.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
};

export default HomePage;
*/