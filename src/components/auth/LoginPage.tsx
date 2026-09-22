import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MedicalLogo } from '../common/MedicalLogo';
import { UserRole } from '../../types/hms';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Building2,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Activity,
  Users,
  Siren,
  PhoneCall,
  MapPin,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Pill,
  FlaskConical,
  UserCheck
} from 'lucide-react';

interface QuickStaffRole {
  role: UserRole;
  label: string;
  name: string;
  email: string;
  dept: string;
  icon: any;
  badgeColor: string;
}

const QUICK_ROLES: QuickStaffRole[] = [
  {
    role: 'doctor',
    label: 'Doctor',
    name: 'Dr. Robert Chen, MD',
    email: 'doctor@demo.com',
    dept: 'Cardiology & OPD',
    icon: Stethoscope,
    badgeColor: 'bg-sky-500 text-white',
  },
  {
    role: 'nurse',
    label: 'Head Nurse',
    name: 'Sarah Jenkins, RN',
    email: 'nurse@demo.com',
    dept: 'ICU & Ward Nursing',
    icon: HeartPulse,
    badgeColor: 'bg-rose-500 text-white',
  },
  {
    role: 'super_admin',
    label: 'Super Admin',
    name: 'System Administrator',
    email: 'admin@demo.com',
    dept: 'Hospital Operations',
    icon: ShieldCheck,
    badgeColor: 'bg-indigo-600 text-white',
  },
  {
    role: 'receptionist',
    label: 'Reception',
    name: 'Front Desk Officer',
    email: 'reception@demo.com',
    dept: 'Admissions & Triage',
    icon: Users,
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    role: 'pharmacist',
    label: 'Pharmacist',
    name: 'Dr. Lisa Wong, PharmD',
    email: 'pharmacy@demo.com',
    dept: 'Central Pharmacy',
    icon: Pill,
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    role: 'lab_technician',
    label: 'Lab Tech',
    name: 'Michael Chang, MLT',
    email: 'lab@demo.com',
    dept: 'Diagnostic Pathology',
    icon: FlaskConical,
    badgeColor: 'bg-teal-600 text-white',
  },
  {
    role: 'patient',
    label: 'Patient',
    name: 'Jane Doe',
    email: 'patient@demo.com',
    dept: 'Patient Portal',
    icon: UserCheck,
    badgeColor: 'bg-cyan-600 text-white',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [selectedHospital, setSelectedHospital] = useState('main_center');
  const [email, setEmail] = useState('doctor@demo.com');
  const [password, setPassword] = useState('••••••••••••');
  const [badgeToken, setBadgeToken] = useState('MED-8842');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSelectRole = (staff: QuickStaffRole) => {
    setSelectedRole(staff.role);
    setEmail(staff.email);
    setPassword('demoPass2026!');
    setBadgeToken(`STF-${Math.floor(1000 + Math.random() * 9000)}`);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your medical staff email or ID.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      login(email, password, selectedRole);
      setIsLoading(false);
    }, 400);
  };

  const handleEmergencyBypass = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('admin@demo.com', 'bypass', 'super_admin');
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Top Clinical Info Bar matching reference header */}
      <header className="bg-sky-900 dark:bg-slate-900 text-slate-100 border-b border-sky-800 dark:border-slate-800 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Contact and Location */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-sky-100">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Emergency 24/7: <strong className="text-white">+012 3456 789</strong>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Mon - Fri: 8:00 AM - 8:00 PM | Trauma Center 24/7</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>One Canada Square, Canary Wharf, London</span>
            </div>
          </div>

          {/* Right Header Controls: Mode Toggle & Security Badge */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Secure Clinical Port 443 (SSL/TLS)
            </span>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              id="login-theme-toggle"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-800/80 hover:bg-sky-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-xs border border-sky-700/60 dark:border-slate-700 transition-all shadow-xs"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-300" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Medical Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Showcase & Healthcare Feature Highlights */}
          <div className="lg:col-span-6 space-y-6">
            {/* Medical Logo and Title */}
            <div className="space-y-3">
              <MedicalLogo
                size="xl"
                variant="full"
                subtitle="Medical and Healthcare Enterprise Management System"
              />

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-4">
                Best Choice For <br />
                <span className="text-sky-600 dark:text-sky-400">Medical Health Care</span>
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Unified clinical workstation integrating electronic medical records, emergency triage,
                bed telemetry, digital pharmacy, stat laboratory diagnostics, and hospital billing.
              </p>
            </div>

            {/* 4 Pillars from the reference image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3 hover:border-sky-400 dark:hover:border-sky-600 transition-all">
                <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Qualified Doctors</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Board-certified specialists across 12 clinical disciplines.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3 hover:border-sky-400 dark:hover:border-sky-600 transition-all">
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex-shrink-0">
                  <Siren className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Emergency Services</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Level 1 Trauma Unit with 24/7 acute emergency care.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3 hover:border-sky-400 dark:hover:border-sky-600 transition-all">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex-shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Transplant Services</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Advanced ICU, OT modules, and patient telemetry.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3 hover:border-sky-400 dark:hover:border-sky-600 transition-all">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">24/7 Care Services</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Real-time nurse call, instant lab &amp; pharmacy fulfillment.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Emergency / Direct Access Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Need Immediate Trauma or ER Access?
                </span>
              </div>
              <button
                type="button"
                onClick={handleEmergencyBypass}
                className="px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[11px] transition-colors shadow-xs"
              >
                Code Blue Bypass &rarr;
              </button>
            </div>
          </div>

          {/* Right Column: Clinical Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-sky-600 to-sky-700 dark:from-slate-900 dark:to-sky-950 text-white border-b border-sky-500 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Staff Clinical Portal</h2>
                    <p className="text-xs text-sky-100 dark:text-slate-400">
                      Sign in to your authorized hospital workstation
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-xs">
                    <Building2 className="w-5 h-5 text-sky-100" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* 1. Fast Role Preset Selector (Single-click demo fills) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Quick Access Role Selector:
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">1-Click Auto Fill</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {QUICK_ROLES.map((staff) => {
                      const Icon = staff.icon;
                      const isSelected = selectedRole === staff.role;
                      return (
                        <button
                          key={staff.role}
                          type="button"
                          onClick={() => handleSelectRole(staff)}
                          className={`flex items-center gap-1.5 p-2 rounded-lg text-left text-xs transition-all border ${
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-600 text-sky-900 dark:text-sky-200 font-bold shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                          <span className="truncate">{staff.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 2. Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Hospital Facility */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hospital Facility
                    </label>
                    <div className="relative">
                      <select
                        value={selectedHospital}
                        onChange={(e) => setSelectedHospital(e.target.value)}
                        className="w-full px-3 py-2 pl-9 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      >
                        <option value="main_center">Main Medical Health Center &amp; Super Specialty</option>
                        <option value="er_trauma">East Wing Acute Emergency &amp; Trauma Care</option>
                        <option value="outpatient_hub">Downtown Outpatient Care &amp; Pathology Hub</option>
                      </select>
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Staff Email or ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Staff ID or Clinical Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@medicalhealth.org"
                        className="w-full px-3 py-2 pl-9 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Password & 2FA Badge row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowHelpModal(true)}
                          className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          Helpdesk?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-3 py-2 pl-9 pr-9 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* 2FA Badge Security Token */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Badge 2FA Token
                        </label>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                          Verified
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={badgeToken}
                          onChange={(e) => setBadgeToken(e.target.value)}
                          placeholder="MED-8842"
                          className="w-full px-3 py-2 pl-9 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-slate-600 dark:text-slate-400">Remember this terminal</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Auto-session lock: 15 min</span>
                  </div>

                  {/* Submit Button with Heartbeat ECG styling */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    id="btn-login-submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <HeartPulse className="w-4 h-4 animate-pulse-ecg" />
                        <span>Authenticate &amp; Launch Workstation</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Security and Compliance Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>HIPAA Compliant &amp; HL7 FHIR Protocol</span>
                  </div>
                  <span>Version 4.2.0-Enterprise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Hospital Helpdesk Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Hospital IT &amp; Clinical Helpdesk</h3>
                <p className="text-xs text-slate-500">24/7 internal clinical technical support</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                For forgotten passwords, smart badge resets, or biometric terminal errors, please contact:
              </p>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1 text-slate-700 dark:text-slate-200">
                <p><strong>Internal Extension:</strong> Ext. 4400 / 4401</p>
                <p><strong>Clinical Hotline:</strong> +012 3456 789 (Option 4)</p>
                <p><strong>IT Security Office:</strong> Ground Floor, Wing B</p>
              </div>
              <p className="text-[11px] text-slate-400">
                All logins are audited under HIPAA Title II physical and technical security mandates.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 rounded-lg bg-sky-600 text-white font-medium text-xs hover:bg-sky-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
