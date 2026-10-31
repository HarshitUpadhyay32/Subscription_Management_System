import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const CustomersPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { customers, subscriptions, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('+91 98201 00000');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const effectiveQuery = searchQuery || localSearch;
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setCompany('');
    setPhone('+91 98201 00000');
    setStatus('active');
    setIsFormModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setEmail(c.email);
    setCompany(c.company);
    setPhone(c.phone);
    setStatus(c.status);
    setIsFormModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        email,
        company,
        phone,
        status,
      });
    } else {
      const initials = name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      addCustomer({
        name,
        email,
        company,
        phone,
        address: 'Bangalore Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        status,
        avatar: initials || 'CU',
        subscriptionsCount: 1,
      });
    }
    setIsFormModalOpen(false);
  };

  const getAvatarInitials = (c: Customer) => {
    if (c.avatar && c.avatar.length <= 3) return c.avatar;
    return c.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarBg = (idx: number) => {
    const bgs = ['bg-blue-600', 'bg-teal-600', 'bg-indigo-600', 'bg-slate-700', 'bg-sky-600'];
    return bgs[idx % bgs.length];
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your customers and their information</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
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
              placeholder="Search customers..."
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

        {/* Table matching Image 1 screen 6 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Subscriptions</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredCustomers.map((cust, idx) => {
                const subCount =
                  cust.subscriptionsCount !== undefined
                    ? cust.subscriptionsCount
                    : subscriptions.filter((s) => s.customerId === cust.id).length;

                return (
                  <tr key={cust.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full ${getAvatarBg(
                            idx
                          )} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          {getAvatarInitials(cust)}
                        </div>
                        <span className="font-semibold text-gray-900">{cust.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-medium">{cust.company}</td>
                    <td className="px-5 py-3 text-gray-500">{cust.email}</td>
                    <td className="px-5 py-3">
                      <Badge variant={cust.status}>{cust.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-800 font-medium pl-8">{subCount}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(cust)}
                          className="p-1 text-gray-400 hover:text-[#7A4C72] rounded hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCustomer(cust.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title="Customer Profile"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#7A4C72] text-white flex items-center justify-center font-bold text-base">
                {getAvatarInitials(selectedCustomer)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{selectedCustomer.name}</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block mb-0.5">Email</span>
                <span className="font-medium text-gray-800">{selectedCustomer.email}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block mb-0.5">Phone</span>
                <span className="font-medium text-gray-800">{selectedCustomer.phone}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block mb-0.5">Status</span>
                <Badge variant={selectedCustomer.status}>{selectedCustomer.status}</Badge>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block mb-0.5">Total Spent</span>
                <span className="font-bold text-gray-900">
                  ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Customer Modal */}
      {isFormModalOpen && (
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        >
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Technologies"
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Pvt Ltd"
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@acme.com"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 44521"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-[#7A4C72] hover:bg-[#683B60] text-white rounded-lg shadow-sm"
              >
                Save Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
