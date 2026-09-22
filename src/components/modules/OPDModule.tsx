import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { Clock, Users, PlayCircle, CheckCircle2, Megaphone, Stethoscope, ArrowRight } from 'lucide-react';

interface OPDModuleProps {
  onStartConsultation: (appt: any) => void;
}

export const OPDModule: React.FC<OPDModuleProps> = ({ onStartConsultation }) => {
  const { appointments, updateAppointmentStatus, doctors } = useHMS();
  const { showToast } = useToast();

  const [selectedDept, setSelectedDept] = useState('all');
  const [callingToken, setCallingToken] = useState<number | null>(null);

  const todayStr = '2026-09-21';
  const todayAppts = appointments.filter(
    (a) => a.date === todayStr && (selectedDept === 'all' || a.department === selectedDept)
  );

  const waitingQueue = todayAppts.filter((a) => a.status === 'Checked-in' || a.status === 'Scheduled');
  const inConsultQueue = todayAppts.filter((a) => a.status === 'In Consultation');
  const completedQueue = todayAppts.filter((a) => a.status === 'Completed');

  const handleCallToken = (tokenNumber: number, patientName: string, doctorName: string) => {
    setCallingToken(tokenNumber);
    showToast({
      type: 'info',
      title: `Calling Token #${tokenNumber}`,
      message: `${patientName} please proceed to ${doctorName}'s consultation room.`,
    });
    setTimeout(() => setCallingToken(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Token Display Board Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Outpatient Department Live Token System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            OPD Central Token Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time queue sequencing, patient token announcements, and waiting room management.
          </p>
        </div>

        {/* Live Calling Display Screen */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
          <div className="text-center px-4 py-2 rounded-lg bg-sky-600 text-white font-mono">
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
              Now Calling
            </span>
            <span className="text-3xl font-bold">
              {callingToken ? `#${callingToken}` : inConsultQueue[0] ? `#${inConsultQueue[0].tokenNumber}` : '---'}
            </span>
          </div>
          <div className="text-xs">
            <p className="text-slate-400">Current Serving:</p>
            <p className="font-bold text-white text-sm">
              {inConsultQueue[0]?.patientName || 'No Active Consultation'}
            </p>
            <p className="text-sky-400 text-[11px]">
              {inConsultQueue[0]?.doctorName || 'Awaiting doctor round'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">Waiting in Queue</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {waitingQueue.length} Patients
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">In Doctor Cabin</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              {inConsultQueue.length} Ongoing
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">Completed Today</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {completedQueue.length} Consulted
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Queue Columns: Waiting vs In Consultation vs Completed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waiting Queue */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Waiting Queue ({waitingQueue.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1">
            {waitingQueue.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-sky-400 transition-all text-xs"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    #{item.tokenNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{item.time}</span>
                </div>

                <div className="mt-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {item.patientName}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Consultant: <span className="font-medium text-slate-700 dark:text-slate-300">{item.doctorName}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">{item.reason}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCallToken(item.tokenNumber, item.patientName, item.doctorName)}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber-600 hover:text-amber-700"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Call Patient</span>
                  </button>

                  <button
                    onClick={() => {
                      updateAppointmentStatus(item.id, 'In Consultation');
                      onStartConsultation(item);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white font-medium text-[11px] shadow-xs"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Start Consult</span>
                  </button>
                </div>
              </div>
            ))}

            {waitingQueue.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No patients currently waiting in this department.
              </div>
            )}
          </div>
        </div>

        {/* In Consultation Active */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Active in Cabin ({inConsultQueue.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1">
            {inConsultQueue.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-xs"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    Token #{item.tokenNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 font-bold uppercase">
                    Inside Cabin
                  </span>
                </div>

                <div className="mt-2">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {item.patientName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Attending: <span className="font-semibold">{item.doctorName}</span>
                  </p>
                  <p className="text-slate-500 text-[11px]">{item.department}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-purple-200 dark:border-purple-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onStartConsultation(item)}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Open Clinical Notes &rarr;
                  </button>

                  <button
                    onClick={() => updateAppointmentStatus(item.id, 'Completed')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conclude</span>
                  </button>
                </div>
              </div>
            ))}

            {inConsultQueue.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No active consultations in progress.
              </div>
            )}
          </div>
        </div>

        {/* Completed Consultations */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Completed ({completedQueue.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[550px] pr-1">
            {completedQueue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs opacity-80"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-500 font-semibold">#{item.tokenNumber}</span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {item.patientName}
                </p>
                <p className="text-[11px] text-slate-400">
                  {item.doctorName} • {item.department}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
