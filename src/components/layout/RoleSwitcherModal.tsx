import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/hms';
import { Shield, Check, X, User, ArrowRight, KeyRound } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole, demoUsers, permissions } = useAuth();

  if (!isOpen) return null;

  const roleDescriptions: Record<UserRole, { badge: string; desc: string; access: string }> = {
    super_admin: {
      badge: 'Full Root Access',
      desc: 'Complete control across all 26 clinical, operational, administrative, and configuration modules.',
      access: 'All Modules + Audit Logs + System Settings + Master Configuration',
    },
    hospital_admin: {
      badge: 'Operations & Management',
      desc: 'Operational supervision over doctors, beds, departments, inventory, pharmacy, and billing.',
      access: 'Clinical Operations, Inventory, Facilities, Finance & Analytics',
    },
    doctor: {
      badge: 'Clinical Care Provider',
      desc: 'Consultation notes, diagnosis, e-prescriptions, lab/radiology orders, and surgical scheduling.',
      access: 'Assigned Patients, Consultations, Prescriptions, Orders, OT',
    },
    nurse: {
      badge: 'Inpatient & Ward Care',
      desc: 'Vital signs charting, ward bed management, triage, and medication administration records.',
      access: 'IPD, Nursing Vitals, Beds, ER Triage, Blood Stock',
    },
    receptionist: {
      badge: 'Front Desk & Admissions',
      desc: 'Patient intake registration, appointment scheduling, queue tokens, and initial billing.',
      access: 'Registration, Appointments, OPD Tokens, Invoices, Ambulance',
    },
    pharmacist: {
      badge: 'Dispensing & Medication',
      desc: 'Prescription dispensing with automated inventory deduction, batch & expiry monitoring.',
      access: 'Pharmacy Catalog, Dispensing, Stock Levels, Expiry Alerts',
    },
    lab_technician: {
      badge: 'Pathology & Diagnostics',
      desc: 'Sample collection, specimen processing, result entry, reference range checks, and reports.',
      access: 'Lab Orders, Test Results, Verification, Specimen Log',
    },
    radiology_technician: {
      badge: 'Medical Imaging',
      desc: 'X-Ray, CT, MRI and Ultrasound scheduling, technician scans, and radiologist findings.',
      access: 'Imaging Orders, Scan Uploads, Impression Reports',
    },
    accountant: {
      badge: 'Financial & Billing',
      desc: 'Hospital invoices, payment collections, cash/card/UPI receipts, and insurance reconciliations.',
      access: 'Billing, Invoices, Payments, Refunds, Financial Reports',
    },
    hr_staff: {
      badge: 'Human Resources',
      desc: 'Medical and non-medical staff management, departmental roster, and shift scheduling.',
      access: 'Staff Profiles, Shifts, Attendance, Payroll Demo',
    },
    patient: {
      badge: 'Patient Portal',
      desc: 'Dedicated patient self-service view to see upcoming visits, active Rx, lab reports & bills.',
      access: 'Personal Appointments, Medical Records, Prescriptions, Invoices',
    },
    insurance_staff: {
      badge: 'TPA & Claims',
      desc: 'Insurance policy coverage verification, claim submission, approvals, and settlement tracking.',
      access: 'Insurance Claims, Pre-auth, Approvals, TPA Audit',
    },
  };

  return (
    <div
      id="role-switcher-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="role-switcher-card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Role-Based Access Control (RBAC) Switcher
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select any of the 12 pre-configured persona accounts to test role-specific workflows and permission gates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {demoUsers.map((u) => {
            const isCurrent = currentUser.role === u.role;
            const meta = roleDescriptions[u.role] || {
              badge: 'Role',
              desc: 'Standard healthcare staff member',
              access: 'Configured modules',
            };

            return (
              <div
                key={u.id}
                className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 shadow-xs ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {meta.badge}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1.5 capitalize">
                        {u.role.replace('_', ' ')}
                      </h3>
                      <p className="text-xs font-medium text-sky-700 dark:text-sky-300">{u.name}</p>
                    </div>

                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/60 px-2 py-1 rounded-md">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          switchRole(u.role);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>Switch</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 font-mono text-[10px] truncate max-w-[200px]">
                    <KeyRound className="w-3 h-3 text-slate-400" />
                    <span>{u.email}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">PW: demo123</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
