import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateLogin,
  onNavigateLanding,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col justify-center items-center p-4 antialiased text-[#34313A]">
      <div className="absolute w-[500px] h-[300px] bg-[#EDE5F0]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <button
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-2 mb-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#714B67] text-white flex items-center justify-center font-bold text-base shadow-[0_2px_8px_rgba(113,75,103,0.3)]">
              BL
            </div>
            <span className="text-xl font-bold tracking-tight text-[#34313A] font-heading">
              Brightloop
            </span>
          </button>
          <h1 className="text-lg font-bold text-[#34313A]">Reset Password</h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Enter your work email address to receive recovery instructions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EBEF] shadow-[0_12px_40px_rgba(52,49,58,0.06)]">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF7F2] text-[#28A879] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-base text-[#34313A]">Recovery link dispatched</h2>
              <p className="text-xs text-[#696A75] leading-relaxed">
                If an account exists for <span className="font-medium text-[#34313A]">{email}</span>, you will receive password reset instructions within 2 minutes.
              </p>
              <button
                onClick={onNavigateLogin}
                className="w-full mt-4 py-2.5 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white transition-colors"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#34313A] mb-1">Work Email</label>
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
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors"
              >
                Send Recovery Instructions
              </button>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[#696A75] hover:text-[#34313A] pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
