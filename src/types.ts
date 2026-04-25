export type Role = 'citizen' | 'admin' | 'public';

export type RequestCategory = 'Sanitation' | 'Roads' | 'Water' | 'Waste Management' | 'Electricity' | 'Other';
export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  location: string;
  image?: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  reportedBy: string;
  adminResponse?: string;
}

export interface ChartData {
  name: string;
  value: number;
}
