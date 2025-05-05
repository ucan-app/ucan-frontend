type Page =
  | "Forum"
  | "ViewProf"
  | "EditProf"
  | "ViewPost"
  | "CreatePost"
  | "Login"
  | "SignUp"
  | "AddBadge"
  | "Verify";

type User = {
  uid: number;
  firstName: string;
  lastName: string;
  profilePicture: string; // Base64 string
  badges: Badge[];
  bio: string;
  bioEdu: string;
  bioWork: string;
  // Email and password will not be stored in browser
};

type Post = {
  uid: number;
  pid: number;
  title: string;
  score: number;
  content: string;
  createdAt: Date;
  isVotedByUser: Vote | null;
  // All other votes will not be stored in browser
};

type PostComment = {
  uid: number;
  pid: number;
  cid: number;
  content: string;
  createdAt: Date;
  isVotedByUser: Vote | null;
};

type Vote = {
  voteType: "UP" | "DOWN";
};

type Badge = {
  bid: string;
  type: "UW" | "COMPANY";
  companyName?: string;
  domain: string;
};
