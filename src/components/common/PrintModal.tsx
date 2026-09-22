import React from 'react';
import { InboxLogo } from './InboxLogo';
import { useHMS } from '../../context/HMSContext';
import { Printer, X, Download } from 'lucide-react';

export type DocumentType = 'prescription' | 'invoice' | 'lab_report' | 'radiology_report' | 'discharge_summary' | 'patient_summary' | 'discharge';

export interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: DocumentType;
  data: any;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, title, type, data }) => {
  const { settings } = useHMS();

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="print-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="print-modal-container"
        className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Header (not printed) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
            <Printer className="w-4 h-4 text-sky-600" />
            <span>Print Preview: {title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto print:p-0 print:m-0 font-sans text-xs leading-relaxed" id="printable-area">
          {/* Hospital Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <InboxLogo size="md" variant="full" />
                <h1 className="text-lg font-bold text-slate-900 mt-2 tracking-tight">
                  {settings.hospitalName}
                </h1>
                <p className="text-[11px] text-slate-600 max-w-sm">{settings.tagline}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {settings.address}, {settings.cityStateZip} | Tel: {settings.phone} | Emergency: {settings.emergencyContact}
                </p>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
                  {type.replace('_', ' ').toUpperCase()}
                </div>
                <p className="text-[11px] text-slate-600">Doc ID: {data.id || data.invoiceNumber}</p>
                <p className="text-[11px] text-slate-600">Date: {data.date || data.orderDate || new Date().toISOString().slice(0, 10)}</p>
                <div className="mt-2 text-[9px] text-amber-700 font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 border border-amber-200 inline-block">
                  DEMO / SAMPLE DOCUMENT
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Content by Type */}

          {/* 1. Prescription Print View */}
          {type === 'prescription' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Patient Information</p>
                  <p className="font-bold text-slate-800 text-sm">{data.patientName}</p>
                  <p className="text-slate-600">Patient ID: {data.patientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Attending Doctor</p>
                  <p className="font-bold text-slate-800 text-sm">{data.doctorName}</p>
                  <p className="text-slate-600">Diagnosis: <span className="font-semibold">{data.diagnosis}</span></p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 font-serif italic text-2xl font-bold text-sky-800">
                  <span>&#8478;</span>
                  <span className="text-xs font-sans not-italic font-bold text-slate-700 uppercase tracking-wider">
                    Prescribed Medications
                  </span>
                </div>

                <table className="w-full border-collapse border border-slate-200 text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      <th className="p-2 border border-slate-200">#</th>
                      <th className="p-2 border border-slate-200">Medicine &amp; Dosage</th>
                      <th className="p-2 border border-slate-200">Frequency</th>
                      <th className="p-2 border border-slate-200">Duration</th>
                      <th className="p-2 border border-slate-200">Route</th>
                      <th className="p-2 border border-slate-200">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.medicines?.map((med: any, idx: number) => (
                      <tr key={idx} className="border border-slate-200 text-slate-800">
                        <td className="p-2 border border-slate-200 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 border border-slate-200 font-semibold">{med.medicineName} ({med.dosage})</td>
                        <td className="p-2 border border-slate-200">{med.frequency}</td>
                        <td className="p-2 border border-slate-200">{med.duration}</td>
                        <td className="p-2 border border-slate-200">{med.route}</td>
                        <td className="p-2 border border-slate-200 italic">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.notes && (
                <div className="p-3 bg-amber-50/60 rounded border border-amber-200 text-slate-700 text-xs">
                  <span className="font-semibold text-amber-900">Advice / Special Instructions:</span> {data.notes}
                </div>
              )}
            </div>
          )}

          {/* 2. Invoice Print View */}
          {type === 'invoice' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Billed To (Patient)</p>
                  <p className="font-bold text-slate-800 text-sm">{data.patientName}</p>
                  <p className="text-slate-600">Patient ID: {data.patientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Invoice Details</p>
                  <p className="font-bold text-slate-800">Invoice #{data.invoiceNumber}</p>
                  <p className="text-slate-600">Due Date: {data.dueDate} | Status: <span className="font-semibold uppercase">{data.paymentStatus}</span></p>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-200 text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    <th className="p-2 border border-slate-200">Item Description</th>
                    <th className="p-2 border border-slate-200">Category</th>
                    <th className="p-2 border border-slate-200 text-center">Qty</th>
                    <th className="p-2 border border-slate-200 text-right">Unit Price</th>
                    <th className="p-2 border border-slate-200 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="border border-slate-200 text-slate-800">
                      <td className="p-2 border border-slate-200 font-medium">{item.description}</td>
                      <td className="p-2 border border-slate-200 text-slate-600">{item.category}</td>
                      <td className="p-2 border border-slate-200 text-center font-mono">{item.quantity}</td>
                      <td className="p-2 border border-slate-200 text-right">${item.unitPrice}</td>
                      <td className="p-2 border border-slate-200 text-right font-semibold">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-72 space-y-1.5 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${data.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes (5%):</span>
                    <span className="font-mono">+${data.taxAmount}</span>
                  </div>
                  {data.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-mono">-${data.discountAmount}</span>
                    </div>
                  )}
                  {data.insuranceCoveredAmount > 0 && (
                    <div className="flex justify-between text-sky-700">
                      <span>Insurance Deduction:</span>
                      <span className="font-mono">-${data.insuranceCoveredAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Payable:</span>
                    <span className="font-mono">${data.totalAmount - (data.insuranceCoveredAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                    <span>Paid Amount:</span>
                    <span className="font-mono">${data.paidAmount}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Balance Due:</span>
                    <span className="font-mono">${data.balanceAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Lab Report Print View */}
          {type === 'lab_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Patient Information</p>
                  <p className="font-bold text-slate-800 text-sm">{data.patientName}</p>
                  <p className="text-slate-600">Patient ID: {data.patientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Test Details</p>
                  <p className="font-bold text-slate-800">{data.testName}</p>
                  <p className="text-slate-600">Category: {data.testCategory} | Requisition: {data.doctorName}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-xs mb-2 uppercase tracking-wider">
                  Quantitative Clinical Parameters
                </h3>
                <table className="w-full border-collapse border border-slate-200 text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      <th className="p-2 border border-slate-200">Investigation / Parameter</th>
                      <th className="p-2 border border-slate-200 text-center">Observed Result</th>
                      <th className="p-2 border border-slate-200 text-center">Units</th>
                      <th className="p-2 border border-slate-200 text-center">Biological Reference Range</th>
                      <th className="p-2 border border-slate-200 text-center">Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results?.map((res: any, idx: number) => (
                      <tr key={idx} className="border border-slate-200 text-slate-800">
                        <td className="p-2 border border-slate-200 font-medium">{res.parameter}</td>
                        <td className={`p-2 border border-slate-200 text-center font-bold ${res.isAbnormal ? 'text-rose-600' : 'text-slate-800'}`}>
                          {res.value}
                        </td>
                        <td className="p-2 border border-slate-200 text-center text-slate-600">{res.unit}</td>
                        <td className="p-2 border border-slate-200 text-center text-slate-600">{res.referenceRange}</td>
                        <td className="p-2 border border-slate-200 text-center font-semibold text-[10px]">
                          {res.isAbnormal ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">ABNORMAL</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">NORMAL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.notes && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-600 text-xs">
                  <span className="font-semibold text-slate-800">Pathology Note:</span> {data.notes}
                </div>
              )}
            </div>
          )}

          {/* 4. Discharge Summary Print View */}
          {type === 'discharge_summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Patient Information</p>
                  <p className="font-bold text-slate-800 text-sm">{data.patientName}</p>
                  <p className="text-slate-600">Patient ID: {data.patientId}</p>
                  <p className="text-slate-600">Admission Date: {data.admissionDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Discharge Particulars</p>
                  <p className="font-bold text-slate-800">{data.department}</p>
                  <p className="text-slate-600">Discharge Date: {data.dischargeDate} ({data.dischargeType})</p>
                  <p className="text-slate-600">Consultant: {data.doctorName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-sky-900">Final Clinical Diagnosis</h4>
                  <p className="p-2.5 bg-sky-50/50 rounded border border-sky-100 text-slate-800 font-semibold">{data.finalDiagnosis}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-700">Summary of Inpatient Hospital Course &amp; Treatment</h4>
                  <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 whitespace-pre-line">{data.treatmentSummary}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-700">Discharge Medications &amp; Care Plan</h4>
                  <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 whitespace-pre-line font-mono text-[11px]">{data.postDischargeMedications}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-700">Follow-up Appointment</h4>
                  <p className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 font-medium">Scheduled for review on: {data.followUpDate} in {data.department}</p>
                </div>
              </div>
            </div>
          )}

          {/* Signatures & Footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-end">
            <div className="text-[10px] text-slate-400">
              <p>Generated electronically by Inbox Health HMS v2.4</p>
              <p>Inbox Infotech Pvt. Ltd. • ISO 27001 Certified Infrastructure</p>
              <p>Valid without physical stamp if digitally verified.</p>
            </div>

            <div className="text-center w-48">
              <div className="border-b border-slate-400 mb-1 h-10 flex items-end justify-center">
                <span className="font-serif italic text-slate-500 text-xs">Dr. Signatory</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800">Authorized Medical Officer</p>
              <p className="text-[9px] text-slate-500">{data.doctorName || 'Medical Superintendent'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
