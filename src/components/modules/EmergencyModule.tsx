import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { EmergencyCase, TriagePriority } from '../../types/hms';
import {
  Siren,
  AlertTriangle,
  HeartPulse,
  Plus,
  Clock,
  User,
  Activity,
  BedSingle,
  CheckCircle2,
  X
} from 'lucide-react';

interface EmergencyModuleProps {
  onAdmitToIPD: (patient: any) => void;
}

export const EmergencyModule: React.FC<EmergencyModuleProps> = ({ onAdmitToIPD }) => {
  const { emergencyCases, addEmergencyCase, updateEmergencyTriage, doctors, patients } = useHMS();
  const { showToast } = useToast();

  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCase, setNewCase] = useState({
    patientName: '',
    age: 35,
    gender: 'Male',
    triagePriority: 'High' as TriagePriority,
    chiefComplaint: 'Acute chest pain radiating to left arm',
    vitals: { bp: '150/95', hr: 110, temp: 98.6, spo2: 92, rr: 24 },
    attendingDoctor: 'Dr. Marcus Vance',
    bedNumber: 'ER-02',
  });

  const filteredCases = emergencyCases.filter(
    (c) => selectedPriority === 'all' || c.triagePriority === selectedPriority
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.patientName || !newCase.chiefComplaint) {
      showToast({ type: 'warning', title: 'Missing details', message: 'Enter patient name & chief complaint.' });
      return;
    }

    addEmergencyCase({
      patientId: `PAT-${1000 + Math.floor(Math.random() * 9000)}`,
      patientName: newCase.patientName,
      age: Number(newCase.age),
      gender: newCase.gender as any,
      triagePriority: newCase.triagePriority,
      chiefComplaint: newCase.chiefComplaint,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedDoctor: newCase.attendingDoctor,
      assignedBed: newCase.bedNumber,
      vitals: {
        bp: newCase.vitals.bp,
        pulse: newCase.vitals.hr,
        spo2: newCase.vitals.spo2,
        temp: newCase.vitals.temp,
        hr: newCase.vitals.hr,
        rr: newCase.vitals.rr,
      },
      attendingDoctor: newCase.attendingDoctor,
      bedNumber: newCase.bedNumber,
      status: 'In Treatment',
    });

    showToast({
      type: 'success',
      title: 'ER Case Created',
      message: `Emergency trauma admission registered for ${newCase.patientName} (${newCase.triagePriority} priority).`,
    });

    setIsModalOpen(false);
  };

  const handleUpdatePriority = (id: string, prio: TriagePriority) => {
    updateEmergencyTriage(id, prio);
    showToast({
      type: 'info',
      title: 'Triage Changed',
      message: `Case ${id} updated to ${prio} priority.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-700 via-rose-600 to-red-800 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-rose-200">
            <Siren className="w-4 h-4 animate-bounce" />
            <span>Emergency &amp; Trauma Resuscitation Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Emergency Triage Console
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-1">
            Rapid patient intake, continuous hemodynamics monitoring, priority classification, and trauma intervention.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 shadow-lg transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Intake Emergency Patient</span>
        </button>
      </div>

      {/* Priority Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPriority('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              selectedPriority === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            All ER Cases ({emergencyCases.length})
          </button>
          <button
            onClick={() => setSelectedPriority('Critical')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              selectedPriority === 'Critical'
                ? 'bg-rose-600 text-white'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            Critical ({emergencyCases.filter((c) => c.triagePriority === 'Critical').length})
          </button>
          <button
            onClick={() => setSelectedPriority('High')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              selectedPriority === 'High'
                ? 'bg-orange-600 text-white'
                : 'text-orange-600 hover:bg-orange-50'
            }`}
          >
            High ({emergencyCases.filter((c) => c.triagePriority === 'High').length})
          </button>
          <button
            onClick={() => setSelectedPriority('Medium')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              selectedPriority === 'Medium'
                ? 'bg-amber-600 text-white'
                : 'text-amber-600 hover:bg-amber-50'
            }`}
          >
            Medium ({emergencyCases.filter((c) => c.triagePriority === 'Medium').length})
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Crash cart &amp; defibrillator: <span className="text-emerald-600 font-bold">READY</span>
        </div>
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCases.map((er) => {
          const isCritical = er.triagePriority === 'Critical';
          const isHigh = er.triagePriority === 'High';

          return (
            <div
              key={er.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isCritical
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 ring-1 ring-rose-500/50'
                  : isHigh
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-300 dark:border-orange-900'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {er.patientName}
                      </h3>
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        {er.bedNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {er.age}y &bull; {er.gender} &bull; Arrived: {er.arrivalTime}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isHigh
                        ? 'bg-orange-600 text-white'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                    }`}
                  >
                    {er.triagePriority}
                  </span>
                </div>

                {/* Complaint */}
                <div className="mt-3">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Chief Complaint:
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                    {er.chiefComplaint}
                  </p>
                </div>

                {/* Hemodynamic Vitals Monitor */}
                <div className="mt-3 p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs grid grid-cols-3 gap-2 border border-slate-800 shadow-inner">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Blood Pressure</span>
                    <span className="text-sm font-bold">{er.vitals.bp}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Heart Rate</span>
                    <span className="text-sm font-bold">{er.vitals.hr || er.vitals.pulse} bpm</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">SpO2</span>
                    <span className={`text-sm font-bold ${er.vitals.spo2 < 95 ? 'text-rose-400' : ''}`}>
                      {er.vitals.spo2}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Temp</span>
                    <span className="text-sm font-bold">{er.vitals.temp}&deg;F</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block uppercase">Resp Rate</span>
                    <span className="text-sm font-bold">{er.vitals.rr || 16} /min</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <span>Attending: </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {er.attendingDoctor || er.assignedDoctor}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <select
                    value={er.triagePriority}
                    onChange={(e) => handleUpdatePriority(er.id, e.target.value as any)}
                    className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <button
                  onClick={() => onAdmitToIPD(er)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold shadow-xs"
                >
                  <BedSingle className="w-3.5 h-3.5" />
                  <span>Transfer to ICU / IPD</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Intake Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-50 dark:bg-rose-950/40">
              <h2 className="text-base font-bold text-rose-900 dark:text-rose-100 flex items-center gap-2">
                <Siren className="w-5 h-5 text-rose-600" />
                <span>Immediate Emergency Intake Registration</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCase.patientName}
                  onChange={(e) => setNewCase({ ...newCase, patientName: e.target.value })}
                  placeholder="e.g. Thomas Wayne"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newCase.age}
                    onChange={(e) => setNewCase({ ...newCase, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={newCase.gender}
                    onChange={(e) => setNewCase({ ...newCase, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Triage Priority *
                  </label>
                  <select
                    value={newCase.triagePriority}
                    onChange={(e) => setNewCase({ ...newCase, triagePriority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-slate-800 text-rose-900 dark:text-rose-200 font-bold"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chief Complaint / Trauma Mechanism *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newCase.chiefComplaint}
                  onChange={(e) => setNewCase({ ...newCase, chiefComplaint: e.target.value })}
                  placeholder="e.g. Blunt abdominal trauma from motor vehicle accident..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Initial Vitals Grid */}
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  On-Arrival Hemodynamic Vitals:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">BP (mmHg)</label>
                    <input
                      type="text"
                      value={newCase.vitals.bp}
                      onChange={(e) =>
                        setNewCase({ ...newCase, vitals: { ...newCase.vitals, bp: e.target.value } })
                      }
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">HR (bpm)</label>
                    <input
                      type="number"
                      value={newCase.vitals.hr}
                      onChange={(e) =>
                        setNewCase({ ...newCase, vitals: { ...newCase.vitals, hr: Number(e.target.value) } })
                      }
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">SpO2 (%)</label>
                    <input
                      type="number"
                      value={newCase.vitals.spo2}
                      onChange={(e) =>
                        setNewCase({ ...newCase, vitals: { ...newCase.vitals, spo2: Number(e.target.value) } })
                      }
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Bay / Bed</label>
                    <input
                      type="text"
                      value={newCase.bedNumber}
                      onChange={(e) => setNewCase({ ...newCase, bedNumber: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Confirm Emergency Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
