import React, { useState } from 'react';
import { CreditCard, QrCode, Smartphone, Loader2, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { Invoice } from '../../types';
import { useApp } from '../../context/AppContext';

interface PayInvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const { payInvoice } = useApp();
  const [method, setMethod] = useState<'UPI' | 'Credit Card'>('UPI');
  const [upiId, setUpiId] = useState('rahul.sharma@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4125');
  const [expiry, setExpiry] = useState('11/28');
  const [cvv, setCvv] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!invoice) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      payInvoice(
        invoice.id,
        method,
        method === 'UPI' ? upiId : cardNumber.slice(-4)
      );
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Payment"
      subtitle={`Settle ${invoice.invoiceNumber} • ₹${invoice.total.toLocaleString('en-IN')}`}
      maxWidth="md"
    >
      <form onSubmit={handlePay} className="space-y-4">
        {/* Method selector */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setMethod('UPI')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              method === 'UPI'
                ? 'border-[#714B67] bg-[#EDE5F0]/40 text-[#714B67]'
                : 'border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#34313A]'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <div>
              <div className="text-xs font-semibold">UPI Autopay</div>
              <div className="text-[10px] text-[#92939D]">GPay, PhonePe, Paytm</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMethod('Credit Card')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              method === 'Credit Card'
                ? 'border-[#714B67] bg-[#EDE5F0]/40 text-[#714B67]'
                : 'border-[#E9EBEF] hover:bg-[#F3F5F8] text-[#34313A]'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <div>
              <div className="text-xs font-semibold">Card</div>
              <div className="text-[10px] text-[#92939D]">Visa, Mastercard, RuPay</div>
            </div>
          </button>
        </div>

        {/* Payment inputs */}
        {method === 'UPI' ? (
          <div className="space-y-3 p-4 bg-[#F8F9FB] rounded-xl border border-[#E9EBEF]">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">
                Virtual Payment Address (VPA / UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                placeholder="username@bank"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E9EBEF] bg-white focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#92939D]">
              <QrCode className="w-3.5 h-3.5 text-[#714B67]" />
              <span>UPI Autopay authorization mandate will trigger on your mobile app</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4 bg-[#F8F9FB] rounded-xl border border-[#E9EBEF]">
            <div>
              <label className="block text-xs font-medium text-[#34313A] mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#E9EBEF] bg-white focus:outline-none focus:border-[#714B67]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#34313A] mb-1">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  required
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#E9EBEF] bg-white focus:outline-none focus:border-[#714B67]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#34313A] mb-1">CVV</label>
                <input
                  type="password"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#E9EBEF] bg-white focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center gap-2 text-[11px] text-[#92939D] px-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#28A879]" />
          <span>256-bit encrypted bank checkout. RBI mandate compliant.</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              `Authorize & Pay ₹${invoice.total.toLocaleString('en-IN')}`
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
