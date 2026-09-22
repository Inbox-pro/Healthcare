import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { Bed, BedStatus, WardType } from '../../types/hms';
import {
  Hotel,
  CheckCircle2,
  AlertCircle,
  Wind,
  Activity,
  Filter,
  User,
  X,
  Sparkles,
  Wrench
} from 'lucide-react';

export const BedsModule: React.FC = () => {
  const { beds, updateBedStatus } = useHMS();
  const { showToast } = useToast();

  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeBed, setActiveBed] = useState<Bed | null>(null);

  const wardTypes: WardType[] = [
    'ICU',
    'General Ward',
    'Private Room',
    'Semi-Private',
    'Emergency',
    'Pediatrics',
    'Maternity',
  ];

  const filteredBeds = beds.filter((b) => {
    const matchesWard = selectedWard === 'all' || b.wardType === selectedWard;
    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
    return matchesWard && matchesStatus;
  });

  const occupiedCount = beds.filter((b) => b.status === 'Occupied').length;
  const availableCount = beds.filter((b) => b.status === 'Available').length;
  const cleaningCount = beds.filter((b) => b.status === 'Cleaning').length;
  const maintenanceCount = beds.filter((b) => b.status === 'Maintenance').length;
  const occupancyRate = Math.round((occupiedCount / beds.length) * 100);

  const handleStatusChange = (bedId: string, newStatus: BedStatus) => {
    updateBedStatus(bedId, newStatus);
    showToast({
      type: 'info',
      title: 'Bed Status Updated',
      message: `Bed ${bedId} updated to ${newStatus}.`,
    });
    if (activeBed && activeBed.id === bedId) {
      setActiveBed({ ...activeBed, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Hotel className="w-6 h-6 text-sky-600" />
            <span>Ward &amp; Bed Occupancy Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time interactive bed matrix, oxygen support status, telemetry, and sanitation tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400">Hospital Census</span>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {occupancyRate}% Occupied ({occupiedCount}/{beds.length})
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">Available Beds</p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-0.5">
              {availableCount}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600 opacity-80" />
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-rose-800 dark:text-rose-300">Occupied</p>
            <p className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-0.5">
              {occupiedCount}
            </p>
          </div>
          <User className="w-6 h-6 text-rose-600 opacity-80" />
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">Sanitizing / Cleaning</p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-0.5">
              {cleaningCount}
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-amber-600 opacity-80" />
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Maintenance</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {maintenanceCount}
            </p>
          </div>
          <Wrench className="w-6 h-6 text-slate-500 opacity-80" />
        </div>
      </div>

      {/* Ward Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedWard('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedWard === 'all'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Wards ({beds.length})
          </button>
          {wardTypes.map((wt) => (
            <button
              key={wt}
              onClick={() => setSelectedWard(wt)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedWard === wt
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {wt} ({beds.filter((b) => b.wardType === wt).length})
            </button>
          ))}
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden font-medium"
        >
          <option value="all">All Bed Statuses</option>
          <option value="Available">Available Only</option>
          <option value="Occupied">Occupied Only</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Visual Bed Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredBeds.map((bed) => {
          const isOcc = bed.status === 'Occupied';
          const isAvail = bed.status === 'Available';
          const isClean = bed.status === 'Cleaning';

          return (
            <div
              key={bed.id}
              onClick={() => setActiveBed(bed)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-102 flex flex-col justify-between ${
                isOcc
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900 shadow-xs'
                  : isAvail
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900 shadow-xs'
                  : isClean
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {bed.bedNumber}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOcc
                        ? 'bg-rose-500'
                        : isAvail
                        ? 'bg-emerald-500'
                        : isClean
                        ? 'bg-amber-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>

                <div className="mt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {bed.wardType}
                  </span>
                  <p className="text-[11px] text-slate-500">Floor {bed.floor}</p>
                </div>

                {isOcc ? (
                  <div className="mt-2 pt-2 border-t border-rose-200 dark:border-rose-900/60">
                    <p className="font-bold text-rose-900 dark:text-rose-200 text-xs truncate">
                      {bed.currentPatientName}
                    </p>
                    <p className="text-[10px] text-rose-600 font-mono">{bed.currentPatientId}</p>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      Ready for Admission
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">${bed.dailyRate}/day</p>
                  </div>
                )}
              </div>

              {/* Badges footer */}
              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-0.5" title="Oxygen Supply">
                  <Wind className={`w-3 h-3 ${bed.hasOxygen ? 'text-sky-600' : 'text-slate-300'}`} />
                  {bed.hasOxygen ? 'O2' : ''}
                </span>
                <span className="flex items-center gap-0.5" title="Ventilator / Telemetry">
                  <Activity
                    className={`w-3 h-3 ${bed.hasVentilator ? 'text-purple-600' : 'text-slate-300'}`}
                  />
                  {bed.hasVentilator ? 'Vent' : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Detail Modal */}
      {activeBed && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveBed(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {activeBed.wardType} &bull; Floor {activeBed.floor}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Bed #{activeBed.bedNumber}
                </h3>
              </div>
              <button onClick={() => setActiveBed(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Ward Charge:</span>
                <span className="font-bold font-mono text-sm">${activeBed.dailyRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Oxygen Port Available:</span>
                <span className="font-semibold text-sky-600">{activeBed.hasOxygen ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ventilator / Life Support:</span>
                <span className="font-semibold text-purple-600">{activeBed.hasVentilator ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {activeBed.status === 'Occupied' && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-1">
                <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                  Current Inpatient
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {activeBed.currentPatientName}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">Patient ID: {activeBed.currentPatientId}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Update Bed Availability Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusChange(activeBed.id, 'Available')}
                  className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs hover:bg-emerald-200"
                >
                  Mark Available
                </button>
                <button
                  onClick={() => handleStatusChange(activeBed.id, 'Occupied')}
                  className="px-3 py-2 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold text-xs hover:bg-rose-200"
                >
                  Mark Occupied
                </button>
                <button
                  onClick={() => handleStatusChange(activeBed.id, 'Cleaning')}
                  className="px-3 py-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold text-xs hover:bg-amber-200"
                >
                  Mark Cleaning
                </button>
                <button
                  onClick={() => handleStatusChange(activeBed.id, 'Maintenance')}
                  className="px-3 py-2 rounded-lg bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300"
                >
                  Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
