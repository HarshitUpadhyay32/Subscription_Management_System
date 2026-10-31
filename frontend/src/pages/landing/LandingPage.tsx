import React, { useState } from 'react';
import {
  Play,
  ArrowRight,
  Shield,
  Briefcase,
  User,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  CreditCard,
  Users,
  Package,
  Layers,
  FileText,
  Percent,
  Check,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onNavigateAuth: (view: 'login' | 'register') => void;
  onEnterDashboard: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateAuth,
  onEnterDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex flex-col font-sans selection:bg-[#F6EDF3] selection:text-[#7A4C72] scroll-smooth">
      {/* Top Navbar matching Image 1 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">
              Brightloop
            </span>
          </button>

          {/* Nav links - Interactive & Functional */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button
              onClick={() => scrollToSection('product')}
              className="hover:text-[#7A4C72] transition-colors focus:outline-none"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#7A4C72] transition-colors focus:outline-none"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#7A4C72] transition-colors focus:outline-none"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#7A4C72] transition-colors focus:outline-none"
            >
              About
            </button>
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigateAuth('login')}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => onNavigateAuth('register')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white transition-all shadow-sm"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-100 mt-3 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium text-gray-700 px-2">
              <button
                onClick={() => scrollToSection('product')}
                className="py-1.5 text-left hover:text-[#7A4C72]"
              >
                Product
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="py-1.5 text-left hover:text-[#7A4C72]"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="py-1.5 text-left hover:text-[#7A4C72]"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="py-1.5 text-left hover:text-[#7A4C72]"
              >
                About
              </button>
            </div>
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => onNavigateAuth('login')}
                className="flex-1 py-2 text-xs font-semibold text-center border border-gray-200 rounded-lg text-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => onNavigateAuth('register')}
                className="flex-1 py-2 text-xs font-semibold text-center rounded-lg bg-[#7A4C72] text-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 lg:pt-16 pb-20 px-6 lg:px-12 overflow-hidden flex flex-col justify-center border-b border-gray-200">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EDF3] text-[#7A4C72] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subscription Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.12]">
              Manage Your Subscriptions. <br />
              <span className="text-gray-900">Grow Your Business.</span>
            </h1>

            <p className="text-base text-gray-600 max-w-xl leading-relaxed">
              All your products, customers, subscriptions, invoices and payments in one powerful platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateAuth('login')}
                className="px-6 py-3 text-sm font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white shadow-sm transition-all"
              >
                Get Started
              </button>
              <button
                onClick={() => onEnterDashboard('admin')}
                className="px-5 py-3 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current text-gray-500" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="pt-8 border-t border-gray-200 grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">500+</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Businesses</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">99%</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Uptime</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Support</div>
              </div>
            </div>

            {/* Quick Flow Direct Roles per Image 2 */}
            <div className="pt-4 bg-white/70 p-4 rounded-xl border border-gray-200 shadow-xs">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Launch Workspace by Role (Flowchart Demo):
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onEnterDashboard('admin')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-[#F6EDF3] hover:text-[#7A4C72] text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#7A4C72]" />
                  Admin
                </button>
                <button
                  onClick={() => onEnterDashboard('staff')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-[#F6EDF3] hover:text-[#7A4C72] text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#7A4C72]" />
                  Staff
                </button>
                <button
                  onClick={() => onEnterDashboard('customer')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-[#F6EDF3] hover:text-[#7A4C72] text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#7A4C72]" />
                  Customer
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard Mockup Card matching Image 1 */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden p-4 sm:p-6 transition-all hover:shadow-3xl">
              {/* Mini Mockup Top Navbar */}
              <div className="bg-[#7A4C72] text-white px-4 py-2.5 rounded-lg flex items-center justify-between text-xs mb-4">
                <span className="font-bold tracking-tight">Brightloop</span>
                <div className="w-36 h-5 bg-white/20 rounded-md" />
                <div className="w-5 h-5 rounded-full bg-white/30" />
              </div>

              {/* Mini Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-[10px] text-gray-500 font-medium">Total Revenue</div>
                  <div className="text-base font-bold text-gray-900 mt-0.5">₹12,48,500</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-1">↑ 12.5% from last month</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-[10px] text-gray-500 font-medium">Active Subscriptions</div>
                  <div className="text-base font-bold text-gray-900 mt-0.5">248</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-1">↑ 8.2% from last month</div>
                </div>
              </div>

              {/* Mini Bar Chart Mockup */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                <div className="text-[11px] font-semibold text-gray-700 mb-2">Revenue Overview</div>
                <div className="h-24 flex items-end justify-between gap-1.5 pt-2">
                  {[40, 55, 35, 70, 60, 85, 75, 90, 65, 80, 95, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full rounded-t bg-[#7A4C72]"
                        style={{ height: `${h * 0.8}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Table preview */}
              <div className="border border-gray-100 rounded-lg overflow-hidden text-[11px]">
                <div className="bg-gray-100/70 px-3 py-1.5 font-semibold text-gray-600 flex justify-between">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-3 py-1.5 flex justify-between items-center bg-white">
                    <span className="font-medium text-gray-800">Brightloop CRM</span>
                    <span className="text-gray-600">₹999.00</span>
                    <span className="px-1.5 py-0.5 bg-[#EAF8F0] text-[#1E834D] rounded text-[10px]">Active</span>
                  </div>
                  <div className="px-3 py-1.5 flex justify-between items-center bg-white">
                    <span className="font-medium text-gray-800">Brightloop Analytics</span>
                    <span className="text-gray-600">₹1,199.00</span>
                    <span className="px-1.5 py-0.5 bg-[#EAF8F0] text-[#1E834D] rounded text-[10px]">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section matching "#product" navbar button */}
      <section id="product" className="py-20 px-6 lg:px-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A4C72] bg-[#F6EDF3] px-3 py-1 rounded-full">
              Product Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Complete Modular SaaS Products
            </h2>
            <p className="text-sm text-gray-500">
              Each product operates seamlessly standalone or connected as an integrated recurring billing ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Brightloop CRM',
                category: 'Sales & Customer Relations',
                price: '₹999/mo',
                desc: 'Complete customer relationship management solution with pipeline management, lead scoring, and automated deal stages.',
                features: ['Unlimited Contacts', 'Visual Pipelines', 'Email & SMS Sync', 'Activity Reminders'],
              },
              {
                name: 'Brightloop Analytics',
                category: 'Business Intelligence',
                price: '₹1,199/mo',
                desc: 'Executive cohorts, MRR breakdown, churn predictions, and customizable dashboards with automated PDF export.',
                features: ['Cohort Retention', 'SQL Query Editor', 'Export to Excel/PDF', 'Real-time Webhooks'],
              },
              {
                name: 'Brightloop HR',
                category: 'Human Resources',
                price: '₹1,499/mo',
                desc: 'Employee directory, self-service leave requests, statutory payroll calculations, and attendance tracking.',
                features: ['Up to 50 employees', 'Leave approvals', 'Payslip Generator', 'Tax Deductions'],
              },
              {
                name: 'Brightloop Finance',
                category: 'Finance & Invoicing',
                price: '₹1,799/mo',
                desc: 'Automated GST-compliant e-invoicing, multi-currency ledger reconciliation, and bank feeds.',
                features: ['GST e-Invoicing', 'Expense Auditing', 'Multi-currency', 'Ledger Sync'],
              },
              {
                name: 'Brightloop Project',
                category: 'Productivity',
                price: '₹899/mo',
                desc: 'Agile sprints, Kanban task boards, milestone dependencies, and team timesheet approvals.',
                features: ['Kanban & Gantt', 'Time Tracking', 'Sprint Burndown', 'File Attachments'],
              },
              {
                name: 'Brightloop Billing Gateway',
                category: 'Payments & Mandates',
                price: 'Included',
                desc: 'Native UPI Autopay, Razorpay, Stripe, and credit card recurring mandate settlement.',
                features: ['Zero-failure retries', 'Dunning Emails', 'UPI 2.0 Mandate', 'Instant Webhooks'],
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-gray-200 bg-[#F8F9FA] hover:border-[#7A4C72] hover:bg-white hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{p.category}</span>
                    <span className="text-sm font-bold text-[#7A4C72]">{p.price}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{p.desc}</p>
                  <ul className="text-xs text-gray-500 space-y-1.5 mt-4 pt-4 border-t border-gray-200">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => onEnterDashboard('admin')}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-[#F6EDF3] hover:text-[#7A4C72] hover:border-[#7A4C72] transition-colors"
                >
                  Explore Product
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section matching "#features" navbar button */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A4C72] bg-[#F6EDF3] px-3 py-1 rounded-full">
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Designed For High-Velocity Subscription Operations
            </h2>
            <p className="text-sm text-gray-500">
              Built specifically to handle the full subscription lifecycle: quotes, orders, recurring invoices, and collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layers,
                title: 'Multi-Tier Plan Builder',
                desc: 'Create monthly, quarterly, and annual billing tiers with flexible feature flags and promo codes.',
              },
              {
                icon: FileText,
                title: 'GST-Compliant Invoicing',
                desc: 'Generate Indian GST invoices with HSN/SAC codes, reverse charge flags, and auto tax rate calculation.',
              },
              {
                icon: CreditCard,
                title: 'UPI & Card Autopay',
                desc: 'One-click subscription mandate authorization with automated retries and dunning notifications.',
              },
              {
                icon: Users,
                title: 'Role-Based Workspaces',
                desc: 'Dedicated portals for Admin management, Staff operations, and Customer self-service subscription portals.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F6EDF3] text-[#7A4C72] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section matching "#pricing" navbar button */}
      <section id="pricing" className="py-20 px-6 lg:px-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A4C72] bg-[#F6EDF3] px-3 py-1 rounded-full">
              Simple Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Flexible Plans That Grow With You
            </h2>
            <p className="text-sm text-gray-500">
              Transparent subscriptions with no hidden charges. Cancel or switch plans at any time.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-12 h-6 rounded-full bg-[#7A4C72] p-1 flex items-center transition-all cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
                  Yearly
                </span>
                <span className="text-[10px] font-bold bg-[#EAF8F0] text-[#1E834D] px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: billingCycle === 'monthly' ? '₹999' : '₹799',
                period: '/month',
                desc: 'Perfect for small teams launching their first recurring software service.',
                features: ['Up to 100 subscribers', '1 Product license', 'Automated GST Invoicing', 'Email notifications', 'Standard Support'],
                popular: false,
              },
              {
                name: 'Professional',
                price: billingCycle === 'monthly' ? '₹2,499' : '₹1,999',
                period: '/month',
                desc: 'Recommended for growing SaaS companies with multi-tier recurring subscriptions.',
                features: ['Up to 2,500 subscribers', 'All 5 Product licenses', 'UPI Autopay & Cards', 'Staff Role Management', 'Custom Promo Codes', 'Priority 24/7 Support'],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: billingCycle === 'monthly' ? '₹5,999' : '₹4,799',
                period: '/month',
                desc: 'For high-scale organizations requiring custom pipelines and dedicated SLAs.',
                features: ['Unlimited subscribers', 'Custom Webhooks & API', 'Multi-tenant database', 'Dedicated Account Manager', '99.99% SLA Guarantee', 'Custom Contract Terms'],
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
                  plan.popular
                    ? 'border-[#7A4C72] shadow-xl ring-2 ring-[#7A4C72]/20 relative'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#7A4C72] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mt-3">
                    {plan.price}{' '}
                    <span className="text-xs font-normal text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{plan.desc}</p>
                  <ul className="text-xs text-gray-600 space-y-2 mt-6 pt-6 border-t border-gray-100">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => onNavigateAuth('register')}
                  className={`w-full py-2.5 mt-8 text-xs font-semibold rounded-lg transition-all ${
                    plan.popular
                      ? 'bg-[#7A4C72] hover:bg-[#683B60] text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section matching "#about" navbar button */}
      <section id="about" className="py-20 px-6 lg:px-12 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A4C72] bg-[#F6EDF3] px-3 py-1 rounded-full">
            About Brightloop
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Engineered For Seamless Subscription Growth
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Brightloop is an enterprise-grade subscription management and recurring billing platform built for modern businesses. We automate billing operations, customer relationships, commercial quotes, and compliance so you can focus entirely on scaling your core product.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="p-5 bg-white rounded-xl border border-gray-200 text-left">
              <div className="text-lg font-bold text-gray-900">Bank-Grade Security</div>
              <div className="text-xs text-gray-500 mt-1">PCI-DSS compliant data tokenization and end-to-end encrypted payment mandates.</div>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200 text-left">
              <div className="text-lg font-bold text-gray-900">GST Compliance</div>
              <div className="text-xs text-gray-500 mt-1">Automatic CGST, SGST, IGST calculations and statutory invoice reconciliation.</div>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200 text-left">
              <div className="text-lg font-bold text-gray-900">99.99% Reliability</div>
              <div className="text-xs text-gray-500 mt-1">High-availability cloud architecture with zero billing downtime guarantee.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>© 2026 Brightloop Software Technologies. All rights reserved.</div>
          <div className="flex gap-6">
            <button onClick={() => scrollToSection('product')} className="hover:text-gray-900">Product</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-gray-900">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-gray-900">Pricing</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-gray-900">About</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
