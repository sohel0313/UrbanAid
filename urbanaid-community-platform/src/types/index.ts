export type UserRole = 'citizen' | 'volunteer' | 'admin';

export type ReportStatus = 'created' | 'assigned' | 'in-progress' | 'completed';

export type ReportCategory = 
  | 'road-damage' 
  | 'streetlight' 
  | 'garbage' 
  | 'graffiti' 
  | 'water-leak' 
  | 'noise' 
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  imageUrl?: string;
  citizenId: string;
  citizenName: string;
  volunteerId?: string;
  volunteerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: Date;
}

export interface AnalyticsData {
  totalReports: number;
  activeVolunteers: number;
  resolvedIssues: number;
  pendingReports: number;
}
