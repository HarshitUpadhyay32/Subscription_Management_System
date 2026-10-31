import React, { useState } from 'react';
import {
  Plus,
  Eye,
  Send,
  CheckCircle2,
  ArrowRightCircle,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuotationItem } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { QuotationPreviewModal } from '../../components/ui/QuotationPreviewModal';

export const QuotationsPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const {
    quotations,
    customers,
    products,
    createQuotation,
    sendQuotation,
    approveQuotation,
    convertQuotationToSubscription,
    deleteQuotation,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);

  // Create Quotation Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(18);
  const [notes, setNotes] = useState('Payment terms: Net 15 days from subscription activation.');

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerCompany.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setCustomerId(customers[0]?.id || '');
    const firstProd = products[0];
    setSelectedProductId(firstProd?.id || '');
    setSelectedPlanId(firstProd?.plans[0]?.id || '');
    setQuantity(1);
    setDiscountPercent(0);
    setTaxPercent(18);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === customerId);
    const product = products.find((p) => p.id === selectedProductId);
    const plan = product?.plans.find((p) => p.id === selectedPlanId);
    if (!customer || !product || !plan) return;

    const unitPrice = plan.price;
    const subtotal = unitPrice * quantity;
    const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Number(((taxableAmount * taxPercent) / 100).toFixed(2));
    const totalAmount = Number((taxableAmount + taxAmount).toFixed(2));

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const expiryStr = expiry.toISOString().split('T')[0];

    const item: QuotationItem = {
      id: `qti-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      planId: plan.id,
      planName: plan.name,
      billingCycle: plan.billingCycle,
      quantity,
      unitPrice,
      total: subtotal,
    };

    createQuotation({
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCompany: customer.company,
      issueDate: today,
      expiryDate: expiryStr,
      items: [item],
      subtotal,
      discountPercentage: discountPercent,
      discountAmount,
      taxPercentage: taxPercent,
      taxAmount,
      totalAmount,
      status: 'draft',
      notes,
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Quotations & Proposals
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Draft customized multi-tier proposals, configure custom discounts, and convert directly to subscriptions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'draft', 'sent', 'approved', 'converted', 'expired'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors whitespace-nowrap ${
              statusFilter === st
                ? 'bg-[#EDE5F0] text-[#714B67] font-semibold'
                : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
            }`}
          >
            {st === 'all' ? 'All Quotations' : st}
          </button>
        ))}
        <span className="text-xs text-[#92939D] ml-auto">
          {filteredQuotes.length} proposals
        </span>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-3 px-4 font-medium">Quotation #</th>
                <th className="py-3 px-4 font-medium">Customer & Company</th>
                <th className="py-3 px-4 font-medium">Items Summary</th>
                <th className="py-3 px-4 font-medium">Valid Until</th>
                <th className="py-3 px-4 font-medium text-right">Total (Inc. GST)</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-[#FDFDFE] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#714B67]">
                    {q.quotationNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#34313A]">{q.customerName}</div>
                    <div className="text-[11px] text-[#92939D]">{q.customerCompany}</div>
                  </td>
                  <td className="py-3 px-4 text-[#696A75]">
                    {q.items.map((it, idx) => (
                      <div key={idx}>
                        <span className="font-medium text-[#34313A]">{it.productName}</span>
                        <span className="text-[11px] text-[#92939D] ml-1">
                          ({it.planName} × {it.quantity})
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-[#696A75]">{q.expiryDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#34313A] tabular-nums">
                    ₹{q.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={q.status}>{q.status.toUpperCase()}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewQuote(q)}
                        className="p-1.5 rounded-lg text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8]"
                        title="Preview Quotation Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {q.status === 'draft' && (
                        <button
                          onClick={() => sendQuotation(q.id)}
                          className="px-2 py-1 text-[11px] font-medium rounded-lg bg-[#F3F5F8] text-[#34313A] hover:bg-[#E9EBEF]"
                          title="Dispatch via Email"
                        >
                          Send
                        </button>
                      )}
                      {q.status === 'sent' && (
                        <button
                          onClick={() => approveQuotation(q.id)}
                          className="px-2 py-1 text-[11px] font-medium rounded-lg bg-[#EBF7F2] text-[#28A879] hover:bg-[#D4EFE4]"
                        >
                          Approve
                        </button>
                      )}
                      {(q.status === 'approved' || q.status === 'sent') && (
                        <button
                          onClick={() => convertQuotationToSubscription(q.id)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1 shadow-xs"
                          title="Activate as live subscription"
                        >
                          <ArrowRightCircle className="w-3 h-3" />
                          <span>Convert</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete quote ${q.quotationNumber}?`)) {
                            deleteQuotation(q.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#92939D] hover:text-[#DC6464] hover:bg-[#FDF2F2]"
                        title="Delete Quote"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft Commercial Quotation"
        subtitle="Configure custom pricing, GST tax, and commercial validity"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Target Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
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
          <div className="grid grid-cols-3 gap-3">
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
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Plan Tier</label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                {currentProduct.plans.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name} (₹{pl.price.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Seats / Qty</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">GST Tax Rate (%)</label>
              <select
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value={18}>18% (Standard GST)</option>
                <option value={12}>12% (Concessional)</option>
                <option value={0}>0% (Export / SEZ)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Payment & Contract Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
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
              Save Quotation Draft
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <QuotationPreviewModal
        quotation={previewQuote}
        isOpen={!!previewQuote}
        onClose={() => setPreviewQuote(null)}
      />
    </div>
  );
};
