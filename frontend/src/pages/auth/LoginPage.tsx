import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield, Briefcase, User, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onNavigateLanding: () => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onSuccessLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateLanding,
  onNavigateRegister,
  onNavigateForgotPassword,
  onSuccessLogin,
}) => {
  const { loginAs, supabaseSignIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await supabaseSignIn(email, password);
      // Role is resolved from the profile row via Supabase auth sync in AppContext
      // We optimistically route by email pattern; AppContext will correct via profile
      if (email.toLowerCase().includes('admin')) onSuccessLogin('admin');
      else if (email.toLowerCase().includes('staff')) onSuccessLogin('staff');
      else onSuccessLogin('customer');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRole = (role: UserRole) => {
    loginAs(role);
    onSuccessLogin(role);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F6] flex flex-col justify-center items-center p-4 antialiased text-[#29252A] relative overflow-hidden">
      {/* Background decorative watermark */}
      <div className="bg-decorative-watermark top-8 left-1/2 -translate-x-1/2 text-[140px] font-serif opacity-15 pointer-events-none select-none">
        ACCESS
      </div>
      {/* Background ambient blur */}
      <div className="absolute w-[500px] h-[300px] bg-[#EDE5F0]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-6">
          <button
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-2 mb-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#714B67] text-white flex items-center justify-center font-bold text-base shadow-[0_2px_8px_rgba(113,75,103,0.3)]">
              BL
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#29252A] font-serif">
              Brightloop
            </span>
          </button>
          <h1 className="text-2xl font-bold text-[#29252A] font-serif">Sign in to your Workspace</h1>
          <p className="text-xs text-[#92939D] mt-1">
            Access your recurring billing dashboard, proposals, and invoices.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EBEF] shadow-[0_12px_40px_rgba(52,49,58,0.06)]">
          {/* Quick 1-click Role Selector for instant prototype exploration */}
          <div className="mb-6 pb-6 border-b border-[#E9EBEF]">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#92939D] uppercase tracking-wider mb-2.5">
              <span>Quick Demo Sign In</span>
              <span className="text-[#714B67] lowercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                1-click
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="p-2 rounded-xl border border-[#E9EBEF] hover:border-[#714B67] hover:bg-[#EDE5F0]/30 text-left transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[#714B67] mb-1" />
                <div className="text-[11px] font-bold text-[#34313A]">Admin</div>
                <div className="text-[9px] text-[#92939D] truncate">Elena Vance</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('staff')}
                className="p-2 rounded-xl border border-[#E9EBEF] hover:border-[#714B67] hover:bg-[#EDE5F0]/30 text-left transition-all"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#714B67] mb-1" />
                <div className="text-[11px] font-bold text-[#34313A]">Staff</div>
                <div className="text-[9px] text-[#92939D] truncate">Arjun Nair</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('customer')}
                className="p-2 rounded-xl border border-[#E9EBEF] hover:border-[#714B67] hover:bg-[#EDE5F0]/30 text-left transition-all"
              >
                <User className="w-3.5 h-3.5 text-[#714B67] mb-1" />
                <div className="text-[11px] font-bold text-[#34313A]">Customer</div>
                <div className="text-[9px] text-[#92939D] truncate">Rahul Sharma</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F9D6D6] text-xs text-[#DC6464]">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#34313A]">Password</label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-xs text-[#714B67] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92939D] hover:text-[#34313A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#714B67] focus:ring-[#714B67]"
                />
                <span className="text-xs text-[#696A75]">Remember this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-[0_2px_8px_rgba(113,75,103,0.25)] flex items-center justify-center gap-1.5 transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Signing in…</span></>
              ) : (
                <><span>Sign In to Brightloop</span><ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#92939D]">
            Don't have an account yet?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-[#714B67] font-semibold hover:underline"
            >
              Register customer account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
