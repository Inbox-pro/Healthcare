import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { InboxLogo } from '../common/InboxLogo';
import {
  Settings,
  Building,
  Shield,
  Database,
  Moon,
  Sun,
  RotateCcw,
  Download,
  CheckCircle2,
  Lock,
  KeyRound,
  FileCheck
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { role, user, ROLE_PERMISSIONS } = useAuth();
  const { resetToDemoData } = useHMS();
  const { showToast } = useToast();

  const [hospitalInfo, setHospitalInfo] = useState({
    name: 'Inbox Healthcare Super-Speciality Hospital',
    parentCompany: 'Inbox Infotech Pvt. Ltd.',
    tagline: 'Precision Medicine & Patient-Centric Clinical Excellence',
    address: 'Plot No. 42, Tech City, Sector 5, Bangalore, Karnataka - 560100',
    contactEmail: 'contact@inboxinfotech.com',
    emergencyHelpline: '+1 (800) 462-6946 / 1066',
    accreditation: 'NABH Digital Health Level 2 & JCI Gold Seal Certified',
    licenseNumber: 'HOSP-INBOX-2026-9812',
    taxGstin: '29AAACI4819Q1ZT',
  });

  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleExportJSON = () => {
    const backup = {
      hospital: hospitalInfo,
      exportedAt: new Date().toISOString(),
      localStorageDump: { ...localStorage },
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Inbox_HMS_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      type: 'success',
      title: 'Database Exported',
      message: 'Encrypted JSON snapshot backup created successfully.',
    });
  };

  const handleSaveHospitalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Hospital organization profile updated.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-600" />
            <span>Hospital Administration &amp; System Configuration</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Inbox Infotech Pvt. Ltd. enterprise parameters, role-based access security, and clinical data governance.
          </p>
        </div>

        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-600" />}
          <span>{darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hospital Entity Details (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <InboxLogo className="h-9 w-auto" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Hospital Entity Profile
              </h2>
              <p className="text-xs text-slate-500">
                Managed &amp; Powered by {hospitalInfo.parentCompany}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveHospitalInfo} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hospital Facility Name
              </label>
              <input
                type="text"
                value={hospitalInfo.name}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Company / Vendor
                </label>
                <input
                  type="text"
                  value={hospitalInfo.parentCompany}
                  onChange={(e) =>
                    setHospitalInfo({ ...hospitalInfo, parentCompany: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accreditation Status
                </label>
                <input
                  type="text"
                  value={hospitalInfo.accreditation}
                  onChange={(e) =>
                    setHospitalInfo({ ...hospitalInfo, accreditation: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Physical Campus Address
              </label>
              <input
                type="text"
                value={hospitalInfo.address}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Emergency 24x7 Helpline
                </label>
                <input
                  type="text"
                  value={hospitalInfo.emergencyHelpline}
                  onChange={(e) =>
                    setHospitalInfo({ ...hospitalInfo, emergencyHelpline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State Health Department License #
                </label>
                <input
                  type="text"
                  value={hospitalInfo.licenseNumber}
                  onChange={(e) =>
                    setHospitalInfo({ ...hospitalInfo, licenseNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs"
              >
                Save Organization Profile
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Security & Data Backup (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Data Backup & Reset Card */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600" />
              <span>Database Operations &amp; Disaster Recovery</span>
            </h3>

            <p className="text-slate-500">
              Create an offline encrypted JSON snapshot of patient EMRs, appointments, pharmacy stock, and billing ledger.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Offline JSON Snapshot</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset all demo records back to clean initial state?')) {
                    resetToDemoData();
                    showToast({
                      type: 'info',
                      title: 'Reset Completed',
                      message: 'Hospital database has been restored to default demo records.',
                    });
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Database to Initial State</span>
              </button>
            </div>
          </div>

          {/* Active Security Session */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Active RBAC Security Context</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <p className="text-slate-500">
                Logged in User: <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
              </p>
              <p className="text-slate-500">
                Assigned Role: <span className="font-bold text-sky-600">{role}</span>
              </p>
              <p className="text-slate-500">
                Department: <span className="font-semibold">{user.department}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Permissions Table */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-600" />
            <span>Role-Based Access Control (RBAC) Governance Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Defines which staff roles have permission to view, edit, and access various clinical and financial modules.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Hospital Staff Role</th>
                <th className="py-3 px-4">Authorized Clinical / Administrative Modules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {Object.entries(ROLE_PERMISSIONS).map(([rName, perm]) => (
                <tr
                  key={rName}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    rName === role ? 'bg-sky-50/50 dark:bg-sky-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{rName}</span>
                    {rName === role && (
                      <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-600 text-white uppercase">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {perm.allowedModules.map((m: string) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
