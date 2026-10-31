import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  icon?: LucideIcon;
  accent?: 'purple' | 'blue' | 'default';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  accent = 'default',
  onClick,
}) => {
  const accentBorders = {
    purple: 'border-[#EDE5F0] hover:border-[#714B67]/30',
    blue: 'border-[#EAF0F8] hover:border-[#3B82F6]/30',
    default: 'border-[#E9EBEF] hover:border-[#CBD0D8]',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all ${
        accentBorders[accent]
      } ${onClick ? 'cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-[#92939D] tracking-wider uppercase">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-[#F5F5F6] text-[#714B67] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-[#29252A] tracking-tight font-mono tabular-nums">
        {value}
      </div>
      {(trend || subtitle) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#92939D]">
          {trend && (
            <span
              className={`font-medium ${
                trend.isPositive ? 'text-[#28A879]' : 'text-[#DC6464]'
              }`}
            >
              {trend.value}
            </span>
          )}
          <span>{trend?.label || subtitle}</span>
        </div>
      )}
    </div>
  );
};
