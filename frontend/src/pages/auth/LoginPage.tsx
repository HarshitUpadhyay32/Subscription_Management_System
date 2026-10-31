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
  const { loginAs, loginWithGoogle } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      onSuccessLogin('admin');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
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
            className="flex items-center gap-2 mb-10 text-left focus:outline-none cursor-pointer"
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
                className="text-[#7A4C72] hover:underline font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Login</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#F8F9FA] px-2 text-gray-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Login with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2.5 hover:border-gray-400 cursor-pointer disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          {/* Quick Demo 1-Click Role Switch per Flowchart */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              <span>Quick Demo Access</span>
              <span className="text-[#7A4C72] flex items-center gap-1 font-medium lowercase">
                <Sparkles className="w-3 h-3" /> 1-click
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="p-2.5 rounded-lg border border-gray-200 hover:border-[#7A4C72] hover:bg-[#F6EDF3] text-left transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#7A4C72] mb-1" />
                <div className="text-xs font-bold text-gray-900">Admin</div>
                <div className="text-[10px] text-gray-500">Full Access</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('staff')}
                className="p-2.5 rounded-lg border border-gray-200 hover:border-[#7A4C72] hover:bg-[#F6EDF3] text-left transition-colors cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-[#7A4C72] mb-1" />
                <div className="text-xs font-bold text-gray-900">Staff</div>
                <div className="text-[10px] text-gray-500">Operations</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('customer')}
                className="p-2.5 rounded-lg border border-gray-200 hover:border-[#7A4C72] hover:bg-[#F6EDF3] text-left transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-[#7A4C72] mb-1" />
                <div className="text-xs font-bold text-gray-900">Customer</div>
                <div className="text-[10px] text-gray-500">Acme Tech</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-[#7A4C72] font-semibold hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="pt-6">
          <button
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to website</span>
          </button>
        </div>
      </div>

      {/* Right side: Decorative blob & brand message matching Image 1 */}
      <div className="hidden lg:flex w-1/2 bg-[#F6EDF3]/60 relative overflow-hidden items-center justify-center p-16">
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
