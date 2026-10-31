import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  Plus,
  Repeat,
  Send,
  ChevronRight,
  Eye,
  CreditCard,
  Users,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { PayInvoiceModal } from '../../components/ui/PayInvoiceModal';

interface AdminOverviewProps {
  onNavigate: (path: string) => void;
  searchQuery?: string;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate, searchQuery = '' }) => {
  const { subscriptions, customers, invoices, payments } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');

  // Compute metrics
  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const mrr = activeSubs.reduce((acc, s) => {
    if (s.billingCycle === 'monthly') return acc + s.amount;
    if (s.billingCycle === 'quarterly') return acc + Math.round(s.amount / 3);
    if (s.billingCycle === 'yearly') return acc + Math.round(s.amount / 12);
    return acc + s.amount;
  }, 0);

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const pendingInvoices = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue');
  const pendingAmount = pendingInvoices.reduce((acc, i) => acc + i.total, 0);

  // Filtered recent transactions
  const recentPayments = payments
    .filter((p) =>
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  // Upcoming renewals
  const upcomingRenewals = subscriptions
    .filter((s) => s.status === 'active')
    .slice(0, 4);

  // Mock bar chart heights for Earning Activity
  const weeklyData = [
    { day: 'M', height: '45%', value: '₹14.2K' },
    { day: 'T', height: '65%', value: '₹22.5K' },
    { day: 'W', height: '90%', value: '₹34.8K', highlight: true },
    { day: 'T', height: '55%', value: '₹18.9K' },
    { day: 'F', height: '75%', value: '₹28.4K' },
    { day: 'S', height: '35%', value: '₹11.2K' },
    { day: 'S', height: '20%', value: '₹6.5K' },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Top Banner / Welcome with quick actions & subtle editorial watermark */}
      <div className="relative overflow-hidden bg-white/60 p-6 rounded-2xl border border-[#E9EBEF] backdrop-blur-xs">
        <div className="bg-decorative-watermark -top-2 right-4 text-7xl font-serif opacity-20 pointer-events-none select-none hidden sm:block">
          OVERVIEW
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="sub-caps text-[#714B67] mb-1">Brightloop Operations</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#29252A] font-serif">
              Executive Subscription Overview
            </h1>
            <p className="text-xs text-[#92939D] mt-1">
              Real-time recurring billing velocity, customer retention, and collections.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('subscriptions')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Subscription</span>
            </button>
            <button
              onClick={() => onNavigate('quotations')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E9EBEF] bg-white hover:bg-[#F3F5F8] text-[#29252A] flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#714B67]" />
              <span>Create Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid with compact uppercase labels */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="TOTAL REVENUE"
          value={`₹${(totalRevenue / 1000).toFixed(1)}K`}
          trend={{ value: '+14.2%', isPositive: true, label: 'vs last mo' }}
          accent="purple"
        />
        <StatCard
          title="MONTHLY MRR"
          value={`₹${(mrr / 1000).toFixed(1)}K`}
          trend={{ value: '+8.6%', isPositive: true, label: 'run-rate' }}
        />
        <StatCard
          title="ACTIVE SUBS"
          value={activeSubs.length}
          subtitle="482 live in system"
          accent="blue"
        />
        <StatCard
          title="TOTAL CUSTOMERS"
          value={customers.length}
          subtitle="1,240 corporate"
        />
        <StatCard
          title="PENDING INVOICES"
          value={pendingInvoices.length}
          subtitle={`₹${(pendingAmount / 1000).toFixed(1)}K due`}
          trend={{ value: '3 Overdue', isPositive: false }}
        />
        <StatCard
          title="CHURN RATE"
          value="1.8%"
          trend={{ value: '-0.3%', isPositive: true, label: 'industry low' }}
        />
      </div>

      {/* 3-column primary dashboard canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Big Available Balance / Revenue Card + Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden">
            {/* Subtle soft lavender ambient gradient */}
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#EDE5F0]/60 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-[#92939D] mb-2">
              <span>Gross Collections (MTD)</span>
              <span className="font-mono text-[11px] bg-[#EDE5F0] text-[#714B67] px-2 py-0.5 rounded-md font-medium">
                FY 2026-Q1
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-[#34313A] tracking-tight tabular-nums">
              ₹56,75,120
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#28A879]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-medium">+18.4% growth</span>
              <span className="text-[#92939D]">from automated renewals</span>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E9EBEF]">
              <div className="text-xs font-semibold text-[#34313A] mb-3">Quick Operations</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <button
                  onClick={() => onNavigate('subscriptions')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#F3F5F8] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#EDE5F0] text-[#714B67] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Repeat className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#696A75]">Subscribe</span>
                </button>
                <button
                  onClick={() => onNavigate('quotations')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#F3F5F8] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F3F5F8] text-[#34313A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#696A75]">Quotation</span>
                </button>
                <button
                  onClick={() => onNavigate('invoices')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#F3F5F8] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F3F5F8] text-[#34313A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#696A75]">Invoice</span>
                </button>
                <button
                  onClick={() => onNavigate('customers')}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#F3F5F8] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F3F5F8] text-[#34313A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#696A75]">Client</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Status breakdown card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#34313A]">Subscription Status</span>
              <button
                onClick={() => onNavigate('subscriptions')}
                className="text-[11px] text-[#714B67] hover:underline font-medium"
              >
                View all
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#696A75] mb-1">
                  <span>Active & Renewing</span>
                  <span className="font-mono font-medium text-[#34313A]">482 (88%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F3F5F8] overflow-hidden">
                  <div className="h-full rounded-full bg-[#28A879]" style={{ width: '88%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[#696A75] mb-1">
                  <span>Pending Setup</span>
                  <span className="font-mono font-medium text-[#34313A]">36 (7%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F3F5F8] overflow-hidden">
                  <div className="h-full rounded-full bg-[#E6A23C]" style={{ width: '7%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[#696A75] mb-1">
                  <span>Cancelled / Churned</span>
                  <span className="font-mono font-medium text-[#34313A]">12 (2.2%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F3F5F8] overflow-hidden">
                  <div className="h-full rounded-full bg-[#DC6464]" style={{ width: '2.2%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Earning Activity Chart + Upcoming Renewals (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-[#92939D]">Earning Activity</div>
                <div className="text-xl font-bold font-mono text-[#34313A] tabular-nums">
                  ₹73,420
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#F3F5F8] p-1 rounded-xl text-xs">
                <button
                  onClick={() => setChartPeriod('weekly')}
                  className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] font-medium ${
                    chartPeriod === 'weekly'
                      ? 'bg-white text-[#34313A] shadow-xs'
                      : 'text-[#92939D] hover:text-[#34313A]'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setChartPeriod('monthly')}
                  className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] font-medium ${
                    chartPeriod === 'monthly'
                      ? 'bg-white text-[#34313A] shadow-xs'
                      : 'text-[#92939D] hover:text-[#34313A]'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Visual Bar Graph */}
            <div className="pt-6 pb-2">
              <div className="flex items-end justify-between gap-2 h-36 px-2">
                {weeklyData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-[#92939D] opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}
                    </span>
                    <div className="w-full max-w-[28px] bg-[#F3F5F8] rounded-xl flex items-end overflow-hidden h-28">
                      <div
                        style={{ height: item.height }}
                        className={`w-full rounded-xl transition-all duration-300 ${
                          item.highlight
                            ? 'bg-[#714B67]'
                            : 'bg-[#EDE5F0] group-hover:bg-[#714B67]/70'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#696A75]">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Renewals Box */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#34313A]">Upcoming Renewals</span>
              <button
                onClick={() => onNavigate('subscriptions')}
                className="text-[11px] text-[#714B67] hover:underline font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {upcomingRenewals.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FB] border border-transparent hover:border-[#E9EBEF] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#EDE5F0] text-[#714B67] flex items-center justify-center shrink-0">
                      <Repeat className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#34313A] truncate">
                        {sub.customerName}
                      </div>
                      <div className="text-[11px] text-[#92939D] truncate">
                        {sub.productName} · {sub.planName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-semibold text-[#34313A] tabular-nums">
                      ₹{sub.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#92939D]">Due {sub.renewalDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Transactions & Corporate Plan Card (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Subscription Proposal Card */}
          <div className="bg-gradient-to-br from-[#714B67] to-[#4A2D43] text-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(113,75,103,0.25)] relative overflow-hidden">
            <div className="flex items-center justify-between text-xs opacity-80 mb-4">
              <span>Brightloop Billing Card</span>
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold tracking-tight mb-1">
              Automated Gateway
            </div>
            <div className="font-mono text-xs tracking-wider opacity-75">
              •••• •••• •••• 9284
            </div>
            <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] opacity-70">Settlement Account</div>
                <div className="font-medium">HDFC Bank Escrow</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] opacity-70">Status</div>
                <div className="font-medium text-[#28A879] bg-white/10 px-2 py-0.5 rounded text-[10px]">
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* Recent Collections Feed */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#34313A]">Recent Collections</span>
              <button
                onClick={() => onNavigate('invoices')}
                className="text-[11px] text-[#714B67] hover:underline font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentPayments.map((pay) => (
                <div
                  key={pay.id}
                  className="flex items-center justify-between text-xs hover:bg-[#F8F9FB] p-1.5 rounded-lg transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-[#34313A] truncate">{pay.customerName}</div>
                    <div className="text-[10px] text-[#92939D] flex items-center gap-1.5">
                      <span>{pay.paymentMethod}</span>
                      <span>·</span>
                      <span>{pay.paymentDate.split(' ')[0]}</span>
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-[#28A879] tabular-nums shrink-0">
                    +₹{pay.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Pending Attention Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#34313A]">Invoices Pending Payment</h3>
            <p className="text-xs text-[#92939D]">Awaiting customer settlement or automated bank sweep.</p>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs text-[#714B67] hover:underline font-medium flex items-center gap-1"
          >
            <span>Manage All Invoices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-y border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Invoice #</th>
                <th className="py-2.5 px-4 font-medium">Customer</th>
                <th className="py-2.5 px-4 font-medium">Due Date</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                <th className="py-2.5 px-4 font-medium text-center">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {pendingInvoices.slice(0, 4).map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FDFDFE]">
                  <td className="py-3 px-4 font-mono font-medium text-[#34313A]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#34313A]">{inv.customerName}</div>
                    <div className="text-[11px] text-[#92939D]">{inv.customerCompany}</div>
                  </td>
                  <td className="py-3 px-4 text-[#696A75]">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#34313A] tabular-nums">
                    ₹{inv.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={inv.status}>{inv.status.toUpperCase()}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8] transition-colors"
                        title="View Tax Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPayingInvoice(inv)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#714B67] hover:bg-[#603D56] text-white transition-colors"
                      >
                        Settle
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals for invoice preview & payment */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPayNow={(inv) => setPayingInvoice(inv)}
      />
      <PayInvoiceModal
        invoice={payingInvoice}
        isOpen={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
      />
    </div>
  );
};
