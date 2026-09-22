import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { PatientVital } from '../../types/hms';
import {
  HeartPulse,
  Plus,
  Search,
  Activity,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const NursingModule: React.FC = () => {
  const { vitals, addVital, patients, admissions } = useHMS();
  const { showToast } = useToast();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // New vitals state
  const [newVital, setNewVital] = useState({
    patientId: selectedPatientId,
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 74,
    temperature: 98.4,
    spo2: 98,
    respiratoryRate: 16,
    bloodSugar: 105,
    painScore: 2,
    nurseNotes: 'Patient resting comfortably. Vitals stable.',
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Vitals history for selected patient (chronological)
  const patientVitals = vitals
    .filter((v: PatientVital) => v.patientId === selectedPatientId)
    .sort((a: PatientVital, b: PatientVital) => a.recordedAt.localeCompare(b.recordedAt));

  // Chart data formatting
  const chartData = patientVitals.map((v: PatientVital) => ({
    time: v.recordedAt.slice(11, 16) || v.recordedAt.slice(5),
    systolic: v.systolicBP,
    diastolic: v.diastolicBP,
    heartRate: v.heartRate,
    spo2: v.spo2,
    temp: v.temperature,
  }));

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newVital.patientId);
    if (!pat) return;

    addVital({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      nurseName: 'Nurse Sarah Jenkins, RN',
      systolicBP: Number(newVital.systolicBP),
      diastolicBP: Number(newVital.diastolicBP),
      heartRate: Number(newVital.heartRate),
      temperature: Number(newVital.temperature),
      spo2: Number(newVital.spo2),
      respiratoryRate: Number(newVital.respiratoryRate),
      bloodSugar: Number(newVital.bloodSugar),
      painScore: Number(newVital.painScore),
      nurseNotes: newVital.nurseNotes,
    });

    showToast({
      type: 'success',
      title: 'Vitals Charted',
      message: `Vitals recorded for ${pat.firstName} ${pat.lastName} at bedside.`,
    });

    setIsRecordModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-sky-600" />
            <span>Nursing Care &amp; Clinical Vitals Charting</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Bedside hemodynamic observation, temperature flowsheets, and nursing handover shift records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setNewVital({ ...newVital, patientId: e.target.value });
            }}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            {patients.slice(0, 15).map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} ({p.id})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Bedside Vitals</span>
          </button>
        </div>
      </div>

      {/* Selected Patient Vitals Line Chart */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Hemodynamic Trend Flowsheet &mdash; {selectedPatient?.firstName}{' '}
              {selectedPatient?.lastName}
            </h3>
            <p className="text-xs text-slate-400">
              Systolic BP vs Diastolic BP vs Heart Rate (BPM) vs SpO2 (%)
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {chartData.length} Readings Logged
          </span>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic BP (mmHg)"
                  stroke="#E64A19"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic BP (mmHg)"
                  stroke="#F57C00"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate (BPM)"
                  stroke="#0288D1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="spo2"
                  name="SpO2 (%)"
                  stroke="#7CB342"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              No historical vitals charted yet for this patient. Click "Record Bedside Vitals" to add.
            </div>
          )}
        </div>
      </div>

      {/* Vitals Log Table */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
          Recent Clinical Measurements Across All Wards
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Time Recorded</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4 text-center">BP (mmHg)</th>
                <th className="py-3 px-4 text-center">Pulse (bpm)</th>
                <th className="py-3 px-4 text-center">Temp (&deg;F)</th>
                <th className="py-3 px-4 text-center">SpO2</th>
                <th className="py-3 px-4 text-center">Blood Glucose</th>
                <th className="py-3 px-4 text-center">Pain (1-10)</th>
                <th className="py-3 px-4">Nurse Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {vitals.slice(0, 12).map((v: PatientVital) => {
                const isBpHigh = v.systolicBP > 140 || v.diastolicBP > 90;
                const isHypoxic = v.spo2 < 95;

                return (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{v.recordedAt}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {v.patientName}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={isBpHigh ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>
                        {v.systolicBP}/{v.diastolicBP}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{v.heartRate}</td>
                    <td className="py-3 px-4 text-center font-mono">{v.temperature}&deg;F</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={isHypoxic ? 'text-rose-600' : 'text-emerald-600'}>
                        {v.spo2}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{v.bloodSugar || '--'} mg/dL</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{v.painScore}/10</td>
                    <td className="py-3 px-4 text-slate-500 truncate max-w-[200px]">
                      {v.nurseNotes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Vitals Modal */}
      {isRecordModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsRecordModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-sky-600" />
                <span>Bedside Nursing Vitals Entry</span>
              </h2>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Patient *
                </label>
                <select
                  value={newVital.patientId}
                  onChange={(e) => setNewVital({ ...newVital, patientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={newVital.systolicBP}
                    onChange={(e) =>
                      setNewVital({ ...newVital, systolicBP: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={newVital.diastolicBP}
                    onChange={(e) =>
                      setNewVital({ ...newVital, diastolicBP: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={newVital.heartRate}
                    onChange={(e) =>
                      setNewVital({ ...newVital, heartRate: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={newVital.spo2}
                    onChange={(e) => setNewVital({ ...newVital, spo2: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Body Temp (&deg;F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newVital.temperature}
                    onChange={(e) =>
                      setNewVital({ ...newVital, temperature: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={newVital.bloodSugar}
                    onChange={(e) =>
                      setNewVital({ ...newVital, bloodSugar: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pain Level (0 - 10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newVital.painScore}
                    onChange={(e) =>
                      setNewVital({ ...newVital, painScore: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nursing Assessment &amp; Clinical Remarks
                </label>
                <textarea
                  rows={2}
                  value={newVital.nurseNotes}
                  onChange={(e) => setNewVital({ ...newVital, nurseNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs"
                >
                  Save to Patient Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
