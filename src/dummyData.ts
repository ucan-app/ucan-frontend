import { User, Badge, Post, PostComment, Tag, Userx } from "./types";

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
  id: 1,
  userId: 1,
  fullName: "John",
  linkedinUrl: "https://www.linkedin.com/in/johndoe/",
  personalWebsite: "https://johndoe.com/",
  bio: "hi im cool",
  graduationYear: 2024,
  badges: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
  /*
  uid: 1, // Username
  username: "testuser", // Username
  firstName: "John",
  lastName: "Wick",
  profilePicture: "null", // Base64 string
  pid: 1, // Profile ID
  bio: "hi im cool",
  bioEdu: "uw",
  bioWork: "amazon",
  graduationYear: 2024,
  linkedin: "https://www.linkedin.com/in/johnwick/",
  personalWebsite: "https://en.wikipedia.org/wiki/John_Wick",
  badges: [],*/
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
    id: 1,
    title: "First Post",
    description: "This is the First dummy post.",
    creatorId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    title: "Second Post",
    description: "This is the second dummy post.",
    creatorId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    title: "Third Post",
    description: "This is the third dummy post.",
    creatorId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

export const dummyComments: PostComment[] = [
  {
    id: 1,
    postId: 1,
    authorId: 1,
    content: "This is a comment on the first post.",
    replyCount: 3,
    createdAt: new Date()
  },
  {
    id: 2,
    postId: 2,
    authorId: 2,
    content: "This is a comment on the second post.",
    replyCount: 3,
    createdAt: new Date()
  },
];
