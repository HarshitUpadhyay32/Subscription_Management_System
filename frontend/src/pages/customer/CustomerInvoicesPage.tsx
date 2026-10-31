import React, { useState } from 'react';
import { Eye, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { PayInvoiceModal } from '../../components/ui/PayInvoiceModal';

export const CustomerInvoicesPage: React.FC = () => {
  const { currentUser, invoices } = useApp();
  const customerId = currentUser?.customerId || 'cust-1';
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const myInvoices = invoices.filter((i) => {
    const isMine = i.customerId === customerId;
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return isMine && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            My Invoices
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Download GST-compliant tax invoices, inspect billing breakdowns, and settle outstanding balances.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E9EBEF]">
          {(['all', 'paid', 'pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#EDE5F0] text-[#714B67] font-semibold'
                  : 'text-[#92939D] hover:text-[#34313A]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-3 px-4 font-medium">Invoice Number</th>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium">Issue Date</th>
                <th className="py-3 px-4 font-medium">Due Date</th>
                <th className="py-3 px-4 font-medium text-right">Tax (18% GST)</th>
                <th className="py-3 px-4 font-medium text-right">Total Amount (₹)</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {myInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FDFDFE] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#714B67]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#34313A] max-w-xs truncate">
                    {inv.items[0]?.description || 'Recurring Subscription'}
                  </td>
                  <td className="py-3 px-4 text-[#696A75]">{inv.issueDate}</td>
                  <td className="py-3 px-4 text-[#696A75]">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#92939D] tabular-nums">
                    ₹{inv.taxAmount.toLocaleString('en-IN')}
                  </td>
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
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-[#92939D]" />
                        <span>View / Print</span>
                      </button>
                      {(inv.status === 'pending' || inv.status === 'overdue') && (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay Now</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
