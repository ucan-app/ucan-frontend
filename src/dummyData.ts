import { Post } from "./types";
import { PostComment } from "./types";

export const dummyPosts: Post[] = [
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

export const dummyComments: PostComment[] = [
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
