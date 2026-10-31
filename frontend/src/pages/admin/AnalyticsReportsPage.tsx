import React from 'react';
import {
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/ui/StatCard';

export const AnalyticsReportsPage: React.FC = () => {
  const { showToast } = useApp();

  const monthlyRevenueData = [
    { month: 'Oct 25', mrr: 8.4, total: 10.2 },
    { month: 'Nov 25', mrr: 9.8, total: 12.1 },
    { month: 'Dec 25', mrr: 10.5, total: 13.9 },
    { month: 'Jan 26', mrr: 11.2, total: 14.8 },
    { month: 'Feb 26', mrr: 12.0, total: 16.2 },
    { month: 'Mar 26', mrr: 12.8, total: 17.5, current: true },
  ];

  const planBreakdown = [
    { name: 'Business CRM - Professional', percentage: 42, count: 202, mrr: '₹3,02,798' },
    { name: 'Cloud ERP Core - Growth & Enterprise', percentage: 28, count: 135, mrr: '₹4,72,365' },
    { name: 'Flow Automation Hub - Unlimited', percentage: 18, count: 87, mrr: '₹79,743' },
    { name: 'Support Desk 360', percentage: 12, count: 58, mrr: '₹1,15,942' },
  ];

  const handleExportCSV = (reportName: string) => {
    showToast({
      type: 'success',
      title: 'Report Exported',
      message: `${reportName}_${new Date().toISOString().split('T')[0]}.csv generated and downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Analytics & Financial Reporting
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Key performance indicators, cohort retention, recurring cashflow, and revenue realizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV('Brightloop_SaaS_Financial_Summary')}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] bg-white hover:bg-[#F3F5F8] text-[#34313A] flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#92939D]" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Annual Run Rate (ARR)"
          value="₹1.54 Cr"
          trend={{ value: '+22.4%', isPositive: true, label: 'YoY trajectory' }}
          accent="purple"
        />
        <StatCard
          title="Net Revenue Retention (NRR)"
          value="114%"
          trend={{ value: '+4%', isPositive: true, label: 'expansion' }}
        />
        <StatCard
          title="Customer Acquisition Cost"
          value="₹3,240"
          subtitle="Avg payback 2.2 months"
          accent="blue"
        />
        <StatCard
          title="Collection Efficiency"
          value="96.8%"
          trend={{ value: '+1.2%', isPositive: true, label: 'on-time settlement' }}
        />
      </div>

      {/* Primary Analytics Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Revenue Trajectory Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-[#34313A]">
                Recurring (MRR) vs Total Billing Inflow (in Lakhs ₹)
              </h2>
              <p className="text-xs text-[#92939D]">
                Visual breakdown comparing predictable MRR vs one-time ad-hoc setup fees.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#7A4C72]" />
                <span className="text-[#696A75]">Recurring MRR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#F6EDF3]" />
                <span className="text-[#696A75]">Total Billed</span>
              </div>
            </div>
          </div>

          {/* Visual Bar Graph */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-4 h-48 px-2">
              {monthlyRevenueData.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-[#92939D] opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{d.total}L
                  </span>
                  <div className="w-full max-w-[36px] bg-[#F3F5F8] rounded-xl flex flex-col items-center justify-end overflow-hidden h-36 p-1">
                    <div
                      style={{ height: `${(d.total / 20) * 100}%` }}
                      className="w-full rounded-t-lg bg-[#F6EDF3] relative"
                    >
                      <div
                        style={{ height: `${(d.mrr / d.total) * 100}%` }}
                        className="w-full rounded-t-lg bg-[#7A4C72] absolute bottom-0 left-0"
                      />
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      d.current ? 'text-[#7A4C72] font-bold' : 'text-[#696A75]'
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Distribution / Popularity (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#34313A] mb-1">Product Revenue Contribution</h2>
            <p className="text-xs text-[#92939D] mb-4">Volume distribution across subscription tiers.</p>
            <div className="space-y-4">
              {planBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#34313A] truncate max-w-[190px]">
                      {item.name}
                    </span>
                    <span className="font-mono text-[#7A4C72] font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F3F5F8] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#7A4C72]"
                      style={{ width: `${item.percentage}%`, opacity: 1 - idx * 0.18 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#92939D]">
                    <span>{item.count} Active Subscribers</span>
                    <span className="font-mono">{item.mrr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#E9EBEF]">
            <button
              onClick={() => handleExportCSV('Tier_Contribution_Report')}
              className="w-full py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#34313A] transition-colors"
            >
              Download Cohort Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Collections & Aging Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-[#34313A] mb-1">Invoice Aging Summary</div>
          <p className="text-[11px] text-[#92939D] mb-3">Receivables outstanding by age bracket</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-[#EBF7F2]">
              <span className="text-[#28A879] font-medium">Current (0 - 15 Days):</span>
              <span className="font-mono font-semibold text-[#28A879]">₹42,850</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#FEF7EC]">
              <span className="text-[#D9822B] font-medium">16 - 30 Days:</span>
              <span className="font-mono font-semibold text-[#D9822B]">₹12,400</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#FDF2F2]">
              <span className="text-[#DC6464] font-medium">&gt; 30 Days Overdue:</span>
              <span className="font-mono font-semibold text-[#DC6464]">₹4,128</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-[#34313A] mb-1">Preferred Settlement Channels</div>
          <p className="text-[11px] text-[#92939D] mb-3">Payment rail distribution across Indian clients</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#696A75]">
              <span>UPI Autopay (NPCI)</span>
              <span className="font-mono font-semibold text-[#34313A]">64% (Highest)</span>
            </div>
            <div className="flex justify-between items-center text-[#696A75]">
              <span>Corporate Credit Card</span>
              <span className="font-mono font-semibold text-[#34313A]">24%</span>
            </div>
            <div className="flex justify-between items-center text-[#696A75]">
              <span>Net Banking & NEFT Wire</span>
              <span className="font-mono font-semibold text-[#34313A]">12%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-[#34313A] mb-1">Retention & Churn Metrics</div>
          <p className="text-[11px] text-[#92939D] mb-3">Customer lifecycle health index</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#696A75]">
              <span>Monthly Logo Churn:</span>
              <span className="font-mono font-semibold text-[#28A879]">1.8%</span>
            </div>
            <div className="flex justify-between items-center text-[#696A75]">
              <span>Average Customer Lifetime:</span>
              <span className="font-mono font-semibold text-[#34313A]">34 Months</span>
            </div>
            <div className="flex justify-between items-center text-[#696A75]">
              <span>Quotation-to-Subscription Rate:</span>
              <span className="font-mono font-semibold text-[#7A4C72]">82.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
