import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHMS } from '../../context/HMSContext';
import { MedicalLogo } from '../common/MedicalLogo';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Clock,
  BedSingle,
  Siren,
  Hotel,
  HeartPulse,
  ClipboardEdit,
  Pill,
  ShoppingBag,
  FlaskConical,
  ScanLine,
  CreditCard,
  Scissors,
  LogOut,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onSelectModule?: (moduleId: string) => void;
  onNavigate?: (moduleId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse = () => {},
  isMobileOpen,
  onCloseMobile,
}) => {
  const { currentUser, isRoleAllowed, logout } = useAuth();
  const { emergencyCases, appointments, medicines, labOrders } = useHMS();
  const navigate = onNavigate || onSelectModule || (() => {});

  // Badges
  const criticalERCount = emergencyCases.filter((c) => c.triagePriority === 'Critical' || c.triagePriority === 'High').length;
  const todayApptsCount = appointments.filter((a) => a.date === '2026-09-21').length;
  const lowStockCount = medicines.filter((m) => m.stockQuantity <= m.minStockLevel).length;
  const pendingLabCount = labOrders.filter((l) => l.status === 'Ordered' || l.status === 'Sample Collected').length;

  const navSections = [
    {
      group: 'Overview & Front Desk',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'patients', label: 'Patients Directory', icon: Users },
        { id: 'appointments', label: 'Appointments', icon: Calendar, badge: todayApptsCount > 0 ? todayApptsCount : undefined, badgeColor: 'bg-sky-500' },
        { id: 'opd', label: 'OPD Queue / Tokens', icon: Clock },
      ],
    },
    {
      group: 'Clinical & Inpatient',
      items: [
        { id: 'doctors', label: 'Doctors & Faculty', icon: Stethoscope },
        { id: 'consultation', label: 'Doctor Consultation', icon: ClipboardEdit },
        { id: 'prescriptions', label: 'Prescriptions (Rx)', icon: Pill },
        { id: 'nursing', label: 'Nursing & Vitals', icon: HeartPulse },
        { id: 'emergency', label: 'Emergency / Trauma', icon: Siren, badge: criticalERCount > 0 ? criticalERCount : undefined, badgeColor: 'bg-red-500 animate-pulse' },
        { id: 'ipd', label: 'Inpatient (IPD)', icon: BedSingle },
        { id: 'beds', label: 'Beds & Rooms', icon: Hotel },
        { id: 'ot', label: 'Operation Theatre', icon: Scissors },
      ],
    },
    {
      group: 'Diagnostics & Pharmacy',
      items: [
        { id: 'lab', label: 'Laboratory (LIS)', icon: FlaskConical, badge: pendingLabCount > 0 ? pendingLabCount : undefined, badgeColor: 'bg-amber-500' },
        { id: 'radiology', label: 'Radiology (RIS)', icon: ScanLine },
        { id: 'pharmacy', label: 'Pharmacy Dispensary', icon: ShoppingBag, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-orange-500' },
      ],
    },
    {
      group: 'Finance & Records',
      items: [
        { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
      ],
    },
    {
      group: 'Services & Operations',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Hospital Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out w-64 ${
          isMobileOpen
            ? 'translate-x-0'
            : isCollapsed
              ? '-translate-x-full'
              : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div
            onClick={() => navigate('dashboard')}
            className="cursor-pointer overflow-hidden flex items-center"
          >
            <MedicalLogo size="sm" variant="full" subtitle="Healthcare System" />
          </div>

          <button
            onClick={() => onToggleCollapse && onToggleCollapse()}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 select-none custom-scrollbar">
          {navSections.map((sec, secIdx) => {
            // Filter items user role is allowed to view
            const visibleItems = sec.items.filter((item) => isRoleAllowed(item.id));
            if (visibleItems.length === 0) return null;

            return (
              <div key={secIdx}>
                {!isCollapsed && (
                  <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {sec.group}
                  </div>
                )}

                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => {
                          navigate(item.id);
                          onCloseMobile();
                        }}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />

                        {!isCollapsed && (
                          <span className="truncate flex-1 text-left">{item.label}</span>
                        )}

                        {!isCollapsed && item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full text-white ${
                              item.badgeColor || 'bg-slate-500'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {isCollapsed && item.badge !== undefined && (
                          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current User Role Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium capitalize truncate">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            )}

            <button
              onClick={() => logout()}
              id="sidebar-logout-btn"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Sign Out / Lock Workstation"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
