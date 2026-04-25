import React from 'react';
import { useAppStore } from '../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, Users, Clock, Flame } from 'lucide-react';
import { motion } from 'motion/react';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#ef4444', '#8b5cf6'];

export function PublicDashboard() {
  const { complaints } = useAppStore();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const categoryCounts = complaints.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const recentResolved = complaints
    .filter(c => c.status === 'Resolved')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
          Community Transparency Portal
        </h1>
        <p className="text-lg text-gray-500">
          Real-time insights into civic issues, reporting trends, and authority resolution rates.
          We believe in an open and accountable city management system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Users size={32} />
          </div>
          <div className="text-5xl font-light font-mono text-gray-900 mb-2">{total}</div>
          <div className="text-gray-500 font-medium">Total Reports Submitted</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <div className="text-5xl font-light font-mono text-gray-900 mb-2">{resolutionRate}%</div>
          <div className="text-gray-500 font-medium">Overall Resolution Rate</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <Clock size={32} />
          </div>
          <div className="text-5xl font-light font-mono text-gray-900 mb-2">{complaints.filter(c=>c.status==='In Progress').length}</div>
          <div className="text-gray-500 font-medium">Issues Currently In Progress</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Flame className="text-orange-500" />
            <h3 className="text-xl font-medium">Top Reported Categories</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="text-green-500" />
            <h3 className="text-xl font-medium">Recently Resolved Issues</h3>
          </div>
          <div className="space-y-6">
            {recentResolved.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No resolved issues yet.</p>
            ) : (
              recentResolved.map(c => (
                <div key={c.id} className="border-l-4 border-green-500 pl-4 py-1">
                  <h4 className="font-medium text-gray-900">{c.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{c.location}</p>
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded italic">
                    "{c.adminResponse || 'Issue resolved.'}"
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
