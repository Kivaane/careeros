import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Filter, Trash2, Edit2, 
  Calendar, MessageSquare, Building2, 
  ChevronDown, CheckCircle2, 
  XCircle, Clock, Zap, Sparkles, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { toast } from 'react-hot-toast';

import api from '../api/api';

/**
 * Readable & Professional Applications Pipeline
 * Features: Balanced Spacing, Natural Text Wrapping, 
 * No Aggressive Truncation, and Structured Card Information Hierarchy.
 */
const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [formData, setFormData] = useState({ 
    company: '', 
    role: '', 
    status: 'APPLIED', 
    priorityScore: 'MEDIUM',
    notes: '',
    appliedDate: format(new Date(), 'yyyy-MM-dd'),
    targetDate: ''
  });

  const fetchApps = async () => {
    try {
      const response = await api.get('/applications');
      setApps(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Sync failure';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.company.trim() || !formData.role.trim()) {
      toast.error('Company and Role are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.targetDate) delete payload.targetDate;
      if (!payload.notes) delete payload.notes;

      if (editingApp) {
        await api.patch(`/applications/${editingApp.id}`, payload);
        toast.success('Node updated 🚀');
      } else {
        await api.post('/applications', payload);
        toast.success('Node synchronized ✨');
      }
      setShowModal(false);
      setEditingApp(null);
      setFormData({ company: '', role: '', status: 'APPLIED', priorityScore: 'MEDIUM', notes: '', appliedDate: format(new Date(), 'yyyy-MM-dd'), targetDate: '' });
      fetchApps();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Sync failed';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Node terminated 🗑️');
      setShowDeleteConfirm(null);
      fetchApps();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Termination failed';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleQuickUpdate = async (id, status) => {
    try {
      await api.patch(`/applications/${id}`, { status });
      toast.success(`${status.toLowerCase()} phase active`);
      fetchApps();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Update failed';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({ 
      company: app.company, 
      role: app.role, 
      status: app.status, 
      priorityScore: app.priorityScore || 'MEDIUM',
      notes: app.notes || '',
      appliedDate: (app.appliedDate || app.createdAt) ? format(parseISO(app.appliedDate || app.createdAt), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      targetDate: app.targetDate ? format(parseISO(app.targetDate), 'yyyy-MM-dd') : ''
    });
    setShowModal(true);
  };

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesFilter = filter === 'ALL' || app.status === filter;
        const matchesSearch = app.company.toLowerCase().includes(search.toLowerCase()) || 
                              app.role.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [apps, filter, search]);

  const getPriorityInfo = (app) => {
     if (app.status === 'INTERVIEW' || (app.targetDate && isBefore(parseISO(app.targetDate), startOfDay(new Date())))) {
        return { label: 'High Impact', class: 'text-rose-600 bg-rose-50 dark:bg-rose-900/10' };
     }
     if (app.priorityScore === 'HIGH') return { label: 'High', class: 'text-rose-600 bg-rose-50 dark:bg-rose-900/10' };
     if (app.priorityScore === 'MEDIUM') return { label: 'Medium', class: 'text-amber-600 bg-amber-50 dark:bg-amber-900/10' };
     return { label: 'Low', class: 'text-blue-600 bg-blue-50 dark:bg-blue-900/10' };
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-full">
        {/* Dynamic Header Row */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-10 mb-14 w-full">
           <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 leading-none mb-3 flex items-center tracking-tighter">
                 <Navigation size={32} strokeWidth={3} className="mr-5 text-primary-600" /> Mission Pipeline
              </h1>
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.4em] leading-none pl-1">Strategic Synchronization • {filteredApps.length} ACTIVE DEPLOYMENTS</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
              <div className="relative flex-1 xl:min-w-[500px]">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input type="text" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 text-base font-bold w-full shadow-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:opacity-50" placeholder="Locating strategic trajectory data..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="relative min-w-[220px]">
                 <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <select className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-16 py-5 text-base font-black w-full shadow-sm appearance-none cursor-pointer tracking-wider outline-none uppercase" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="ALL">ALL NODES</option>
                    <option value="APPLIED">APPLIED</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="OFFER">OFFERS</option>
                    <option value="REJECTED">ARCHIVED</option>
                 </select>
                 <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
           </div>
        </div>

        {/* Global Floating Action Button */}
        <button 
           onClick={() => { setEditingApp(null); setFormData({ company: '', role: '', status: 'APPLIED', priorityScore: 'MEDIUM', notes: '', appliedDate: format(new Date(), 'yyyy-MM-dd'), targetDate: '' }); setShowModal(true); }} 
           className="fixed bottom-6 right-6 z-50 p-6 bg-primary-600 text-white rounded-full shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-110 active:scale-95 transition-all group overflow-hidden"
           title="New Entry"
        >
           <div className="absolute inset-0 bg-gradient-to-tr from-primary-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
           <Plus size={32} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* Readable & Balanced Pipeline Grid */}
        <div className="flex-1 w-full h-full">
           {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                 {[...Array(6)].map((_, i) => <div key={i} className="min-h-[260px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 opacity-40 animate-pulse"></div>)}
              </div>
           ) : filteredApps.length === 0 ? (
              <div className="h-[60vh] bg-white dark:bg-slate-900 rounded-[40px] border-4 border-dashed border-slate-50 dark:border-slate-900 p-24 flex flex-col items-center justify-center grayscale opacity-40 shadow-inner">
                 <Sparkles size={80} strokeWidth={1} className="mb-10 text-slate-200" />
                 <p className="text-xl font-black uppercase tracking-[0.5em] text-slate-300">Operational Zero • Awaiting Deployment</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-32">
                 <AnimatePresence mode="popLayout">
                    {filteredApps.map((app) => {
                       const priority = getPriorityInfo(app);
                       const isOverdue = app.targetDate && isBefore(parseISO(app.targetDate), startOfDay(new Date()));
                       
                       return (
                          <motion.div 
                            key={app.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
                            className={`bg-white dark:bg-slate-900 p-6 lg:p-7 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all group relative hover:shadow-xl hover:shadow-primary-500/10 hover:scale-[1.01] w-full h-full min-h-[260px] flex flex-col justify-between space-y-4 ${app.status === 'INTERVIEW' ? 'border-amber-400/40 shadow shadow-amber-500/5' : app.status === 'OFFER' ? 'border-emerald-400/40 shadow shadow-emerald-500/5' : ''}`}
                          >
                             {/* Header Row: Readable Company & Role (Natural Wrap) */}
                             <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-5">
                                   <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 text-primary-600 flex items-center justify-center text-2xl font-black border border-slate-100 dark:border-slate-800 shadow-sm group-hover:rotate-6 transition-all duration-500">
                                      {app.company.charAt(0)}
                                   </div>
                                   <div>
                                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight break-words uppercase tracking-tighter">
                                         {app.company}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-2 mt-1">
                                         <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-black rounded-md whitespace-nowrap ${priority.class} uppercase leading-none shadow-sm`}>
                                            {priority.label}
                                         </span>
                                         <p className="text-xs font-medium text-slate-400 dark:text-slate-500 break-words leading-tight">
                                            {app.role}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                                <span className={`flex-shrink-0 inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-full whitespace-nowrap bg-slate-50 dark:bg-slate-800/80 text-slate-500 border border-slate-100 dark:border-slate-800 shadow-sm leading-none ${app.status === 'OFFER' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100' : app.status === 'INTERVIEW' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/10 border-amber-100' : ''}`}>
                                   {app.status}
                                </span>
                             </div>

                             {/* Info Section (Balanced Boxes) */}
                             <div className="flex justify-between gap-4 mt-6">
                                <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50 space-y-1">
                                   <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-none">Date</p>
                                   <div className="flex items-center gap-2">
                                      <Calendar size={12} className="text-primary-500" />
                                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-none">
                                         {app.createdAt ? format(parseISO(app.createdAt), 'MMM d, yy') : 'N/A'}
                                      </span>
                                   </div>
                                </div>
                                <div className={`flex-1 flex flex-col rounded-xl p-3 border space-y-1 ${isOverdue ? 'bg-rose-50 border-rose-100 text-rose-600 shadow-inner' : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300'}`}>
                                   <p className="text-[10px] font-bold uppercase tracking-wider leading-none opacity-60">ETA</p>
                                   <div className="flex items-center gap-2">
                                      <Clock size={12} className="" />
                                      <span className="text-sm font-medium leading-none">
                                         {app.targetDate ? format(parseISO(app.targetDate), 'MMM d') : 'NO ETA'}
                                      </span>
                                   </div>
                                </div>
                             </div>

                             {/* Buttons Row (Natural Alignment) */}
                             <div className="flex items-center justify-between gap-3 pt-2">
                                <button onClick={() => setShowDetailsModal(app)} className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-primary-900/10 text-slate-600 dark:text-slate-400 py-2.5 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-800 transition-all uppercase tracking-wide shadow-sm active:scale-95">Analyze</button>
                                <div className="flex gap-2">
                                   <button onClick={() => openEditModal(app)} className="p-2.5 bg-white dark:bg-slate-900 text-blue-500 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-all shadow-sm active:scale-95 hover:bg-blue-50/30">
                                      <Edit2 size={16} />
                                   </button>
                                   <button onClick={() => setShowDeleteConfirm(app.id)} className="p-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-800 hover:border-rose-300 transition-all shadow-sm active:scale-95 hover:rotate-6">
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                             </div>

                             {/* Center Status Hotline */}
                              <div className="absolute top-1/2 left-0 w-full flex justify-center -translate-y-8 opacity-0 group-hover:opacity-100 group-hover:-translate-y-14 transition-all pointer-events-none group-hover:pointer-events-auto z-20">
                                <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 flex gap-3">
                                   <button onClick={(e) => { e.stopPropagation(); handleQuickUpdate(app.id, 'INTERVIEW'); }} title="Set Interview" className="p-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 rounded-xl transition-all border border-transparent hover:border-amber-100 active:scale-90 shadow-sm"><Zap size={20} strokeWidth={2.5} /></button>
                                   <button onClick={(e) => { e.stopPropagation(); handleQuickUpdate(app.id, 'OFFER'); }} title="Set Offer" className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500 rounded-xl transition-all border border-transparent hover:border-emerald-100 active:scale-90 shadow-sm"><CheckCircle2 size={20} strokeWidth={2.5} /></button>
                                   <button onClick={(e) => { e.stopPropagation(); handleQuickUpdate(app.id, 'REJECTED'); }} title="Archive Target" className="p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100 active:scale-90 shadow-sm"><XCircle size={20} strokeWidth={2.5} /></button>
                                </div>
                             </div>
                          </motion.div>
                       );
                    })}
                 </AnimatePresence>
              </div>
           )}
        </div>

        {/* Sync Trajectory Modal (Balanced Context) */}
        <AnimatePresence>
          {showModal && (
            <div className="modal-overlay backdrop-blur-2xl bg-slate-900/40">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden rounded-[40px] border border-slate-100 dark:border-slate-800 z-50">
                 <div className="p-12">
                    <div className="flex justify-between items-center mb-10">
                       <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{editingApp ? 'Update Target' : 'Sync Deployment'}</h2>
                       <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-500 transition-all hover:rotate-90"><XCircle size={38} /></button>
                    </div>
                    <form onSubmit={handleSave} className="space-y-6 flex flex-col items-stretch">
                       <div className="grid grid-cols-2 gap-6 w-full">
                          <input required className="input-field col-span-2 py-5 px-8 text-lg font-bold rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm outline-none" placeholder="Target Company..." value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                          <input required className="input-field col-span-2 py-5 px-8 text-base font-bold rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm outline-none" placeholder="Strategic Role..." value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                          <div className="flex flex-col gap-3">
                             <label className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-4">Mission Phase</label>
                             <select className="input-field py-5 px-8 text-sm font-bold uppercase rounded-2xl appearance-none cursor-pointer border border-slate-100 dark:border-slate-800 shadow-sm outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                               <option value="APPLIED">Applied Phase</option>
                               <option value="INTERVIEW">Interview Staging</option>
                               <option value="OFFER">Offer Protocol</option>
                               <option value="REJECTED">Archive Cell</option>
                             </select>
                          </div>
                          <div className="flex flex-col gap-3">
                             <label className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-4">Priority Score</label>
                             <select className="input-field py-5 px-8 text-sm font-bold uppercase rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm outline-none cursor-pointer appearance-none" value={formData.priorityScore} onChange={e => setFormData({...formData, priorityScore: e.target.value})}>
                               <option value="HIGH">High Impact</option>
                               <option value="MEDIUM">Standard Node</option>
                               <option value="LOW">Minor Element</option>
                             </select>
                          </div>
                          <div className="flex flex-col gap-3">
                             <label className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-4">Applied Date</label>
                             <input type="date" required className="input-field py-5 px-8 text-sm font-bold uppercase rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm outline-none" value={formData.appliedDate} onChange={e => setFormData({...formData, appliedDate: e.target.value})} />
                          </div>
                          <div className="flex flex-col gap-3">
                             <label className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-4">Target ETA</label>
                             <input type="date" className="input-field py-5 px-8 text-sm font-bold uppercase rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm outline-none" value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} />
                          </div>
                          <textarea className="input-field col-span-2 py-6 px-8 text-sm font-medium min-h-[140px] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm outline-none" placeholder="Operational narrative intelligence snapshot..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                       </div>
                       <div className="flex gap-4 pt-6 w-full">
                          <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary flex items-center justify-center py-5 font-bold uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/30 active:scale-95 text-base disabled:opacity-70 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 mr-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Syncing...
                              </>
                            ) : 'Confirm Protocol'}
                          </button>
                          <button type="button" onClick={() => setShowModal(false)} className="px-10 border-2 rounded-2xl border-slate-100 dark:border-slate-800 font-bold uppercase text-[12px] text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Abort</button>
                       </div>
                    </form>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Details View (Analysis) */}
        <AnimatePresence>
          {showDetailsModal && (
            <div className="modal-overlay backdrop-blur-3xl bg-slate-950/40 z-[60]">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-4xl bg-white dark:bg-slate-900 rounded-[56px] overflow-hidden shadow-2xl border border-slate-50 dark:border-slate-800 relative z-10 w-full m-4">
                  <div className="bg-gradient-to-br from-primary-600 via-indigo-700 to-indigo-950 p-16 text-white relative">
                     <button onClick={() => setShowDetailsModal(null)} className="absolute top-8 right-8 text-white/30 hover:text-white transition-all"><XCircle size={44} strokeWidth={1} /></button>
                     <p className="text-[12px] font-black text-primary-200 uppercase tracking-[0.5em] mb-4 opacity-70 animate-pulse">Telemetry Sequence Intercepted</p>
                     <h2 className="text-5xl font-black uppercase leading-none tracking-tighter mb-4">{showDetailsModal.company}</h2>
                     <p className="text-xl font-bold text-primary-100 uppercase tracking-widest leading-none flex items-center opacity-60"><Building2 size={28} className="mr-5 text-white" /> {showDetailsModal.role}</p>
                  </div>
                  <div className="p-16 space-y-12">
                     <div className="grid grid-cols-3 gap-8">
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default overflow-hidden">
                           <p className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 leading-none underline decoration-primary-500/30 underline-offset-4">Status</p>
                           <p className="text-xl font-black text-primary-600 uppercase leading-none tracking-tighter truncate">{showDetailsModal.status}</p>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default">
                           <p className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 leading-none underline decoration-slate-400/20 underline-offset-4">Initial Sync</p>
                           <p className="text-xl font-black text-slate-800 dark:text-slate-200 leading-none tracking-tighter">{showDetailsModal.createdAt ? format(parseISO(showDetailsModal.createdAt), 'MMM d, yyyy') : '--'}</p>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default">
                           <p className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 leading-none underline decoration-slate-400/20 underline-offset-4">Trace Time</p>
                           <p className="text-xl font-black text-slate-800 dark:text-slate-200 leading-none tracking-tighter">{showDetailsModal.updatedAt ? format(parseISO(showDetailsModal.updatedAt), 'HH:mm:ss') : '--'}</p>
                        </div>
                     </div>
                     <div className="p-12 bg-slate-50 dark:bg-slate-800/20 rounded-[48px] border border-slate-100 dark:border-slate-800 relative shadow-inner overflow-hidden">
                        <MessageSquare className="absolute -bottom-10 -right-10 text-slate-100 dark:text-slate-800 opacity-10" size={200} />
                        <p className="text-[14px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-8 leading-none">Internal Narrative Intelligence summary</p>
                        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 italic relative z-10 leading-relaxed max-h-[300px] overflow-y-auto pr-8 custom-scrollbar">
                           "{showDetailsModal.notes || 'Capture required for primary intelligence summary reporting...'}"
                        </p>
                     </div>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirm Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="modal-overlay backdrop-blur-md bg-slate-900/40 flex items-center justify-center fixed inset-0 z-[60]">
               <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl max-w-sm w-full mx-4 border border-slate-100 dark:border-slate-800 text-center relative z-10">
                  <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100 dark:border-rose-800/50 text-rose-500">
                     <Trash2 size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-slate-100 mb-3">Terminate Node?</h3>
                  <p className="text-[13px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed mb-8">This action is irreversible. The deployment record will be completely expunged.</p>
                  <div className="flex gap-4 w-full">
                     <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 px-4 font-bold rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs uppercase tracking-widest">Abort</button>
                     <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-4 px-4 font-bold rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all border border-rose-100 dark:border-rose-900 shadow-sm text-xs uppercase tracking-widest active:scale-95">Terminate</button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

    </div>
  );
};

export default Applications;