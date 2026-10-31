import React, { useState } from 'react';
import {
  Receipt,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { InvoiceModal } from '../../components/ui/InvoiceModal';
import { PayInvoiceModal } from '../../components/ui/PayInvoiceModal';
import { Modal } from '../../components/ui/Modal';

interface CustomerOverviewProps {
  onNavigate: (path: string) => void;
}

export const CustomerOverview: React.FC<CustomerOverviewProps> = ({ onNavigate }) => {
  const { currentUser, subscriptions, invoices, payments, showToast } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Rahul Sharma's customer ID is 'cust-1'
  const customerId = currentUser?.customerId || 'cust-1';

  // Filter ONLY this customer's data!
  const mySubscriptions = subscriptions.filter((s) => s.customerId === customerId);
  const myInvoices = invoices.filter((i) => i.customerId === customerId);
  const myPayments = payments.filter((p) => p.customerId === customerId);

  const activeSub = mySubscriptions.find((s) => s.status === 'active') || mySubscriptions[0];
  const pendingInvoices = myInvoices.filter((i) => i.status === 'pending' || i.status === 'overdue');
  const amountDue = pendingInvoices.reduce((acc, i) => acc + i.total, 0);

  const handleRequestUpgrade = () => {
    setIsUpgradeModalOpen(false);
    showToast({
      type: 'success',
      title: 'Upgrade Request Submitted',
      message: 'Your account manager has been notified and will apply the Enterprise Annual tier.',
    });
  };

  const handleRequestCancel = () => {
    setIsCancelModalOpen(false);
    showToast({
      type: 'warning',
      title: 'Cancellation Request Logged',
      message: 'A confirmation will be sent to your email before the next billing cycle.',
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Welcome header with subtle decorative watermark */}
      <div className="relative overflow-hidden bg-white/60 p-6 rounded-2xl border border-[#E9EBEF] backdrop-blur-xs">
        <div className="bg-decorative-watermark -top-2 right-4 text-7xl font-serif opacity-20 pointer-events-none select-none hidden sm:block">
          SUBSCRIBER
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="sub-caps text-[#7A4C72] mb-1">Customer Workspace</div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#29252A] font-serif">
                Welcome back, {currentUser?.name?.split(' ')[0] || 'Rahul'}
              </h1>
              <span className="text-[10px] font-semibold bg-[#EBF7F2] text-[#28A879] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Active Member
              </span>
            </div>
            <p className="text-xs text-[#92939D] mt-1">
              {currentUser?.company || 'Sharma Logistics Solutions'} • Manage your active licenses, billing invoices, and UPI mandate.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('my-invoices')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E9EBEF] bg-white hover:bg-[#F3F5F8] text-[#29252A] flex items-center gap-1.5 transition-colors"
            >
              <Receipt className="w-3.5 h-3.5 text-[#7A4C72]" />
              <span>My Invoices</span>
            </button>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#7A4C72] hover:bg-[#683B60] text-white flex items-center gap-1.5 shadow-[0_2px_8px_rgba(113,75,103,0.25)] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Change Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Plan Hero Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#92939D] mb-3">
              <span>Current Active Subscription</span>
              {activeSub && <Badge variant={activeSub.status}>{activeSub.status.toUpperCase()}</Badge>}
            </div>
            {activeSub ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#34313A]">{activeSub.productName}</h2>
                    <div className="text-xs font-medium text-[#7A4C72]">{activeSub.planName} Tier</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-[#34313A] tabular-nums">
                      ₹{activeSub.amount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-[#92939D]">/{activeSub.billingCycle}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E9EBEF] space-y-2 text-xs">
                  <div className="flex justify-between text-[#696A75]">
                    <span>Subscription Code:</span>
                    <span className="font-mono font-medium text-[#34313A]">
                      {activeSub.subscriptionCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#696A75]">
                    <span>Next Auto-Renewal Date:</span>
                    <span className="font-medium text-[#34313A] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#7A4C72]" />
                      {activeSub.renewalDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#696A75]">
                    <span>Payment Mandate:</span>
                    <span className="font-medium text-[#28A879]">{activeSub.paymentMethod}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E9EBEF] flex items-center justify-between">
                  <button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="text-xs text-[#7A4C72] hover:underline font-semibold"
                  >
                    Upgrade Tier
                  </button>
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="text-xs text-[#DC6464] hover:underline"
                  >
                    Request Cancellation
                  </button>
                </div>
              </>
            ) : (
              <div className="text-xs text-[#92939D] py-6 text-center">
                No active subscriptions currently on record.
              </div>
            )}
          </div>

          {/* Amount Due / Pending Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#34313A]">Payment Due</span>
              {amountDue > 0 ? (
                <span className="text-[10px] text-[#DC6464] bg-[#FDF2F2] px-2 py-0.5 rounded font-medium">
                  Due Soon
                </span>
              ) : (
                <span className="text-[10px] text-[#28A879] bg-[#EBF7F2] px-2 py-0.5 rounded font-medium">
                  All Clear
                </span>
              )}
            </div>
            <div className="text-2xl font-bold font-mono text-[#34313A] tabular-nums">
              ₹{amountDue.toLocaleString('en-IN')}
            </div>
            {pendingInvoices.length > 0 ? (
              <div className="mt-4 pt-3 border-t border-[#E9EBEF] space-y-2">
                {pendingInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-[#7A4C72]">{inv.invoiceNumber}</span>
                      <div className="text-[10px] text-[#92939D]">Due {inv.dueDate}</div>
                    </div>
                    <button
                      onClick={() => setPayingInvoice(inv)}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-[#7A4C72] text-white hover:bg-[#683B60] transition-colors"
                    >
                      Pay Now (₹{inv.total.toLocaleString('en-IN')})
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#92939D] mt-2">
                All previous billing cycles have been settled via UPI autopay.
              </p>
            )}
          </div>
        </div>

        {/* Right column: Recent Invoices & Payment Receipts (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#34313A]">Recent Tax Invoices</h3>
                <p className="text-xs text-[#92939D]">Your recurring GST billing history and receipts.</p>
              </div>
              <button
                onClick={() => onNavigate('my-invoices')}
                className="text-xs text-[#7A4C72] hover:underline font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {myInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FB] border border-[#E9EBEF] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-xs text-[#7A4C72]">
                        {inv.invoiceNumber}
                      </span>
                      <Badge variant={inv.status}>{inv.status.toUpperCase()}</Badge>
                    </div>
                    <div className="text-xs text-[#34313A] mt-1 line-clamp-1">
                      {inv.items[0]?.description || 'Recurring Subscription'}
                    </div>
                    <div className="text-[11px] text-[#92939D]">Issue Date: {inv.issueDate}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-[#34313A] tabular-nums">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2 py-0.5 text-[11px] rounded border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
                      >
                        PDF
                      </button>
                      {inv.status === 'pending' && (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-2 py-0.5 text-[11px] rounded bg-[#7A4C72] text-white hover:bg-[#683B60]"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Receipts Ledger */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#34313A]">Recent Settlements</span>
              <button
                onClick={() => onNavigate('payment-history')}
                className="text-xs text-[#7A4C72] hover:underline font-medium"
              >
                Full History
              </button>
            </div>
            <div className="space-y-2">
              {myPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F9FB] border border-[#E9EBEF] text-xs"
                >
                  <div>
                    <div className="font-mono text-[11px] text-[#34313A] font-medium">
                      {p.transactionReference}
                    </div>
                    <div className="text-[10px] text-[#92939D]">
                      {p.paymentMethod} • {p.paymentDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-[#28A879] tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>
                    <div className="text-[10px] text-[#28A879] font-medium">Settled</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Request Subscription Plan Upgrade"
        subtitle="Transition your team to a higher license or annual discounted commitment"
      >
        <div className="space-y-4 text-xs text-[#34313A]">
          <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E9EBEF]">
            <span className="font-semibold text-sm">Recommended: Professional Annual Tier</span>
            <div className="my-1 text-base font-bold font-mono text-[#7A4C72]">
              ₹14,990 / year
            </div>
            <p className="text-xs text-[#696A75]">
              Includes 2 months free, unlimited contacts, automated WhatsApp connector, and dedicated SLA.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">
              Additional Seats or Requests (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Please add 5 extra sales agent seats..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#7A4C72]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestUpgrade}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#7A4C72] hover:bg-[#683B60] text-white"
            >
              Submit Upgrade Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Request Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Subscription Cancellation Request"
        subtitle="Please let us know how we can improve before you leave"
      >
        <div className="space-y-4 text-xs text-[#34313A]">
          <p className="text-[#696A75]">
            If you cancel, your access will remain active until the end of your prepaid period (
            {activeSub?.renewalDate || 'current cycle end'}). No further automatic charges will occur.
          </p>
          <div>
            <label className="block text-xs font-medium text-[#34313A] mb-1">Reason for Cancellation</label>
            <select className="w-full px-3 py-2 text-xs rounded-xl border border-[#E9EBEF] focus:outline-none focus:border-[#7A4C72]">
              <option>Project completed / No longer needed</option>
              <option>Budget constraints</option>
              <option>Switching to another solution</option>
              <option>Missing specific feature</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8]"
            >
              Keep My Plan
            </button>
            <button
              onClick={handleRequestCancel}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#DC6464] hover:bg-[#c95353] text-white"
            >
              Confirm Cancellation Request
            </button>
          </div>
        </div>
      </Modal>

      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPayNow={(inv) => setPayingInvoice(inv)}
      />
      <PayInvoiceModal
        invoice={payingInvoice}
        isOpen={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
      />
    </div>
  );
};
