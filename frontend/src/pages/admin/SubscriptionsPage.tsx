import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BillingCycle, Subscription } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const SubscriptionsPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const {
    subscriptions,
    customers,
    products,
    createSubscription,
    renewSubscription,
    cancelSubscription,
    changeSubscriptionPlan,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Create Sub Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI Autopay');
  const [autoRenew, setAutoRenew] = useState(true);

  // Change Plan Modal
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [targetSub, setTargetSub] = useState<Subscription | null>(null);
  const [newPlanId, setNewPlanId] = useState('');

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const filteredSubs = subscriptions.filter((s) => {
    const matchesSearch =
      s.subscriptionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setSelectedCustomerId(customers[0]?.id || '');
    const firstProd = products[0];
    setSelectedProductId(firstProd?.id || '');
    setSelectedPlanId(firstProd?.plans[0]?.id || '');
    setBillingCycle('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId);
    const product = products.find((p) => p.id === selectedProductId);
    const plan = product?.plans.find((p) => p.id === selectedPlanId);
    if (!customer || !product || !plan) return;

    const start = new Date(startDate);
    const end = new Date(start);
    if (billingCycle === 'monthly') end.setDate(end.getDate() + 30);
    else if (billingCycle === 'quarterly') end.setDate(end.getDate() + 90);
    else end.setFullYear(end.getFullYear() + 1);

    const endStr = end.toISOString().split('T')[0];

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
      startDate,
      endDate: endStr,
      renewalDate: endStr,
      status: 'active',
      autoRenew,
      paymentMethod,
    });
    setIsCreateModalOpen(false);
  };

  const openChangePlan = (sub: Subscription) => {
    setTargetSub(sub);
    const prod = products.find((p) => p.id === sub.productId);
    setNewPlanId(prod?.plans[0]?.id || '');
    setIsChangePlanModalOpen(true);
  };

  const handleChangePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSub) return;
    const prod = products.find((p) => p.id === targetSub.productId);
    const plan = prod?.plans.find((p) => p.id === newPlanId);
    if (!plan) return;

    changeSubscriptionPlan(targetSub.id, plan.id, plan.price, plan.billingCycle);
    setIsChangePlanModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Subscriptions Management
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Track subscription lifecycles, automated renewals, tier transitions, and billing terms.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Subscription</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'active', 'pending', 'expired', 'cancelled', 'trial'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors whitespace-nowrap ${
              statusFilter === st
                ? 'bg-[#EDE5F0] text-[#714B67] font-semibold'
                : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
            }`}
          >
            {st === 'all' ? 'All Subscriptions' : st}
          </button>
        ))}
        <span className="text-xs text-[#92939D] ml-auto">
          {filteredSubs.length} entries
        </span>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-3 px-4 font-medium">Subscription Code</th>
                <th className="py-3 px-4 font-medium">Customer & Company</th>
                <th className="py-3 px-4 font-medium">Product & Plan</th>
                <th className="py-3 px-4 font-medium text-center">Cycle</th>
                <th className="py-3 px-4 font-medium text-right">Recurring Price</th>
                <th className="py-3 px-4 font-medium text-center">Next Renewal</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#FDFDFE] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#714B67]">
                    {sub.subscriptionCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#34313A]">{sub.customerName}</div>
                    <div className="text-[11px] text-[#92939D]">{sub.customerCompany}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#34313A]">{sub.productName}</div>
                    <div className="text-[11px] text-[#714B67]">{sub.planName}</div>
                  </td>
                  <td className="py-3 px-4 text-center capitalize text-[#696A75]">
                    {sub.billingCycle}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#34313A] tabular-nums">
                    ₹{sub.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center text-[#696A75]">
                    <div>{sub.renewalDate}</div>
                    <div className="text-[10px] text-[#92939D]">
                      {sub.autoRenew ? 'Auto-renews' : 'Manual renew'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={sub.status}>{sub.status.toUpperCase()}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {sub.status === 'active' && (
                        <>
                          <button
                            onClick={() => openChangePlan(sub)}
                            className="px-2 py-1 text-[11px] font-medium rounded-lg border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] transition-colors"
                            title="Upgrade / Downgrade Plan"
                          >
                            Change Plan
                          </button>
                          <button
                            onClick={() => renewSubscription(sub.id)}
                            className="p-1.5 rounded-lg text-[#28A879] hover:bg-[#EBF7F2] transition-colors"
                            title="Renew Subscription"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Cancel subscription ${sub.subscriptionCode}?`)) {
                                cancelSubscription(sub.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#DC6464] hover:bg-[#FDF2F2] transition-colors"
                            title="Cancel Subscription"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {(sub.status === 'expired' || sub.status === 'cancelled') && (
                        <button
                          onClick={() => renewSubscription(sub.id)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#EDE5F0] text-[#714B67] hover:bg-[#DFCDE2] transition-colors"
                        >
                          Reactivate
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

      {/* Create Subscription Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Activate New Subscription"
        subtitle="Assign subscriber, choose SaaS plan, and trigger initial recurring billing"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Select Customer</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const prod = products.find((p) => p.id === e.target.value);
                  if (prod && prod.plans[0]) setSelectedPlanId(prod.plans[0].id);
                }}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Pricing Plan Tier</label>
              <select
                value={selectedPlanId}
                onChange={(e) => {
                  setSelectedPlanId(e.target.value);
                  const pl = currentProduct.plans.find((p) => p.id === e.target.value);
                  if (pl) setBillingCycle(pl.billingCycle);
                }}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                {currentProduct.plans.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name} - ₹{pl.price.toLocaleString('en-IN')} / {pl.billingCycle}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value="UPI Autopay">UPI Autopay (GPay / PhonePe)</option>
                <option value="Corporate Credit Card">Corporate Credit Card</option>
                <option value="Net Banking">Net Banking E-Mandate</option>
                <option value="NEFT Transfer">NEFT / RTGS Wire</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="autoRenew"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
              className="rounded text-[#714B67] focus:ring-[#714B67]"
            />
            <label htmlFor="autoRenew" className="text-xs text-[#34313A]">
              Enable recurring auto-renewal and automatic invoice dispatcher
            </label>
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
              Activate Subscription
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Plan Modal */}
      {targetSub && (
        <Modal
          isOpen={isChangePlanModalOpen}
          onClose={() => setIsChangePlanModalOpen(false)}
          title={`Upgrade or Downgrade Plan`}
          subtitle={`${targetSub.subscriptionCode} • ${targetSub.customerName}`}
        >
          <form onSubmit={handleChangePlanSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Current Plan</label>
              <div className="p-3 bg-[#F8F9FB] rounded-xl border border-[#E9EBEF] text-xs">
                <span className="font-semibold text-[#34313A]">{targetSub.planName}</span>
                <span className="text-[#92939D]"> (₹{targetSub.amount.toLocaleString('en-IN')} / {targetSub.billingCycle})</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">New Target Plan</label>
              <select
                value={newPlanId}
                onChange={(e) => setNewPlanId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                {products
                  .find((p) => p.id === targetSub.productId)
                  ?.plans.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name} — ₹{pl.price.toLocaleString('en-IN')} / {pl.billingCycle}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
              <button
                type="button"
                onClick={() => setIsChangePlanModalOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
              >
                Confirm Plan Transition
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
