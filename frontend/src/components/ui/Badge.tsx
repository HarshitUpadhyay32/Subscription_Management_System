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
  | 'purple'
  | 'neutral';

interface BadgeProps {
  variant: BadgeVariant | string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'sm' }) => {
  const getStyles = (v: string) => {
    switch (v.toLowerCase()) {
      case 'active':
      case 'paid':
      case 'successful':
      case 'approved':
        return 'bg-[#EBF7F2] text-[#28A879] border-[#D4EFE4]';
      case 'pending':
      case 'trial':
      case 'sent':
        return 'bg-[#FEF7EC] text-[#D9822B] border-[#FBEAD2]';
      case 'expired':
      case 'cancelled':
      case 'overdue':
      case 'failed':
        return 'bg-[#FDF2F2] text-[#DC6464] border-[#F9D6D6]';
      case 'converted':
      case 'purple':
        return 'bg-[#EDE5F0] text-[#714B67] border-[#DFCDE2]';
      case 'draft':
      default:
        return 'bg-[#F3F5F8] text-[#696A75] border-[#E9EBEF]';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border tracking-tight ${sizeClasses} ${getStyles(
        variant
      )}`}
    >
      {children}
    </span>
  );
};
