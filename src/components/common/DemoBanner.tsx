import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, RefreshCw, UserCheck, ChevronDown, Check, Shield, LogOut } from 'lucide-react';
import { UserRole } from '../../types/hms';

interface DemoBannerProps {
  onOpenRoleSwitcher: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenRoleSwitcher }) => {
  const { currentUser, switchRole, demoUsers, logout } = useAuth();
  const { resetDemoData } = useHMS();
  const { showToast } = useToast();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all demo database records to initial synthetic dataset?')) {
      resetDemoData();
      showToast({
        type: 'info',
        title: 'Demo Data Reset',
        message: 'All records have been restored to initial sample state.',
      });
    }
  };

  const handleQuickRole = (role: UserRole) => {
    switchRole(role);
    setShowRoleDropdown(false);
    showToast({
      type: 'success',
      title: 'Switched Role',
      message: `Active session role is now: ${role.replace('_', ' ').toUpperCase()}`,
    });
  };

  return (
    <div
      id="demo-banner-bar"
      className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-3 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 z-40 transition-colors"
    >
      <div className="flex items-center gap-2 font-medium">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold text-[11px] tracking-wide uppercase">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Demo Mode
        </span>
        <span className="hidden sm:inline text-slate-600 dark:text-slate-300 text-[11px]">
          Synthetic clinical &amp; operational records for demonstration. No real patient data.
        </span>
      </div>

      <div className="flex items-center gap-2 relative">
        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            id="demo-role-switch-btn"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/60 shadow-xs hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium transition-colors"
            title="Click to quickly switch user role"
          >
            <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Role:</span>
            <span className="font-semibold text-sky-700 dark:text-sky-300 capitalize">
              {currentUser.role.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-slate-700 dark:text-slate-200 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
                Switch Active Persona
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {demoUsers.map((u) => {
                  const isCurrent = currentUser.role === u.role;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleQuickRole(u.role)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors ${
                        isCurrent ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold' : ''
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="capitalize">{u.role.replace('_', ' ')}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">{u.name}</div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700/50 p-1.5">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onOpenRoleSwitcher();
                  }}
                  className="w-full text-center text-xs py-1 text-sky-600 dark:text-sky-400 hover:underline"
                >
                  View Full Role Matrix &amp; Accounts &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reset Database Button */}
        <button
          id="demo-reset-data-btn"
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-300 transition-colors shadow-xs"
          title="Reset database to initial synthetic demo state"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Data</span>
        </button>

        {/* Sign Out to Login Screen */}
        <button
          id="demo-signout-btn"
          onClick={() => logout()}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 transition-colors shadow-xs"
          title="Sign out to test the Medical Login Screen"
        >
          <LogOut className="w-3 h-3 text-rose-500" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
