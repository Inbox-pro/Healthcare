import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { Doctor } from '../../types/hms';
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface DoctorsModuleProps {
  onBookWithDoctor?: (doctorId: string) => void;
  onNavigateToAppointments?: () => void;
}

export const DoctorsModule: React.FC<DoctorsModuleProps> = ({ onBookWithDoctor, onNavigateToAppointments }) => {
  const { doctors, updateDoctor, departments } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      search === '' ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.department.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'all' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleToggleAvailability = (doc: Doctor) => {
    updateDoctor(doc.id, { isAvailable: !doc.isAvailable });
    showToast({
      type: 'info',
      title: 'Status Updated',
      message: `${doc.name} is now marked as ${!doc.isAvailable ? 'Available' : 'Unavailable/Off-duty'}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-sky-600" />
            <span>Doctors &amp; Medical Faculty Roster</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage senior consultants, OPD clinic schedules, room allocations, and live availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
            {doctors.filter((d) => d.isAvailable).length} Doctors On Duty
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors by name, specialty, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Departments ({departments.length})</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <span className="text-slate-400 text-xs">{filteredDoctors.length} doctors found</span>
        </div>
      </div>

      {/* Doctors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sky-700 dark:text-sky-300 text-base shadow-xs">
                    {doc.name.split(' ').slice(1, 3).map((n) => n[0]).join('') || 'DR'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-slate-400">{doc.qualifications || doc.qualification}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAvailability(doc)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    doc.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                  title="Click to toggle availability"
                >
                  {doc.isAvailable ? 'Available' : 'Off-Duty'}
                </button>
              </div>

              {/* Specs & Schedule */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Department:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{doc.department}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> OPD Hours:
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                    {doc.opdTimings || doc.workingHours} ({(doc.opdDays || doc.scheduleDays || []).slice(0, 3).join(', ')})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Room / Clinic:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Room {doc.roomNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Consultation Fee:</span>
                  <span className="font-bold text-emerald-600 font-mono text-sm">
                    ${doc.consultationFee}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{doc.rating}</span>
                <span className="text-slate-400 font-normal">({doc.experienceYears}y exp)</span>
              </div>

              <button
                onClick={() => {
                  if (onBookWithDoctor) {
                    onBookWithDoctor(doc.id);
                  } else if (onNavigateToAppointments) {
                    onNavigateToAppointments();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Visit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
