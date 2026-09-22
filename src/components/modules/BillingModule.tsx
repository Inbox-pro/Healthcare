import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { BillItem, BillStatus, PaymentMethod } from '../../types/hms';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  CreditCard,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Trash2,
  X
} from 'lucide-react';

interface BillingModuleProps {
  onPrintDocument: (type: any, data: any, title: string) => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({ onPrintDocument }) => {
  const { bills, addBill, recordBillPayment, patients } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activePaymentBill, setActivePaymentBill] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');

  // New Bill Form
  const [newBill, setNewBill] = useState<{
    patientId: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    copayAmount: number;
    deductible: number;
    items: BillItem[];
  }>({
    patientId: patients[0]?.id || '',
    insuranceProvider: 'BlueCross Health Premier',
    insurancePolicyNumber: 'BCBS-984210',
    copayAmount: 50,
    deductible: 100,
    items: [
      {
        id: 'ITM-1',
        description: 'Specialist Physician Consultation Fee',
        category: 'Consultation',
        quantity: 1,
        unitPrice: 150,
        total: 150,
      },
      {
        id: 'ITM-2',
        description: 'Complete Blood Count & CMP Panel',
        category: 'Laboratory',
        quantity: 1,
        unitPrice: 180,
        total: 180,
      },
      {
        id: 'ITM-3',
        description: 'Pharmacy Prescriptions (Antibiotics & Analgesics)',
        category: 'Pharmacy',
        quantity: 1,
        unitPrice: 120,
        total: 120,
      },
    ],
  });

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      search === '' ||
      b.patientName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      (b.insuranceProvider && b.insuranceProvider.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = bills.reduce((acc, b) => acc + b.paidAmount, 0);
  const totalOutstanding = bills.reduce((acc, b) => acc + b.balanceAmount, 0);

  const handleAddItemRow = () => {
    setNewBill({
      ...newBill,
      items: [
        ...newBill.items,
        {
          id: `ITM-${Date.now()}`,
          description: 'Hospital Service / Ward Charge',
          category: 'Bed Charge',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        },
      ],
    });
  };

  const handleRemoveItemRow = (idx: number) => {
    setNewBill({
      ...newBill,
      items: newBill.items.filter((_, i) => i !== idx),
    });
  };

  const handleCreateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newBill.patientId);
    if (!pat) return;

    const subtotal = newBill.items.reduce((s, it) => s + it.total, 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = 0;
    const total = subtotal + tax - discount;
    const insuranceCoverage = Math.max(0, total - newBill.copayAmount);

    const created = addBill({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      items: newBill.items.map(it => ({ ...it, category: it.category as any })),
      subtotal,
      tax,
      taxAmount: tax,
      discount,
      discountAmount: discount,
      totalAmount: total,
      paidAmount: 0,
      balanceAmount: total,
      insuranceProvider: newBill.insuranceProvider,
      insurancePolicyNumber: newBill.insurancePolicyNumber,
      insuranceClaimAmount: insuranceCoverage,
      insuranceCoveredAmount: insuranceCoverage,
      copayAmount: newBill.copayAmount,
      deductible: newBill.deductible,
      status: 'Pending Insurance',
      paymentStatus: 'Pending',
      paymentMethod: 'Cash',
      payments: [],
    });

    showToast({
      type: 'success',
      title: 'Invoice Generated',
      message: `Invoice #${created.id} issued for ${created.patientName} ($${created.totalAmount}).`,
    });

    setIsGenerateModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentBill || paymentAmount <= 0) return;

    recordBillPayment(activePaymentBill.id, Number(paymentAmount), paymentMethod);

    showToast({
      type: 'success',
      title: 'Payment Received',
      message: `Payment of $${paymentAmount} recorded via ${paymentMethod}.`,
    });

    setActivePaymentBill(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-sky-600" />
            <span>Hospital Billing, Revenue &amp; Insurance Claims</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Itemized clinical invoicing, third-party insurance adjudication, copay settlements, and receipt generation.
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Financial Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">Total Invoiced</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
              ${totalBilled.toLocaleString()}
            </p>
          </div>
          <Receipt className="w-6 h-6 text-sky-600 opacity-80" />
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">Collections Received</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">
              ${totalPaid.toLocaleString()}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600 opacity-80" />
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">Outstanding Balances</p>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-0.5">
              ${totalOutstanding.toLocaleString()}
            </p>
          </div>
          <Clock className="w-6 h-6 text-amber-600 opacity-80" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, patient, insurance payer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden font-medium"
          >
            <option value="all">All Invoices ({bills.length})</option>
            <option value="Paid">Fully Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending Insurance">Pending Insurance</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Date &amp; Due</th>
                <th className="py-3 px-4">Insurance Coverage</th>
                <th className="py-3 px-4 text-right">Total Bill</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                    {bill.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {bill.patientName}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{bill.patientId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>{bill.date}</div>
                    <div className="text-[10px] text-slate-400">Due: {bill.dueDate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                      {bill.insuranceProvider || 'Self-Pay / Cash'}
                    </div>
                    {(bill.insuranceClaimAmount || bill.insuranceCoveredAmount) ? (
                      <span className="text-[10px] text-emerald-600 font-mono">
                        Claim: ${bill.insuranceClaimAmount || bill.insuranceCoveredAmount}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    ${bill.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">
                    ${bill.paidAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                    ${bill.balanceAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        (bill.status === 'Paid' || bill.paymentStatus === 'Paid')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : (bill.status === 'Partially Paid' || bill.paymentStatus === 'Partial')
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : bill.status === 'Pending Insurance'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {bill.status || bill.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {bill.balanceAmount > 0 && (
                        <button
                          onClick={() => {
                            setActivePaymentBill(bill);
                            setPaymentAmount(bill.balanceAmount);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px]"
                          title="Record payment"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay</span>
                        </button>
                      )}

                      <button
                        onClick={() => onPrintDocument('invoice', bill, `Invoice #${bill.id}`)}
                        className="p-1.5 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {activePaymentBill && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActivePaymentBill(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">{activePaymentBill.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Record Settlement Payment
                </h3>
              </div>
              <button
                onClick={() => setActivePaymentBill(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <p className="text-slate-500">
                Patient: <span className="font-bold text-slate-800 dark:text-slate-200">{activePaymentBill.patientName}</span>
              </p>
              <p className="text-slate-500">
                Total Outstanding: <span className="font-mono font-bold text-rose-600">${activePaymentBill.balanceAmount}</span>
              </p>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (USD) *
                </label>
                <input
                  type="number"
                  max={activePaymentBill.balanceAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="Cash">Cash (Hospital Counter)</option>
                  <option value="Insurance Claim">Insurance Claim Payout</option>
                  <option value="Bank Transfer">Bank Wire / ACH</option>
                  <option value="Check">Hospital Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivePaymentBill(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate New Bill Modal */}
      {isGenerateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsGenerateModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-600" />
                <span>Create Hospital Invoice &amp; Insurance Adjudication</span>
              </h2>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBillSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Patient *
                  </label>
                  <select
                    value={newBill.patientId}
                    onChange={(e) => setNewBill({ ...newBill, patientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    value={newBill.insuranceProvider}
                    onChange={(e) => setNewBill({ ...newBill, insuranceProvider: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Itemized Medical Charges
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Service Line
                  </button>
                </div>

                <div className="space-y-2">
                  {newBill.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...newBill.items];
                            updated[idx].description = e.target.value;
                            setNewBill({ ...newBill, items: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const updated = [...newBill.items];
                            updated[idx].category = e.target.value as any;
                            setNewBill({ ...newBill, items: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-[11px]"
                        >
                          <option value="Consultation">Consultation</option>
                          <option value="Bed Charges">Bed Charges</option>
                          <option value="Pharmacy">Pharmacy</option>
                          <option value="Laboratory">Laboratory</option>
                          <option value="Radiology">Radiology</option>
                          <option value="Operation Theatre">Surgery / OT</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const updated = [...newBill.items];
                            const price = Number(e.target.value);
                            updated[idx].unitPrice = price;
                            updated[idx].total = price * updated[idx].quantity;
                            setNewBill({ ...newBill, items: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-mono"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
