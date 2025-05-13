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

// =========================
// User-related Types
// =========================

export type Userx = {
  // Identification
  uid: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string; // Base64 string
  pid: number; // Profile ID
  // Bio
  bio: string;
  bioEdu: string;
  bioWork: string;
  graduationYear: number;
  // Links
  linkedin: string;
  personalWebsite: string;
  badges: Badge[];
  // Password will not be stored in browser
};

export type User = {
  // Identification
  id: number;
  userid: number;
  fullname: string; // username
  linkedinUrl: string;
  personalWebsite: string;
  bio: string;
  graduationYear: number;
  badges: Badge[];
  createdAt: string;
  updatedAt: string;
};

export type Badge = {
  bid: string;
  type: "UW" | "COMPANY";
  companyName?: string;
  domain: string;
};

// =========================
// Post-related Types
// =========================

export type Post = {
  uid: number;
  pid: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  votes: { [uid: number]: Vote };
};

export type PostComment = {
  uid: number;
  pid: number;
  cid: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  votes: { [uid: number]: Vote };
};

export type Tag = {
  tid: number;
  name: string;
};

export type Vote = {
  voteType: "UP" | "DOWN";
};

export function calculatePostScore(post: Post): number {
  let score = 0;
  for (const vote of Object.values(post.votes)) {
    if (vote.voteType === "UP") {
      score++;
    } else if (vote.voteType === "DOWN") {
      score--;
    }
  }
  return score;
}
