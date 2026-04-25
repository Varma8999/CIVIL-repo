import React from 'react';
import { useAppStore } from '../store';
import { Navigation as NavIcon, Shield, Users, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { Role } from '../types';

export function Navigation() {
  const { role, setRole } = useAppStore();

  const navItems: { id: Role; label: string; icon: React.ReactNode }[] = [
    { id: 'public', label: 'Public View', icon: <Globe size={18} /> },
    { id: 'citizen', label: 'Citizen Portal', icon: <Users size={18} /> },
    { id: 'admin', label: 'Admin Dashboard', icon: <Shield size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg tracking-tight">
          <NavIcon className="w-6 h-6"/>
          CivicFlow
        </div>

        <div className="flex items-center p-1 bg-gray-100 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setRole(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                role === item.id 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
