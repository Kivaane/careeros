import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, LogOut, Rocket, Sparkles, Coffee, BriefcaseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Portfolio-level Sidebar
 * Features: Fixed positioning, Sidebar-Main-Content separation, 
 * and professional layout structure. 
 */
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, color: 'primary' },
    { name: 'Applications', path: '/applications', icon: Briefcase, color: 'indigo' },
  ];

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-64 min-w-[256px] bg-white dark:bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-100 dark:border-slate-800 flex flex-col shadow-2xl z-50 transition-colors"
    >
      {/* Brand Profile */}
      <div className="p-8 pb-12">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-primary-600 p-2.5 rounded-2xl text-white shadow-2xl shadow-primary-500/30 group-hover:scale-110 transition-transform">
            <Rocket size={24} strokeWidth={2.5} />
          </div>
          <div>
             <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                Career<span className="text-primary-600">OS</span>
             </h1>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">V1.2 Intelligence</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-4 space-y-3">
        {navItems.map((item) => (
          <motion.div key={item.path} variants={itemVariants}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center px-4 py-3.5 rounded-2xl bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 shadow-sm border border-primary-100/30 font-black tracking-wide relative' 
                  : 'flex items-center px-4 py-3.5 rounded-2xl text-slate-500 dark:text-slate-400 font-bold tracking-normal hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group'
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl mr-3 transition-all ${isActive ? 'bg-primary-100 text-primary-600' : 'bg-slate-50 dark:bg-slate-800 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                    <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                  </div>
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-indicator"
                      className="ml-auto w-1.5 h-6 bg-primary-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Pro Badge (WOW FACTOR) */}
      <div className="px-6 mb-8">
         <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-12 translate-x-12 rounded-full group-hover:scale-125 transition-transform duration-700" />
            <Sparkles className="text-primary-200 mb-3" size={24} />
            <p className="text-sm font-black mb-1">Portfolio Pro</p>
            <p className="text-[10px] font-medium text-primary-100 leading-relaxed uppercase tracking-wider">Showcasing state-of-the-art career intelligence</p>
         </div>
      </div>

      {/* Logout Control */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3.5 text-red-500 font-black hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all group"
        >
          <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-xl mr-3 group-hover:bg-red-200 transition-colors">
            <LogOut size={20} strokeWidth={3} />
          </div>
          <span className="ml-1">Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
