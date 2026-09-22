import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { AppointmentStatus, AppointmentType } from '../../types/hms';
import {
  Calendar,
  Clock,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  PlayCircle,
  User,
  Stethoscope,
  X
} from 'lucide-react';

interface AppointmentsModuleProps {
  onStartConsultation: (appointment: any) => void;
  defaultDoctorId?: string;
}

export const AppointmentsModule: React.FC<AppointmentsModuleProps> = ({
  onStartConsultation,
  defaultDoctorId,
}) => {
  const { appointments, addAppointment, updateAppointmentStatus, patients, doctors } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-09-21');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(defaultDoctorId || 'all');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New Booking State
  const [booking, setBooking] = useState({
    patientId: patients[0]?.id || '',
    doctorId: defaultDoctorId || doctors[0]?.id || '',
    date: '2026-09-21',
    time: '11:00 AM',
    type: 'Routine Consultation' as AppointmentType,
    reason: 'Routine health checkup',
  });

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      search === '' ||
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());

    const matchesDate = selectedDate === 'all' || a.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    const matchesDoc = selectedDoctor === 'all' || a.doctorId === selectedDoctor;

    return matchesSearch && matchesDate && matchesStatus && matchesDoc;
  });

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    updateAppointmentStatus(id, newStatus);
    showToast({
      type: 'info',
      title: 'Appointment Status Changed',
      message: `Appointment ${id} status set to ${newStatus}.`,
    });
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === booking.patientId);
    const doc = doctors.find((d) => d.id === booking.doctorId);

    if (!pat || !doc) {
      showToast({ type: 'warning', title: 'Error', message: 'Invalid patient or doctor selected.' });
      return;
    }

    const created = addAppointment({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date: booking.date,
      time: booking.time,
      status: 'Scheduled',
      type: booking.type,
      reason: booking.reason,
      vitalSignsRecorded: false,
      consultationFee: doc.consultationFee,
    });

    showToast({
      type: 'success',
      title: 'Appointment Booked',
      message: `Visit confirmed for ${created.patientName} with ${created.doctorName}. Token #${created.tokenNumber}`,
    });

    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-600" />
            <span>Outpatient Appointments &amp; Scheduling</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time appointment scheduler, OPD consultation queue tokens, and patient check-in.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter and Date Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, reason, token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Presets */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
            <button
              onClick={() => setSelectedDate('2026-09-21')}
              className={`px-3 py-1 rounded font-medium ${
                selectedDate === '2026-09-21'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Today (09/21)
            </button>
            <button
              onClick={() => setSelectedDate('2026-09-22')}
              className={`px-3 py-1 rounded font-medium ${
                selectedDate === '2026-09-22'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setSelectedDate('all')}
              className={`px-3 py-1 rounded font-medium ${
                selectedDate === 'all'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Dates
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Checked-in">Checked-in</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Doctor Filter */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden max-w-[180px]"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor &amp; Department</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Visit Type / Reason</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredAppointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                    #{appt.tokenNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {appt.patientName}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{appt.patientId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {appt.doctorName}
                    </div>
                    <div className="text-[10px] text-slate-400">{appt.department}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      {appt.time}
                    </div>
                    <div className="text-[10px] text-slate-400">{appt.date}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-0.5">
                      {appt.type}
                    </span>
                    <p className="text-slate-500 truncate max-w-[180px]">{appt.reason}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        appt.status === 'In Consultation'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 animate-pulse'
                          : appt.status === 'Checked-in'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : appt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : appt.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {appt.status === 'Scheduled' && (
                        <button
                          onClick={() => handleStatusChange(appt.id, 'Checked-in')}
                          className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium text-[11px]"
                          title="Check-in patient"
                        >
                          Check In
                        </button>
                      )}

                      {(appt.status === 'Checked-in' || appt.status === 'Scheduled') && (
                        <button
                          onClick={() => {
                            handleStatusChange(appt.id, 'In Consultation');
                            onStartConsultation(appt);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white font-medium text-[11px]"
                          title="Start Doctor Consultation"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Consult</span>
                        </button>
                      )}

                      {appt.status === 'In Consultation' && (
                        <button
                          onClick={() => handleStatusChange(appt.id, 'Completed')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>
                      )}

                      {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                          title="Cancel appointment"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div
          id="book-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsBookModalOpen(false)}
        >
          <div
            id="book-modal-card"
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                <span>Book Outpatient Consultation</span>
              </h2>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Patient *
                </label>
                <select
                  value={booking.patientId}
                  onChange={(e) => setBooking({ ...booking, patientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.id}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consulting Doctor *
                </label>
                <select
                  value={booking.doctorId}
                  onChange={(e) => setBooking({ ...booking, doctorId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} &bull; {d.department} (Fee: ${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Visit Classification
                </label>
                <select
                  value={booking.type}
                  onChange={(e) => setBooking({ ...booking, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="New Consultation">New Consultation</option>
                  <option value="Routine Consultation">Routine Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency Consultation">Emergency Consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Visit / Symptoms
                </label>
                <textarea
                  rows={2}
                  value={booking.reason}
                  onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  placeholder="e.g. Persistent fever, cough, joint stiffness..."
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
