import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Plan, Product, BillingCycle } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const ProductsPlansPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { products, addProduct, updateProduct, deleteProduct, addPlan, updatePlan, deletePlan } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planProductId, setPlanProductId] = useState<string>('');

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodCode, setProdCode] = useState('');
  const [prodCategory, setProdCategory] = useState('Sales & CRM');
  const [prodDescription, setProdDescription] = useState('');

  // Form states for Plan
  const [planName, setPlanName] = useState('');
  const [planCycle, setPlanCycle] = useState<BillingCycle>('monthly');
  const [planPrice, setPlanPrice] = useState<number>(1499);
  const [planDuration, setPlanDuration] = useState<number>(30);
  const [planDesc, setPlanDesc] = useState('');
  const [planFeaturesText, setPlanFeaturesText] = useState('Feature 1\nFeature 2\nFeature 3');
  const [planIsPopular, setPlanIsPopular] = useState(false);

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Open Product Modal
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCode(`PROD-${Math.floor(100 + Math.random() * 900)}`);
    setProdCategory('Sales & CRM');
    setProdDescription('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCode(prod.code);
    setProdCategory(prod.category);
    setProdDescription(prod.description);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        code: prodCode,
        category: prodCategory,
        description: prodDescription,
      });
    } else {
      addProduct({
        name: prodName,
        code: prodCode,
        category: prodCategory,
        description: prodDescription,
        iconName: 'Package',
        status: 'active',
        plans: [
          {
            id: `plan-${Date.now()}`,
            name: 'Standard Monthly',
            billingCycle: 'monthly',
            price: 999,
            durationDays: 30,
            features: ['Essential access', 'Single user', 'Email support'],
            isActive: true,
            description: 'Starter tier for small business operations.',
          },
        ],
      });
    }
    setIsProductModalOpen(false);
  };

  // Open Plan Modal
  const openNewPlanModal = (prodId: string) => {
    setPlanProductId(prodId);
    setEditingPlan(null);
    setPlanName('');
    setPlanCycle('monthly');
    setPlanPrice(1499);
    setPlanDuration(30);
    setPlanDesc('');
    setPlanFeaturesText('Up to 5 Users\nStandard Automation\nEmail Support');
    setPlanIsPopular(false);
    setIsPlanModalOpen(true);
  };

  const openEditPlanModal = (prodId: string, pl: Plan) => {
    setPlanProductId(prodId);
    setEditingPlan(pl);
    setPlanName(pl.name);
    setPlanCycle(pl.billingCycle);
    setPlanPrice(pl.price);
    setPlanDuration(pl.durationDays);
    setPlanDesc(pl.description);
    setPlanFeaturesText(pl.features.join('\n'));
    setPlanIsPopular(!!pl.isPopular);
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = planFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingPlan) {
      updatePlan(planProductId, editingPlan.id, {
        name: planName,
        billingCycle: planCycle,
        price: Number(planPrice),
        durationDays: Number(planDuration),
        description: planDesc,
        features: featuresList,
        isPopular: planIsPopular,
      });
    } else {
      addPlan(planProductId, {
        name: planName,
        billingCycle: planCycle,
        price: Number(planPrice),
        durationDays: Number(planDuration),
        description: planDesc,
        features: featuresList,
        isPopular: planIsPopular,
        isActive: true,
      });
    }
    setIsPlanModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Products & Subscription Plans
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Configure software products, recurring billing tiers, pricing intervals, and feature limits.
          </p>
        </div>
        <button
          onClick={openNewProductModal}
          className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Category row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap capitalize ${
              filterCategory === cat
                ? 'bg-[#EDE5F0] text-[#714B67] font-semibold'
                : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* 2-column layout: Product list on left (5 cols), Plans and details on right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Products Directory */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-[#34313A] px-1">
            Available Products ({filteredProducts.length})
          </div>
          <div className="space-y-2.5">
            {filteredProducts.map((prod) => {
              const isSelected = activeProduct?.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#714B67] shadow-[0_4px_16px_rgba(113,75,103,0.08)] ring-1 ring-[#714B67]'
                      : 'bg-white border-[#E9EBEF] hover:border-[#CBD0D8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EDE5F0] text-[#714B67] flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#34313A]">{prod.name}</div>
                        <div className="text-[11px] font-mono text-[#92939D]">{prod.code}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditProductModal(prod);
                        }}
                        className="p-1 rounded-lg text-[#92939D] hover:text-[#34313A] hover:bg-[#F3F5F8]"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete product "${prod.name}" and its plans?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1 rounded-lg text-[#92939D] hover:text-[#DC6464] hover:bg-[#FDF2F2]"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#696A75] mt-2 line-clamp-2">{prod.description}</p>
                  <div className="mt-3 pt-3 border-t border-[#E9EBEF] flex items-center justify-between text-[11px] text-[#92939D]">
                    <span>Category: {prod.category}</span>
                    <span className="font-mono text-[#714B67] font-medium">
                      {prod.plans.length} Tiers Configured
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Product's Subscription Plans */}
        {activeProduct ? (
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9EBEF]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#34313A]">{activeProduct.name}</h2>
                    <span className="font-mono text-xs text-[#92939D] bg-[#F3F5F8] px-2 py-0.5 rounded-md">
                      {activeProduct.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#92939D] mt-0.5">{activeProduct.description}</p>
                </div>
                <button
                  onClick={() => openNewPlanModal(activeProduct.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#EDE5F0] hover:bg-[#DFCDE2] text-[#714B67] flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pricing Plan</span>
                </button>
              </div>

              {/* Plans Grid */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProduct.plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-4 border relative flex flex-col justify-between transition-all ${
                      plan.isPopular
                        ? 'border-[#714B67] bg-[#EDE5F0]/15 shadow-xs'
                        : 'border-[#E9EBEF] bg-[#FDFDFE]'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-2.5 right-4 bg-[#714B67] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </div>
                    )}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#34313A]">{plan.name}</h3>
                          <span className="text-[11px] font-medium text-[#92939D] capitalize">
                            {plan.billingCycle} ({plan.durationDays} Days)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditPlanModal(activeProduct.id, plan)}
                            className="p-1 rounded text-[#92939D] hover:text-[#34313A]"
                            title="Edit Plan"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove plan "${plan.name}"?`)) {
                                deletePlan(activeProduct.id, plan.id);
                              }
                            }}
                            className="p-1 rounded text-[#92939D] hover:text-[#DC6464]"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="my-3">
                        <span className="text-2xl font-bold font-mono text-[#34313A] tabular-nums">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#92939D]"> /{plan.billingCycle}</span>
                      </div>
                      <p className="text-xs text-[#696A75] mb-3">{plan.description}</p>
                      <div className="space-y-1.5 pt-3 border-t border-[#E9EBEF]">
                        <span className="text-[10px] uppercase font-semibold text-[#92939D] tracking-wider">
                          Included Features
                        </span>
                        {plan.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-[#34313A]">
                            <Check className="w-3.5 h-3.5 text-[#28A879] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E9EBEF] flex items-center justify-between text-[11px] text-[#92939D]">
                      <span>Status: {plan.isActive ? 'Live in Catalog' : 'Draft'}</span>
                      <Badge variant="purple">{plan.billingCycle}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-[#E9EBEF] text-center text-xs text-[#92939D]">
            Select or create a product to manage its pricing plans.
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        subtitle="Catalog entry for SaaS product line"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Product Name</label>
            <input
              type="text"
              required
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="e.g. Omnichannel Helpdesk"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Product Code</label>
              <input
                type="text"
                required
                value={prodCode}
                onChange={(e) => setProdCode(e.target.value)}
                placeholder="PROD-CRM"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Category</label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value="Sales & Customer Relations">Sales & CRM</option>
                <option value="Operations & Inventory">Operations & Inventory</option>
                <option value="Workflow Automation">Workflow Automation</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Analytics & BI">Analytics & BI</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Description</label>
            <textarea
              rows={3}
              value={prodDescription}
              onChange={(e) => setProdDescription(e.target.value)}
              placeholder="Brief explanation of the product capabilities..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Plan Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title={editingPlan ? 'Edit Pricing Plan' : 'Add Pricing Plan'}
        subtitle="Configure billing cadence, price point in INR (₹), and feature limits"
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Plan Name</label>
            <input
              type="text"
              required
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Professional or Scale Tier"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Billing Cycle</label>
              <select
                value={planCycle}
                onChange={(e) => {
                  const val = e.target.value as BillingCycle;
                  setPlanCycle(val);
                  if (val === 'monthly') setPlanDuration(30);
                  else if (val === 'quarterly') setPlanDuration(90);
                  else setPlanDuration(365);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Price in INR (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={planPrice}
                onChange={(e) => setPlanPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Duration (Days)</label>
              <input
                type="number"
                required
                min={1}
                value={planDuration}
                onChange={(e) => setPlanDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Summary Description</label>
            <input
              type="text"
              value={planDesc}
              onChange={(e) => setPlanDesc(e.target.value)}
              placeholder="e.g. Recommended for high-velocity teams"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">
              Included Features (one per line)
            </label>
            <textarea
              rows={4}
              value={planFeaturesText}
              onChange={(e) => setPlanFeaturesText(e.target.value)}
              placeholder="Up to 10 Seats&#10;Unlimited Workflows&#10;Priority SLA Support"
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="planIsPopular"
              checked={planIsPopular}
              onChange={(e) => setPlanIsPopular(e.target.checked)}
              className="rounded text-[#714B67] focus:ring-[#714B67]"
            />
            <label htmlFor="planIsPopular" className="text-xs text-[#34313A]">
              Mark as "Most Popular" highlighted plan
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              {editingPlan ? 'Save Plan' : 'Add Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
