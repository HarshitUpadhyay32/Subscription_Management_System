import React from 'react';
import { CreditCard, Smartphone, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';

export const CustomerPaymentsPage: React.FC = () => {
  const { currentUser, payments, showToast } = useApp();
  const customerId = currentUser?.customerId || 'cust-1';
  const myPayments = payments.filter((p) => p.customerId === customerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#34313A] font-heading">
            Payment History & Receipts
          </h1>
          <p className="text-xs text-[#92939D] mt-0.5">
            Audit trail of cleared recurring payments, transaction tokens, and tax clearance receipts.
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-[#E9EBEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FB] border-b border-[#E9EBEF] text-[#92939D]">
              <tr>
                <th className="py-3 px-4 font-medium">Transaction Reference</th>
                <th className="py-3 px-4 font-medium">Invoice Number</th>
                <th className="py-3 px-4 font-medium">Payment Method</th>
                <th className="py-3 px-4 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium text-right">Settled Amount</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {myPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-[#FDFDFE] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#34313A]">
                    {pay.transactionReference}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#714B67] font-medium">
                    {pay.invoiceNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-[#34313A]">
                      {pay.paymentMethod === 'UPI' ? (
                        <Smartphone className="w-3.5 h-3.5 text-[#714B67]" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5 text-[#3B82F6]" />
                      )}
                      <span>{pay.paymentMethod}</span>
                    </div>
                    {pay.upiId && <div className="text-[10px] text-[#92939D]">{pay.upiId}</div>}
                    {pay.cardLast4 && (
                      <div className="text-[10px] text-[#92939D]">•••• {pay.cardLast4}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#696A75]">{pay.paymentDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#28A879] tabular-nums">
                    ₹{pay.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="paid">SUCCESSFUL</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() =>
                        showToast({
                          type: 'success',
                          title: 'Receipt Downloaded',
                          message: `Bank receipt ${pay.transactionReference}.pdf saved to your downloads.`,
                        })
                      }
                      className="px-2.5 py-1 text-[11px] rounded-lg border border-[#E9EBEF] text-[#34313A] hover:bg-[#F3F5F8] flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3 h-3 text-[#92939D]" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
