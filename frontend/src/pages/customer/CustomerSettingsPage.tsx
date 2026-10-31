import React, { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerSettingsPage: React.FC = () => {
  const { currentUser, customers, updateCustomer, showToast } = useApp();
  const customerId = currentUser?.customerId || 'cust-1';
  const myProfile = customers.find((c) => c.id === customerId);

  const [name, setName] = useState(myProfile?.name || currentUser?.name || '');
  const [company, setCompany] = useState(myProfile?.company || currentUser?.company || '');
  const [email, setEmail] = useState(myProfile?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(myProfile?.phone || '+91 98201 44521');
  const [address, setAddress] = useState(myProfile?.address || 'Plot 42, MIDC Industrial Area');
  const [gstin, setGstin] = useState(myProfile?.gstin || '27AABCS1429B1Z2');
  const [notifyInvoice, setNotifyInvoice] = useState(true);
  const [notifyRenew, setNotifyRenew] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (myProfile) {
      updateCustomer(myProfile.id, {
        name,
        company,
        email,
        phone,
        address,
        gstin,
      });
    }
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your company details and billing notifications preferences have been saved.',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
          Account & Billing Settings
        </h1>
        <p className="text-xs text-[#92939D] mt-0.5">
          Manage your organizational contact details, registered GSTIN, and automated notification channels.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EBEF]">
            <Building2 className="w-4 h-4 text-[#714B67]" />
            <h2 className="text-sm font-semibold text-[#34313A]">Organization & Contact Profile</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Company Legal Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Billing Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Billing Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EBEF]">
            <h2 className="text-sm font-semibold text-[#34313A]">Communication Preferences</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyInvoice}
                onChange={(e) => setNotifyInvoice(e.target.checked)}
                className="rounded text-[#714B67] focus:ring-[#714B67]"
              />
              <span className="text-xs text-[#34313A]">
                Receive instant PDF invoices via email upon recurring renewal
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyRenew}
                onChange={(e) => setNotifyRenew(e.target.checked)}
                className="rounded text-[#714B67] focus:ring-[#714B67]"
              />
              <span className="text-xs text-[#34313A]">
                Send SMS & Email reminder 48 hours prior to UPI autopay execution
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-2 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Account Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
