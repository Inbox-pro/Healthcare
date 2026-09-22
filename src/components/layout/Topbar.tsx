import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHMS } from '../../context/HMSContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Shield,
  UserCheck,
  ChevronDown,
  CheckCircle2,
  Calendar,
  UserPlus,
  FileText,
  Pill,
  FlaskConical,
  BedSingle,
  AlertTriangle,
  Info,
  LogOut
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
  isSidebarCollapsed?: boolean;
  isMobileSidebarOpen?: boolean;
  onOpenSearch: () => void;
  onOpenRoleSwitcher: () => void;
  onQuickAction: (action: string) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  activeModuleName?: string;
  activeModule?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  onToggleDesktopSidebar,
  isSidebarCollapsed = false,
  isMobileSidebarOpen = false,
  onOpenSearch,
  onOpenRoleSwitcher,
  onQuickAction,
  isDark = false,
  onToggleTheme = () => {},
  activeModuleName,
  activeModule,
}) => {
  const currentModuleName = activeModuleName || activeModule || 'Dashboard';
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationsAsRead, settings } = useHMS();

  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-4 transition-colors"
    >
      {/* Left: Current Module Title */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <span className="text-xs text-slate-400 font-medium">Inbox Health HMS &bull;</span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {currentModuleName}
          </h2>
        </div>
      </div>

      {/* Center / Search bar trigger */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          id="topbar-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search patients, doctors, records...</span>
          </div>
          <kbd className="font-mono text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {isSidebarCollapsed && (
          <button
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Open Sidebar"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {!isMobileSidebarOpen && (
          <button
            onClick={onToggleMobileSidebar}
            className="flex lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Open Sidebar"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Action "+ New" Button */}
        <div className="relative">
          <button
            id="topbar-quick-action-btn"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-slate-700 dark:text-slate-200">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Create Hospital Record
              </div>
              <button
                onClick={() => {
                  onQuickAction('register_patient');
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <UserPlus className="w-4 h-4 text-sky-600" />
                <span>Register New Patient</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('book_appointment');
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Book Appointment</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('create_invoice');
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Create Billing Invoice</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('new_prescription');
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Pill className="w-4 h-4 text-rose-600" />
                <span>Issue Prescription (Rx)</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('order_lab');
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <FlaskConical className="w-4 h-4 text-amber-600" />
                <span>Order Laboratory Test</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('admit_patient');
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <BedSingle className="w-4 h-4 text-purple-600" />
                <span>Admit Inpatient (IPD)</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="topbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Clinical &amp; System Alerts
                  </h4>
                  <p className="text-[10px] text-slate-400">{unreadCount} unread notifications</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${
                      !n.read ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {n.type === 'emergency' && (
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      )}
                      {n.type === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      {n.type === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      )}
                      {n.type === 'info' && (
                        <Info className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                          {n.title}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">
                          {n.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          id="topbar-theme-toggle"
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Persona & Role Switcher */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.slice(0, 1)}
            </div>
            <div className="hidden xl:block text-left leading-none">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {currentUser.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 capitalize">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-1 text-slate-700 dark:text-slate-200">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenRoleSwitcher();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-sky-600 dark:text-sky-400 font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>Switch Role Persona</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  id="topbar-signout-btn"
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Lock Workstation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
