import React from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Repeat,
  FileSpreadsheet,
  Receipt,
  Percent,
  UserCog,
  BarChart3,
  Settings,
  CreditCard,
  UserCheck,
  LogOut,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentRole, logout, invoices, quotations } = useApp();
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue').length;
  const pendingQuotationsCount = quotations.filter((q) => q.status === 'sent' || q.status === 'approved').length;

  const getNavItems = (role: UserRole): NavItem[] => {
    if (role === 'admin') {
      return [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Products & Plans', icon: Package },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
        { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet, badge: pendingQuotationsCount || undefined },
        { id: 'invoices', label: 'Invoices', icon: Receipt, badge: pendingInvoicesCount || undefined },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'discounts-taxes', label: 'Discounts & Taxes', icon: Percent },
        { id: 'analytics', label: 'Reports', icon: BarChart3 },
        { id: 'staff', label: 'Staff Management', icon: UserCog },
      ];
    }
    if (role === 'staff') {
      return [
        { id: 'overview', label: 'Staff Dashboard', icon: LayoutDashboard },
        { id: 'customers', label: 'Customer Management', icon: Users },
        { id: 'subscriptions', label: 'Manage Subscriptions', icon: Repeat },
        { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet, badge: pendingQuotationsCount || undefined },
        { id: 'invoices', label: 'Invoices & Payments', icon: Receipt, badge: pendingInvoicesCount || undefined },
      ];
    }
    // Customer Portal per Flowchart Image 2
    return [
      { id: 'overview', label: 'Customer Portal', icon: LayoutDashboard },
      { id: 'my-subscriptions', label: 'My Subscriptions', icon: Repeat },
      { id: 'my-invoices', label: 'My Invoices', icon: Receipt },
      { id: 'account-settings', label: 'Account Settings', icon: UserCheck },
    ];
  };

  const navItems = getNavItems(currentRole);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-60 select-none">
      {/* Navigation items list */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#F6EDF3] text-[#7A4C72] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#7A4C72]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#7A4C72] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Area: User role tag and Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => {
            logout();
            onNavigate('landing');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-14 h-[calc(100vh-56px)] z-10">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-3 bg-[#7A4C72] text-white flex items-center justify-between">
              <span className="font-bold text-sm">Brightloop Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
