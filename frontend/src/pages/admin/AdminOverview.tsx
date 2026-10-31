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
  ChevronDown,
  Calendar,
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
  const [timeFilter, setTimeFilter] = useState<'30days' | '90days' | 'year'>('30days');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'Monthly' | 'Quarterly'>('Monthly');

  // Filtered recent transactions
  const filteredInvoices = invoices
    .filter((inv) =>
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const monthlyBars = [
    { month: 'Jan', val: 32 },
    { month: 'Feb', val: 45 },
    { month: 'Mar', val: 28 },
    { month: 'Apr', val: 62 },
    { month: 'May', val: 54 },
    { month: 'Jun', val: 78 },
    { month: 'Jul', val: 70 },
    { month: 'Aug', val: 88 },
    { month: 'Sep', val: 65 },
    { month: 'Oct', val: 92 },
    { month: 'Nov', val: 82 },
    { month: 'Dec', val: 98 },
  ];

  const statusSegments = [
    { label: 'Active', percent: 62, color: '#10B981' },
    { label: 'Paused', percent: 14, color: '#F59E0B' },
    { label: 'Draft', percent: 10, color: '#7A4C72' },
    { label: 'Closed', percent: 8, color: '#64748B' },
    { label: 'Canceled', percent: 6, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header matching Image 1 screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Overview of your subscription business</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="appearance-none bg-white border border-gray-200 text-xs font-medium text-gray-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-[#7A4C72] cursor-pointer"
            >
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Create Button */}
          <button
            onClick={() => onNavigate('subscriptions')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="₹12,48,500"
          trend={{ value: "12.5%", isPositive: true, label: "from last month" }}
        />
        <StatCard
          title="Active Subscriptions"
          value="248"
          trend={{ value: "8.2%", isPositive: true, label: "from last month" }}
        />
        <StatCard
          title="Total Customers"
          value="186"
          trend={{ value: "5.4%", isPositive: true, label: "from last month" }}
        />
        <StatCard
          title="Pending Invoices"
          value="12"
          trend={{ value: "3.1%", isPositive: false, label: "from last month" }}
        />
      </div>

      {/* Charts Grid: Revenue Overview & Subscription Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Overview Bar Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-900">Revenue Overview</h2>
            <div className="relative">
              <select
                value={revenueTimeframe}
                onChange={(e) => setRevenueTimeframe(e.target.value as any)}
                className="appearance-none bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 py-1.5 pl-2.5 pr-7 rounded-md focus:outline-none cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Bar Chart Graphic */}
          <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-gray-100">
            {monthlyBars.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                  {bar.val}k
                </div>
                <div
                  className="w-full max-w-[28px] rounded-t-sm transition-all duration-300 group-hover:opacity-90"
                  style={{
                    height: `${bar.val * 1.8}px`,
                    backgroundColor: idx % 2 === 0 ? '#7A4C72' : '#9B6C93',
                  }}
                />
                <span className="text-[10px] text-gray-500 font-medium mt-2">{bar.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 px-1">
            <span>₹0</span>
            <span>₹25,000</span>
            <span>₹50,000</span>
            <span>₹75,000</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        {/* Right: Subscription Status Donut Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Subscription Status</h2>
          </div>

          <div className="flex flex-col items-center justify-center my-auto py-2">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* SVG Donut Slices */}
                {(() => {
                  let accumulatedPercent = 0;
                  return statusSegments.map((seg, idx) => {
                    const strokeDasharray = `${seg.percent} ${100 - seg.percent}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += seg.percent;
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="15"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all hover:opacity-80"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-gray-900">248</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Legend with percentages */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6 w-full text-xs">
              {statusSegments.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600 font-medium">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Recent Invoices</h2>
            <p className="text-xs text-gray-500">Latest generated subscription invoices</p>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-semibold text-[#7A4C72] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Invoice ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Subscription</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3">{inv.customerName}</td>
                  <td className="px-5 py-3 text-gray-500">SUB-001</td>
                  <td className="px-5 py-3 font-medium">₹{inv.total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-gray-500">{inv.dueDate}</td>
                  <td className="px-5 py-3">
                    <Badge variant={inv.status}>{inv.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 text-[11px] font-medium text-[#7A4C72] hover:bg-[#F6EDF3] rounded transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices Modals */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPay={() => {
            setPayingInvoice(selectedInvoice);
            setSelectedInvoice(null);
          }}
        />
      )}
      {payingInvoice && (
        <PayInvoiceModal
          invoice={payingInvoice}
          onClose={() => setPayingInvoice(null)}
          onSuccess={() => setPayingInvoice(null)}
        />
      )}
    </div>
  );
};
