import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  Plus,
  Eye,
  Download,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { PayInvoiceModal } from '../../components/ui/PayInvoiceModal';

export const InvoicesPaymentsPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { invoices, payments, customers, createInvoice, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  // Manual Invoice Creation Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [description, setDescription] = useState('Custom Enterprise Implementation & Onboarding');
  const [amount, setAmount] = useState<number>(4999);
  const [dueDate, setDueDate] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerCompany.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = invoiceStatusFilter === 'all' || inv.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter((pay) => {
    return (
      pay.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    const today = new Date().toISOString().split('T')[0];
    const due = dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const taxRate = 18;
    const taxAmount = Number(((amount * taxRate) / 100).toFixed(2));
    const total = Number((amount + taxAmount).toFixed(2));

    createInvoice({
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerCompany: cust.company,
      customerGstin: cust.gstin,
      issueDate: today,
      dueDate: due,
      items: [{ description, quantity: 1, unitPrice: amount, amount }],
      subtotal: amount,
      taxRate,
      taxAmount,
      discountAmount: 0,
      total,
      status: 'pending',
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Invoices & Payments Ledger
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Automated GST-compliant billing, pending collections, and real-time transaction reconciliation.
          </p>
        </div>
        <button
          onClick={() => {
            setCustomerId(customers[0]?.id || '');
            setDescription('Custom Enterprise Implementation & Onboarding');
            setAmount(4999);
            setIsCreateModalOpen(true);
          }}
          className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Manual Invoice</span>
        </button>
      </div>

      {/* Main Mode Tabs: Invoices vs Payments */}
      <div className="flex items-center justify-between border-b border-[#E9EBEF] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'invoices'
                ? 'bg-[#714B67] text-white shadow-xs'
                : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Recurring Invoices ({invoices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'payments'
                ? 'bg-[#714B67] text-white shadow-xs'
                : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments & Receipts ({payments.length})</span>
          </button>
        </div>

        {activeTab === 'invoices' && (
          <div className="hidden sm:flex items-center gap-1.5">
            {['all', 'paid', 'pending', 'overdue'].map((st) => (
              <button
                key={st}
                onClick={() => setInvoiceStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  invoiceStatusFilter === st
                    ? 'bg-[#EDE5F0] text-[#714B67]'
                    : 'text-[#92939D] hover:text-[#34313A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Invoices View */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
                <tr>
                  <th className="py-3 px-4 font-medium">Invoice Number</th>
                  <th className="py-3 px-4 font-medium">Customer & Company</th>
                  <th className="py-3 px-4 font-medium">Issue Date</th>
                  <th className="py-3 px-4 font-medium">Due Date</th>
                  <th className="py-3 px-4 font-medium text-right">Subtotal</th>
                  <th className="py-3 px-4 font-medium text-right">Tax (18%)</th>
                  <th className="py-3 px-4 font-medium text-right">Total (₹)</th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EBEF]">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FDFDFE] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#714B67]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#34313A]">{inv.customerName}</div>
                      <div className="text-[11px] text-[#92939D]">{inv.customerCompany}</div>
                    </td>
                    <td className="py-3 px-4 text-[#696A75]">{inv.issueDate}</td>
                    <td className="py-3 px-4 text-[#696A75]">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono text-[#696A75] tabular-nums">
                      ₹{inv.subtotal.toLocaleString('en-IN')}
                    </td>
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
                          className="p-1.5 rounded-lg text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8]"
                          title="View / Download Tax Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {(inv.status === 'pending' || inv.status === 'overdue') && (
                          <button
                            onClick={() => setPayingInvoice(inv)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#714B67] hover:bg-[#603D56] text-white shadow-xs transition-colors"
                          >
                            Pay / Settle
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
      )}

      {/* Payments View */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
                <tr>
                  <th className="py-3 px-4 font-medium">Transaction Reference</th>
                  <th className="py-3 px-4 font-medium">Settled Invoice #</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Method</th>
                  <th className="py-3 px-4 font-medium">Payment Timestamp</th>
                  <th className="py-3 px-4 font-medium text-right">Amount (₹)</th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EBEF]">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#FDFDFE] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#34313A]">
                      {pay.transactionReference}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#714B67] font-medium">
                      {pay.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#34313A]">
                      {pay.customerName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-[#34313A]">
                        {pay.paymentMethod === 'UPI' ? (
                          <Smartphone className="w-3.5 h-3.5 text-[#714B67]" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5 text-[#3B82F6]" />
                        )}
                        <span>{pay.paymentMethod}</span>
                      </div>
                      {pay.upiId && <div className="text-[10px] text-[#92939D]">{pay.upiId}</div>}
                      {pay.cardLast4 && (
                        <div className="text-[10px] text-[#92939D]">•••• {pay.cardLast4}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#696A75]">{pay.paymentDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#28A879] tabular-nums">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="paid">SUCCESSFUL</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          showToast({
                            type: 'success',
                            title: 'Receipt Downloaded',
                            message: `Payment confirmation receipt for ${pay.transactionReference} downloaded.`,
                          })
                        }
                        className="px-2 py-1 text-[11px] rounded-lg border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] flex items-center gap-1 ml-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-[#92939D]" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Invoice Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Issue Ad-hoc Invoice"
        subtitle="Generate one-time implementation, custom service, or add-on charge"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">
              Description / Line Item
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Annual Onboarding & Data Migration"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">
                Subtotal Amount (₹)
              </label>
              <input
                type="number"
                min={1}
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="p-3 bg-[#F8F9FB] rounded-xl border border-[#E9EBEF] text-xs space-y-1">
            <div className="flex justify-between text-[#92939D]">
              <span>Subtotal:</span>
              <span className="font-mono text-[#34313A]">₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#92939D]">
              <span>GST (18%):</span>
              <span className="font-mono text-[#34313A]">
                ₹{((amount * 18) / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-[#34313A] pt-1 border-t border-[#E9EBEF]">
              <span>Payable Total:</span>
              <span className="font-mono text-[#714B67]">
                ₹{(amount * 1.18).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Detail / Print Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPayNow={(inv) => setPayingInvoice(inv)}
      />

      {/* Pay Invoice Modal */}
      <PayInvoiceModal
        invoice={payingInvoice}
        isOpen={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
      />
    </div>
  );
};
