import React, { useState, useMemo } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { Patient } from '../../types/hms';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Calendar,
  FileText,
  CreditCard,
  Pill,
  Activity,
  Heart,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface PatientsModuleProps {
  onQuickAction?: (action: string, data?: any) => void;
  onPrintDocument?: (type: any, data: any, title: string) => void;
  selectedPatientId?: string;
  initialPatientId?: string;
}

export const PatientsModule: React.FC<PatientsModuleProps> = ({
  onQuickAction,
  onPrintDocument,
  selectedPatientId,
  initialPatientId,
}) => {
  const { patients, addPatient, appointments, prescriptions, invoices, labOrders, admissions } = useHMS();
  const { showToast } = useToast();

  const activeInitialId = selectedPatientId || initialPatientId;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [activePatient, setActivePatient] = useState<Patient | null>(() => {
    if (activeInitialId) {
      return patients.find((p) => p.id === activeInitialId) || null;
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'labs' | 'billing' | 'admissions'>('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Patient Form State
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    age: 30,
    gender: 'Male',
    dateOfBirth: '1996-05-15',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    city: 'New York',
    emergencyContact: { name: '', relationship: 'Spouse', relation: 'Spouse', phone: '' },
    allergies: ['None'],
    chronicConditions: [],
    insurance: { provider: 'Medicare Advantage', policyNumber: 'MED-9021', validUntil: '2027-12-31', validTill: '2027-12-31' },
  });

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGender = selectedGender === 'all' || p.gender === selectedGender;
      const matchesBlood = selectedBloodGroup === 'all' || p.bloodGroup === selectedBloodGroup;

      return matchesSearch && matchesGender && matchesBlood;
    });
  }, [patients, searchQuery, selectedGender, selectedBloodGroup]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.phone) {
      showToast({
        type: 'warning',
        title: 'Validation Error',
        message: 'Please fill in patient name and primary phone number.',
      });
      return;
    }

    const created = addPatient({
      firstName: newPatient.firstName!,
      lastName: newPatient.lastName!,
      age: Number(newPatient.age) || 25,
      gender: newPatient.gender as any,
      dateOfBirth: newPatient.dateOfBirth || '1995-01-01',
      bloodGroup: newPatient.bloodGroup as any,
      phone: newPatient.phone!,
      email: newPatient.email || `${newPatient.firstName?.toLowerCase()}@example.com`,
      address: newPatient.address || '123 Health Ave',
      city: newPatient.city || 'Metro City',
      emergencyContact: {
        name: newPatient.emergencyContact?.name || 'Emergency Contact',
        relationship: newPatient.emergencyContact?.relation || 'Family',
        relation: newPatient.emergencyContact?.relation || 'Family',
        phone: newPatient.emergencyContact?.phone || '555-0199',
      },
      allergies: newPatient.allergies || ['None'],
      chronicConditions: newPatient.chronicConditions || [],
      insurance: newPatient.insurance,
      registrationDate: new Date().toISOString().slice(0, 10),
      status: 'Active',
      totalVisits: 0,
      outstandingBalance: 0,
    });

    showToast({
      type: 'success',
      title: 'Patient Registered',
      message: `Patient ${created.firstName} ${created.lastName} (ID: ${created.id}) created successfully.`,
    });

    setIsRegisterModalOpen(false);
    setActivePatient(created);
  };

  // Associated records for active patient
  const patientAppointments = activePatient
    ? appointments.filter((a) => a.patientId === activePatient.id)
    : [];
  const patientPrescriptions = activePatient
    ? prescriptions.filter((p) => p.patientId === activePatient.id)
    : [];
  const patientInvoices = activePatient
    ? invoices.filter((i) => i.patientId === activePatient.id)
    : [];
  const patientLabs = activePatient
    ? labOrders.filter((l) => l.patientId === activePatient.id)
    : [];
  const patientAdmissions = activePatient
    ? admissions.filter((ad) => ad.patientId === activePatient.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span>Patients Master Registry</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage comprehensive demographic records, clinical history, appointments, and billing ledgers.
          </p>
        </div>

        <button
          id="patient-register-btn"
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            id="patient-search-input"
            type="text"
            placeholder="Search by name, ID (e.g. PAT-1001), phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600">
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Blood Group Filter */}
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="all">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <span className="text-xs text-slate-400 font-medium px-2">
            Showing {filteredPatients.length} of {patients.length} patients
          </span>
        </div>
      </div>

      {/* Patients Data Table */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Visits</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                    {patient.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                      {patient.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {patient.age} yrs • {patient.gender}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {patient.phone}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{patient.city}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {patient.totalVisits}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    {(patient.outstandingBalance || 0) > 0 ? (
                      <span className="text-rose-600">${patient.outstandingBalance}</span>
                    ) : (
                      <span className="text-emerald-600">$0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setActivePatient(patient)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View EMR</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail EMR Modal */}
      {activePatient && (
        <div
          id="patient-emr-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setActivePatient(null)}
        >
          <div
            id="patient-emr-card"
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {activePatient.firstName[0]}
                  {activePatient.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {activePatient.firstName} {activePatient.lastName}
                    </h2>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold">
                      {activePatient.id}
                    </span>
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {activePatient.bloodGroup}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activePatient.age} years old • {activePatient.gender} • Registered:{' '}
                    {activePatient.registrationDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onPrintDocument &&
                    onPrintDocument(
                      'patient_summary',
                      {
                        ...activePatient,
                        patientName: `${activePatient.firstName} ${activePatient.lastName}`,
                        patientId: activePatient.id,
                      },
                      `Patient Summary - ${activePatient.firstName} ${activePatient.lastName}`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Summary</span>
                </button>
                <button
                  onClick={() => setActivePatient(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-6 text-xs font-semibold overflow-x-auto bg-white dark:bg-slate-900">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Clinical Overview
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'appointments'
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Appointments ({patientAppointments.length})
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'prescriptions'
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Prescriptions ({patientPrescriptions.length})
              </button>
              <button
                onClick={() => setActiveTab('labs')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'labs'
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Laboratory Tests ({patientLabs.length})
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'billing'
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Billing Invoices ({patientInvoices.length})
              </button>
              <button
                onClick={() => setActiveTab('admissions')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'admissions'
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                IPD Admissions ({patientAdmissions.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* 1. Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Demographics & Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Contact Information
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-sky-600" />
                          <span>{activePatient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-sky-600" />
                          <span>{activePatient.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-sky-600" />
                          <span>
                            {activePatient.address}, {activePatient.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Emergency Contact
                      </p>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {activePatient.emergencyContact.name}
                        </p>
                        <p className="text-slate-500">
                          Relation: {activePatient.emergencyContact.relation}
                        </p>
                        <p className="text-sky-600 font-mono text-[11px]">
                          Tel: {activePatient.emergencyContact.phone}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Insurance Policy
                      </p>
                      {activePatient.insurance ? (
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{activePatient.insurance.provider}</span>
                          </p>
                          <p className="text-slate-500 font-mono text-[11px]">
                            Policy #{activePatient.insurance.policyNumber}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Valid until: {activePatient.insurance.validTill || activePatient.insurance.validUntil}
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-400">Self-paying patient (No TPA)</p>
                      )}
                    </div>
                  </div>

                  {/* Clinical Alerts: Allergies & Chronic Conditions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
                      <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200 text-xs mb-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Documented Allergies</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activePatient.allergies.map((alg, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-semibold text-[11px]"
                          >
                            {alg}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                      <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-xs mb-2">
                        <Heart className="w-4 h-4 text-amber-600" />
                        <span>Chronic Conditions / Comorbidities</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activePatient.chronicConditions.length > 0 ? (
                          activePatient.chronicConditions.map((cond, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold text-[11px]"
                            >
                              {cond}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">No known chronic conditions</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Appointments */}
              {activeTab === 'appointments' && (
                <div className="space-y-3">
                  {patientAppointments.length > 0 ? (
                    patientAppointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {appt.doctorName}{' '}
                            <span className="font-normal text-slate-400">({appt.department})</span>
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            {appt.date} at {appt.time} • Token #{appt.tokenNumber} • Reason:{' '}
                            {appt.reason}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {appt.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">No appointment records found.</div>
                  )}
                </div>
              )}

              {/* 3. Prescriptions */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-4">
                  {patientPrescriptions.length > 0 ? (
                    patientPrescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              Rx #{rx.id}
                            </span>{' '}
                            <span className="text-slate-400 font-mono text-[11px]">
                              • Date: {rx.date}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Doctor: {rx.doctorName} | Diagnosis: <span className="font-semibold text-sky-700 dark:text-sky-300">{rx.diagnosis}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => onPrintDocument && onPrintDocument('prescription', rx, `Prescription #${rx.id}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs hover:bg-slate-100"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {rx.medicines.map((m, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-none"
                            >
                              <div className="font-semibold text-slate-800 dark:text-slate-200">
                                {m.medicineName} ({m.dosage})
                              </div>
                              <div className="text-slate-500">
                                {m.frequency} • {m.duration} • {m.instructions}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">No prescriptions found.</div>
                  )}
                </div>
              )}

              {/* 4. Labs */}
              {activeTab === 'labs' && (
                <div className="space-y-3">
                  {patientLabs.length > 0 ? (
                    patientLabs.map((l) => (
                      <div
                        key={l.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {l.testName}{' '}
                            <span className="font-normal text-slate-400">({l.testCategory})</span>
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            Order #{l.id} • Date: {l.orderDate} • Doctor: {l.doctorName}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                              l.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {l.status}
                          </span>
                          <button
                            onClick={() => onPrintDocument && onPrintDocument('lab_report', l, `Lab Report - ${l.testName}`)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Print Lab Report"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">No laboratory orders recorded.</div>
                  )}
                </div>
              )}

              {/* 5. Billing */}
              {activeTab === 'billing' && (
                <div className="space-y-3">
                  {patientInvoices.length > 0 ? (
                    patientInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            Invoice #{inv.invoiceNumber}
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            Date: {inv.date} • Total: ${inv.totalAmount} • Paid: ${inv.paidAmount} •
                            Balance: <span className="font-bold text-rose-600">${inv.balanceAmount}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                              inv.paymentStatus === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                          <button
                            onClick={() => onPrintDocument && onPrintDocument('invoice', inv, `Invoice #${inv.invoiceNumber}`)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">No billing history found.</div>
                  )}
                </div>
              )}

              {/* 6. Admissions */}
              {activeTab === 'admissions' && (
                <div className="space-y-3">
                  {patientAdmissions.length > 0 ? (
                    patientAdmissions.map((adm) => (
                      <div
                        key={adm.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            IPD #{adm.id} &bull; Ward: {adm.wardType} &bull; Bed: {adm.bedNumber}
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            Admitted: {adm.admissionDate} • Doctor: {adm.doctorName} • Diagnosis: {adm.admissionDiagnosis}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-sky-100 text-sky-800">
                          {adm.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">No inpatient admission stays recorded.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patient Registration Modal */}
      {isRegisterModalOpen && (
        <div
          id="patient-register-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            id="patient-register-card"
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-600" />
                <span>Register New Inpatient / Outpatient</span>
              </h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    placeholder="e.g. Eleanor"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    placeholder="e.g. 555-0182"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    placeholder="patient@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newPatient.city}
                    onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact Name &amp; Phone
                  </label>
                  <input
                    type="text"
                    value={newPatient.emergencyContact?.name}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        emergencyContact: { ...newPatient.emergencyContact!, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    placeholder="Full name & relationship"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs"
                >
                  Confirm &amp; Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
