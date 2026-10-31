import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const DiscountsTaxesPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { discounts, taxes, addDiscount, toggleDiscount, deleteDiscount, addTax, toggleTax } = useApp();
  const [activeTab, setActiveTab] = useState<'discounts' | 'taxes'>('discounts');

  // Discount modal state
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(15);
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [minAmount, setMinAmount] = useState<number>(2000);

  // Tax modal state
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [taxName, setTaxName] = useState('');
  const [taxPercentage, setTaxPercentage] = useState<number>(18);
  const [taxDesc, setTaxDesc] = useState('');
  const [taxType, setTaxType] = useState<'GST' | 'IGST' | 'CGST_SGST'>('IGST');

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTaxes = taxes.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    addDiscount({
      code: code.toUpperCase().trim(),
      description: desc,
      type,
      value: Number(value),
      validUntil,
      isActive: true,
      minimumAmount: minAmount ? Number(minAmount) : undefined,
    });
    setIsDiscountModalOpen(false);
  };

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    addTax({
      name: taxName,
      percentage: Number(taxPercentage),
      description: taxDesc,
      isActive: true,
      type: taxType,
    });
    setIsTaxModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Discounts & Tax Configuration
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Manage promotional coupon codes, percentage deductions, and statutory Indian GST tax rules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'discounts' ? (
            <button
              onClick={() => {
                setCode('SUMMER25');
                setDesc('25% seasonal concession');
                setType('percentage');
                setValue(25);
                setValidUntil('2026-08-31');
                setMinAmount(3000);
                setIsDiscountModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Promo Code</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTaxName('Digital Service Cess');
                setTaxPercentage(2);
                setTaxDesc('Supplemental digital equalization levy');
                setTaxType('GST');
                setIsTaxModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tax Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9EBEF] pb-3">
        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'discounts'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Discount Codes ({discounts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('taxes')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'taxes'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>GST & Tax Rules ({taxes.length})</span>
        </button>
      </div>

      {/* Discounts Tab */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDiscounts.map((disc) => (
            <div
              key={disc.id}
              className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-[#714B67] bg-[#EDE5F0] px-2.5 py-1 rounded-lg">
                    {disc.code}
                  </span>
                  <button
                    onClick={() => toggleDiscount(disc.id)}
                    className="text-[#92939D] hover:text-[#34313A]"
                    title="Toggle Active"
                  >
                    {disc.isActive ? (
                      <ToggleRight className="w-6 h-6 text-[#28A879]" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-[#92939D]" />
                    )}
                  </button>
                </div>
                <div className="my-2">
                  <span className="text-xl font-bold font-mono text-[#34313A] tabular-nums">
                    {disc.type === 'percentage' ? `${disc.value}% OFF` : `₹${disc.value} FLAT`}
                  </span>
                </div>
                <p className="text-xs text-[#696A75] mb-3">{disc.description}</p>
                <div className="space-y-1 text-[11px] text-[#92939D] pt-3 border-t border-[#E9EBEF]">
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="font-medium text-[#34313A]">{disc.validUntil}</span>
                  </div>
                  {disc.minimumAmount && (
                    <div className="flex justify-between">
                      <span>Minimum Order:</span>
                      <span className="font-mono text-[#34313A]">
                        ₹{disc.minimumAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Redemptions:</span>
                    <span className="font-mono text-[#714B67] font-medium">{disc.usedCount} used</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E9EBEF] flex items-center justify-between">
                <Badge variant={disc.isActive ? 'active' : 'draft'}>
                  {disc.isActive ? 'ACTIVE' : 'DISABLED'}
                </Badge>
                <button
                  onClick={() => {
                    if (confirm(`Delete coupon code ${disc.code}?`)) {
                      deleteDiscount(disc.id);
                    }
                  }}
                  className="p-1 rounded text-[#92939D] hover:text-[#DC6464]"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Taxes Tab */}
      {activeTab === 'taxes' && (
        <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
                <tr>
                  <th className="py-3 px-4 font-medium">Tax Name</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Description</th>
                  <th className="py-3 px-4 font-medium text-center">Tax Percentage</th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EBEF]">
                {filteredTaxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-[#FDFDFE]">
                    <td className="py-3 px-4 font-semibold text-[#34313A]">{tax.name}</td>
                    <td className="py-3 px-4 font-mono text-[#714B67]">{tax.type}</td>
                    <td className="py-3 px-4 text-[#696A75] max-w-sm">{tax.description}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-sm text-[#34313A] tabular-nums">
                      {tax.percentage}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={tax.isActive ? 'active' : 'draft'}>
                        {tax.isActive ? 'ENFORCED' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleTax(tax.id)}
                        className="text-[#92939D] hover:text-[#34313A]"
                      >
                        {tax.isActive ? (
                          <ToggleRight className="w-6 h-6 text-[#28A879]" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-[#92939D]" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Discount */}
      <Modal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        title="Create Promotional Discount"
        subtitle="Offer promotional rates to new or renewing subscribers"
      >
        <form onSubmit={handleSaveDiscount} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE20"
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed INR Amount (₹)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">
                Value {type === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                min={1}
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Description</label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. 20% off all annual SaaS subscriptions"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">
              Minimum Transaction Amount (₹)
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsDiscountModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              Publish Discount
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Tax */}
      <Modal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        title="Add Tax Rate"
        subtitle="Statutory tax rule applied at checkout and invoice generation"
      >
        <form onSubmit={handleSaveTax} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Tax Name</label>
            <input
              type="text"
              required
              value={taxName}
              onChange={(e) => setTaxName(e.target.value)}
              placeholder="e.g. Intrastate GST Split"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Tax Percentage (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Tax Category</label>
              <select
                value={taxType}
                onChange={(e) => setTaxType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value="IGST">IGST (Inter-state)</option>
                <option value="CGST_SGST">CGST + SGST (Intra-state)</option>
                <option value="GST">GST General</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Tax Description</label>
            <textarea
              rows={2}
              value={taxDesc}
              onChange={(e) => setTaxDesc(e.target.value)}
              placeholder="Statutory explanation..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsTaxModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              Save Tax Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
