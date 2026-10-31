import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const StaffManagementPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { staff, addStaff, updateStaff, toggleStaffStatus } = useApp();
  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const effectiveQuery = searchQuery || localSearch;
  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setRole('Staff');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (s: StaffMember) => {
    setEditingStaff(s);
    setName(s.name);
    setEmail(s.email);
    setRole(s.role);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name,
        email,
        role: role as any,
        status,
      });
    } else {
      addStaff({
        name,
        email,
        role: role as any,
        department: 'Operations',
        status,
        lastLogin: 'Today',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header matching Image 1 screen 12 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Staff Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage staff members and their roles</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Staff</span>
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
              placeholder="Search staff members..."
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

        {/* Table matching Image 1 screen 12 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Login</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-900">{member.name}</td>
                  <td className="px-5 py-3 text-gray-500">{member.email}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">Staff</td>
                  <td className="px-5 py-3">
                    <Badge variant={member.status}>{member.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{member.lastLogin || '30 Oct 2026'}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openEditModal(member)}
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

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        >
          <form onSubmit={handleSave} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Mehta"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@brightloop.com"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A4C72]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold bg-[#7A4C72] hover:bg-[#683B60] text-white rounded-lg shadow-sm"
              >
                Save Staff
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
