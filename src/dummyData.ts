import { User, Badge, Post, PostComment, Tag } from "./types";

// =========================
// User-related dummy data
// =========================

export const exampleBadges: Badge[] = [
  {
    bid: "1",
    type: "UW",
    domain: "Computer Science",
  },
  {
    bid: "2",
    type: "COMPANY",
    companyName: "Amazon",
    domain: "Software Development",
  },
  {
    bid: "3",
    type: "COMPANY",
    companyName: "Microsoft",
    domain: "Cloud Computing",
  },
];

export const dummyUser: User = {
  uid: 1, // Username
  username: "testuser", // Username
  firstName: "John",
  lastName: "Wick",
  profilePicture: "null", // Base64 string
  bio: "hi im cool",
  bioEdu: "uw",
  bioWork: "amazon",
  linkedin: "https://www.linkedin.com/in/johnwick/",
  personalWebsite: "https://en.wikipedia.org/wiki/John_Wick",
  badges: [],
};

// =========================
// Post-related dummy data
// =========================

export const exampleTags: Tag[] = [
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
    tags: [exampleTags[0]],
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
    tags: [exampleTags[0], exampleTags[1]],
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
