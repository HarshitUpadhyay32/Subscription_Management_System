import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Shield,
  User,
  Briefcase,
  LogOut,
  Settings,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface TopNavbarProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateLanding: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  onNavigateLanding,
  currentPath,
  onNavigate,
}) => {
  const { currentUser, currentRole, switchRole, logout } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { id: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
    { id: 'admin', label: 'Admin', desc: 'Full System & Analytics', icon: Shield },
    { id: 'staff', label: 'Staff', desc: 'Customer & Billing Ops', icon: Briefcase },
    { id: 'customer', label: 'Customer', desc: 'Customer Portal', icon: User },
  ];

  const notifications = [
    { id: '1', title: 'Payment received', desc: '₹999.00 via UPI from Acme Technologies', time: '10m ago' },
    { id: '2', title: 'New Subscription', desc: 'TechCorp Solutions activated Analytics Yearly', time: '1h ago' },
    { id: '3', title: 'Invoice Due Soon', desc: 'INV-002 due in 3 days', time: '2d ago' },
  ];

  const getRoleLabel = () => {
    if (currentRole === 'admin') return 'Admin';
    if (currentRole === 'staff') return 'Staff';
    return currentUser?.name?.split(' ')[0] || 'Customer';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#7A4C72] text-white px-4 md:px-6 h-14 flex items-center justify-between shadow-sm transition-all select-none">
      {/* Left: Hamburger (mobile) + Brand Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2 text-left focus:outline-none hover:opacity-90 transition-opacity"
        >
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Brightloop
          </span>
        </button>
      </div>

      {/* Center: Search Bar with translucent background */}
      <div className="flex-1 max-w-md mx-4 sm:mx-8">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-white/60 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-white/15 text-white placeholder-white/60 border border-white/10 rounded-lg focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 p-0.5 text-white/70 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Notifications & Profile / Role Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Bell */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors relative focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-400 ring-2 ring-[#7A4C72]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Notifications
                </span>
                {unreadCount > 0 ? (
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[10px] text-[#7A4C72] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400">All caught up</span>
                )}
              </div>
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-gray-50 transition-colors text-left cursor-pointer">
                    <div className="text-xs font-semibold text-gray-900">{n.title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{n.desc}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill Dropdown: Avatar + Name + Dropdown caret */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg hover:bg-white/10 text-white transition-all text-xs font-medium focus:outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-xs overflow-hidden border border-white/20">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                getRoleLabel().charAt(0)
              )}
            </div>
            <span className="hidden sm:inline-block font-medium">
              {getRoleLabel()}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-white/80" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <div className="text-xs font-bold text-gray-900 truncate">
                  {currentUser?.name || 'User Profile'}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {currentUser?.email || 'user@brightloop.com'}
                </div>
                <div className="mt-1.5 inline-block text-[10px] font-semibold bg-[#F6EDF3] text-[#7A4C72] px-2 py-0.5 rounded-full capitalize">
                  {currentRole} Role
                </div>
              </div>

              {/* Role Switcher */}
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 px-1">
                  Switch Workspace Role
                </div>
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isCurrent = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        onNavigate('overview');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        isCurrent
                          ? 'bg-[#F6EDF3] text-[#7A4C72] font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{r.label}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-[#7A4C72]" />}
                    </button>
                  );
                })}
              </div>

              {/* Settings shortcut */}
              {currentRole === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                  <span>System Settings</span>
                </button>
              )}

              {/* Landing Page */}
              <button
                onClick={() => {
                  onNavigateLanding();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                <span>View Landing Page</span>
              </button>

              {/* Logout (Flowchart target) */}
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  onNavigateLanding();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-gray-100 text-left font-medium mt-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
