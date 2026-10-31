import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Mail,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const StaffManagementPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { staff, addStaff, updateStaff, toggleStaffStatus } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Billing Operations');
  const [department, setDepartment] = useState('Finance & Operations');

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setRole('Billing Operations');
    setDepartment('Finance & Invoicing');
    setIsModalOpen(true);
  };

  const openEditModal = (s: StaffMember) => {
    setEditingStaff(s);
    setName(s.name);
    setEmail(s.email);
    setRole(s.role);
    setDepartment(s.department);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name,
        email,
        role,
        department,
      });
    } else {
      addStaff({
        name,
        email,
        role,
        department,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Staff & Role-Based Access Control
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Administer internal operators, billing specialists, customer support teams, and permissions.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E9EBEF]"
                />
                <button
                  onClick={() => toggleStaffStatus(member.id)}
                  title="Toggle status"
                  className="text-[#92939D] hover:text-[#34313A]"
                >
                  {member.status === 'active' ? (
                    <ToggleRight className="w-6 h-6 text-[#28A879]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-[#92939D]" />
                  )}
                </button>
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-sm text-[#34313A]">{member.name}</h3>
                <div className="text-[11px] text-[#714B67] font-medium mt-0.5">{member.role}</div>
                <div className="text-[11px] text-[#92939D]">{member.department}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E9EBEF] space-y-1 text-[11px] text-[#92939D]">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>Joined {member.joinedDate}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Assigned Portfolios:</span>
                  <span className="font-mono text-[#34313A] font-medium">
                    {member.assignedCustomersCount} Clients
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E9EBEF] flex items-center justify-between">
              <Badge variant={member.status === 'active' ? 'active' : 'draft'}>
                {member.status.toUpperCase()}
              </Badge>
              <button
                onClick={() => openEditModal(member)}
                className="p-1.5 rounded-lg text-[#696A75] hover:text-[#34313A] hover:bg-[#F3F5F8]"
                title="Edit staff member"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Staff */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Credentials' : 'Add Staff Member'}
        subtitle="Configure role privileges and operational department"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arjun Nair"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arjun@brightloop.io"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Role Privileges</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              >
                <option value="Super Admin">Super Admin (Unrestricted)</option>
                <option value="Billing Operations">Billing Operations</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Sales Representative">Sales Representative</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Finance & Invoicing"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              {editingStaff ? 'Update Member' : 'Enrol Staff Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
