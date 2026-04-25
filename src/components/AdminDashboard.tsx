import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ComplaintStatus } from '../types';
import { MapPin, Clock, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#ef4444', '#8b5cf6'];

export function AdminDashboard() {
  const { complaints, updateComplaint } = useAppStore();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // Analytics
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;

  const categoryCounts = complaints.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const priorityCounts = complaints.reduce((acc, curr) => {
    acc[curr.priority] = (acc[curr.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, { status });
  };

  const submitResponse = (id: string) => {
    updateComplaint(id, { adminResponse: responseText });
    setResponseText('');
    setSelectedComplaint(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Authority Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage, categorize, and resolve community reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Reports</div>
          <div className="text-4xl font-light font-mono text-gray-900">{total}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
          <div className="text-sm font-medium text-orange-600 mb-1">Pending</div>
          <div className="text-4xl font-light font-mono text-orange-500">{pending}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="text-sm font-medium text-blue-600 mb-1">In Progress</div>
          <div className="text-4xl font-light font-mono text-blue-500">{inProgress}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="text-sm font-medium text-green-600 mb-1">Resolved</div>
          <div className="text-4xl font-light font-mono text-green-500">{resolved}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-6">Issues by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-6">Priority Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-medium text-gray-900">Recent Reports</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <AnimatePresence>
            {complaints.map(complaint => (
               <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                 <div className="flex flex-col md:flex-row md:items-start gap-6">
                 
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                        ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : ''}
                        ${complaint.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : ''}
                        ${complaint.status === 'Pending' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {complaint.status}
                      </span>
                      <span className={`flex items-center gap-1 text-xs font-semibold
                        ${complaint.priority === 'High' ? 'text-red-600' : ''}
                        ${complaint.priority === 'Medium' ? 'text-orange-500' : ''}
                        ${complaint.priority === 'Low' ? 'text-blue-500' : ''}
                      `}>
                        <AlertTriangle size={12}/> {complaint.priority} Priority
                      </span>
                      <span className="text-xs text-gray-400 font-mono ml-auto">#{complaint.id.toUpperCase()}</span>
                   </div>
                   
                   <h4 className="text-lg font-medium text-gray-900 mb-1">{complaint.title}</h4>
                   <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                   
                   {complaint.image && (
                     <div className="mb-3 relative w-full max-w-sm rounded-lg overflow-hidden border border-gray-100">
                       <img src={complaint.image} alt="Reported issue" className="w-full object-cover" />
                     </div>
                   )}

                   <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                     <span className="flex items-center gap-1.5"><MapPin size={14}/> {complaint.location}</span>
                     <span className="flex items-center gap-1.5"><Clock size={14}/> {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</span>
                     <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{complaint.category}</span>
                   </div>
                 </div>

                 <div className="md:w-64 flex flex-col gap-2">
                   <div className="text-sm font-medium mb-1 text-gray-700">Actions</div>
                   <div className="flex bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => handleUpdateStatus(complaint.id, 'Pending')}
                        className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${complaint.status === 'Pending' ? 'bg-white shadow pointer-events-none' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(complaint.id, 'In Progress')}
                        className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${complaint.status === 'In Progress' ? 'bg-white shadow pointer-events-none text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Progress
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(complaint.id, 'Resolved')}
                        className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${complaint.status === 'Resolved' ? 'bg-white shadow pointer-events-none text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Resolve
                      </button>
                   </div>
                   
                   {!complaint.adminResponse ? (
                     selectedComplaint === complaint.id ? (
                       <div className="mt-3">
                         <textarea 
                           autoFocus
                           className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none mb-2"
                           rows={3}
                           placeholder="Write a response..."
                           value={responseText}
                           onChange={e => setResponseText(e.target.value)}
                         />
                         <div className="flex gap-2">
                           <button onClick={() => submitResponse(complaint.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-colors">Send</button>
                           <button onClick={() => setSelectedComplaint(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium py-2 rounded-lg transition-colors">Cancel</button>
                         </div>
                       </div>
                     ) : (
                       <button onClick={() => setSelectedComplaint(complaint.id)} className="w-full mt-2 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium py-2 rounded-lg transition-colors">
                         <MessageSquare size={14}/> Add Response
                       </button>
                     )
                   ) : (
                     <div className="mt-2 bg-green-50 text-green-800 text-xs p-2.5 rounded-lg border border-green-100 flex items-start gap-2">
                       <CheckCircle2 size={14} className="mt-0.5 shrink-0"/>
                       <span><strong className="block mb-0.5 text-green-900">Replied:</strong> {complaint.adminResponse}</span>
                     </div>
                   )}
                 </div>
               </div>
             </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
