import React from 'react';
import { Send, CheckCircle2, ArrowRightCircle, Download } from 'lucide-react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Quotation } from '../../types';
import { useApp } from '../../context/AppContext';

interface QuotationPreviewModalProps {
  quotation: Quotation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationPreviewModal: React.FC<QuotationPreviewModalProps> = ({
  quotation,
  isOpen,
  onClose,
}) => {
  const {
    settings,
    sendQuotation,
    approveQuotation,
    convertQuotationToSubscription,
    showToast,
    currentRole,
  } = useApp();

  if (!quotation) return null;

  const handleSend = () => {
    sendQuotation(quotation.id);
  };

  const handleApprove = () => {
    approveQuotation(quotation.id);
  };

  const handleConvert = () => {
    convertQuotationToSubscription(quotation.id);
    onClose();
  };

  const handleDownloadPdf = () => {
    showToast({
      type: 'success',
      title: 'Quotation Downloaded',
      message: `${quotation.quotationNumber}.pdf downloaded.`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quotation Proposal - ${quotation.quotationNumber}`}
      subtitle={`Valid until ${quotation.expiryDate}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-[#34313A]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E9EBEF]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#714B67] text-white flex items-center justify-center font-bold text-sm">
                BL
              </div>
              <div>
                <span className="font-semibold text-base tracking-tight text-[#34313A]">
                  {settings.companyName}
                </span>
                <p className="text-[11px] text-[#92939D]">GSTIN: {settings.gstin}</p>
              </div>
            </div>
            <div className="text-xs text-[#92939D] mt-2 space-y-0.5">
              <p>{settings.address}</p>
              <p>{settings.city}, {settings.state} - {settings.pincode}</p>
              <p>Email: {settings.email}</p>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-xs font-medium text-[#92939D]">Status:</span>
              <Badge variant={quotation.status}>{quotation.status.toUpperCase()}</Badge>
            </div>
            <div className="mt-2 font-mono text-sm font-semibold text-[#34313A]">
              {quotation.quotationNumber}
            </div>
            <div className="text-xs text-[#92939D] mt-1">
              <p>Issue Date: {quotation.issueDate}</p>
              <p>Expiry Date: {quotation.expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Customer detail block */}
        <div className="bg-[#F3F5F8] p-4 rounded-xl border border-[#E9EBEF]">
          <div className="text-[11px] font-semibold text-[#92939D] uppercase tracking-wider mb-1">
            Prepared For
          </div>
          <div className="font-semibold text-sm text-[#34313A]">{quotation.customerName}</div>
          <div className="text-xs text-[#696A75]">{quotation.customerCompany}</div>
          <div className="text-xs text-[#92939D]">{quotation.customerEmail}</div>
        </div>

        {/* Quotation line items */}
        <div className="border border-[#E9EBEF] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Product & Plan</th>
                <th className="py-2.5 px-4 font-medium text-center">Cycle</th>
                <th className="py-2.5 px-4 font-medium text-center">Qty</th>
                <th className="py-2.5 px-4 font-medium text-right">Price</th>
                <th className="py-2.5 px-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {quotation.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#34313A]">{item.productName}</div>
                    <div className="text-[11px] text-[#92939D]">{item.planName}</div>
                  </td>
                  <td className="py-3 px-4 text-center capitalize text-[#92939D]">{item.billingCycle}</td>
                  <td className="py-3 px-4 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#34313A] tabular-nums">
                    ₹{item.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-[#92939D]">
              <span>Subtotal:</span>
              <span className="font-mono text-[#34313A] tabular-nums">
                ₹{quotation.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {quotation.discountAmount > 0 && (
              <div className="flex justify-between text-[#28A879]">
                <span>Discount ({quotation.discountPercentage}%):</span>
                <span className="font-mono tabular-nums">
                  -₹{quotation.discountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[#92939D]">
              <span>GST ({quotation.taxPercentage}%):</span>
              <span className="font-mono text-[#34313A] tabular-nums">
                ₹{quotation.taxAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E9EBEF] flex justify-between font-semibold text-sm text-[#34313A]">
              <span>Grand Total:</span>
              <span className="font-mono text-[#714B67] tabular-nums">
                ₹{quotation.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div className="p-3 bg-[#F8F9FB] rounded-xl border border-[#E9EBEF] text-xs text-[#696A75]">
            <span className="font-semibold text-[#34313A]">Terms & Notes: </span>
            {quotation.notes}
          </div>
        )}

        {/* Action button bar */}
        <div className="pt-4 border-t border-[#E9EBEF] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownloadPdf}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#92939D]" />
            Download PDF
          </button>
          <div className="flex items-center gap-2">
            {currentRole !== 'customer' && quotation.status === 'draft' && (
              <button
                onClick={handleSend}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#F3F5F8] hover:bg-[#E9EBEF] text-[#34313A] flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-[#714B67]" />
                Send to Customer
              </button>
            )}
            {currentRole !== 'customer' && quotation.status === 'sent' && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#EBF7F2] hover:bg-[#D4EFE4] text-[#28A879] flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Approved
              </button>
            )}
            {currentRole !== 'customer' && (quotation.status === 'approved' || quotation.status === 'sent') && (
              <button
                onClick={handleConvert}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1 shadow-sm transition-colors"
              >
                <ArrowRightCircle className="w-3.5 h-3.5" />
                Convert to Live Subscription
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#F3F5F8] text-[#34313A] hover:bg-[#E9EBEF] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
