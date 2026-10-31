import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Trash2,
  Filter,
  Search,
  MoreHorizontal,
  Tag,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const DiscountsTaxesPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { discounts, taxes, addDiscount, toggleDiscount, deleteDiscount, addTax, toggleTax } = useApp();
  const [activeTab, setActiveTab] = useState<'discounts' | 'taxes'>('discounts');
  const [localSearch, setLocalSearch] = useState('');

  // Discount modal state
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Fixed Amount'>('Percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(1000);
  const [validity, setValidity] = useState('01 Oct - 31 Dec 2026');

  // Tax modal state
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [taxName, setTaxName] = useState('');
  const [taxPercentage, setTaxPercentage] = useState<number>(18);
  const [taxDesc, setTaxDesc] = useState('');

  const effectiveQuery = searchQuery || localSearch;
  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const filteredTaxes = taxes.filter(
    (t) =>
      t.name.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addDiscount({
      code: code.toUpperCase().trim(),
      description: `${value}${type === 'Percentage' ? '%' : ' INR'} discount`,
      type: type as any,
      value: Number(value),
      validUntil: '2026-12-31',
      validityRange: validity,
      minOrder: Number(minOrder),
      isActive: true,
    });
    setIsDiscountModalOpen(false);
  };

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxName.trim()) return;

    addTax({
      name: taxName,
      percentage: Number(taxPercentage),
      description: taxDesc || 'Statutory tax rule',
      isActive: true,
      type: 'GST',
    });
    setIsTaxModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header matching Image 1 screen 11 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Discounts & Taxes</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage discount rates and tax rates</p>
        </div>

        {activeTab === 'discounts' ? (
          <button
            onClick={() => {
              setCode('');
              setType('Percentage');
              setValue(10);
              setMinOrder(1000);
              setValidity('01 Oct - 31 Dec 2026');
              setIsDiscountModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Discount</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setTaxName('');
              setTaxPercentage(18);
              setTaxDesc('');
              setIsTaxModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tax Rule</span>
          </button>
        )}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Switcher & Search Bar */}
        <div className="px-5 pt-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('discounts')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'discounts'
                  ? 'border-[#7A4C72] text-[#7A4C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Discounts
            </button>
            <button
              onClick={() => setActiveTab('taxes')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'taxes'
                  ? 'border-[#7A4C72] text-[#7A4C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Taxes
            </button>
          </div>

          <div className="flex items-center gap-2 pb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={activeTab === 'discounts' ? 'Search discounts...' : 'Search taxes...'}
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

        {/* Tab 1: Discounts Table matching Image 1 screen 11 */}
        {activeTab === 'discounts' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Value</th>
                  <th className="px-5 py-3">Min Order</th>
                  <th className="px-5 py-3">Validity</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredDiscounts.map((disc) => {
                  const displayType =
                    disc.type === 'percentage' || disc.type === 'Percentage'
                      ? 'Percentage'
                      : 'Fixed Amount';
                  const displayVal =
                    displayType === 'Percentage' ? `${disc.value}%` : `₹${disc.value}`;
                  const displayMin = disc.minOrder
                    ? `₹${disc.minOrder.toLocaleString('en-IN')}`
                    : '₹1,000';
                  const displayRange = disc.validityRange || '01 Oct - 31 Dec 2026';

                  return (
                    <tr key={disc.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3 font-semibold text-[#7A4C72] tracking-wider">
                        {disc.code}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{displayType}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900">{displayVal}</td>
                      <td className="px-5 py-3 text-gray-600">{displayMin}</td>
                      <td className="px-5 py-3 text-gray-500">{displayRange}</td>
                      <td className="px-5 py-3">
                        <Badge variant={disc.isActive ? 'active' : 'inactive'}>
                          {disc.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => toggleDiscount(disc.id)}
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
          /* Tab 2: Taxes Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Tax Rule</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Rate</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredTaxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-900">{tax.name}</td>
                    <td className="px-5 py-3 text-gray-600">{tax.type}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{tax.percentage}%</td>
                    <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{tax.description}</td>
                    <td className="px-5 py-3">
                      <Badge variant={tax.isActive ? 'active' : 'inactive'}>
                        {tax.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => toggleTax(tax.id)}
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
        )}
      </div>

      {/* Add Discount Modal */}
      {isDiscountModalOpen && (
        <Modal
          isOpen={isDiscountModalOpen}
          onClose={() => setIsDiscountModalOpen(false)}
          title="Add Discount Code"
        >
          <form onSubmit={handleSaveDiscount} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72] uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed Amount">Fixed Amount (INR)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Value *</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Min Order (INR)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Validity Range</label>
                <input
                  type="text"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                  placeholder="01 Oct - 31 Dec 2026"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(false)}
                className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold bg-[#7A4C72] hover:bg-[#683B60] text-white rounded-lg shadow-sm"
              >
                Save Discount
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Tax Modal */}
      {isTaxModalOpen && (
        <Modal
          isOpen={isTaxModalOpen}
          onClose={() => setIsTaxModalOpen(false)}
          title="Add Tax Rule"
        >
          <form onSubmit={handleSaveTax} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tax Name *</label>
              <input
                type="text"
                required
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                placeholder="GST 18%"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Rate (%) *</label>
              <input
                type="number"
                required
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(Number(e.target.value))}
                placeholder="18"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={taxDesc}
                onChange={(e) => setTaxDesc(e.target.value)}
                placeholder="Standard B2B SaaS GST rate"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsTaxModalOpen(false)}
                className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold bg-[#7A4C72] hover:bg-[#683B60] text-white rounded-lg shadow-sm"
              >
                Save Tax Rule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
