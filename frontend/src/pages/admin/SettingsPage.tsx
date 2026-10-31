import React, { useState } from 'react';
import {
  Building2,
  Receipt,
  Bell,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [legalEntity, setLegalEntity] = useState(settings.legalEntity);
  const [gstin, setGstin] = useState(settings.gstin);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [state, setState] = useState(settings.state);
  const [pincode, setPincode] = useState(settings.pincode);
  const [currency] = useState(settings.currency);
  const [currencySymbol] = useState(settings.currencySymbol);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);
  const [quotationPrefix, setQuotationPrefix] = useState(settings.quotationPrefix);
  const [subscriptionPrefix, setSubscriptionPrefix] = useState(settings.subscriptionPrefix);
  const [defaultPaymentTermsDays, setDefaultPaymentTermsDays] = useState(settings.defaultPaymentTermsDays);
  const [enableAutoRenewDefault, setEnableAutoRenewDefault] = useState(settings.enableAutoRenewDefault);
  const [sendEmailOnInvoice, setSendEmailOnInvoice] = useState(settings.sendEmailOnInvoice);
  const [sendRenewalReminders, setSendRenewalReminders] = useState(settings.sendRenewalReminders);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      legalEntity,
      gstin,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      currency,
      currencySymbol,
      invoicePrefix,
      quotationPrefix,
      subscriptionPrefix,
      defaultPaymentTermsDays: Number(defaultPaymentTermsDays),
      enableAutoRenewDefault,
      sendEmailOnInvoice,
      sendRenewalReminders,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            System & Billing Settings
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Configure legal business details, GSTIN compliance, invoice serial prefixes, and billing automation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EBEF]">
            <Building2 className="w-4 h-4 text-[#714B67]" />
            <h2 className="text-sm font-semibold text-[#34313A]">Company & Tax Identity</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Company Trade Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Legal Registered Entity</label>
              <input
                type="text"
                required
                value={legalEntity}
                onChange={(e) => setLegalEntity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Statutory GSTIN</label>
              <input
                type="text"
                required
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Official Billing Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Support Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Registered Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Pincode</label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
        </div>

        {/* Invoice & Serial Prefixes Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EBEF]">
            <Receipt className="w-4 h-4 text-[#714B67]" />
            <h2 className="text-sm font-semibold text-[#34313A]">Document Numbering & Terms</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Invoice Prefix</label>
              <input
                type="text"
                required
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Quotation Prefix</label>
              <input
                type="text"
                required
                value={quotationPrefix}
                onChange={(e) => setQuotationPrefix(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Subscription Prefix</label>
              <input
                type="text"
                required
                value={subscriptionPrefix}
                onChange={(e) => setSubscriptionPrefix(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Currency</label>
              <input
                type="text"
                disabled
                value={`${currency} (${currencySymbol})`}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] bg-[#F8F9FB] text-[#696A75]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">
                Default Payment Due Days
              </label>
              <input
                type="number"
                min={1}
                max={90}
                required
                value={defaultPaymentTermsDays}
                onChange={(e) => setDefaultPaymentTermsDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#714B67]"
              />
            </div>
          </div>
        </div>

        {/* Automation & Notification Settings */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9EBEF]">
            <Bell className="w-4 h-4 text-[#714B67]" />
            <h2 className="text-sm font-semibold text-[#34313A]">Automation & Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAutoRenewDefault}
                onChange={(e) => setEnableAutoRenewDefault(e.target.checked)}
                className="rounded text-[#714B67] focus:ring-[#714B67]"
              />
              <span className="text-xs text-[#34313A]">
                Default new subscriptions to automatic recurring renewal
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmailOnInvoice}
                onChange={(e) => setSendEmailOnInvoice(e.target.checked)}
                className="rounded text-[#714B67] focus:ring-[#714B67]"
              />
              <span className="text-xs text-[#34313A]">
                Automatically dispatch GST tax invoice PDF to customer email on billing cycle trigger
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendRenewalReminders}
                onChange={(e) => setSendRenewalReminders(e.target.checked)}
                className="rounded text-[#714B67] focus:ring-[#714B67]"
              />
              <span className="text-xs text-[#34313A]">
                Send automated renewal reminder notifications 3 days before renewal date
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
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
