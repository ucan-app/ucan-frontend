export type Page =
  | "Home"
  | "ViewProf"
  | "EditProf"
  | "ViewPost"
  | "CreatePost"
  | "Login"
  | "SignUp"
  | "AddBadge"
  | "Verify";

export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  profilePicture: string; // Base64 string
  badges: Badge[];
  bio: string;
  bioEdu: string;
  bioWork: string;
  linkedin: string;
  // Email and password will not be stored in browser
};

export type Post = {
  uid: number;
  pid: number;
  title: string;
  score: number;
  content: string;
  createdAt: Date;
  isVotedByUser: Vote | null;
  // All other votes will not be stored in browser
};

export type PostComment = {
  uid: number;
  pid: number;
  cid: number;
  content: string;
  createdAt: Date;
  isVotedByUser: Vote | null;
};

export type Vote = {
  voteType: "UP" | "DOWN";
};

export type Badge = {
  bid: string;
  type: "UW" | "COMPANY";
  companyName?: string;
  domain: string;
};
