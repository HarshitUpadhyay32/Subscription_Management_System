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
  Compass,
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
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'products', label: 'Products & Plans', icon: Package },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
        { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet, badge: pendingQuotationsCount || undefined },
        { id: 'invoices', label: 'Invoices & Payments', icon: Receipt, badge: pendingInvoicesCount || undefined },
        { id: 'discounts-taxes', label: 'Discounts & Taxes', icon: Percent },
        { id: 'staff', label: 'Staff Management', icon: UserCog },
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }
    if (role === 'staff') {
      return [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
        { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet, badge: pendingQuotationsCount || undefined },
        { id: 'invoices', label: 'Invoices & Payments', icon: Receipt, badge: pendingInvoicesCount || undefined },
      ];
    }
    // Customer Portal
    return [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'my-subscriptions', label: 'My Subscriptions', icon: Repeat },
      { id: 'my-invoices', label: 'My Invoices', icon: Receipt },
      { id: 'payment-history', label: 'Payment History', icon: CreditCard },
      { id: 'account-settings', label: 'Account Settings', icon: UserCheck },
    ];
  };

  const navItems = getNavItems(currentRole);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E9EBEF]">
      {/* Brand logo */}
      <div className="p-5 flex items-center justify-between border-b border-[#E9EBEF]">
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#714B67] text-white flex items-center justify-center font-bold text-base shadow-[0_2px_8px_rgba(113,75,103,0.3)]">
            BL
          </div>
          <div>
            <div className="text-lg font-bold text-[#29252A] tracking-tight font-serif flex items-center gap-1.5">
              Brightloop
            </div>
            <div className="sub-caps">
              {currentRole === 'admin'
                ? 'Admin Workspace'
                : currentRole === 'staff'
                ? 'Staff Console'
                : 'Customer Portal'}
            </div>
          </div>
        </button>
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-[#92939D] hover:text-[#34313A]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#92939D] px-3 py-1.5 mb-1">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#EDE5F0] text-[#714B67] shadow-[0_1px_3px_rgba(113,75,103,0.06)] font-semibold'
                  : 'text-[#696A75] hover:bg-[#F3F5F8] hover:text-[#34313A]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#714B67]' : 'text-[#92939D]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-[#714B67] text-white'
                      : 'bg-[#F3F5F8] text-[#92939D]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t border-[#E9EBEF] space-y-1">
        <button
          onClick={() => {
            onNavigate('landing');
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8] rounded-xl transition-colors"
        >
          <Compass className="w-4 h-4 text-[#92939D]" />
          <span>Marketing Website</span>
        </button>
        <button
          onClick={() => {
            logout();
            onNavigate('landing');
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-[#DC6464] hover:bg-[#FDF2F2] rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>
      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#34313A]/30 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
