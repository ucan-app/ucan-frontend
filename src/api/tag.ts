import { api, handleApiError } from './index';
import { Tag } from '../types';

export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get('/api/tags');
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch tags");
    throw error;
  }
};

export const getTagsByCategory = async (category: 'CLASSES' | 'CAREERS' | 'COMPANIES'): Promise<Tag[]> => {
  try {
    const response = await api.get(`/api/tags/category/${category}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch tags by category");
    throw error;
  }
};

export const createTag = async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
  try {
    const response = await api.post('/api/tags', tag);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to create tag");
    throw error;
  }
};

export const initializePredefinedTags = async (): Promise<string> => {
  try {
    const response = await api.post('/api/tags/initialize');
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to initialize tags");
    throw error;
  }
};