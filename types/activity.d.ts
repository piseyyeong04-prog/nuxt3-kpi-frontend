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
export interface PDFReportOptions {
  title?: string;
  subtitle?: string;
  dateRange?: string;
  companyName?: string;
  companyLogo?: string;
  generatedBy?: string;
  includeCharts?: boolean;
  customStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}
export interface ActivityResponse {
  data: ActivityItem[];
  meta: {
    filter_count: number;
    total_count: number;
  };
}

export interface ActivityItem {
  id: string;
  action: 'login' | 'create' | 'update' | 'delete';
  collection: string;
  timestamp: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    title?: string;
    email?: string;
    avatar?: {
      id: string;
    };
  };
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