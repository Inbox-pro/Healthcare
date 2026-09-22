import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { LabOrder, LabTestStatus } from '../../types/hms';
import {
  FlaskConical,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Stethoscope,
  X,
  FileText
} from 'lucide-react';

interface LabModuleProps {
  onPrintDocument: (type: any, data: any, title: string) => void;
}

export const LabModule: React.FC<LabModuleProps> = ({ onPrintDocument }) => {
  const { labOrders, updateLabOrderStatus, addLabOrder, patients, doctors } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<LabOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New order state
  const [newOrder, setNewOrder] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    testName: 'Complete Blood Count (CBC)',
    testCategory: 'Hematology',
    priority: 'Normal' as const,
  });

  const filteredOrders = labOrders.filter((order) => {
    const matchesSearch =
      search === '' ||
      order.patientName.toLowerCase().includes(search.toLowerCase()) ||
      order.testName.toLowerCase().includes(search.toLowerCase()) ||
      order.testCategory.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusProgress = (orderId: string, currentStatus: LabTestStatus) => {
    let nextStatus: LabTestStatus = 'Sample Collected';
    if (currentStatus === 'Ordered') nextStatus = 'Sample Collected';
    else if (currentStatus === 'Sample Collected') nextStatus = 'In Analysis';
    else if (currentStatus === 'In Analysis') nextStatus = 'Completed';
    else if (currentStatus === 'Completed') nextStatus = 'Verified';

    updateLabOrderStatus(orderId, nextStatus);
    showToast({
      type: 'info',
      title: 'Lab Order Progressed',
      message: `Order #${orderId} moved to stage: ${nextStatus}.`,
    });
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newOrder.patientId);
    const doc = doctors.find((d) => d.id === newOrder.doctorId);
    if (!pat || !doc) return;

    const created = addLabOrder({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      doctorId: doc.id,
      doctorName: doc.name,
      testName: newOrder.testName,
      testCategory: newOrder.testCategory as any,
      priority: newOrder.priority,
      results: [
        { parameter: 'Hemoglobin', value: '13.8', unit: 'g/dL', referenceRange: '13.0 - 17.0', isAbnormal: false },
        { parameter: 'Total Leukocyte Count', value: '8,200', unit: '/mcL', referenceRange: '4,000 - 11,000', isAbnormal: false },
        { parameter: 'Platelets', value: '250,000', unit: '/mcL', referenceRange: '150,000 - 450,000', isAbnormal: false },
      ],
    });

    showToast({
      type: 'success',
      title: 'Lab Order Requisition Placed',
      message: `Specimen tube barcode requisition #${created.id} issued.`,
    });

    setIsNewOrderModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-sky-600" />
            <span>Pathology &amp; Clinical Laboratory Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Specimen phlebotomy tracking, hematology analyzer results, reference ranges, and verified pathology reports.
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Order Laboratory Test</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search test name, patient, category, requisition ID..."
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
            <option value="all">All Pathology Requisitions</option>
            <option value="Ordered">Ordered (Sample Pending)</option>
            <option value="Sample Collected">Sample Collected</option>
            <option value="In Analysis">In Analysis</option>
            <option value="Completed">Completed</option>
            <option value="Verified">Verified by Pathologist</option>
          </select>
        </div>
      </div>

      {/* Lab Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isVerified = order.status === 'Verified';
          const isCritical = order.priority === 'Urgent';

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 transition-all text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {order.id}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {order.testName}
                    </h3>
                    <p className="text-slate-500 text-[11px]">
                      Patient: <span className="font-semibold text-slate-700 dark:text-slate-300">{order.patientName}</span> ({order.patientId}) &bull; Ordered by {order.doctorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : order.status === 'In Analysis'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : order.status === 'Sample Collected'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {order.status}
                  </span>

                  {!isVerified && (
                    <button
                      onClick={() => handleStatusProgress(order.id, order.status)}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs"
                    >
                      {order.status === 'Ordered'
                        ? 'Collect Specimen'
                        : order.status === 'Sample Collected'
                        ? 'Send to Analyzer'
                        : order.status === 'In Analysis'
                        ? 'Record Values'
                        : 'Verify by Pathologist'}
                    </button>
                  )}

                  <button
                    onClick={() => onPrintDocument('lab', order, `Lab Report #${order.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs"
                    title="Print Pathology Report"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                </div>
              </div>

              {/* Lab Parameters Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                      <th className="pb-1 font-semibold">Test Parameter</th>
                      <th className="pb-1 font-semibold text-center">Observed Result</th>
                      <th className="pb-1 font-semibold text-center">Unit</th>
                      <th className="pb-1 font-semibold text-center">Reference Range</th>
                      <th className="pb-1 font-semibold text-right">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {order.results?.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2 font-medium text-slate-800 dark:text-slate-200">
                          {res.parameter}
                        </td>
                        <td className="py-2 text-center font-mono font-bold">
                          <span className={res.isAbnormal ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'}>
                            {res.value}
                          </span>
                        </td>
                        <td className="py-2 text-center text-slate-500 font-mono text-[11px]">
                          {res.unit}
                        </td>
                        <td className="py-2 text-center text-slate-500 font-mono text-[11px]">
                          {res.referenceRange}
                        </td>
                        <td className="py-2 text-right">
                          {res.isAbnormal ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              ABNORMAL (HIGH)
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-600">
                              NORMAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Lab Order Modal */}
      {isNewOrderModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsNewOrderModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-sky-600" />
                <span>Requisition New Diagnostic Pathology Test</span>
              </h2>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Patient *
                </label>
                <select
                  value={newOrder.patientId}
                  onChange={(e) => setNewOrder({ ...newOrder, patientId: e.target.value })}
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
                  Ordering Physician *
                </label>
                <select
                  value={newOrder.doctorId}
                  onChange={(e) => setNewOrder({ ...newOrder, doctorId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} &bull; {d.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pathology Test Profile *
                </label>
                <select
                  value={newOrder.testName}
                  onChange={(e) => setNewOrder({ ...newOrder, testName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                  <option value="Comprehensive Metabolic Panel (CMP)">Comprehensive Metabolic Panel (CMP)</option>
                  <option value="Lipid Profile with Apolipoproteins">Lipid Profile with Apolipoproteins</option>
                  <option value="Glycated Hemoglobin (HbA1c)">Glycated Hemoglobin (HbA1c)</option>
                  <option value="Serum Electrolytes (Na, K, Cl)">Serum Electrolytes (Na, K, Cl)</option>
                  <option value="Thyroid Profile (TSH, Free T3, Free T4)">Thyroid Profile (TSH, FT3, FT4)</option>
                  <option value="Coagulation PT / INR">Coagulation PT / INR</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department Category
                  </label>
                  <select
                    value={newOrder.testCategory}
                    onChange={(e) => setNewOrder({ ...newOrder, testCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Serology">Serology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Requisition
                  </label>
                  <select
                    value={newOrder.priority}
                    onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Normal">Routine (Turnaround ~4h)</option>
                    <option value="Urgent">STAT / Urgent (Turnaround &lt;1h)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Issue Lab Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
