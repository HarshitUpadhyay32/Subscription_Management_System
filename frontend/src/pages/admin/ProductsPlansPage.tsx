import React, { useState } from 'react';
import {
  Package,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Upload,
  ArrowLeft,
  Check,
  Edit2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Plan, Product, BillingCycle } from '../../types';
import { Badge } from '../../components/ui/Badge';

export const ProductsPlansPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { products, addProduct, updateProduct, deleteProduct, addPlan, deletePlan } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'plans'>('products');
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [localSearch, setLocalSearch] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states for Create / Edit Product matching Image 1 screen 5
  const [formName, setFormName] = useState('');
  const [formBasePrice, setFormBasePrice] = useState('999');
  const [formType, setFormType] = useState('SaaS');
  const [formCostPrice, setFormCostPrice] = useState('500');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  // Search filter
  const effectiveQuery = searchQuery || localSearch;
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setFormName('');
    setFormBasePrice('999');
    setFormType('SaaS');
    setFormCostPrice('500');
    setFormDescription('');
    setFormStatus('active');
    setViewMode('create');
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormBasePrice(String(prod.basePrice || prod.plans[0]?.price || 999));
    setFormType(prod.productType || 'SaaS');
    setFormCostPrice(String(prod.costPrice || 500));
    setFormDescription(prod.description);
    setFormStatus(prod.status === 'archived' ? 'inactive' : (prod.status as any));
    setViewMode('create');
  };

  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formName.trim()) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        basePrice: parseFloat(formBasePrice) || 999,
        costPrice: parseFloat(formCostPrice) || 0,
        productType: formType,
        description: formDescription,
        status: formStatus as any,
      });
    } else {
      addProduct({
        name: formName,
        code: `BL-${formName.slice(0, 3).toUpperCase()}`,
        category: formType,
        description: formDescription || 'Complete subscription product for business operations.',
        iconName: 'Package',
        status: formStatus as any,
        basePrice: parseFloat(formBasePrice) || 999,
        costPrice: parseFloat(formCostPrice) || 0,
        productType: formType,
        plans: [
          {
            id: `plan-${Date.now()}`,
            name: `${formName} - Standard`,
            billingCycle: 'monthly',
            price: parseFloat(formBasePrice) || 999,
            durationDays: 30,
            features: ['Full application access', 'Standard analytics', 'Email support'],
            isActive: true,
            description: 'Default monthly tier.',
          },
        ],
      });
    }
    setViewMode('list');
  };

  const getProductIcon = (idx: number) => {
    const bgColors = ['bg-[#7A4C72]', 'bg-blue-600', 'bg-indigo-600', 'bg-rose-600', 'bg-emerald-600'];
    const color = bgColors[idx % bgColors.length];
    return (
      <div className={`w-8 h-8 rounded-lg ${color} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
        <Package className="w-4 h-4" />
      </div>
    );
  };

  // Screen 5: Create Product Form View
  if (viewMode === 'create') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto font-sans">
        {/* Breadcrumb matching Image 1 screen 5 */}
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <button onClick={() => setViewMode('list')} className="hover:text-gray-900">
            Products
          </button>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">
            {editingProductId ? 'Edit Product' : 'New Product'}
          </span>
        </div>

        {/* Header with Cancel and Save buttons */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {editingProductId ? 'Edit Product' : 'Create Product'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveProduct()}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white transition-all shadow-sm"
            >
              Save
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Brightloop CRM"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72]"
                />
              </div>

              {/* Base Price (INR) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Base Price (INR) *
                </label>
                <input
                  type="number"
                  required
                  value={formBasePrice}
                  onChange={(e) => setFormBasePrice(e.target.value)}
                  placeholder="999"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72]"
                />
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Product Type *
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72]"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="Platform">Platform</option>
                  <option value="API Service">API Service</option>
                  <option value="Support Package">Support Package</option>
                </select>
              </div>

              {/* Cost Price (INR) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Cost Price (INR)
                </label>
                <input
                  type="number"
                  value={formCostPrice}
                  onChange={(e) => setFormCostPrice(e.target.value)}
                  placeholder="500"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72]"
                />
              </div>

              {/* Description (spans 2 columns on desktop) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Complete customer relationship management solution for modern businesses"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A4C72]/20 focus:border-[#7A4C72]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Product Image Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[#7A4C72]/50 transition-colors cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs font-medium text-gray-700">Upload Image</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG up to 2MB</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Screen 4: Products List View
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your products and subscription plans</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Main card with tabs and table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tabs: Products / Plans */}
        <div className="px-5 pt-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'products'
                  ? 'border-[#7A4C72] text-[#7A4C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'plans'
                  ? 'border-[#7A4C72] text-[#7A4C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Plans
            </button>
          </div>

          {/* Search + Filter toolbar */}
          <div className="flex items-center gap-2 pb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
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

        {/* Tab 1: Products Table matching Image 1 screen 4 */}
        {activeTab === 'products' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Base Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredProducts.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {getProductIcon(idx)}
                        <div>
                          <div className="font-semibold text-gray-900">{prod.name}</div>
                          <div className="text-[11px] text-gray-400 truncate max-w-xs">{prod.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-medium">
                      {prod.productType || 'SaaS'}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      ₹{(prod.basePrice || prod.plans[0]?.price || 999).toLocaleString('en-IN')}.00
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={prod.status === 'archived' ? 'inactive' : prod.status}>
                        {prod.status === 'archived' ? 'Inactive' : prod.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{prod.createdAt}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1 text-gray-400 hover:text-[#7A4C72] rounded hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Delete"
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
        ) : (
          /* Tab 2: Plans */
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.flatMap((p) =>
              p.plans.map((pl) => (
                <div key={pl.id} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#7A4C72] transition-colors space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">{p.name}</div>
                      <div className="text-sm font-bold text-gray-900 mt-0.5">{pl.name}</div>
                    </div>
                    <Badge variant={pl.isActive ? 'active' : 'inactive'}>
                      {pl.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ₹{pl.price.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-gray-400">/{pl.billingCycle}</span>
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">{pl.description}</div>
                  <ul className="text-xs text-gray-600 space-y-1 pt-1 border-t border-gray-100">
                    {pl.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#1E834D]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
