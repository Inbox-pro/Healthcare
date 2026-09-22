import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { Pill, Search, Printer, CheckCircle2, ShoppingBag, Eye, Calendar, User, Stethoscope } from 'lucide-react';

interface PrescriptionsModuleProps {
  onPrintDocument: (type: any, data: any, title: string) => void;
}

export const PrescriptionsModule: React.FC<PrescriptionsModuleProps> = ({ onPrintDocument }) => {
  const { prescriptions, dispensePrescription } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = prescriptions.filter((rx) => {
    const matchesSearch =
      search === '' ||
      rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      rx.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || rx.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDispense = (rxId: string) => {
    dispensePrescription(rxId);
    showToast({
      type: 'success',
      title: 'Medications Dispensed',
      message: `Prescription #${rxId} dispensed and pharmacy stock updated.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Pill className="w-6 h-6 text-sky-600" />
            <span>E-Prescriptions Master Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Electronic prescriptions, dosage schedules, pharmacy dispensing integration, and printable Rx slips.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
            {prescriptions.length} Total Issued
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
            {prescriptions.filter((p) => p.status === 'Active').length} Awaiting Dispense
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Rx ID, patient, doctor, diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Prescriptions ({prescriptions.length})</option>
            <option value="Active">Active / Pending Dispense</option>
            <option value="Dispensed">Dispensed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Prescriptions List Cards */}
      <div className="space-y-4">
        {filtered.map((rx) => (
          <div
            key={rx.id}
            className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 transition-all text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {rx.id}
                </span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {rx.patientName}{' '}
                    <span className="font-mono text-[11px] text-slate-400">({rx.patientId})</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Prescribed by: <span className="font-semibold text-slate-700 dark:text-slate-300">{rx.doctorName}</span> &bull; Date: {rx.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rx.status === 'Dispensed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {rx.status}
                </span>

                {rx.status === 'Active' && (
                  <button
                    onClick={() => handleDispense(rx.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Dispense from Pharmacy</span>
                  </button>
                )}

                <button
                  onClick={() => onPrintDocument('prescription', rx, `Prescription #${rx.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
                  title="Print Rx"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Rx</span>
                </button>
              </div>
            </div>

            {/* Diagnosis and Notes */}
            <div className="mb-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-slate-100">Diagnosis: </span>
              <span className="text-sky-700 dark:text-sky-300 font-semibold">{rx.diagnosis}</span>
              {rx.notes && (
                <p className="mt-1 text-slate-500 italic">
                  <span className="not-italic font-semibold">Doctor's Advice:</span> {rx.notes}
                </p>
              )}
            </div>

            {/* Prescribed Medicines Line items */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-1 font-semibold">Medicine &amp; Strength</th>
                    <th className="pb-1 font-semibold">Dosage</th>
                    <th className="pb-1 font-semibold">Frequency</th>
                    <th className="pb-1 font-semibold">Duration</th>
                    <th className="pb-1 font-semibold">Route</th>
                    <th className="pb-1 font-semibold">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {rx.medicines.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="py-2 font-bold text-slate-800 dark:text-slate-200">
                        {item.medicineName}
                      </td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">{item.dosage}</td>
                      <td className="py-2 font-semibold text-sky-700 dark:text-sky-300">
                        {item.frequency}
                      </td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">{item.duration}</td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">{item.route}</td>
                      <td className="py-2 italic text-slate-500">{item.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            No prescriptions matching current filters.
          </div>
        )}
      </div>
    </div>
  );
};
