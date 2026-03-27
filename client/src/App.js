import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

/**
 * CareerOS Core Application
 * Integrated Features: Dark Mode toggler, Toaster, Floating Action Button (FAB), 
 * and Standardized SaaS Layout Alignment.
 */
function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: darkMode ? '#0f172a' : '#ffffff',
            color: darkMode ? '#f8fafc' : '#0f172a',
            borderRadius: '24px',
            border: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}`,
            padding: '16px 28px',
            fontWeight: '700',
            fontSize: '15px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        }}
      />

      <div id="career-os-root" className="min-h-screen bg-white dark:bg-slate-950 transition-colors selection:bg-primary-100">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="fixed top-8 right-8 z-[60] p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Area (Wrapped in MainLayout for SaaS Sidebar Separation) */}
          <Route 
             path="/" 
             element={
               <ProtectedRoute>
                 <MainLayout>
                   <Dashboard />
                 </MainLayout>
               </ProtectedRoute>
             } 
          />
          <Route 
             path="/applications" 
             element={
               <ProtectedRoute>
                 <MainLayout>
                   <Applications />
                 </MainLayout>
               </ProtectedRoute>
             } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;