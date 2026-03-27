import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

import api from '../api/api';

/**
 * Premium SaaS Login Page
 * Features: Dark Mode support, framer motion entry animations, 
 * glassmorphism card, and real-time validation feedback.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      toast.success('Trajectory authorized. Welcome back!', { duration: 3000 });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Authorization failed. Check mission credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans selection:bg-primary-100 transition-colors">
      
      {/* Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-200 dark:bg-primary-900 blur-[120px] rounded-full animate-float" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-100 dark:bg-blue-900 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
             whileHover={{ rotate: 12, scale: 1.1 }}
             className="inline-flex items-center justify-center p-5 bg-primary-600 rounded-3xl shadow-2xl shadow-primary-500/40 mb-8"
          >
            <Rocket className="text-white" size={48} strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tighter leading-none mb-4">
             Career<span className="text-primary-600">OS</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
            Intelligence Command Center V1.2
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 py-12 px-10 shadow-3xl rounded-[48px] border border-slate-100 dark:border-slate-800 backdrop-blur-sm relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 transform translate-x-16 -translate-y-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
          
          <form className="space-y-8 relative z-10" onSubmit={handleLogin}>
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-5 py-4 rounded-2xl flex items-center text-xs font-black uppercase tracking-widest shadow-sm"
                >
                  <AlertCircle size={20} className="mr-3 flex-shrink-0" strokeWidth={3} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2">
                Corporate Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                  <Mail size={20} strokeWidth={2} />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field pl-14 py-4.5 text-lg font-black tracking-tight"
                  placeholder="name@vision.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" title="Enter your password here" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2">
                Secure Token
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                  <Lock size={20} strokeWidth={2} />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-field pl-14 py-4.5 text-lg font-black tracking-tight"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xl flex items-center justify-center font-black tracking-tighter uppercase shadow-2xl shadow-primary-500/30 group disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="tracking-widest">Authorizing...</span>
                </div>
              ) : (
                <>
                  <LogIn size={24} className="mr-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  Access Command Center
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center relative z-10 pt-10 border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">New to the Trajectory?</p>
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-black text-lg tracking-tight hover:underline transition-all flex items-center justify-center">
              <Sparkles size={18} className="mr-2" /> Initialize Account &rarr;
            </Link>
          </div>
        </div>
        
        <p className="mt-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
          &copy; 2026 Mission Intelligence. Secured via JWT.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;