import React, { useState } from 'react';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Building2,
  Repeat,
  Receipt,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const CustomersPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { customers, subscriptions, invoices, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [gstin, setGstin] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.gstin && c.gstin.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setCompany('');
    setPhone('+91 9');
    setAddress('');
    setCity('Mumbai');
    setState('Maharashtra');
    setGstin('');
    setStatus('active');
    setIsFormModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setEmail(c.email);
    setCompany(c.company);
    setPhone(c.phone);
    setAddress(c.address);
    setCity(c.city);
    setState(c.state);
    setGstin(c.gstin || '');
    setStatus(c.status);
    setIsFormModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        email,
        company,
        phone,
        address,
        city,
        state,
        gstin,
        status,
      });
    } else {
      addCustomer({
        name,
        email,
        company,
        phone,
        address,
        city,
        state,
        gstin,
        status,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
    setIsFormModalOpen(false);
  };

  // Associated data for selected customer
  const customerSubs = selectedCustomer
    ? subscriptions.filter((s) => s.customerId === selectedCustomer.id)
    : [];
  const customerInvs = selectedCustomer
    ? invoices.filter((i) => i.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Customer Directory
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Manage subscriber accounts, billing profiles, GST identities, and account history.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'active', 'inactive'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
              statusFilter === st
                ? 'bg-[#EDE5F0] text-[#714B67] font-semibold'
                : 'bg-white border border-[#E9EBEF] text-[#696A75] hover:bg-[#F3F5F8]'
            }`}
          >
            {st === 'all' ? 'All Customers' : st}
          </button>
        ))}
        <span className="text-xs text-[#92939D] ml-auto">
          Showing {filteredCustomers.length} accounts
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-3 px-4 font-medium">Customer & Company</th>
                <th className="py-3 px-4 font-medium">Contact Details</th>
                <th className="py-3 px-4 font-medium">Location</th>
                <th className="py-3 px-4 font-medium">GSTIN</th>
                <th className="py-3 px-4 font-medium text-right">Lifetime Value</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FDFDFE] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-8 h-8 rounded-lg object-cover border border-[#E9EBEF]"
                      />
                      <div>
                        <div className="font-semibold text-[#34313A]">{cust.name}</div>
                        <div className="text-[11px] text-[#696A75] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#92939D]" />
                          <span>{cust.company}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#696A75]">
                    <div>{cust.email}</div>
                    <div className="text-[11px] text-[#92939D] font-mono">{cust.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-[#696A75]">
                    <div>{cust.city}</div>
                    <div className="text-[11px] text-[#92939D]">{cust.state}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#34313A]">
                    {cust.gstin || <span className="text-[#92939D] italic">Unregistered</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#34313A] tabular-nums">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={cust.status}>{cust.status.toUpperCase()}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="p-1.5 rounded-lg text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8]"
                        title="View Full Profile & History"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(cust)}
                        className="p-1.5 rounded-lg text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8]"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove customer ${cust.name}?`)) {
                            deleteCustomer(cust.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#92939D] hover:text-[#DC6464] hover:bg-[#FDF2F2]"
                        title="Delete Customer"
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

      {/* Customer 360 Details Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`${selectedCustomer.company} • Member since ${selectedCustomer.joinedDate}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs text-[#34313A]">
            {/* Top Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F8F9FB] rounded-xl border border-[#E9EBEF]">
              <div>
                <span className="text-[11px] text-[#92939D]">Contact & Billing</span>
                <p className="font-medium text-[#34313A] mt-0.5">{selectedCustomer.email}</p>
                <p className="font-mono text-[#696A75]">{selectedCustomer.phone}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#92939D]">Billing Address</span>
                <p className="font-medium text-[#34313A] mt-0.5">{selectedCustomer.address}</p>
                <p className="text-[#696A75]">
                  {selectedCustomer.city}, {selectedCustomer.state}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#92939D]">GSTIN & Status</span>
                <p className="font-mono font-medium text-[#34313A] mt-0.5">
                  {selectedCustomer.gstin || 'Not Provided'}
                </p>
                <div className="mt-1">
                  <Badge variant={selectedCustomer.status}>{selectedCustomer.status.toUpperCase()}</Badge>
                </div>
              </div>
            </div>

            {/* Active Subscriptions Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#34313A] flex items-center gap-1.5">
                  <Repeat className="w-4 h-4 text-[#714B67]" />
                  Subscription History ({customerSubs.length})
                </span>
              </div>
              {customerSubs.length === 0 ? (
                <div className="p-4 bg-white rounded-xl border border-[#E9EBEF] text-[#92939D] text-center">
                  No active subscriptions currently on record for this customer.
                </div>
              ) : (
                <div className="border border-[#E9EBEF] rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
                      <tr>
                        <th className="py-2 px-3 font-medium">Sub Code</th>
                        <th className="py-2 px-3 font-medium">Product / Plan</th>
                        <th className="py-2 px-3 font-medium text-center">Cycle</th>
                        <th className="py-2 px-3 font-medium text-right">Amount</th>
                        <th className="py-2 px-3 font-medium text-center">Next Renewal</th>
                        <th className="py-2 px-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9EBEF]">
                      {customerSubs.map((sub) => (
                        <tr key={sub.id} className="hover:bg-[#FDFDFE]">
                          <td className="py-2.5 px-3 font-mono font-medium">{sub.subscriptionCode}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-[#34313A]">{sub.productName}</span>
                            <span className="text-[11px] text-[#92939D] ml-1">({sub.planName})</span>
                          </td>
                          <td className="py-2.5 px-3 text-center capitalize">{sub.billingCycle}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                            ₹{sub.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-center text-[#696A75]">{sub.renewalDate}</td>
                          <td className="py-2.5 px-3 text-center">
                            <Badge variant={sub.status}>{sub.status.toUpperCase()}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Invoices Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#34313A] flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[#714B67]" />
                  Invoices ({customerInvs.length})
                </span>
              </div>
              {customerInvs.length === 0 ? (
                <div className="p-4 bg-white rounded-xl border border-[#E9EBEF] text-[#92939D] text-center">
                  No invoices generated yet.
                </div>
              ) : (
                <div className="border border-[#E9EBEF] rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
                      <tr>
                        <th className="py-2 px-3 font-medium">Invoice #</th>
                        <th className="py-2 px-3 font-medium">Issue Date</th>
                        <th className="py-2 px-3 font-medium">Due Date</th>
                        <th className="py-2 px-3 font-medium text-right">Total Amount</th>
                        <th className="py-2 px-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9EBEF]">
                      {customerInvs.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[#FDFDFE]">
                          <td className="py-2.5 px-3 font-mono font-medium">{inv.invoiceNumber}</td>
                          <td className="py-2.5 px-3">{inv.issueDate}</td>
                          <td className="py-2.5 px-3 text-[#696A75]">{inv.dueDate}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium tabular-nums">
                            ₹{inv.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <Badge variant={inv.status}>{inv.status.toUpperCase()}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E9EBEF]">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#F3F5F8] text-[#34313A] hover:bg-[#E9EBEF]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCustomer ? 'Edit Customer Account' : 'Add New Customer'}
        subtitle="Business billing profile and GST registration details"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Contact Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Company / Entity</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Sharma Logistics Solutions"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@company.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98201 44521"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Billing Street Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Suite / Floor / Industrial Estate"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="27AABCS1429B1Z2"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value="active">Active Subscriber</option>
                <option value="inactive">Inactive / Onboarding</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              {editingCustomer ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
