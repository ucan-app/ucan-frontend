import { Post, PostComment, Tag, Vote } from "./types";

const exTags: Tag[] = [
  { tid: 1, name: "General" },
  { tid: 2, name: "Off-Topic" },
];

export const dummyPosts: Post[] = [
  {
    uid: 1,
    pid: 1,
    title: "First Post",
    content: "This is the first dummy post.",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [exTags[0]],
    votes: {
      1: { voteType: "UP" },
      2: { voteType: "DOWN" },
      3: { voteType: "UP" },
    },
  },
  {
    uid: 2,
    pid: 2,
    title: "Second Post",
    content: "This is the second dummy post.",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [exTags[0], exTags[1]],
    votes: {
      2: { voteType: "UP" },
    },
  },
  {
    uid: 3,
    pid: 3,
    title: "Third Post",
    content: "This is the third dummy post.",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    votes: {},
  },
];

export const dummyComments: PostComment[] = [
  {
    uid: 1,
    pid: 1,
    cid: 1,
    content: "This is a comment on the first post.",
    createdAt: new Date(),
    updatedAt: new Date(),
    votes: { 2: { voteType: "UP" } },
  },
  {
    uid: 2,
    pid: 1,
    cid: 2,
    content: "Another comment on the first post.",
    createdAt: new Date(),
    updatedAt: new Date(),
    votes: {},
  },
];
