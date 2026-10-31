import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Pause,
  Play,
  RotateCcw,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BillingCycle, Subscription, Invoice } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { InvoiceModal } from '../../components/ui/InvoiceModal';

export const SubscriptionsPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const {
    subscriptions,
    customers,
    products,
    invoices,
    createSubscription,
    renewSubscription,
    cancelSubscription,
    createInvoice,
  } = useApp();

  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [detailTab, setDetailTab] = useState<'invoices' | 'payments' | 'activity'>('invoices');
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Create Sub Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [startDate, setStartDate] = useState('01 Oct 2026');
  const [paymentMethod, setPaymentMethod] = useState('UPI Autopay');

  const effectiveQuery = searchQuery || localSearch;
  const filteredSubs = subscriptions.filter(
    (s) =>
      s.subscriptionCode.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      s.productName.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      s.planName.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedCustomerId(customers[0]?.id || '');
    const firstProd = products[0];
    setSelectedProductId(firstProd?.id || '');
    setSelectedPlanId(firstProd?.plans[0]?.id || '');
    setBillingCycle('monthly');
    setStartDate('01 Oct 2026');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId);
    const product = products.find((p) => p.id === selectedProductId);
    const plan = product?.plans.find((p) => p.id === selectedPlanId) || product?.plans[0];
    if (!customer || !product || !plan) return;

    createSubscription({
      customerId: customer.id,
      customerName: customer.name,
      customerCompany: customer.company,
      customerEmail: customer.email,
      productId: product.id,
      productName: product.name,
      planId: plan.id,
      planName: plan.name,
      billingCycle,
      amount: plan.price,
      startDate: '01 Oct 2026',
      endDate: '01 Oct 2027',
      renewalDate: '01 Nov 2026',
      status: 'active',
      autoRenew: true,
      paymentMethod,
    });
    setIsCreateModalOpen(false);
  };

  const handleGenerateInvoice = (sub: Subscription) => {
    const invNum = `INV-${Math.floor(100 + Math.random() * 900)}`;
    const newInv = createInvoice({
      customerId: sub.customerId,
      customerName: sub.customerName,
      customerCompany: sub.customerCompany,
      customerEmail: sub.customerEmail,
      subscriptionId: sub.id,
      issueDate: '01 Nov 2026',
      dueDate: '15 Nov 2026',
      items: [
        {
          description: `${sub.productName} - ${sub.planName}`,
          quantity: 1,
          unitPrice: sub.amount,
          amount: sub.amount,
        },
      ],
      subtotal: sub.amount,
      taxRate: 18,
      taxAmount: Math.round(sub.amount * 0.18),
      discountAmount: 0,
      total: sub.amount,
      status: 'pending',
    });
    setViewingInvoice(newInv);
  };

  // Screen 8: Subscription Detail View (SUB-001)
  if (selectedSub) {
    // Invoices belonging to this subscription
    const subInvoices = invoices.filter(
      (inv) => inv.subscriptionId === selectedSub.id || inv.customerId === selectedSub.customerId
    );

    return (
      <div className="space-y-6 max-w-6xl mx-auto font-sans">
        {/* Breadcrumb matching Image 1 screen 8 */}
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <button onClick={() => setSelectedSub(null)} className="hover:text-gray-900">
            Subscriptions
          </button>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">{selectedSub.subscriptionCode}</span>
        </div>

        {/* Header with Title, Badge, Subtitle & Action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {selectedSub.subscriptionCode}
              </h1>
              <Badge variant={selectedSub.status}>{selectedSub.status}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedSub.customerName} - {selectedSub.planName}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => alert(`Subscription ${selectedSub.subscriptionCode} paused.`)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Pause
            </button>
            <button
              onClick={() => renewSubscription(selectedSub.id)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Renew
            </button>
            <button
              onClick={() => handleGenerateInvoice(selectedSub)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white transition-all shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Information & Tabs/Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Subscription Information Card */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Subscription Information
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Customer</span>
                <span className="font-semibold text-gray-900">{selectedSub.customerName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Plan</span>
                <span className="font-semibold text-[#7A4C72]">{selectedSub.planName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium text-gray-700">{selectedSub.startDate}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">End Date</span>
                <span className="font-medium text-gray-700">{selectedSub.endDate}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Billing Cycle</span>
                <span className="font-medium text-gray-700 capitalize">{selectedSub.billingCycle}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-gray-900 text-sm">
                  ₹{selectedSub.amount.toLocaleString('en-IN')}.00
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Status</span>
                <Badge variant={selectedSub.status}>{selectedSub.status}</Badge>
              </div>
            </div>
          </div>

          {/* Right: Invoices, Payments, Activity Log Tabs Card */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="px-5 pt-4 border-b border-gray-100 flex items-center gap-6">
              <button
                onClick={() => setDetailTab('invoices')}
                className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                  detailTab === 'invoices'
                    ? 'border-[#7A4C72] text-[#7A4C72]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => setDetailTab('payments')}
                className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                  detailTab === 'payments'
                    ? 'border-[#7A4C72] text-[#7A4C72]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setDetailTab('activity')}
                className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                  detailTab === 'activity'
                    ? 'border-[#7A4C72] text-[#7A4C72]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Activity Log
              </button>
            </div>

            {/* Tab 1: Invoices Sub-table matching Image 1 screen 8 */}
            {detailTab === 'invoices' && (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3">Invoice ID</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {subInvoices.length > 0 ? (
                      subInvoices.map((inv) => (
                        <tr
                          key={inv.id}
                          onClick={() => setViewingInvoice(inv)}
                          className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                        >
                          <td className="px-5 py-3 font-semibold text-[#7A4C72]">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-5 py-3 text-gray-500">{inv.issueDate}</td>
                          <td className="px-5 py-3 font-semibold text-gray-900">
                            ₹{inv.total.toLocaleString('en-IN')}.00
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant={inv.status}>{inv.status}</Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                          No invoices found for this subscription.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Payments */}
            {detailTab === 'payments' && (
              <div className="p-5 text-xs space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">PAY-001 (UPI)</div>
                    <div className="text-gray-500 text-[11px]">01 Oct 2026 · john@okhdfcbank</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹999.00</div>
                    <Badge variant="paid">Success</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Activity Log */}
            {detailTab === 'activity' && (
              <div className="p-5 text-xs space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5" />
                  <div>
                    <div className="font-medium text-gray-800">Subscription activated</div>
                    <div className="text-gray-400 text-[11px]">01 Oct 2026, 10:00 AM</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#7A4C72] mt-1.5" />
                  <div>
                    <div className="font-medium text-gray-800">Payment mandate verified</div>
                    <div className="text-gray-400 text-[11px]">01 Oct 2026, 10:05 AM</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Modal if clicked */}
        {viewingInvoice && (
          <InvoiceModal
            invoice={viewingInvoice}
            onClose={() => setViewingInvoice(null)}
          />
        )}
      </div>
    );
  }

  // Screen 7: Subscriptions List View
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Subscriptions</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage customer subscriptions</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Subscription</span>
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#7A4C72] w-64"
            />
          </div>

          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-gray-500" />
            <span>Filter</span>
          </button>
        </div>

        {/* Table matching Image 1 screen 7 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Subscription ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Start Date</th>
                <th className="px-5 py-3">End Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSubs.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 font-semibold text-[#7A4C72]">
                    {sub.subscriptionCode}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{sub.customerName}</td>
                  <td className="px-5 py-3 text-gray-600">{sub.planName}</td>
                  <td className="px-5 py-3 text-gray-500">{sub.startDate}</td>
                  <td className="px-5 py-3 text-gray-500">{sub.endDate}</td>
                  <td className="px-5 py-3">
                    <Badge variant={sub.status}>{sub.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSub(sub);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Subscription Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Subscription"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Customer *</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
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
              <label className="block font-semibold text-gray-700 mb-1">Product *</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const p = products.find((prod) => prod.id === e.target.value);
                  if (p?.plans[0]) setSelectedPlanId(p.plans[0].id);
                }}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Plan *</label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              >
                {products
                  .find((p) => p.id === selectedProductId)
                  ?.plans.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name} - ₹{pl.price.toLocaleString('en-IN')}/{pl.billingCycle}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              >
                <option value="UPI Autopay">UPI Autopay</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cash">Cash</option>
              </select>
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
                Create Subscription
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
