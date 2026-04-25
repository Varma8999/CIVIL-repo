/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navigation } from './components/Navigation';
import { CitizenModule } from './components/CitizenModule';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicDashboard } from './components/PublicDashboard';
import { useAppStore } from './store';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const { role } = useAppStore();

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-gray-900 flex flex-col">
      <Navigation />
      
      <main className="flex-1 w-full relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          {role === 'public' && (
            <motion.div key="public" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeOut" }}>
              <PublicDashboard />
            </motion.div>
          )}
          {role === 'citizen' && (
            <motion.div key="citizen" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeOut" }}>
              <CitizenModule />
            </motion.div>
          )}
          {role === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeOut" }}>
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
