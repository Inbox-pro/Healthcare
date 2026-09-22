import React, { useState, useEffect, useMemo } from 'react';
import { useHMS } from '../../context/HMSContext';
import { Search, X, User, Stethoscope, Calendar, Pill, FileText, Activity, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (moduleId: string, itemData?: any) => void;
  onSelectResult?: (result: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate, onSelectResult }) => {
  const { patients, doctors, appointments, medicines, invoices, labOrders } = useHMS();
  const [query, setQuery] = useState('');

  const handleSelect = (moduleId: string, item: any) => {
    if (onSelectResult) {
      onSelectResult({ moduleId, ...item });
    }
    if (onNavigate) {
      onNavigate(moduleId, item);
    }
    onClose();
  };

  // Close on Escape or click backdrop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // handled in parent or toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedPatients = patients
      .filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.bloodGroup.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const matchedDoctors = doctors
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedAppointments = appointments
      .filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedMedicines = medicines
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedInvoices = invoices
      .filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.patientName.toLowerCase().includes(q) ||
          inv.id.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedLab = labOrders
      .filter(
        (l) =>
          l.testName.toLowerCase().includes(q) ||
          l.patientName.toLowerCase().includes(q) ||
          l.testCategory.toLowerCase().includes(q)
      )
      .slice(0, 3);

    return {
      patients: matchedPatients,
      doctors: matchedDoctors,
      appointments: matchedAppointments,
      medicines: matchedMedicines,
      invoices: matchedInvoices,
      labOrders: matchedLab,
    };
  }, [query, patients, doctors, appointments, medicines, invoices, labOrders]);

  if (!isOpen) return null;

  return (
    <div
      id="global-search-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="global-search-card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search patients, doctors, appointments, medicines, bills, lab tests... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-hidden text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-3 space-y-4">
          {!query && (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm font-medium">Type keywords to search hospital records</p>
              <p className="text-xs mt-1">Try "Cardiology", "Amoxicillin", "John", "PAT-1001", or "Blood"</p>
            </div>
          )}

          {query && results && (
            <>
              {/* Patients */}
              {results.patients.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Patients ({results.patients.length})
                  </div>
                  <div className="space-y-1">
                    {results.patients.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect('patients', p)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>
                              {p.firstName} {p.lastName}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                              {p.id}
                            </span>
                            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                              {p.bloodGroup}
                            </span>
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {p.age} yrs • {p.gender} • {p.phone} • {p.city}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors */}
              {results.doctors.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" /> Doctors ({results.doctors.length})
                  </div>
                  <div className="space-y-1">
                    {results.doctors.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleSelect('doctors', d)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {d.name}{' '}
                            <span className="text-[11px] font-normal text-slate-500">
                              • {d.specialization}
                            </span>
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {d.department} • Room: {d.roomNumber} • Fee: ${d.consultationFee}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments */}
              {results.appointments.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Appointments ({results.appointments.length})
                  </div>
                  <div className="space-y-1">
                    {results.appointments.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleSelect('appointments', a)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {a.patientName} &rarr; {a.doctorName}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {a.date} at {a.time} • Status: {a.status} • {a.reason}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medicines */}
              {results.medicines.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" /> Pharmacy Medicines ({results.medicines.length})
                  </div>
                  <div className="space-y-1">
                    {results.medicines.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelect('pharmacy', m)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {m.name}{' '}
                            <span className="text-[11px] font-normal text-slate-500">
                              ({m.genericName})
                            </span>
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            Stock: {m.stockQuantity} {m.unit} • Price: ${m.sellingPrice} • Category:{' '}
                            {m.category}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Orders */}
              {results.labOrders.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Laboratory Tests ({results.labOrders.length})
                  </div>
                  <div className="space-y-1">
                    {results.labOrders.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleSelect('laboratory', l)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {l.testName}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            Patient: {l.patientName} • Status: {l.status} • {l.testCategory}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {results.invoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Invoices &amp; Bills ({results.invoices.length})
                  </div>
                  <div className="space-y-1">
                    {results.invoices.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => handleSelect('billing', inv)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {inv.invoiceNumber} • {inv.patientName}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            Total: ${inv.totalAmount} • Status: {inv.paymentStatus} • Date: {inv.date}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty result */}
              {results.patients.length === 0 &&
                results.doctors.length === 0 &&
                results.appointments.length === 0 &&
                results.medicines.length === 0 &&
                results.labOrders.length === 0 &&
                results.invoices.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No matching records found for "{query}".
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
