import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { OperationTheatreSlot } from '../../types/hms';
import {
  Scissors,
  Search,
  Plus,
  Clock,
  User,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sparkles,
  X
} from 'lucide-react';

export const OTModule: React.FC = () => {
  const { otSlots, addOTSlot, patients, doctors } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('all');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New Surgery Slot Form
  const [newSlot, setNewSlot] = useState({
    patientId: patients[0]?.id || '',
    leadSurgeon: doctors.find((d) => (d.specialization || d.specialty || '').includes('Surgeon'))?.name || 'Dr. Eleanor Campbell',
    anesthetist: 'Dr. Robert Zhao, MD',
    surgeryName: 'Laparoscopic Cholecystectomy',
    theaterRoom: 'OT-1 (Main Surgical Suite)',
    scheduledDate: '2026-09-22',
    scheduledTime: '08:00 AM - 11:30 AM',
    pacClearance: true,
  });

  const filteredSlots = otSlots.filter((slot: OperationTheatreSlot) => {
    const matchesSearch =
      search === '' ||
      slot.patientName.toLowerCase().includes(search.toLowerCase()) ||
      slot.surgeryName.toLowerCase().includes(search.toLowerCase()) ||
      slot.leadSurgeon.toLowerCase().includes(search.toLowerCase());

    const matchesOT = selectedTheater === 'all' || slot.theaterRoom === selectedTheater;
    return matchesSearch && matchesOT;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newSlot.patientId);
    if (!pat) return;

    addOTSlot({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      surgeryName: newSlot.surgeryName,
      leadSurgeon: newSlot.leadSurgeon,
      anesthetist: newSlot.anesthetist,
      theaterRoom: newSlot.theaterRoom,
      scheduledDate: newSlot.scheduledDate,
      scheduledTime: newSlot.scheduledTime,
      status: 'Scheduled',
      pacClearance: newSlot.pacClearance,
    });

    showToast({
      type: 'success',
      title: 'OT Slot Reserved',
      message: `${newSlot.surgeryName} booked in ${newSlot.theaterRoom} for ${pat.firstName}.`,
    });

    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scissors className="w-6 h-6 text-sky-600" />
            <span>Operation Theatre &amp; Surgical Scheduling</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Surgical suites (OT-1 to OT-4), Pre-Anesthesia Checkup (PAC) clearance, scrub roster, and sterilization cycles.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Surgical Procedure</span>
        </button>
      </div>

      {/* Theater Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/30">
          <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
            <span>OT-1 (Main Suite)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
          </div>
          <p className="text-rose-700 dark:text-rose-300 font-semibold mt-1">In Procedure</p>
          <p className="text-[11px] text-slate-500">Cabg Procedure &bull; Dr. Campbell</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
            <span>OT-2 (Laparoscopy)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
          <p className="text-emerald-700 dark:text-emerald-300 font-semibold mt-1">Sterilized &amp; Ready</p>
          <p className="text-[11px] text-slate-500">Next: 02:00 PM</p>
        </div>

        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/60 dark:bg-purple-950/30">
          <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-200">
            <span>OT-3 (Ortho &amp; Neuro)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          </div>
          <p className="text-purple-700 dark:text-purple-300 font-semibold mt-1">Scheduled Prep</p>
          <p className="text-[11px] text-slate-500">Total Knee Arthroplasty</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30">
          <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
            <span>OT-4 (Emergency OT)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          </div>
          <p className="text-amber-700 dark:text-amber-300 font-semibold mt-1">Trauma Standby</p>
          <p className="text-[11px] text-slate-500">24/7 Rapid Induction Ready</p>
        </div>
      </div>

      {/* Surgeries Table */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">OT Case #</th>
                <th className="py-3 px-4">Procedure &amp; Theater</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Surgical Team</th>
                <th className="py-3 px-4">Date &amp; Window</th>
                <th className="py-3 px-4 text-center">PAC Clearance</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSlots.map((slot: OperationTheatreSlot) => (
                <tr
                  key={slot.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                    {slot.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {slot.surgeryName}
                    </div>
                    <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                      {slot.theaterRoom}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {slot.patientName}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{slot.patientId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                      Surgeon: {slot.leadSurgeon}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Anesthetist: {slot.anesthetist}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {slot.scheduledDate}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{slot.scheduledTime}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {slot.pacClearance ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> CLEARED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" /> PENDING
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        slot.status === 'In Progress'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                          : slot.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Procedure Modal */}
      {isBookModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsBookModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-sky-600" />
                <span>Reserve Operating Theatre Procedure</span>
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
                  value={newSlot.patientId}
                  onChange={(e) => setNewSlot({ ...newSlot, patientId: e.target.value })}
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
                  Surgical Procedure Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSlot.surgeryName}
                  onChange={(e) => setNewSlot({ ...newSlot, surgeryName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operating Theatre *
                  </label>
                  <select
                    value={newSlot.theaterRoom}
                    onChange={(e) => setNewSlot({ ...newSlot, theaterRoom: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="OT-1 (Main Surgical Suite)">OT-1 (Main Surgical Suite)</option>
                    <option value="OT-2 (Laparoscopy Suite)">OT-2 (Laparoscopy Suite)</option>
                    <option value="OT-3 (Ortho &amp; Neuro)">OT-3 (Ortho &amp; Neuro)</option>
                    <option value="OT-4 (Emergency OT)">OT-4 (Emergency Standby)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Surgery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newSlot.scheduledDate}
                    onChange={(e) => setNewSlot({ ...newSlot, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Surgeon *
                  </label>
                  <input
                    type="text"
                    value={newSlot.leadSurgeon}
                    onChange={(e) => setNewSlot({ ...newSlot, leadSurgeon: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Anesthetist *
                  </label>
                  <input
                    type="text"
                    value={newSlot.anesthetist}
                    onChange={(e) => setNewSlot({ ...newSlot, anesthetist: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={newSlot.pacClearance}
                    onChange={(e) => setNewSlot({ ...newSlot, pacClearance: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Pre-Anesthesia Checkup (PAC) Cleared</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Confirm Surgery Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
