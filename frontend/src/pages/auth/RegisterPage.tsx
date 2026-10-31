import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface RegisterPageProps {
  onNavigateLanding: () => void;
  onNavigateLogin: () => void;
  onSuccessRegister: (role: UserRole) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateLanding,
  onNavigateLogin,
  onSuccessRegister,
}) => {
  const { registerAccount } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      registerAccount(name, email, company);
      onSuccessRegister('admin');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row font-sans selection:bg-[#F6EDF3] selection:text-[#7A4C72]">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto lg:mx-0">
        <div>
          <button
            onClick={onNavigateLanding}
            className="flex items-center gap-2 mb-10 text-left focus:outline-none"
          >
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Brightloop
            </span>
          </button>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500">
              Start your 14-day free trial on Brightloop
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Vance"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@company.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Innovations"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Sign Up</span>
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <button
              onClick={onNavigateLogin}
              className="text-[#7A4C72] font-semibold hover:underline"
            >
              Log in
            </button>
          </div>
        </div>

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

      {/* Right side: Decorative background */}
      <div className="hidden lg:flex w-1/2 bg-[#F6EDF3]/60 relative overflow-hidden items-center justify-center p-16">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EDE4EC] blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E5D7E3] blur-2xl" />
        <div className="relative z-10 max-w-lg space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Start Scaling <br />
            Your Recurring <br />
            Revenue Today.
          </h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-md">
            Automate invoicing, recurring payments, and subscriber management.
          </p>
        </div>
      </div>
    </div>
  );
};
