import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle2, 
  PlusCircle, Sparkles, Lightbulb, Bell,
  Target, Award, ShieldAlert, LineChart, Zap
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, subDays, startOfDay, isBefore, addDays } from 'date-fns';
import { toast } from 'react-hot-toast';

import api from '../api/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

/**
 * Standard Dashboard Segment
 * Handled by MainLayout (Fixed Sidebar + Scrollable Workspace).
 */
const Dashboard = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await api.get('/applications');
      setApps(response.data);
    } catch (err) {
      console.error('Failed to sync intelligence:', err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteAction = async (id) => {
     try {
        await api.patch(`/applications/${id}`, { targetDate: null });
        toast.success('Task finalized 🎯');
        fetchData();
     } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Task failed to update';
        toast.error(Array.isArray(msg) ? msg[0] : msg);
     }
  };

  const stats = useMemo(() => {
    const raw = apps.reduce(
      (acc, app) => {
        const status = (app.status || 'APPLIED').toUpperCase();
        acc[status] = (acc[status] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0, APPLIED: 0, INTERVIEW: 0, REJECTED: 0, OFFER: 0 }
    );
    
    const interviewRate = raw.total ? Math.round((raw.INTERVIEW / raw.total) * 100) : 0;
    const offerRate = raw.total ? Math.round((raw.OFFER / raw.total) * 100) : 0;
    const rejectionRate = raw.total ? Math.round((raw.REJECTED / raw.total) * 100) : 0;

    return { ...raw, interviewRate, offerRate, rejectionRate };
  }, [apps]);

  const timelineEvents = useMemo(() => {
    return apps
      .map(app => [
        { type: 'APPLIED', date: app.createdAt, company: app.company, details: `Applied for ${app.role}` },
        ...(app.status === 'INTERVIEW' ? [{ type: 'INTERVIEW', date: app.updatedAt, company: app.company, details: `Interview stage` }] : []),
        ...(app.status === 'OFFER' ? [{ type: 'OFFER', date: app.updatedAt, company: app.company, details: `Received offer 🎉` }] : [])
      ])
      .flat()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [apps]);

  const actionItems = useMemo(() => {
    const now = new Date();
    return apps
      .filter(app => app.targetDate && typeof app.targetDate === 'string')
      .map(app => {
        const date = parseISO(app.targetDate);
        let category = 'Upcoming';
        let priority = 'low';
        if (isBefore(date, now)) {
            category = 'Overdue';
            priority = 'high';
        } else if (isBefore(date, addDays(now, 2))) {
            category = 'Immediate';
            priority = 'medium';
        }
        return { ...app, targetDateObj: date, category, priority };
      })
      .sort((a, b) => a.targetDateObj - b.targetDateObj)
      .slice(0, 4);
  }, [apps]);

  const barData = useMemo(() => {
     const last7Days = [...Array(7)].map((_, i) => subDays(startOfDay(new Date()), i)).reverse();
     const counts = last7Days.map(day => apps.filter(app => app.createdAt && format(parseISO(app.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length);
     return {
       labels: last7Days.map(day => format(day, 'MMM d')),
       datasets: [{ label: 'Applications', data: counts, backgroundColor: '#3b82f6', borderRadius: 4, hoverBackgroundColor: '#2563eb' }]
     };
  }, [apps]);

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-100 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
        {/* Header Section (Full Width, No Layout Margin) */}
        <header className="mb-10 w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none mb-1">Strategic Control</h1>
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-[0.2em]">Synchronization Sequence Online • {stats.total} Active Nodes</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/applications')}
              className="btn-primary py-3 px-8 text-xs font-black flex items-center shadow-xl shadow-primary-500/20 active:scale-95 transition-all rounded-2xl"
            >
              <PlusCircle size={18} className="mr-3" /> NEW ENTRY
            </button>
          </div>
        </header>

        {/* Row 1: Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
           {[
             { label: 'Active Pipeline', value: stats.total, icon: Briefcase, color: 'blue' },
             { label: 'Interview Yield', value: `${stats.interviewRate}%`, icon: Target, color: 'amber' },
             { label: 'Offer Protocol', value: `${stats.offerRate}%`, icon: Award, color: 'emerald' },
             { label: 'Archival Rank', value: `${stats.rejectionRate}%`, icon: ShieldAlert, color: 'rose' }
           ].map((metric, i) => (
             <motion.div key={i} className="bg-white dark:bg-slate-900 p-5 lg:p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between w-full h-full min-h-[140px]">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 leading-none">Target: {metric.label}</h3>
                  <div className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-none tracking-tighter">{metric.value}</div>
                </div>
                <div className={`p-3 lg:p-4 rounded-2xl lg:rounded-3xl bg-${metric.color}-50 dark:bg-${metric.color}-900/10 text-${metric.color}-600`}>
                  <metric.icon size={24} strokeWidth={2.5} />
                </div>
             </motion.div>
           ))}
        </div>

        {/* Stretched 12-Column Grid Area */}
        <div className="grid grid-cols-12 gap-8 w-full flex-1 mb-8">
           
           {/* Left Analytics: col-span-8 */}
           <div className="col-span-12 xl:col-span-8 flex flex-col gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col flex-1 h-full min-h-[350px]">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] flex items-center">
                       <Zap size={18} className="mr-3 text-primary-600" /> Operational Velocity Trace
                    </h2>
                    <span className="text-[10px] bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full text-gray-400 font-bold uppercase tracking-wider">7-Day Mapping</span>
                 </div>
                 <div className="flex-1 w-full">
                    <Bar 
                      data={barData} 
                      options={{ 
                        maintainAspectRatio: false, 
                        scales: { 
                          y: { beginAtZero: true, grid: { borderDash: [2, 2], color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 11, weight: 'bold' } } }, 
                          x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } } 
                        }, 
                        plugins: { legend: { display: false } } 
                      }} 
                    />
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[380px]">
                 <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 mb-10 uppercase tracking-[0.3em] flex items-center">
                    <LineChart size={18} className="mr-3 text-primary-600" /> Operational Intelligence Stream
                 </h2>
                 {timelineEvents.length > 0 ? (
                    <div className="space-y-8 lg:space-y-10 relative pl-8 border-l-2 border-slate-50 dark:border-slate-800 ml-4">
                       {timelineEvents.map((event, idx) => (
                         <div key={idx} className="relative group/timeline">
                            <div className={`absolute -left-[41px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-900 transition-all group-hover/timeline:scale-125 ${event.type === 'OFFER' ? 'bg-emerald-500 shadow-xl' : event.type === 'INTERVIEW' ? 'bg-amber-500 shadow-xl' : 'bg-primary-500 shadow-xl'}`} />
                            <div className="hover:translate-x-2 transition-transform cursor-default">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2.5 block">{event.date ? format(parseISO(event.date), 'MMMM d, HH:mm') : 'Trace Unavailable'}</span>
                               <p className="text-base font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight leading-none mb-1.5">{event.company}</p>
                               <p className="text-xs font-bold text-gray-400 italic">Target Insight: {event.details}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                       <Sparkles size={32} className="mb-4" />
                       <p className="text-sm font-black uppercase tracking-widest">Feed Standby Mode</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Right Intelligence: col-span-4 */}
           <div className="col-span-12 xl:col-span-4 flex flex-col gap-8 h-full">
              <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[350px]">
                 <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center">
                    <Bell size={18} className="mr-3 text-primary-600" /> Action Mission Control
                 </h2>
                 {actionItems.length > 0 ? (
                  <div className="space-y-6">
                     {actionItems.map((item) => (
                       <div key={item.id} className={`p-6 lg:p-7 rounded-[32px] border flex items-center justify-between group transition-all ${item.priority === 'high' ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/40' : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'}`}>
                          <div className="truncate pr-4">
                             <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1.5 leading-none">{item.company}</p>
                             <h4 className="font-black text-gray-800 dark:text-gray-100 text-[15px] truncate leading-none mb-1.5">{item.role}</h4>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight italic opacity-60">Status: {item.category}</p>
                          </div>
                          <button onClick={() => handleCompleteAction(item.id)} className="p-3.5 bg-white dark:bg-slate-900 text-emerald-600 rounded-2xl lg:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-110 active:scale-95 transition-all">
                             <CheckCircle2 size={22} strokeWidth={3} />
                          </button>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-20 grayscale">
                     <Zap size={32} className="mb-4 text-primary-600" />
                     <p className="text-xs font-black uppercase tracking-[0.3em]">Operational Zero</p>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-8 justify-end">
                 <div className="bg-primary-600 p-10 lg:p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 -translate-y-32 translate-x-32 rounded-full group-hover:scale-125 transition-transform duration-1000" />
                    <Sparkles className="mb-8 text-primary-200" size={36} />
                    <h3 className="text-3xl font-black mb-2 leading-none tracking-tighter">Strategic Intelligence</h3>
                    <p className="text-xs font-bold text-primary-100 uppercase tracking-[0.4em] opacity-80 mb-14">Tier A Protocol Online</p>
                    <div className="flex justify-between items-end border-t border-white/10 pt-10">
                       <div>
                          <p className="text-5xl lg:text-6xl font-black leading-none">{stats.total}</p>
                          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-100 mt-4 leading-none">Target Nodes</p>
                       </div>
                       <div className="text-right">
                          <p className="text-5xl lg:text-6xl font-black leading-none uppercase">Apex</p>
                          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-100 mt-4 leading-none text-right">Mission Rank</p>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 lg:p-10 shadow-sm">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary-600 border border-slate-50 dark:border-slate-800 shadow-sm group-hover:bg-primary-50 transition-colors">
                          <Lightbulb size={28} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] leading-none mb-2">Strategy Node Protocol</p>
                          <p className="text-base font-black text-gray-700 dark:text-gray-200 tracking-tight leading-tight">Focus on Intercept-Ready targets to maximize overall deployment yields.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
    </div>
  );
};

export default Dashboard;
