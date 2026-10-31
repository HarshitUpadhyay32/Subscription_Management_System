import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'pending'
  | 'expired'
  | 'cancelled'
  | 'trial'
  | 'paid'
  | 'overdue'
  | 'draft'
  | 'sent'
  | 'approved'
  | 'converted'
  | 'successful'
  | 'success'
  | 'failed'
  | 'paused'
  | 'closed'
  | 'inactive'
  | 'purple'
  | 'neutral';

interface BadgeProps {
  variant: BadgeVariant | string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'sm', className = '' }) => {
  const getStyles = (v: string) => {
    switch (v.toLowerCase()) {
      case 'active':
      case 'paid':
      case 'successful':
      case 'success':
      case 'approved':
        return 'bg-[#EAF8F0] text-[#1E834D]';
      case 'pending':
      case 'trial':
      case 'sent':
      case 'paused':
        return 'bg-[#FEF5E7] text-[#D97706]';
      case 'expired':
      case 'cancelled':
      case 'overdue':
      case 'failed':
      case 'inactive':
        return 'bg-[#FDEEEC] text-[#D9383A]';
      case 'converted':
      case 'purple':
        return 'bg-[#F6EDF3] text-[#7A4C72]';
      case 'draft':
      case 'closed':
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${getStyles(
        variant
      )} ${sizeStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span className="capitalize">{children}</span>
    </span>
  );
};
