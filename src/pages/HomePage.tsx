import React from "react";
import { Post } from "../types";
import PostPreview from "../components/PostPreview";
import { dummyPosts } from "../dummyData";

interface HomePageProps {
  posts?: Post[];
}

// Define the component with explicit return type
const HomePage: React.FC<HomePageProps> = ({ posts }) => {
  // Implement logic to call default posts or given posts here
  const postsToRender = posts && posts.length > 0 ? posts : dummyPosts;

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      {postsToRender.map((post) => (
        <PostPreview key={post.pid} post={post} />
      ))}
    </div>
  );
};

export default HomePage;
