import React, { useState } from 'react';
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    registerAccount(name, email, company);
    onSuccessRegister('customer');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F6] flex flex-col justify-center items-center p-4 antialiased text-[#29252A] relative overflow-hidden">
      <div className="bg-decorative-watermark top-8 left-1/2 -translate-x-1/2 text-[140px] font-serif opacity-15 pointer-events-none select-none">
        SIGNUP
      </div>
      <div className="absolute w-[500px] h-[300px] bg-[#EDE5F0]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md relative z-10">
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
          <h1 className="text-2xl font-bold text-[#29252A] font-serif">Create your Customer Account</h1>
          <p className="text-xs text-[#92939D] mt-1">
            Public registration enrolls you into the Customer Portal.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EBEF] shadow-[0_12px_40px_rgba(52,49,58,0.06)]">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-[#FDF2F2] border border-[#F9D6D6] text-xs text-[#DC6464]">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Company / Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Sharma Logistics Solutions"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@sharmalogistics.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#34313A] mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#34313A] mb-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92939D]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white shadow-[0_2px_8px_rgba(113,75,103,0.25)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#92939D]">
            Already have an account?{' '}
            <button onClick={onNavigateLogin} className="text-[#714B67] font-semibold hover:underline">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
