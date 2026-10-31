import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  RotateCcw,
  Shield,
  User,
  Briefcase,
  Check,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface TopNavbarProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateLanding: () => void;
  currentPath: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  onNavigateLanding,
  currentPath,
}) => {
  const { currentUser, currentRole, switchRole, logout, resetToInitialData } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
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
    { id: 'customer', label: 'Customer', desc: 'Rahul Sharma Portal', icon: User },
  ];

  const notifications = [
    { id: '1', title: 'Payment received', desc: '₹1,768.82 via UPI from Rahul Sharma', time: '10m ago' },
    { id: '2', title: 'Quotation Approved', desc: 'Ananya Deshmukh approved BL-QT-8092', time: '1h ago' },
    { id: '3', title: 'Renewal Upcoming', desc: 'Zest Technologies renews on 01 Apr 2026', time: '2d ago' },
  ];

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-[#E9EBEF] px-4 md:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & module breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-[#696A75] hover:bg-[#F3F5F8]"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#92939D]">
            <span className="font-semibold text-[#34313A] capitalize">
              {currentPath.replace('-', ' ')}
            </span>
            <span>·</span>
            <span>Brightloop SaaS</span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
            <input
              type="text"
              placeholder={`Search ${currentPath.replace('-', ' ')} or records...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F3F5F8] border border-transparent hover:border-[#E9EBEF] focus:border-[#714B67] rounded-xl text-[#34313A] placeholder-[#92939D] focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Role Switcher, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Demo Role Switcher pill dropdown */}
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#EDE5F0] bg-[#EDE5F0]/50 hover:bg-[#EDE5F0] text-[#714B67] text-xs font-medium transition-all"
              title="Switch demo persona"
            >
              <span className="w-2 h-2 rounded-full bg-[#714B67]" />
              <span className="hidden sm:inline capitalize">Role: {currentRole}</span>
              <span className="sm:hidden capitalize">{currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_12px_32px_rgba(0,0,0,0.08)] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-[#92939D] tracking-wider border-b border-[#E9EBEF] mb-1">
                  Switch Active Role
                </div>
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#EDE5F0]/60 text-[#714B67] font-semibold'
                          : 'text-[#34313A] hover:bg-[#F3F5F8]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#714B67]" />
                        <div>
                          <div>{r.label}</div>
                          <div className="text-[10px] text-[#92939D] font-normal">{r.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#714B67]" />}
                    </button>
                  );
                })}
                <div className="pt-2 mt-1 border-t border-[#E9EBEF] px-2">
                  <button
                    onClick={() => {
                      resetToInitialData();
                      setShowRoleMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-[#92939D] hover:text-[#34313A] hover:bg-[#F3F5F8] rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Realistic Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications bell */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8] transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#714B67]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_12px_32px_rgba(0,0,0,0.08)] p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E9EBEF]">
                  <span className="text-xs font-semibold text-[#34313A]">Recent Activity</span>
                  <span className="text-[11px] text-[#714B67] hover:underline cursor-pointer">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-[#34313A]">{n.title}</span>
                        <span className="text-[10px] text-[#92939D]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#92939D] mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-[#F3F5F8] transition-colors"
            >
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover border border-[#E9EBEF]"
              />
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-semibold text-[#34313A] truncate max-w-[110px]">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-[#92939D] capitalize">{currentRole}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#92939D]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_12px_32px_rgba(0,0,0,0.08)] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#E9EBEF]">
                  <div className="text-xs font-semibold text-[#34313A]">{currentUser?.name}</div>
                  <div className="text-[11px] text-[#92939D] truncate">{currentUser?.email}</div>
                  {currentUser?.company && (
                    <div className="text-[10px] text-[#714B67] mt-1 font-medium">{currentUser.company}</div>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateLanding();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#34313A] hover:bg-[#F3F5F8] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#92939D]" />
                    <span>View Public Landing Page</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      onNavigateLanding();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#DC6464] hover:bg-[#FDF2F2] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
