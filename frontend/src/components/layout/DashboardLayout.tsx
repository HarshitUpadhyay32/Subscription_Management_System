import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { ToastContainer } from '../ui/Toast';

interface DashboardLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col antialiased text-gray-800 font-sans">
      {/* Full-width sticky Top Bar spanning edge-to-edge */}
      <TopNavbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onNavigateLanding={() => onNavigate('landing')}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />

      {/* Main split view: Sidebar + Page Content */}
      <div className="flex-1 flex flex-row min-h-[calc(100vh-56px)]">
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-5 sm:p-6 lg:p-8 min-w-0 max-w-[1600px] mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
