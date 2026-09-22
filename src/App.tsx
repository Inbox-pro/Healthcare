import React, { useState, useEffect } from 'react';
import { HMSProvider } from './context/HMSContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { RoleSwitcherModal } from './components/layout/RoleSwitcherModal';
import { DemoBanner } from './components/common/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { PrintModal, DocumentType } from './components/common/PrintModal';
import { LoginPage } from './components/auth/LoginPage';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { PatientsModule } from './components/modules/PatientsModule';
import { DoctorsModule } from './components/modules/DoctorsModule';
import { AppointmentsModule } from './components/modules/AppointmentsModule';
import { OPDModule } from './components/modules/OPDModule';
import { ConsultationModule } from './components/modules/ConsultationModule';
import { EmergencyModule } from './components/modules/EmergencyModule';
import { IPDModule } from './components/modules/IPDModule';
import { BedsModule } from './components/modules/BedsModule';
import { NursingModule } from './components/modules/NursingModule';
import { PharmacyModule } from './components/modules/PharmacyModule';
import { PrescriptionsModule } from './components/modules/PrescriptionsModule';
import { LabModule } from './components/modules/LabModule';
import { RadiologyModule } from './components/modules/RadiologyModule';
import { OTModule } from './components/modules/OTModule';
import { BillingModule } from './components/modules/BillingModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { SettingsModule } from './components/modules/SettingsModule';

function MainLayout() {
  const { role, isRoleAllowed } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Selected patient for EMR deep linking
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);
  // Selected appointment for Consultation deep linking
  const [selectedConsultationAppt, setSelectedConsultationAppt] = useState<any | null>(null);

  // Print Modal State
  const [printState, setPrintState] = useState<{
    isOpen: boolean;
    type: DocumentType;
    data: any;
    title: string;
  }>({
    isOpen: false,
    type: 'invoice',
    data: null,
    title: 'Hospital Clinical Document',
  });

  // Global Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ensure current active module is allowed for active role; if not, fallback to dashboard
  useEffect(() => {
    if (!isRoleAllowed(activeModule)) {
      setActiveModule('dashboard');
    }
  }, [role, activeModule, isRoleAllowed]);

  const handleNavigate = (moduleKey: string) => {
    setActiveModule(moduleKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAction = (actionKey: string) => {
    if (actionKey === 'register_patient' || actionKey === 'register-patient') {
      setActiveModule('patients');
    } else if (actionKey === 'book_appointment' || actionKey === 'book-appointment') {
      setActiveModule('appointments');
    } else if (actionKey === 'create_invoice' || actionKey === 'new-bill') {
      setActiveModule('billing');
    } else if (actionKey === 'new_prescription' || actionKey === 'new-prescription') {
      setActiveModule('consultation');
    } else if (actionKey === 'order_lab' || actionKey === 'order-lab') {
      setActiveModule('lab');
    } else if (actionKey === 'order_radiology' || actionKey === 'order-radiology') {
      setActiveModule('radiology');
    } else if (actionKey === 'admit_patient' || actionKey === 'admit-patient') {
      setActiveModule('ipd');
    } else if (actionKey === 'emergency_intake' || actionKey === 'emergency-intake') {
      setActiveModule('emergency');
    }
  };

  const handleGlobalSearchResultSelect = (result: any) => {
    if (result.type === 'patient') {
      setSelectedPatientId(result.id);
      setActiveModule('patients');
    } else if (result.type === 'doctor') {
      setActiveModule('doctors');
    } else if (result.type === 'appointment') {
      setActiveModule('appointments');
    } else if (result.type === 'emergency') {
      setActiveModule('emergency');
    } else if (result.type === 'medicine') {
      setActiveModule('pharmacy');
    } else if (result.type === 'bill') {
      setActiveModule('billing');
    }
  };

  const handleStartConsultation = (appointment: any) => {
    setSelectedConsultationAppt(appointment);
    setActiveModule('consultation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdmitToIPDFromER = (erCase: any) => {
    setActiveModule('ipd');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitiateDischarge = (admission: any) => {
    // Open billing with admission data or print discharge summary
    setPrintState({
      isOpen: true,
      type: 'discharge',
      data: admission,
      title: `Discharge Summary - ${admission.patientName}`,
    });
  };

  const handlePrintDocument = (type: DocumentType, data: any, title: string) => {
    setPrintState({
      isOpen: true,
      type,
      data,
      title,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top RBAC Demo Notification Banner */}
      <DemoBanner onOpenRoleSwitcher={() => setIsRoleModalOpen(true)} />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 overflow-y-auto transition-[margin] duration-300 ease-in-out ${
            isSidebarCollapsed ? '' : 'lg:ml-64'
          }`}
        >
          {/* Header Topbar */}
          <Topbar
            activeModule={activeModule}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onToggleDesktopSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            isSidebarCollapsed={isSidebarCollapsed}
            isMobileSidebarOpen={isMobileSidebarOpen}
            onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onQuickAction={handleQuickAction}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          {/* Module Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeModule === 'dashboard' && (
              <DashboardModule
                onNavigate={handleNavigate}
                onQuickAction={handleQuickAction}
                onStartConsultation={handleStartConsultation}
              />
            )}

            {activeModule === 'patients' && (
              <PatientsModule
                initialPatientId={selectedPatientId}
                onPrintDocument={handlePrintDocument}
              />
            )}

            {activeModule === 'doctors' && (
              <DoctorsModule onNavigateToAppointments={() => setActiveModule('appointments')} />
            )}

            {activeModule === 'appointments' && (
              <AppointmentsModule onStartConsultation={handleStartConsultation} />
            )}

            {activeModule === 'opd' && (
              <OPDModule onStartConsultation={handleStartConsultation} />
            )}

            {activeModule === 'consultation' && (
              <ConsultationModule
                initialAppointment={selectedConsultationAppt}
                onPrintDocument={handlePrintDocument}
              />
            )}

            {activeModule === 'emergency' && (
              <EmergencyModule onAdmitToIPD={handleAdmitToIPDFromER} />
            )}

            {activeModule === 'ipd' && (
              <IPDModule
                onInitiateDischarge={handleInitiateDischarge}
                onPrintDocument={handlePrintDocument}
              />
            )}

            {activeModule === 'beds' && <BedsModule />}

            {activeModule === 'nursing' && <NursingModule />}

            {activeModule === 'pharmacy' && <PharmacyModule />}

            {activeModule === 'prescriptions' && (
              <PrescriptionsModule onPrintDocument={handlePrintDocument} />
            )}

            {activeModule === 'lab' && (
              <LabModule onPrintDocument={handlePrintDocument} />
            )}

            {activeModule === 'radiology' && (
              <RadiologyModule onPrintDocument={handlePrintDocument} />
            )}

            {activeModule === 'ot' && <OTModule />}

            {activeModule === 'billing' && (
              <BillingModule onPrintDocument={handlePrintDocument} />
            )}

            {activeModule === 'reports' && <ReportsModule />}

            {activeModule === 'settings' && <SettingsModule />}
          </main>
        </div>
      </div>

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleGlobalSearchResultSelect}
      />

      {/* Role Switcher RBAC Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Clinical & Financial Document Print Modal */}
      <PrintModal
        isOpen={printState.isOpen}
        onClose={() => setPrintState({ ...printState, isOpen: false })}
        type={printState.type}
        data={printState.data}
        title={printState.title}
      />

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HMSProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </HMSProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
