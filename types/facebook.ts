export interface FacebookVideoData {
    id: string;
    title: string;
    views: number;
    likes?: number; // Optional since it's not in the API response
    shares?: number; // Optional since it's not in the API response
    post_views?: number;
    post_id: string;
    thumbnailUrl: string;
    created_time: string;
    createdTime: string;
    length?: number; // ✅ Add this line
  }

export interface FacebookReactions {
    total: number;
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  }

export interface FacebookEngagementData {
    id: string;
    message: string;
    created_time: string;
    clicks: number;
    reactions: FacebookReactions;
    comments: number;
    shares: number;
  }

export interface FacebookEngagementResult {
    url: string;
    objectId: string;
    status: 'success' | 'error';
    data?: FacebookEngagementData;
    error?: string;
  }