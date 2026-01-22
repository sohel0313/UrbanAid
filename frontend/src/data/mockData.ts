import { Report, Notification, AnalyticsData, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'John Citizen',
  email: 'john@example.com',
  role: 'citizen',
  createdAt: new Date('2024-01-15'),
};

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the intersection.',
    category: 'road-damage',
    status: 'in-progress',
    location: {
      address: '123 Main Street, Downtown',
      lat: 40.7128,
      lng: -74.006,
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    citizenId: '1',
    citizenName: 'John Citizen',
    volunteerId: '2',
    volunteerName: 'Sarah Volunteer',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '2',
    title: 'Broken Streetlight',
    description: 'Streetlight not working for the past week, creating safety concerns.',
    category: 'streetlight',
    status: 'assigned',
    location: {
      address: '456 Oak Avenue, Midtown',
      lat: 40.7148,
      lng: -74.008,
    },
    citizenId: '1',
    citizenName: 'John Citizen',
    volunteerId: '3',
    volunteerName: 'Mike Helper',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '3',
    title: 'Garbage Overflow',
    description: 'Public garbage bin overflowing near the park entrance.',
    category: 'garbage',
    status: 'created',
    location: {
      address: '789 Park Lane, Greenside',
      lat: 40.7168,
      lng: -74.01,
    },
    citizenId: '4',
    citizenName: 'Emma Wilson',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '4',
    title: 'Water Leak on Cedar Street',
    description: 'Water leaking from underground pipe, flooding the sidewalk.',
    category: 'water-leak',
    status: 'completed',
    location: {
      address: '321 Cedar Street, Riverside',
      lat: 40.7188,
      lng: -74.012,
    },
    citizenId: '5',
    citizenName: 'Robert Brown',
    volunteerId: '2',
    volunteerName: 'Sarah Volunteer',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '5',
    title: 'Graffiti on Public Building',
    description: 'Vandalism on the community center exterior wall.',
    category: 'graffiti',
    status: 'assigned',
    location: {
      address: '555 Community Drive, Central',
      lat: 40.7208,
      lng: -74.014,
    },
    citizenId: '6',
    citizenName: 'Lisa Green',
    volunteerId: '3',
    volunteerName: 'Mike Helper',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-10'),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Report Updated',
    message: 'Your pothole report status changed to In Progress',
    type: 'info',
    read: false,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '2',
    title: 'Issue Resolved',
    message: 'The water leak on Cedar Street has been fixed',
    type: 'success',
    read: false,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Volunteer Assigned',
    message: 'Sarah has been assigned to your streetlight report',
    type: 'info',
    read: true,
    createdAt: new Date('2024-01-09'),
  },
];

export const mockAnalytics: AnalyticsData = {
  totalReports: 156,
  activeVolunteers: 24,
  resolvedIssues: 89,
  pendingReports: 67,
};

export const categoryLabels: Record<string, string> = {
  'road-damage': 'Road Damage',
  'streetlight': 'Streetlight',
  'garbage': 'Garbage',
  'graffiti': 'Graffiti',
  'water-leak': 'Water Leak',
  'noise': 'Noise Complaint',
  'other': 'Other',
};

export const statusLabels: Record<string, string> = {
  'created': 'Created',
  'assigned': 'Assigned',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};
