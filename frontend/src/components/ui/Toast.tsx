import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[#28A879] shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-[#DC6464] shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#E6A23C] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#714B67] shrink-0" />,
        };
        const borderStyles = {
          success: 'border-[#28A879]/20 bg-white',
          error: 'border-[#DC6464]/20 bg-white',
          warning: 'border-[#E6A23C]/20 bg-white',
          info: 'border-[#714B67]/20 bg-white',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              borderStyles[toast.type]
            }`}
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <div className="text-xs font-semibold text-[#34313A]">{toast.title}</div>
              )}
              <div className="text-xs text-[#92939D] leading-relaxed break-words">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#92939D] hover:text-[#34313A] p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
