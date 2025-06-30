// =========================
// User-related Types
// =========================

export type User = {
  // Identification
  id: number;
  userId: number;
  fullName: string; // username
  linkedinUrl: string;
  personalWebsite: string;
  bio: string;
  graduationYear: number;
  badges: Badge[];
  createdAt: string;
  updatedAt: string;
};

export type Badge = {
  organizationName: string;
  validated: boolean;
}

// =========================
// Post-related Types
// =========================

export type Post = {
  id: number;
  title: string;
  upvote: number;
  downvote: number;
  description: string;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  tags?: Tag[];
};

// This interface matches Spring Data's Page interface
export interface Page<T> {
  content: T[];                // The actual items
  number: number;              // Current page number (0-based)
  size: number;                // Page size
  totalElements: number;       // Total number of items across all pages
  totalPages: number;          // Total number of pages
  first: boolean;              // Whether this is the first page
  last: boolean;               // Whether this is the last page
  numberOfElements: number;    // Number of elements in the current page
  empty: boolean;              // Whether the page is empty
  // The pageable property often includes pagination metadata
  pageable: {
    offset: number;            // The offset of the current page
    pageNumber: number;        // Current page number (0-based)
    pageSize: number;          // Page size
    paged: boolean;            // Whether pagination is enabled
    unpaged: boolean;          // Whether pagination is disabled
    sort: {                    // Sort information
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  sort: {                      // Sort information
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

export type PostComment = {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  replyCount: number;
  createdAt: Date;
};

export type UserReply = {
  id: number;
  commentId: number;
  authorId: number;
  content: string;
  createdAt: Date;
}

export type Tag = {
  id: number;
  name: string;
  category: 'CLASSES' | 'CAREERS' | 'COMPANIES';
  description?: string;
  isActive: boolean;
};

export type Vote = {
  voteType: "UP" | "DOWN";
};
/*
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
*/

// =========================
// Notification-related Types
// =========================

export type Notification = {
  id: number;
  recipientId: number;
  message: string;
  read: boolean;
  createdAt: string;
  postId?: number;
  commentId?: number;
};