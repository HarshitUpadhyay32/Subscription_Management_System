import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
  accent?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-gray-200/90 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:border-[#7A4C72]/40 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#F6EDF3] text-[#7A4C72] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-gray-900 tracking-tight">
        {value}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span
            className={`inline-flex items-center font-medium ${
              trend.isPositive !== false ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive !== false ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {trend.value}
          </span>
          {trend.label && <span className="text-gray-400">{trend.label}</span>}
        </div>
      )}

      {subtitle && !trend && (
        <div className="text-xs text-gray-400 mt-2">{subtitle}</div>
      )}
    </div>
  );
};
