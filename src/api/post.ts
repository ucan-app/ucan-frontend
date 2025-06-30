import { api, handleApiError } from "./index";
import { Page, Post } from "../types";

// Post endpoints
/*export const createPost = async (postData: { title: string; description: string; creatorId: number }): Promise<Post> => {
  try {
    const params = new URLSearchParams();
    params.append('title', postData.title);
    params.append('description', postData.description);
    params.append('creatorId', postData.creatorId.toString());

    const response = await api.post(
      `/api/posts`, 
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Required for @RequestParam
        },
      }
    );

    console.log("Creat post response", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create post");
    throw error;
  }
};*/

// Replace your existing createPost function with this:
export const createPost = async (postData: { 
  title: string; 
  description: string; 
  creatorId: number;
  image?: File;
  tagIds?: number[];
}): Promise<Post> => {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('creatorId', postData.creatorId.toString());
    
    // Add tags if provided
    if (postData.tagIds && postData.tagIds.length > 0) {
      postData.tagIds.forEach(tagId => {
        formData.append('tagIds', tagId.toString());
      });
    }
    
    // Add image if provided
    if (postData.image) {
      formData.append('image', postData.image);
    }

    const response = await api.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Create post response", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create post");
    throw error;
  }
};

export const getAllPosts = async (
  page: number = 0, 
  size: number = 10
): Promise<Page<Post>> => {
  try {
    const response = await api.get(
      `/api/posts`,
      { 
        params: { page, size }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch all posts:", error);
    throw error;
  }
};

export const getPost = async (postId: number): Promise<Post> => {
  try {
    const response = await api.get(`/api/posts/${postId}`);

    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch post");
    throw error;
  }
};

export const getPostByCreator = async (creatorId: number): Promise<Post[]> => {
  try {
    const response = await api.get(`/api/posts/creator/${creatorId}`);

    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch post by creator");
    throw error;
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  try {
    await api.delete(`/api/posts/${postId}`);
  } catch (error: any) {
    handleApiError(error, "Failed to delete post");
    throw error;
  }
};

export const updatePost = async (postId: number, title: string, description: string, tagIds?: number[]): Promise<Post> => {
  try {
    const params = new URLSearchParams();
    params.append('title', title);
    params.append('description', description);
    
    if (tagIds && tagIds.length > 0) {
      tagIds.forEach(tagId => {
        params.append('tagIds', tagId.toString());
      });
    }
    
    const response = await api.put(
      `/api/posts/${postId}`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log("Update post response:", response.data);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to update post");
    throw error;
  }
};

export const getPostsByTag = async (tag: string): Promise<Post[]> => {
  try {
    const response = await api.get(`/api/posts/tag/${tag}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch posts by tag");
    throw error;
  }
};

export const getPostsByTagIds = async (tagIds: number[]): Promise<Post[]> => {
  try {
    const params = new URLSearchParams();
    tagIds.forEach(tagId => {
      params.append('tagIds', tagId.toString());
    });

    const response = await api.get(`/api/posts/tags?${params}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch posts by tag IDs");
    throw error;
  }
};

// Add these functions to your existing api/post.ts file

export const upvotePost = async (postId: number, userId: number): Promise<void> => {
  try {
    console.log("Calling upvote API for post:", postId);
    //await api.patch(`/api/posts/${postId}/upvote`);
    await api.patch(`/api/posts/${postId}/upvote`, null, {
      params: { userId: userId }
    });
    console.log("Upvote API call successful");
  } catch (error: any) {
    console.error("Upvote API error:", error);
    handleApiError(error, "Failed to upvote post");
    throw error;
  }
};

export const downvotePost = async (postId: number, userId: number): Promise<void> => {
  try {
    await api.patch(`/api/posts/${postId}/downvote`, null, {
      params: {userId: userId}
    });
  } catch (error: any) {
    handleApiError(error, "Failed to downvote post");
    throw error;
  }
};