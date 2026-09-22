import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { InpatientAdmission, WardType } from '../../types/hms';
import {
  BedSingle,
  Search,
  Plus,
  Hotel,
  Clock,
  LogOut,
  User,
  Stethoscope,
  X,
  Printer
} from 'lucide-react';

interface IPDModuleProps {
  onInitiateDischarge: (admission: any) => void;
  onPrintDocument: (type: any, data: any, title: string) => void;
}

export const IPDModule: React.FC<IPDModuleProps> = ({ onInitiateDischarge, onPrintDocument }) => {
  const { admissions, admitPatient, beds, patients, doctors } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('all');
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  // New Admission form
  const [newAdmission, setNewAdmission] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    wardType: 'General Ward' as WardType,
    bedNumber: 'GEN-201',
    admissionDiagnosis: 'Post-operative recovery and IV antibiotic therapy',
    initialDeposit: 500,
  });

  const availableBedsForWard = beds.filter(
    (b) => b.wardType === newAdmission.wardType && b.status === 'Available'
  );

  const filtered = admissions.filter((adm) => {
    const matchesSearch =
      search === '' ||
      adm.patientName.toLowerCase().includes(search.toLowerCase()) ||
      adm.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      (adm.admissionDiagnosis || adm.reasonForAdmission || '').toLowerCase().includes(search.toLowerCase()) ||
      adm.bedNumber.toLowerCase().includes(search.toLowerCase()) ||
      adm.id.toLowerCase().includes(search.toLowerCase());

    const matchesWard = selectedWard === 'all' || (adm.wardType || adm.ward) === selectedWard;
    return matchesSearch && matchesWard;
  });

  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newAdmission.patientId);
    const doc = doctors.find((d) => d.id === newAdmission.doctorId);

    if (!pat || !doc) return;

    const targetBed = beds.find((b) => b.bedNumber === newAdmission.bedNumber) || availableBedsForWard[0] || beds[0];

    admitPatient({
      patientId: pat.id,
      doctorId: doc.id,
      wardType: newAdmission.wardType,
      bedId: targetBed.id,
      reason: newAdmission.admissionDiagnosis,
      attendantName: pat.emergencyContact?.name || 'Family Attendant',
      attendantPhone: pat.emergencyContact?.phone || pat.phone,
      insuranceCovered: !!pat.insurance || !!pat.insurancePolicyNumber,
    });

    showToast({
      type: 'success',
      title: 'Inpatient Admitted',
      message: `${pat.firstName} admitted to ${newAdmission.wardType} (Bed ${newAdmission.bedNumber}).`,
    });

    setIsAdmitModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BedSingle className="w-6 h-6 text-sky-600" />
            <span>Inpatient Department (IPD) Admissions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active ward stays, consultant physician rounds, clinical vitals, and bed transfers.
          </p>
        </div>

        <button
          onClick={() => setIsAdmitModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Inpatient Admission</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inpatient by name, doctor, bed, diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Wards ({admissions.length})</option>
            <option value="ICU">ICU Only</option>
            <option value="General Ward">General Ward</option>
            <option value="Private Room">Private Rooms</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="Emergency">Emergency</option>
          </select>
          <span className="text-slate-400">
            {filtered.filter((a) => a.status === 'Admitted').length} currently in beds
          </span>
        </div>
      </div>

      {/* Inpatient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((adm) => (
          <div
            key={adm.id}
            className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between text-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    {adm.id}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">
                    {adm.patientName}
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">{adm.patientId}</span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100 block">
                    Bed {adm.bedNumber}
                  </span>
                  <span className="text-[10px] text-sky-600 font-semibold">{adm.wardType}</span>
                </div>
              </div>

              {/* Diagnosis and particulars */}
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Admission Diagnosis
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {adm.admissionDiagnosis}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400">Attending Consultant</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {adm.doctorName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Primary Nurse</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {adm.attendingNurse || 'Nurse Station Duty'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400">Admission Date</span>
                    <p className="font-mono text-slate-700 dark:text-slate-300">
                      {adm.admissionDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Initial Deposit</span>
                    <p className="font-mono font-bold text-emerald-600">${adm.initialDeposit || 500}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  adm.status === 'Admitted'
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {adm.status}
              </span>

              {adm.status === 'Admitted' && (
                <button
                  onClick={() => onInitiateDischarge(adm)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Initiate Discharge</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Inpatient Admission Modal */}
      {isAdmitModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsAdmitModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BedSingle className="w-5 h-5 text-sky-600" />
                <span>Inpatient Ward Admission Form</span>
              </h2>
              <button
                onClick={() => setIsAdmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdmitSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Registered Patient *
                </label>
                <select
                  value={newAdmission.patientId}
                  onChange={(e) => setNewAdmission({ ...newAdmission, patientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.id}) - {p.bloodGroup}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attending Consultant Physician *
                </label>
                <select
                  value={newAdmission.doctorId}
                  onChange={(e) => setNewAdmission({ ...newAdmission, doctorId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} &bull; {d.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ward Category *
                  </label>
                  <select
                    value={newAdmission.wardType}
                    onChange={(e) => {
                      const wt = e.target.value as WardType;
                      const nextBed = beds.find((b) => b.wardType === wt && b.status === 'Available');
                      setNewAdmission({
                        ...newAdmission,
                        wardType: wt,
                        bedNumber: nextBed?.bedNumber || 'W-01',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="ICU">ICU Ward (Floor 3)</option>
                    <option value="General Ward">General Ward (Floor 2)</option>
                    <option value="Private Room">Private Room (Floor 4)</option>
                    <option value="Semi-Private">Semi-Private (Floor 2)</option>
                    <option value="Emergency">Emergency Holding</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Available Bed Assignment *
                  </label>
                  <select
                    value={newAdmission.bedNumber}
                    onChange={(e) => setNewAdmission({ ...newAdmission, bedNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  >
                    {availableBedsForWard.map((b) => (
                      <option key={b.id} value={b.bedNumber}>
                        {b.bedNumber} (${b.dailyRate}/day)
                      </option>
                    ))}
                    {availableBedsForWard.length === 0 && (
                      <option value="OVERFLOW">No vacant beds in this ward</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admission Diagnosis / Clinical Indication *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newAdmission.admissionDiagnosis}
                  onChange={(e) =>
                    setNewAdmission({ ...newAdmission, admissionDiagnosis: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Admission Deposit (USD)
                </label>
                <input
                  type="number"
                  value={newAdmission.initialDeposit}
                  onChange={(e) =>
                    setNewAdmission({ ...newAdmission, initialDeposit: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdmitModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs"
                >
                  Admit Patient to Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
