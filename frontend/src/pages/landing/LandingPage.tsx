import React, { useState } from 'react';
import {
  Repeat,
  Receipt,
  Check,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface LandingPageProps {
  onNavigateAuth: (view: 'login' | 'register') => void;
  onEnterDashboard: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateAuth,
  onEnterDashboard,
}) => {
  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#34313A] flex flex-col antialiased">
      {/* Top Bar Navigation following Top Bar Contract: Brand title - Nav links - 1 Primary Action */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E9EBEF] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#714B67] text-white flex items-center justify-center font-bold text-sm shadow-[0_2px_8px_rgba(113,75,103,0.3)]">
              BL
            </div>
            <span className="text-xl font-bold tracking-tight text-[#29252A] font-serif whitespace-nowrap">
              Brightloop
            </span>
          </div>

          {/* Zone 2: 4-5 concise nav links */}
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-wider text-[#696A75]">
            <a href="#features" className="hover:text-[#714B67] transition-colors whitespace-nowrap">
              Platform
            </a>
            <a href="#workflow" className="hover:text-[#714B67] transition-colors whitespace-nowrap">
              Billing Lifecycle
            </a>
            <a href="#pricing" className="hover:text-[#714B67] transition-colors whitespace-nowrap">
              Pricing Plans
            </a>
            <a href="#roles" className="hover:text-[#714B67] transition-colors whitespace-nowrap">
              User Roles
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateAuth('login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#696A75] hover:text-[#714B67] transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterDashboard('admin')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors whitespace-nowrap"
            >
              Launch Live App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with soft Payno-inspired dashboard visual preview & Expressive background typography */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        {/* Expressive background typography poster element */}
        <div className="bg-decorative-watermark top-6 left-1/2 -translate-x-1/2 text-[110px] sm:text-[180px] lg:text-[240px] tracking-tighter opacity-25 whitespace-nowrap">
          RECURRING
        </div>

        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#EDE5F0]/60 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE5F0] text-[#714B67] text-[11px] font-semibold uppercase tracking-wider border border-[#DFCDE2]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Subscription Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#29252A] font-serif leading-[1.08] max-w-4xl mx-auto text-balance">
            Subscription Billing, Quotations & Collections Made Effortless
          </h1>

          <p className="text-sm sm:text-base text-[#696A75] max-w-2xl mx-auto leading-relaxed">
            Manage multi-tier recurring plans, automated GST tax invoicing, commercial quotations, and UPI autopay mandates with dedicated workspaces for Admins, Staff, and Subscribers.
          </p>

          {/* Role selector quick launch */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onEnterDashboard('admin')}
              className="px-5 py-3 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white shadow-[0_4px_16px_rgba(113,75,103,0.3)] flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore as Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEnterDashboard('staff')}
              className="px-4 py-3 text-xs font-semibold rounded-xl bg-white border border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#29252A] shadow-xs transition-colors"
            >
              <span>Explore as Staff</span>
            </button>
            <button
              onClick={() => onEnterDashboard('customer')}
              className="px-4 py-3 text-xs font-semibold rounded-xl bg-white border border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#714B67] shadow-xs transition-colors"
            >
              <span>Customer Portal (Rahul Sharma)</span>
            </button>
          </div>

          {/* Interactive Hero Visual */}
          <div className="mt-12 max-w-4xl mx-auto bg-white/95 rounded-3xl p-5 sm:p-7 border border-[#E9EBEF] shadow-[0_20px_50px_rgba(52,49,58,0.06)] backdrop-blur-md text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9EBEF] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#DC6464]" />
                <span className="w-3 h-3 rounded-full bg-[#E6A23C]" />
                <span className="w-3 h-3 rounded-full bg-[#28A879]" />
                <span className="font-semibold text-[#34313A] ml-2">Brightloop Console Live Preview</span>
              </div>
              <span className="font-mono text-[11px] text-[#28A879] bg-[#EBF7F2] px-2 py-0.5 rounded-md font-medium">
                ● Recurring Engine Active
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E9EBEF]">
                <span className="text-[11px] text-[#92939D]">Monthly Recurring Revenue</span>
                <div className="text-2xl font-bold font-mono text-[#34313A] mt-1">₹12,85,000</div>
                <div className="text-[11px] text-[#28A879] mt-1 font-medium">+14.2% monthly velocity</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E9EBEF]">
                <span className="text-[11px] text-[#92939D]">Active Subscribers</span>
                <div className="text-2xl font-bold font-mono text-[#714B67] mt-1">482 Live</div>
                <div className="text-[11px] text-[#92939D] mt-1">Rahul Sharma & 481 others</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E9EBEF]">
                <span className="text-[11px] text-[#92939D]">Automated GST Collections</span>
                <div className="text-2xl font-bold font-mono text-[#34313A] mt-1">₹56,75,120</div>
                <div className="text-[11px] text-[#28A879] mt-1">UPI Autopay & Cards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Business Workflow Strip */}
      <section id="workflow" className="py-16 px-6 bg-white border-y border-[#E9EBEF]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold text-[#714B67] uppercase tracking-wider">
              End-to-End SaaS Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#34313A] font-heading mt-1">
              From Product Catalog to Payment Realization
            </h2>
            <p className="text-xs text-[#696A75] mt-2">
              Every stage of customer lifecycle connected in a frictionless pipeline.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            {[
              { step: '01', title: 'Product Setup', desc: 'Define products & codes' },
              { step: '02', title: 'Plan Builder', desc: 'Monthly/Quarterly/Annual' },
              { step: '03', title: 'Smart Quote', desc: 'Draft custom pricing' },
              { step: '04', title: 'Quote Approval', desc: 'Client confirmation' },
              { step: '05', title: 'Subscription', desc: 'Instant activation' },
              { step: '06', title: 'GST Invoice', desc: 'Recurring dispatcher' },
              { step: '07', title: 'UPI Clearance', desc: 'Real-time ledger' },
            ].map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#F8F9FB] border border-[#E9EBEF] hover:border-[#714B67] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EDE5F0] text-[#714B67] flex items-center justify-center font-mono font-bold text-xs mx-auto mb-2">
                  {st.step}
                </div>
                <div className="font-semibold text-xs text-[#34313A]">{st.title}</div>
                <div className="text-[10px] text-[#92939D] mt-0.5">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold text-[#714B67] uppercase tracking-wider">
              Built for Scale
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#34313A] font-heading mt-1">
              Everything Your SaaS Needs to Bill & Retain
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE5F0] text-[#714B67] flex items-center justify-center">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#34313A]">Automated Recurring Engine</h3>
              <p className="text-xs text-[#696A75] leading-relaxed">
                Supports monthly, quarterly, and annual billing cycles with automatic grace period tracking, renewal warnings, and failed payment retry mechanisms.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE5F0] text-[#714B67] flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#34313A]">Commercial Quotations</h3>
              <p className="text-xs text-[#696A75] leading-relaxed">
                Draft customized enterprise proposals with multi-item quantities, negotiated discounts, and instant 1-click conversion to live subscriptions.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE5F0] text-[#714B67] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#34313A]">Indian GST & UPI Autopay</h3>
              <p className="text-xs text-[#696A75] leading-relaxed">
                Pre-configured for 18% IGST and CGST/SGST splitting, GSTIN validation, and seamless mock UPI autopay debit mandates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Experience section */}
      <section id="roles" className="py-16 px-6 bg-white border-t border-[#E9EBEF]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold text-[#714B67] uppercase tracking-wider">
              Three Distinct Workspaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#34313A] font-heading mt-1">
              Tailored for Every Stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8F9FB] border border-[#E9EBEF] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#714B67] uppercase tracking-wider">
                  Role: Administrator
                </span>
                <h3 className="text-base font-bold text-[#34313A] mt-1">Executive Governance</h3>
                <p className="text-xs text-[#696A75] mt-2 mb-4">
                  Full system control: Products, Pricing Plans, Analytics, Financial Reports, Staff Management, and GST Configurations.
                </p>
                <div className="space-y-1.5 text-xs text-[#34313A]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>ARR & MRR Growth Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Staff Role Provisioning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Tax & Discount Architecture</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onEnterDashboard('admin')}
                className="mt-6 w-full py-2 text-xs font-semibold rounded-xl bg-[#714B67] text-white hover:bg-[#603D56] transition-colors"
              >
                Launch Admin View
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F9FB] border border-[#E9EBEF] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#714B67] uppercase tracking-wider">
                  Role: Staff
                </span>
                <h3 className="text-base font-bold text-[#34313A] mt-1">Operations & Support</h3>
                <p className="text-xs text-[#696A75] mt-2 mb-4">
                  Operational execution: Customer management, Subscriptions renewals, Quotations generation, and Invoicing.
                </p>
                <div className="space-y-1.5 text-xs text-[#34313A]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Customer 360 Records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Quotation-to-Subscription Workflow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Offline Payment Clearance</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onEnterDashboard('staff')}
                className="mt-6 w-full py-2 text-xs font-semibold rounded-xl border border-[#E9EBEF] bg-white text-[#34313A] hover:bg-[#F3F5F8] transition-colors"
              >
                Launch Staff View
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F9FB] border border-[#E9EBEF] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#714B67] uppercase tracking-wider">
                  Role: Customer
                </span>
                <h3 className="text-base font-bold text-[#34313A] mt-1">Self-Service Portal</h3>
                <p className="text-xs text-[#696A75] mt-2 mb-4">
                  Isolated client experience: View active plans, download invoices, request tier changes, and manage billing address.
                </p>
                <div className="space-y-1.5 text-xs text-[#34313A]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Instant UPI / Card Pay Now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Printable GST Tax Invoices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Self-Service Tier Upgrade Requests</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onEnterDashboard('customer')}
                className="mt-6 w-full py-2 text-xs font-semibold rounded-xl bg-[#EDE5F0] text-[#714B67] hover:bg-[#DFCDE2] transition-colors"
              >
                Launch Customer Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section id="pricing" className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold text-[#714B67] uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#34313A] font-heading mt-1">
              Sample Plans in Indian Rupees (₹)
            </h2>
            <p className="text-xs text-[#696A75] mt-2">
              Every plan includes automated recurring billing, GST compliance, and quotation builder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#34313A]">Starter Plan</h3>
                <p className="text-xs text-[#92939D] mt-0.5">For emerging startups</p>
                <div className="my-4">
                  <span className="text-3xl font-bold font-mono text-[#34313A]">₹799</span>
                  <span className="text-xs text-[#92939D]"> /month</span>
                </div>
                <div className="space-y-2 text-xs text-[#696A75] pt-3 border-t border-[#E9EBEF]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Up to 3 team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>1,000 Contacts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>GST Invoices</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onEnterDashboard('customer')}
                className="mt-6 w-full py-2 text-xs font-semibold rounded-xl border border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#34313A] transition-colors"
              >
                Get Started
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-[#714B67] shadow-[0_8px_30px_rgba(113,75,103,0.12)] flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-[#714B67] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                RECOMMENDED
              </div>
              <div>
                <h3 className="font-bold text-base text-[#34313A]">Professional</h3>
                <p className="text-xs text-[#714B67] mt-0.5">Used by Rahul Sharma (Sharma Logistics)</p>
                <div className="my-4">
                  <span className="text-3xl font-bold font-mono text-[#34313A]">₹1,499</span>
                  <span className="text-xs text-[#92939D]"> /month</span>
                </div>
                <div className="space-y-2 text-xs text-[#696A75] pt-3 border-t border-[#E9EBEF]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Up to 15 team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>25,000 Contacts & Automated Pipelines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>WhatsApp Connector + UPI Autopay</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onEnterDashboard('customer')}
                className="mt-6 w-full py-2 text-xs font-semibold rounded-xl bg-[#714B67] text-white hover:bg-[#603D56] transition-colors shadow-xs"
              >
                Start Free Trial
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#34313A]">Scale Enterprise</h3>
                <p className="text-xs text-[#92939D] mt-0.5">Multi-entity organizations</p>
                <div className="my-4">
                  <span className="text-3xl font-bold font-mono text-[#34313A]">₹9,999</span>
                  <span className="text-xs text-[#92939D]"> /quarter</span>
                </div>
                <div className="space-y-2 text-xs text-[#696A75] pt-3 border-t border-[#E9EBEF]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Unlimited multi-warehouse entities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Dedicated Account Manager & SLA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#28A879]" />
                    <span>Custom ERP Integrations</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onEnterDashboard('admin')}
                className="mt-6 w-full py-2 text-xs font-semibold rounded-xl border border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#34313A] transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-[#E9EBEF] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#92939D]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#714B67] text-white flex items-center justify-center font-bold text-xs">
              BL
            </div>
            <span className="font-semibold text-[#34313A]">Brightloop Technologies Pvt Ltd</span>
          </div>
          <div>
            <span>© 2026 Brightloop. All rights reserved. GST Registered.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onEnterDashboard('admin')}
              className="text-[#714B67] hover:underline font-medium"
            >
              Demo Console
            </button>
            <button onClick={() => onNavigateAuth('login')} className="hover:text-[#34313A]">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
