import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const CustomerSubscriptionsPage: React.FC = () => {
  const { currentUser, subscriptions, showToast } = useApp();
  const customerId = currentUser?.customerId || 'cust-1';
  const mySubs = subscriptions.filter((s) => s.customerId === customerId);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('Professional Annual Tier');

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpgradeModalOpen(false);
    showToast({
      type: 'success',
      title: 'Request Received',
      message: `Your request to switch to "${selectedPlanName}" has been submitted to Brightloop billing operations.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            My Subscriptions
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Active product licenses, billing intervals, and subscription lifecycle management.
          </p>
        </div>
        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="px-3.5 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore Upgrade Options</span>
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {mySubs.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-xs text-[#714B67] bg-[#EDE5F0] px-2.5 py-0.5 rounded-md">
                  {sub.subscriptionCode}
                </span>
                <Badge variant={sub.status}>{sub.status.toUpperCase()}</Badge>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#34313A]">{sub.productName}</h2>
                <div className="text-xs font-medium text-[#714B67] mt-0.5">{sub.planName} Plan</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs text-[#696A75]">
                <div>
                  <span className="text-[11px] text-[#92939D]">Billing Interval</span>
                  <div className="font-medium text-[#34313A] capitalize">{sub.billingCycle}</div>
                </div>
                <div>
                  <span className="text-[11px] text-[#92939D]">Start Date</span>
                  <div className="font-medium text-[#34313A]">{sub.startDate}</div>
                </div>
                <div>
                  <span className="text-[11px] text-[#92939D]">Next Renewal Date</span>
                  <div className="font-medium text-[#34313A]">{sub.renewalDate}</div>
                </div>
              </div>
            </div>
            <div className="md:text-right flex flex-col justify-between items-start md:items-end pt-4 md:pt-0 border-t md:border-t-0 border-[#E9EBEF]">
              <div>
                <div className="text-xs text-[#92939D]">Recurring Subscription Price</div>
                <div className="text-2xl font-bold font-mono text-[#34313A] tabular-nums mt-0.5">
                  ₹{sub.amount.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#92939D]">/{sub.billingCycle} (Excl. GST)</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#34313A] transition-colors"
                >
                  Change Tier
                </button>
                <button
                  onClick={() =>
                    showToast({
                      type: 'info',
                      title: 'Support Ticket Raised',
                      message: 'Our billing operations team will contact you regarding this subscription.',
                    })
                  }
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#F3F5F8] hover:bg-[#E9EBEF] text-[#696A75] transition-colors"
                >
                  Help & Billing Inquiry
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Options Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Upgrade Subscription Plan"
        subtitle="Select from available enterprise tiers"
      >
        <form onSubmit={handleUpgradeSubmit} className="space-y-4">
          <div className="space-y-2.5">
            {[
              {
                name: 'Professional Annual (Recommended)',
                price: '₹14,990 / year',
                features: '2 Months free + 25 Seats + WhatsApp Connector',
              },
              {
                name: 'Flow Automation Add-on',
                price: '₹10,999 / year',
                features: 'Unlimited workflow execution + 99.99% Uptime SLA',
              },
              {
                name: 'Cloud ERP Core - Growth',
                price: '₹3,499 / month',
                features: 'Multi-warehouse stock control + GST e-invoicing',
              },
            ].map((tier, idx) => (
              <label
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E9EBEF] hover:border-[#714B67] hover:bg-[#FDFDFE] cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="tier"
                  checked={selectedPlanName === tier.name}
                  onChange={() => setSelectedPlanName(tier.name)}
                  className="mt-1 text-[#714B67] focus:ring-[#714B67]"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-[#34313A]">{tier.name}</span>
                    <span className="font-mono text-xs font-bold text-[#714B67]">{tier.price}</span>
                  </div>
                  <p className="text-[11px] text-[#92939D] mt-0.5">{tier.features}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white"
            >
              Request Upgrade
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
