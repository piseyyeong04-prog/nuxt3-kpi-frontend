// types/activity.d.ts

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  title: string;
}

export interface Avatar {
  id: string;
}

export interface ActivityItem {
  action: string;
  collection: string;
  timestamp: string;
  id: number;
  user: User;
  avatar: Avatar;
}

export interface ActivityResponse {
  data: ActivityItem[];
}

// Optional: If you want to use this globally in Nuxt 3
declare global {
  interface ActivityGlobals {
    User: User;
    Avatar: Avatar;
    ActivityItem: ActivityItem;
    ActivityResponse: ActivityResponse;
  }
}

export {};