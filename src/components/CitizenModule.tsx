import React, { useState } from 'react';
import { useAppStore } from '../store';
import { categorizeComplaint } from '../lib/gemini';
import { PriorityLevel, RequestCategory } from '../types';
import { CheckCircle2, Loader2, Plus, Sparkles, MapPin, Map, Clock, Image as ImageIcon, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export function CitizenModule() {
  const { complaints, addComplaint } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<{ category?: RequestCategory, priority?: PriorityLevel } | null>(null);

  const myComplaints = complaints.filter(c => c.reportedBy === 'user123');

  const analyzeIssue = async () => {
    if (!title || !description) return;
    setIsCategorizing(true);
    const result = await categorizeComplaint(title, description);
    setAiAnalysis({ category: result.category as RequestCategory, priority: result.priority as PriorityLevel });
    setIsCategorizing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let finalCategory = aiAnalysis?.category || 'Other';
    let finalPriority = aiAnalysis?.priority || 'Medium';

    if (!aiAnalysis) {
       const result = await categorizeComplaint(title, description);
       finalCategory = result.category as RequestCategory;
       finalPriority = result.priority as PriorityLevel;
    }

    addComplaint({
      title,
      description,
      location,
      image: image || undefined,
      category: finalCategory as RequestCategory,
      priority: finalPriority as PriorityLevel,
      reportedBy: 'user123'
    });

    setIsSubmitting(false);
    setShowForm(false);
    setTitle('');
    setDescription('');
    setLocation('');
    setImage(null);
    setAiAnalysis(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">My Reports</h1>
          <p className="text-gray-500 mt-1">Track and manage your community reports.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            New Report
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.95 }} 
            animate={{ opacity: 1, height: 'auto', scale: 1 }} 
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium flex items-center gap-2">
                  <MapPin className="text-blue-500" />
                  Report an Issue
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="E.g., Deep pothole on 5th Avenue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={() => { if(title && description && !aiAnalysis) analyzeIssue() }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                placeholder="Give details about the issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <Map className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Street address or cross streets"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo Evidence</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl relative overflow-hidden group hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                {image ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-gray-900/50 hover:bg-gray-900 text-white rounded-full backdrop-blur transition-colors"
                    >
                      <X w-4 h-4 />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {(isCategorizing || aiAnalysis) && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4 transition-all">
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  {isCategorizing ? <Loader2 className="w-4 h-4 text-blue-600 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">AI Analysis</h4>
                  {isCategorizing ? (
                    <p className="text-sm text-blue-700/80 mt-0.5">Analyzing your description to determine category and priority...</p>
                  ) : (
                    <p className="text-sm text-blue-800 mt-0.5">
                      System auto-classified this as <strong>{aiAnalysis?.category}</strong> with <strong>{aiAnalysis?.priority}</strong> priority.
                    </p>
                  )}
                </div>
              </div>
            )}

            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Report'}
            </button>
          </form>
            </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="grid gap-4">
        {myComplaints.length === 0 && !showForm && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-500">When you submit issues in your community, they will appear here.</p>
          </div>
        )}
        
        <AnimatePresence>
          {myComplaints.map(complaint => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              key={complaint.id} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 transition-all hover:shadow-md"
            >
              <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                  ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : ''}
                  ${complaint.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : ''}
                  ${complaint.status === 'Pending' ? 'bg-gray-100 text-gray-700' : ''}
                `}>
                  {complaint.status}
                </span>
                <span className="text-sm text-gray-500 font-mono">#{complaint.id.toUpperCase()}</span>
                <span className="text-sm text-gray-400 flex items-center gap-1 ml-auto md:ml-0">
                  <Clock size={14} /> {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
              <p className="text-gray-600 mt-1 line-clamp-2 md:line-clamp-1">{complaint.description}</p>
              
              {complaint.image && (
                <div className="mt-3 relative w-32 h-24 rounded-lg overflow-hidden border border-gray-100">
                  <img src={complaint.image} alt="Reported issue" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin size={14}/> {complaint.location}</span>
                <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-blue-500"/> {complaint.category}</span>
              </div>
            </div>
            
            {complaint.adminResponse && (
              <div className="bg-gray-50 p-4 rounded-xl md:w-1/3 border border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500"/> Authority Response
                </div>
                <p className="text-sm text-gray-700">{complaint.adminResponse}</p>
              </div>
            )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
