import Sidebar from './Sidebar';

/**
 * Standardized SaaS Layout Wrapper
 * Features: Fixed Sidebar (256px) + Stretchable Main Content (Scrolling).
 * Ensures a perfectly aligned, non-overlapping interface.
 */
const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-primary-100">
      {/* Fixed-Width Persistent Sidebar */}
      <Sidebar />

      {/* Primary Scrollable Workspace Wrapper */}
      {/* ml-64 (256px) maintains the spatial separation from the fixed sidebar */}
      <main className="flex-1 ml-64 h-full overflow-y-auto overflow-x-hidden p-6 lg:p-10 flex flex-col relative">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
