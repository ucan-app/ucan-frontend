import React from "react";
import { Post } from "../types";
import PostPreview from "../components/PostPreview";

// Define the component with explicit return type
const HomePage: React.FC<{}> = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      {dummyPosts.map((post) => (
        <PostPreview key={post.pid} post={post} />
      ))}
    </div>
  );
};

export default HomePage;

const dummyPosts: Post[] = [
  {
    uid: 1,
    pid: 1,
    title: "First Post",
    score: 10,
    content: "This is the first dummy post.",
    createdAt: new Date(),
    isVotedByUser: null,
  },
  {
    uid: 2,
    pid: 2,
    title: "Second Post",
    score: 5,
    content: "This is the second dummy post.",
    createdAt: new Date(),
    isVotedByUser: null,
  },
  {
    uid: 3,
    pid: 3,
    title: "Third Post",
    score: 8,
    content: "This is the third dummy post.",
    createdAt: new Date(),
    isVotedByUser: null,
  },
];
