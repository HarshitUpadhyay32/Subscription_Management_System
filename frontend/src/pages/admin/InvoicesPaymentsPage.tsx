import React, { useState, useEffect } from 'react';
import {
  Receipt,
  CreditCard,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Smartphone,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, Payment } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { PayInvoiceModal } from '../../components/ui/PayInvoiceModal';

interface InvoicesPaymentsPageProps {
  searchQuery?: string;
  initialTab?: 'invoices' | 'payments';
}

export const InvoicesPaymentsPage: React.FC<InvoicesPaymentsPageProps> = ({
  searchQuery = '',
  initialTab = 'invoices',
}) => {
  const { invoices, payments, customers, createInvoice, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>(initialTab);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Invoice creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [description, setDescription] = useState('Brightloop CRM - Monthly');
  const [amount, setAmount] = useState<number>(999);
  const [dueDate, setDueDate] = useState('15 Nov 2026');

  // Record payment modal
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [payCustName, setPayCustName] = useState('Acme Technologies');
  const [payInvNumber, setPayInvNumber] = useState('INV-001');
  const [payAmount, setPayAmount] = useState(999);
  const [payMethod, setPayMethod] = useState('UPI');

  const effectiveQuery = searchQuery || localSearch;

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      inv.customerCompany.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const filteredPayments = payments.filter(
    (p) =>
      p.transactionReference.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    createInvoice({
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerCompany: cust.company,
      customerGstin: cust.gstin,
      issueDate: '01 Nov 2026',
      dueDate: dueDate || '15 Nov 2026',
      items: [{ description, quantity: 1, unitPrice: amount, amount }],
      subtotal: amount,
      taxRate: 18,
      taxAmount: Math.round(amount * 0.18),
      discountAmount: 0,
      total: amount,
      status: 'pending',
    });
    setIsCreateModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({ type: 'success', message: 'Payment recorded successfully' });
    setIsRecordPaymentOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Dynamic Header depending on Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {activeTab === 'invoices' ? 'Invoices' : 'Payments'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {activeTab === 'invoices'
              ? 'Manage and track invoices'
              : 'Record and track payments'}
          </p>
        </div>

        {activeTab === 'invoices' ? (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
        ) : (
          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        )}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Switcher & Search Bar */}
        <div className="px-5 pt-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'invoices'
                  ? 'border-[#7A4C72] text-[#7A4C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'payments'
                  ? 'border-[#7A4C72] text-[#7A4C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Payments
            </button>
          </div>

          <div className="flex items-center gap-2 pb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  activeTab === 'invoices'
                    ? 'Search invoices...'
                    : 'Search payments...'
                }
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#7A4C72] w-48 sm:w-60"
              />
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-gray-500" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Invoices Table matching Image 1 screen 9 */}
        {activeTab === 'invoices' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Invoice No</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Subscription</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredInvoices.map((inv, idx) => {
                  const subCode = `SUB-00${(idx % 5) + 1}`;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 font-semibold text-[#7A4C72]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">{inv.customerName}</td>
                      <td className="px-5 py-3 text-gray-600">{subCode}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900">
                        ₹{inv.total.toLocaleString('en-IN')}.00
                      </td>
                      <td className="px-5 py-3 text-gray-500">{inv.dueDate}</td>
                      <td className="px-5 py-3">
                        <Badge variant={inv.status}>{inv.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(inv);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Tab 2: Payments Table matching Image 1 screen 10 */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Payment ID</th>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#7A4C72]">
                      {p.transactionReference}
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-medium">{p.invoiceNumber}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{p.customerName}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      ₹{p.amount.toLocaleString('en-IN')}.00
                    </td>
                    <td className="px-5 py-3 text-gray-600">{p.paymentMethod}</td>
                    <td className="px-5 py-3 text-gray-500">{p.paymentDate}</td>
                    <td className="px-5 py-3">
                      <Badge variant="paid">Success</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
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

      {/* Pay Invoice Modal */}
      {payingInvoice && (
        <PayInvoiceModal
          invoice={payingInvoice}
          onClose={() => setPayingInvoice(null)}
          onSuccess={() => setPayingInvoice(null)}
        />
      )}

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Invoice"
        >
          <form onSubmit={handleCreateInvoice} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Customer *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brightloop CRM - Monthly"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount (INR) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="999"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Due Date</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="15 Nov 2026"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold bg-[#7A4C72] hover:bg-[#683B60] text-white rounded-lg shadow-sm"
              >
                Generate Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && (
        <Modal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
          title="Record Payment"
        >
          <form onSubmit={handleRecordPayment} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Customer</label>
              <input
                type="text"
                value={payCustName}
                onChange={(e) => setPayCustName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Invoice Number</label>
              <input
                type="text"
                value={payInvNumber}
                onChange={(e) => setPayInvNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount (INR)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsRecordPaymentOpen(false)}
                className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold bg-[#7A4C72] hover:bg-[#683B60] text-white rounded-lg shadow-sm"
              >
                Save Payment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
