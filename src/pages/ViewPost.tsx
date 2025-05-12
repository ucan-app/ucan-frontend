import React from "react";
import { useParams } from "react-router-dom";
import { Post, PostComment } from "../types";
import PostFull from "../components/PostFull";

const ViewPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = dummyPosts.find((p) => p.pid === Number(id));
  const comments = dummyComments.filter((c) => c.pid === Number(id));

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div>
      <PostFull post={post} comments={comments} />
    </div>
  );
};

export default ViewPost;

// Dummy data for demonstration
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
];

const dummyComments: PostComment[] = [
  {
    uid: 1,
    pid: 1,
    cid: 1,
    content: "This is a comment on the first post.",
    createdAt: new Date(),
    isVotedByUser: null,
  },
  {
    uid: 2,
    pid: 1,
    cid: 2,
    content: "Another comment on the first post.",
    createdAt: new Date(),
    isVotedByUser: null,
  },
];
