import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint, Role } from './types';

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

const mockComplaints: Complaint[] = [
  {
    id: 'c1',
    title: 'Pothole on Main St',
    description: 'There is a massive pothole causing traffic slowing and potential damage near the intersection.',
    category: 'Roads',
    location: 'Main St & 4th Ave',
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reportedBy: 'user123'
  },
  {
    id: 'c2',
    title: 'Garbage not collected in Zone B',
    description: 'The weekly garbage collection was missed this Tuesday.',
    category: 'Waste Management',
    location: 'Zone B Residential',
    priority: 'Medium',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    reportedBy: 'user123'
  },
  {
    id: 'c3',
    title: 'Water pipe leak',
    description: 'Fresh water is leaking rapidly onto the sidewalk in front of the bakery.',
    category: 'Water',
    location: 'Elm Street, next to Bakery',
    priority: 'High',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    reportedBy: 'user999',
    adminResponse: 'Pipe repaired by municipal water division on Thursday.'
  }
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('public');
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

  const addComplaint = (newComplaintInfo: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...newComplaintInfo,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Pending',
    };
    setComplaints([newComplaint, ...complaints]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ));
  };

  return (
    <AppContext.Provider value={{ role, setRole, complaints, addComplaint, updateComplaint }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
};
