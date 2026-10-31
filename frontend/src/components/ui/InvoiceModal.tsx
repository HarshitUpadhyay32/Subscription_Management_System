import React from 'react';
import { Download, Printer, CreditCard } from 'lucide-react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Invoice } from '../../types';
import { useApp } from '../../context/AppContext';

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPayNow?: (invoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPayNow,
}) => {
  const { settings, showToast } = useApp();
  if (!invoice) return null;

  const handleDownload = () => {
    showToast({
      type: 'success',
      title: 'Invoice Downloaded',
      message: `${invoice.invoiceNumber}.pdf downloaded to your device.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice - ${invoice.invoiceNumber}`}
      subtitle={`Issued on ${invoice.issueDate}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-[#34313A]" id="printable-invoice">
        {/* Top Header of Invoice */}
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
              <p>
                {settings.city}, {settings.state} - {settings.pincode}
              </p>
              <p>Email: {settings.email} | Tel: {settings.phone}</p>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-xs font-medium text-[#92939D]">Status:</span>
              <Badge variant={invoice.status}>{invoice.status.toUpperCase()}</Badge>
            </div>
            <div className="mt-3 font-mono text-sm font-semibold text-[#34313A]">
              {invoice.invoiceNumber}
            </div>
            <div className="text-xs text-[#92939D] mt-1">
              <p>Issue Date: {invoice.issueDate}</p>
              <p>Due Date: {invoice.dueDate}</p>
              {invoice.paidDate && (
                <p className="text-[#28A879] font-medium">Paid Date: {invoice.paidDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="bg-[#F3F5F8] p-4 rounded-xl border border-[#E9EBEF]">
          <div className="text-[11px] font-semibold text-[#92939D] uppercase tracking-wider mb-1">
            Billed To
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <div className="font-semibold text-sm text-[#34313A]">{invoice.customerName}</div>
              <div className="text-xs text-[#696A75]">{invoice.customerCompany}</div>
              <div className="text-xs text-[#92939D]">{invoice.customerEmail}</div>
            </div>
            {invoice.customerGstin && (
              <div className="sm:text-right">
                <span className="text-[11px] text-[#92939D]">Customer GSTIN:</span>
                <p className="font-mono text-xs font-medium text-[#34313A]">{invoice.customerGstin}</p>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-[#E9EBEF] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Item & Description</th>
                <th className="py-2.5 px-4 font-medium text-center">Qty</th>
                <th className="py-2.5 px-4 font-medium text-right">Unit Price</th>
                <th className="py-2.5 px-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FDFDFE]">
                  <td className="py-3 px-4 font-medium text-[#34313A]">{item.description}</td>
                  <td className="py-3 px-4 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium tabular-nums text-[#34313A]">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-[#92939D]">
              <span>Subtotal:</span>
              <span className="font-mono text-[#34313A] tabular-nums">
                ₹{invoice.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-[#28A879]">
                <span>Discount Applied:</span>
                <span className="font-mono tabular-nums">
                  -₹{invoice.discountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[#92939D]">
              <span>GST ({invoice.taxRate}%):</span>
              <span className="font-mono text-[#34313A] tabular-nums">
                ₹{invoice.taxAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E9EBEF] flex justify-between font-semibold text-sm text-[#34313A]">
              <span>Grand Total:</span>
              <span className="font-mono text-[#714B67] tabular-nums">
                ₹{invoice.total.toLocaleString('en-IN')}
              </span>
            </div>
            {invoice.paymentMethod && (
              <div className="text-[11px] text-[#92939D] pt-1">
                Settled via: <span className="font-medium text-[#34313A]">{invoice.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E9EBEF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#92939D]" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#92939D]" />
              Print
            </button>
          </div>
          <div className="flex items-center gap-2">
            {invoice.status === 'pending' && onPayNow && (
              <button
                onClick={() => {
                  onClose();
                  onPayNow(invoice);
                }}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#714B67] hover:bg-[#603D56] text-white flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay Now (₹{invoice.total.toLocaleString('en-IN')})
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
