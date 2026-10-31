import React, { useState } from 'react';
import {
  Users,
  Repeat,
  FileSpreadsheet,
  Receipt,
  Plus,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Invoice } from '../../types';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { PayInvoiceModal } from '../../components/ui/PayInvoiceModal';

interface StaffOverviewProps {
  onNavigate: (path: string) => void;
  searchQuery?: string;
}

export const StaffOverview: React.FC<StaffOverviewProps> = ({ onNavigate }) => {
  const { customers, subscriptions, quotations, invoices } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const pendingQuotations = quotations.filter((q) => q.status === 'sent' || q.status === 'approved');
  const outstandingInvoices = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue');
  const upcomingRenewals = subscriptions
    .filter((s) => s.status === 'active')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-white/60 p-6 rounded-2xl border border-[#E9EBEF] backdrop-blur-xs">
        <div className="bg-decorative-watermark -top-2 right-4 text-7xl font-serif opacity-20 pointer-events-none select-none hidden sm:block">
          OPERATIONS
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="sub-caps text-[#714B67] mb-1">Staff Console</div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#29252A] font-serif">
                Operations & Customer Desk
              </h1>
              <span className="text-[10px] font-semibold bg-[#EDE5F0] text-[#714B67] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Staff Access
              </span>
            </div>
            <p className="text-xs text-[#92939D] mt-1">
              Operational dashboard for subscriber assistance, proposal workflows, and payment clearance.
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
              <span>Send Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Operational KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Subscribers"
          value={activeSubs.length}
          subtitle="Under active management"
          accent="purple"
        />
        <StatCard
          title="Customers Enrolled"
          value={customers.length}
          subtitle="Corporate accounts"
        />
        <StatCard
          title="Pending Quotations"
          value={pendingQuotations.length}
          subtitle="Awaiting client sign-off"
          accent="blue"
        />
        <StatCard
          title="Outstanding Invoices"
          value={outstandingInvoices.length}
          trend={{ value: 'Action Required', isPositive: false }}
        />
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left column: Action items & Pending Quotations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#34313A]">Quotations Requiring Action</h3>
                <p className="text-xs text-[#92939D]">Convert approved proposals or follow up on sent quotes.</p>
              </div>
              <button
                onClick={() => onNavigate('quotations')}
                className="text-xs text-[#714B67] hover:underline font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {pendingQuotations.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl border border-[#E9EBEF] hover:bg-[#FDFDFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-xs text-[#714B67]">
                        {q.quotationNumber}
                      </span>
                      <Badge variant={q.status}>{q.status.toUpperCase()}</Badge>
                    </div>
                    <div className="text-xs font-semibold text-[#34313A] mt-1">{q.customerName}</div>
                    <div className="text-[11px] text-[#92939D]">{q.customerCompany}</div>
                  </div>
                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-[#34313A] tabular-nums">
                      ₹{q.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => onNavigate('quotations')}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#714B67] text-white hover:bg-[#603D56] transition-colors"
                    >
                      Process Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Strip */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="text-xs font-semibold text-[#34313A] mb-3">Daily Tasks</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <button
                onClick={() => onNavigate('customers')}
                className="p-3 rounded-xl bg-[#F8F9FB] hover:bg-[#EDE5F0]/50 text-[#34313A] transition-colors"
              >
                <Users className="w-4 h-4 mx-auto mb-1 text-[#714B67]" />
                <span className="font-medium">Client Roster</span>
              </button>
              <button
                onClick={() => onNavigate('subscriptions')}
                className="p-3 rounded-xl bg-[#F8F9FB] hover:bg-[#EDE5F0]/50 text-[#34313A] transition-colors"
              >
                <Repeat className="w-4 h-4 mx-auto mb-1 text-[#714B67]" />
                <span className="font-medium">Subscriptions</span>
              </button>
              <button
                onClick={() => onNavigate('quotations')}
                className="p-3 rounded-xl bg-[#F8F9FB] hover:bg-[#EDE5F0]/50 text-[#34313A] transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 mx-auto mb-1 text-[#714B67]" />
                <span className="font-medium">Proposals</span>
              </button>
              <button
                onClick={() => onNavigate('invoices')}
                className="p-3 rounded-xl bg-[#F8F9FB] hover:bg-[#EDE5F0]/50 text-[#34313A] transition-colors"
              >
                <Receipt className="w-4 h-4 mx-auto mb-1 text-[#714B67]" />
                <span className="font-medium">Billings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Upcoming Renewals & Collections Attention (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#34313A]">Upcoming Cycle Renewals</span>
              <button
                onClick={() => onNavigate('subscriptions')}
                className="text-[11px] text-[#714B67] hover:underline font-medium"
              >
                Manage
              </button>
            </div>
            <div className="space-y-2.5">
              {upcomingRenewals.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FB] border border-[#E9EBEF] transition-all"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#34313A]">{sub.customerName}</div>
                    <div className="text-[11px] text-[#92939D]">
                      {sub.productName} · {sub.planName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-[#34313A] tabular-nums">
                      ₹{sub.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#92939D]">Due {sub.renewalDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#34313A]">Pending Invoices</span>
              <button
                onClick={() => onNavigate('invoices')}
                className="text-[11px] text-[#714B67] hover:underline font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {outstandingInvoices.slice(0, 3).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F9FB] border border-[#E9EBEF] text-xs"
                >
                  <div>
                    <div className="font-mono text-[11px] text-[#714B67] font-medium">
                      {inv.invoiceNumber}
                    </div>
                    <div className="text-[#34313A] font-medium">{inv.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-[#34313A] tabular-nums">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => setPayingInvoice(inv)}
                      className="text-[10px] text-[#714B67] hover:underline font-medium"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
