import React, { useState } from 'react';
import { Shield, Briefcase, User, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
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
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (email.toLowerCase().includes('admin')) {
        loginAs('admin');
        onSuccessLogin('admin');
      } else if (email.toLowerCase().includes('staff')) {
        loginAs('staff');
        onSuccessLogin('staff');
      } else {
        loginAs('customer');
        onSuccessLogin('customer');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRole = (role: UserRole) => {
    loginAs(role);
    onSuccessLogin(role);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row font-sans selection:bg-[#F6EDF3] selection:text-[#7A4C72]">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto lg:mx-0">
        <div>
          {/* Logo */}
          <button
            onClick={onNavigateLanding}
            className="flex items-center gap-2 mb-10 text-left focus:outline-none"
          >
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Brightloop
            </span>
          </button>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-500">
              Login to your Brightloop account
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72] transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#7A4C72] focus:ring-[#7A4C72]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-[#7A4C72] hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Login</span>
            </button>
          </form>

          {/* Quick Demo 1-Click Role Switch per Flowchart */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              <span>Quick Demo Access</span>
              <span className="text-[#7A4C72] flex items-center gap-1 font-medium lowercase">
                <Sparkles className="w-3 h-3" /> 1-click
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="p-2.5 rounded-lg border border-gray-200 hover:border-[#7A4C72] hover:bg-[#F6EDF3] text-left transition-colors"
              >
                <Shield className="w-4 h-4 text-[#7A4C72] mb-1" />
                <div className="text-xs font-bold text-gray-900">Admin</div>
                <div className="text-[10px] text-gray-500">Full Access</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('staff')}
                className="p-2.5 rounded-lg border border-gray-200 hover:border-[#7A4C72] hover:bg-[#F6EDF3] text-left transition-colors"
              >
                <Briefcase className="w-4 h-4 text-[#7A4C72] mb-1" />
                <div className="text-xs font-bold text-gray-900">Staff</div>
                <div className="text-[10px] text-gray-500">Operations</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('customer')}
                className="p-2.5 rounded-lg border border-gray-200 hover:border-[#7A4C72] hover:bg-[#F6EDF3] text-left transition-colors"
              >
                <User className="w-4 h-4 text-[#7A4C72] mb-1" />
                <div className="text-xs font-bold text-gray-900">Customer</div>
                <div className="text-[10px] text-gray-500">Acme Tech</div>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-[#7A4C72] font-semibold hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="pt-8">
          <button
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to website</span>
          </button>
        </div>
      </div>

      {/* Right side: Decorative blob & brand message matching Image 1 */}
      <div className="hidden lg:flex w-1/2 bg-[#F6EDF3]/60 relative overflow-hidden items-center justify-center p-16">
        {/* Organic soft background blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EDE4EC] blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E5D7E3] blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/40 blur-3xl" />

        <div className="relative z-10 max-w-lg space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            One Platform <br />
            For All Your <br />
            Subscriptions.
          </h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-md">
            Manage products, customers, billing and payments with ease.
          </p>
        </div>
      </div>
    </div>
  );
};
