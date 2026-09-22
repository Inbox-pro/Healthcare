import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Doctor,
  Department,
  Appointment,
  Admission,
  Bed,
  EmergencyCase,
  Prescription,
  PrescriptionMedicineItem,
  Medicine,
  InventoryItem,
  LabOrder,
  RadiologyOrder,
  Invoice,
  InsuranceClaim,
  StaffMember,
  BloodUnit,
  Ambulance,
  OperationTheatre,
  OperationTheatreSlot,
  PatientVital,
  DischargeSummary,
  HospitalDocument,
  NotificationItem,
  AuditLogItem,
  HospitalSettings,
  AppointmentStatus,
  BedStatus
} from '../types/hms';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_INVENTORY,
  INITIAL_EMERGENCY_CASES,
  INITIAL_BLOOD_STOCK,
  INITIAL_AMBULANCES,
  INITIAL_OT_SCHEDULE,
  INITIAL_DISCHARGE_SUMMARIES,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_HOSPITAL_SETTINGS,
  generateSyntheticPatients,
  generateSyntheticMedicines,
  generateSyntheticAppointments,
  generateSyntheticPrescriptions,
  generateSyntheticLabOrders,
  generateSyntheticRadiologyOrders,
  generateSyntheticInvoices,
  generateSyntheticInsuranceClaims,
  generateSyntheticStaff,
  generateSyntheticBeds
} from '../data/mockData';

interface HMSContextType {
  // State
  patients: Patient[];
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  admissions: Admission[];
  beds: Bed[];
  emergencyCases: EmergencyCase[];
  prescriptions: Prescription[];
  medicines: Medicine[];
  inventory: InventoryItem[];
  labOrders: LabOrder[];
  radiologyOrders: RadiologyOrder[];
  invoices: Invoice[];
  bills: Invoice[];
  insuranceClaims: InsuranceClaim[];
  staff: StaffMember[];
  bloodStock: BloodUnit[];
  ambulances: Ambulance[];
  otSchedule: OperationTheatre[];
  otSlots: OperationTheatreSlot[];
  vitals: PatientVital[];
  dischargeSummaries: DischargeSummary[];
  documents: HospitalDocument[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  settings: HospitalSettings;

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  toggleDoctorAvailability: (id: string) => void;
  addDoctor: (doctor: Omit<Doctor, 'id' | 'rating' | 'totalConsultations'>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;

  addAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  admitPatient: (admissionData: {
    patientId: string;
    doctorId: string;
    wardType: Bed['wardType'];
    bedId: string;
    reason: string;
    attendantName: string;
    attendantPhone: string;
    insuranceCovered: boolean;
  }) => void;
  dischargeInpatient: (admissionId: string, bedId: string, summary: Partial<DischargeSummary>) => void;
  updateBedStatus: (bedId: string, status: BedStatus) => void;

  addEmergencyCase: (data: Omit<EmergencyCase, 'id'>) => void;
  updateEmergencyStatus: (id: string, status: EmergencyCase['status']) => void;
  updateEmergencyTriage: (id: string, priority: any, status?: any) => void;

  addVital: (vital: Omit<PatientVital, 'id' | 'recordedAt'>) => PatientVital;

  addPrescription: (prescription: Omit<Prescription, 'id' | 'date'>) => Prescription;
  dispensePrescription: (prescriptionId: string) => boolean;

  updateMedicineStock: (medicineId: string, delta: number) => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;

  updateInventoryStock: (itemId: string, delta: number) => void;

  addLabOrder: (order: Omit<LabOrder, 'id' | 'orderDate' | 'status'>) => LabOrder;
  updateLabStatus: (orderId: string, status: LabOrder['status'], results?: LabOrder['results']) => void;
  updateLabOrderStatus: (orderId: string, status: any) => void;

  addRadiologyOrder: (order: Omit<RadiologyOrder, 'id' | 'orderDate' | 'status'>) => RadiologyOrder;
  updateRadiologyStatus: (orderId: string, status: RadiologyOrder['status'], findings?: string, impression?: string) => void;
  updateRadiologyFindings: (orderId: string, findings?: string, impression?: string) => void;

  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  recordPayment: (invoiceId: string, amount: number, method: Invoice['paymentMethod']) => void;
  addBill: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  recordBillPayment: (invoiceId: string, amount: number, method: Invoice['paymentMethod']) => void;

  addInsuranceClaim: (claim: Omit<InsuranceClaim, 'id' | 'claimNumber' | 'submissionDate'>) => void;
  updateClaimStatus: (claimId: string, status: InsuranceClaim['status'], approvedAmount?: number) => void;

  updateAmbulanceStatus: (ambulanceId: string, status: Ambulance['status'], location?: string) => void;
  updateOTStatus: (otId: string, status: OperationTheatre['status']) => void;
  addOTSlot: (slot: Omit<OperationTheatreSlot, 'id'>) => OperationTheatreSlot;
  updateBloodStock: (groupId: string, change: number) => void;

  uploadDocument: (doc: Omit<HospitalDocument, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (docId: string) => void;

  markNotificationsAsRead: () => void;
  logAction: (action: string, module: string, details: string) => void;
  updateSettings: (updates: Partial<HospitalSettings>) => void;
  resetDemoData: () => void;
  resetToDemoData: () => void;
}

const HMSContext = createContext<HMSContextType | undefined>(undefined);

const STORAGE_KEY = 'inbox_hms_state_v2';

export const HMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or generate initial state
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached HMS data:', e);
      }
    }

    // Generate fresh coherent data
    const initialPatients = generateSyntheticPatients();
    const initialMeds = generateSyntheticMedicines();
    const initialBeds = generateSyntheticBeds();
    const initialAppts = generateSyntheticAppointments(initialPatients);
    const initialPrescriptions = generateSyntheticPrescriptions(initialPatients);
    const initialLab = generateSyntheticLabOrders(initialPatients);
    const initialRad = generateSyntheticRadiologyOrders(initialPatients);
    const initialInvoices = generateSyntheticInvoices(initialPatients);
    const initialClaims = generateSyntheticInsuranceClaims(initialPatients);
    const initialStaff = generateSyntheticStaff();

    // Inpatient admissions based on occupied beds
    const initialAdmissions: Admission[] = initialBeds
      .filter(b => b.status === 'Occupied' && b.patientId)
      .map((b, idx) => ({
        id: `ADM-${200 + idx}`,
        patientId: b.patientId!,
        patientName: b.patientName || 'Admitted Patient',
        age: 48,
        gender: idx % 2 === 0 ? 'Male' : 'Female',
        doctorId: INITIAL_DOCTORS[idx % INITIAL_DOCTORS.length].id,
        doctorName: INITIAL_DOCTORS[idx % INITIAL_DOCTORS.length].name,
        department: INITIAL_DOCTORS[idx % INITIAL_DOCTORS.length].department,
        admissionDate: b.admissionDate || '2026-09-18',
        ward: b.wardType,
        roomNumber: b.roomNumber,
        bedNumber: b.bedNumber,
        reasonForAdmission: 'Continuous hemodynamic monitoring and supportive inpatient clinical care',
        attendantName: 'Family Guardian',
        attendantPhone: '+1 (555) 901-2244',
        insuranceCovered: true,
        status: 'Admitted'
      }));

    return {
      patients: initialPatients,
      doctors: INITIAL_DOCTORS,
      departments: INITIAL_DEPARTMENTS,
      appointments: initialAppts,
      admissions: initialAdmissions,
      beds: initialBeds,
      emergencyCases: INITIAL_EMERGENCY_CASES,
      prescriptions: initialPrescriptions,
      medicines: initialMeds,
      inventory: INITIAL_INVENTORY,
      labOrders: initialLab,
      radiologyOrders: initialRad,
      invoices: initialInvoices,
      insuranceClaims: initialClaims,
      staff: initialStaff,
      bloodStock: INITIAL_BLOOD_STOCK,
      ambulances: INITIAL_AMBULANCES,
      otSchedule: INITIAL_OT_SCHEDULE,
      dischargeSummaries: INITIAL_DISCHARGE_SUMMARIES,
      documents: INITIAL_DOCUMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: DEFAULT_HOSPITAL_SETTINGS,
    };
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Audit Logger helper
  const logAction = (action: string, module: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: 'ACTIVE-USER',
      userName: 'Current Operator',
      role: 'Staff',
      action,
      module,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '192.168.1.15',
      details,
    };
    setData((prev: typeof data) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs].slice(0, 200),
    }));
  };

  // Patients
  const addPatient = (patientData: Omit<Patient, 'id' | 'registeredDate'>): Patient => {
    const nextId = `PAT-${1000 + data.patients.length + 1}`;
    const newPatient: Patient = {
      ...patientData,
      id: nextId,
      registeredDate: new Date().toISOString().slice(0, 10),
    };
    setData((prev: typeof data) => ({
      ...prev,
      patients: [newPatient, ...prev.patients],
    }));
    logAction('Patient Registered', 'Patients', `Registered ${newPatient.firstName} ${newPatient.lastName} (${nextId})`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setData((prev: typeof data) => ({
      ...prev,
      patients: prev.patients.map((p: Patient) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    logAction('Patient Updated', 'Patients', `Updated record for ${id}`);
  };

  const deletePatient = (id: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      patients: prev.patients.filter((p: Patient) => p.id !== id),
    }));
    logAction('Patient Removed', 'Patients', `Removed patient record ${id}`);
  };

  // Doctors
  const toggleDoctorAvailability = (id: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      doctors: prev.doctors.map((d: Doctor) => (d.id === id ? { ...d, isAvailable: !d.isAvailable } : d)),
    }));
  };

  const addDoctor = (docData: Omit<Doctor, 'id' | 'rating' | 'totalConsultations'>) => {
    const newDoc: Doctor = {
      ...docData,
      id: `DOC-${200 + data.doctors.length + 1}`,
      rating: 4.8,
      totalConsultations: 0,
    };
    setData((prev: typeof data) => ({
      ...prev,
      doctors: [...prev.doctors, newDoc],
    }));
    logAction('Doctor Added', 'Doctors', `Added ${newDoc.name} to ${newDoc.department}`);
  };

  // Appointments
  const addAppointment = (appData: Omit<Appointment, 'id' | 'tokenNumber'>): Appointment => {
    const nextToken = (data.appointments.filter((a: Appointment) => a.date === appData.date).length % 50) + 1;
    const newAppt: Appointment = {
      ...appData,
      id: `APT-${1000 + data.appointments.length + 1}`,
      tokenNumber: nextToken,
    };
    setData((prev: typeof data) => ({
      ...prev,
      appointments: [newAppt, ...prev.appointments],
    }));
    logAction('Appointment Created', 'Appointments', `Booked ${newAppt.id} for ${newAppt.patientName} with ${newAppt.doctorName}`);
    return newAppt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setData((prev: typeof data) => ({
      ...prev,
      appointments: prev.appointments.map((a: Appointment) => (a.id === id ? { ...a, status } : a)),
    }));
    logAction('Appointment Status Updated', 'Appointments', `Appointment ${id} status set to ${status}`);
  };

  // Inpatient / IPD / Beds
  const admitPatient = (admData: {
    patientId: string;
    doctorId: string;
    wardType: Bed['wardType'];
    bedId: string;
    reason: string;
    attendantName: string;
    attendantPhone: string;
    insuranceCovered: boolean;
  }) => {
    const patient = data.patients.find((p: Patient) => p.id === admData.patientId);
    const doctor = data.doctors.find((d: Doctor) => d.id === admData.doctorId);
    const bed = data.beds.find((b: Bed) => b.id === admData.bedId);

    if (!patient || !doctor || !bed) return;

    const newAdmission: Admission = {
      id: `ADM-${200 + data.admissions.length + 1}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      age: patient.age,
      gender: patient.gender,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      admissionDate: new Date().toISOString().slice(0, 10),
      ward: bed.wardType,
      roomNumber: bed.roomNumber,
      bedNumber: bed.bedNumber,
      reasonForAdmission: admData.reason,
      attendantName: admData.attendantName,
      attendantPhone: admData.attendantPhone,
      insuranceCovered: admData.insuranceCovered,
      status: 'Admitted',
    };

    setData((prev: typeof data) => ({
      ...prev,
      admissions: [newAdmission, ...prev.admissions],
      beds: prev.beds.map((b: Bed) =>
        b.id === bed.id
          ? {
              ...b,
              status: 'Occupied',
              patientId: patient.id,
              patientName: `${patient.firstName} ${patient.lastName}`,
              admissionDate: new Date().toISOString().slice(0, 10),
              assignedDoctorName: doctor.name,
            }
          : b
      ),
      patients: prev.patients.map((p: Patient) => (p.id === patient.id ? { ...p, status: 'Inpatient' } : p)),
    }));

    logAction('Inpatient Admitted', 'IPD', `Admitted ${patient.firstName} ${patient.lastName} to Bed ${bed.bedNumber}`);
  };

  const dischargeInpatient = (admissionId: string, bedId: string, summary: Partial<DischargeSummary>) => {
    const adm = data.admissions.find((a: Admission) => a.id === admissionId);
    if (!adm) return;

    const newSummary: DischargeSummary = {
      id: `DISC-${data.dischargeSummaries.length + 1}`,
      patientId: adm.patientId,
      patientName: adm.patientName,
      admissionId: adm.id,
      doctorName: adm.doctorName,
      department: adm.department,
      admissionDate: adm.admissionDate,
      dischargeDate: new Date().toISOString().slice(0, 10),
      dischargeType: summary.dischargeType || 'Normal',
      finalDiagnosis: summary.finalDiagnosis || adm.reasonForAdmission,
      treatmentSummary: summary.treatmentSummary || 'Supportive inpatient care administered with clinical stabilization.',
      postDischargeMedications: summary.postDischargeMedications || 'Oral antibiotics and maintenance as advised.',
      followUpDate: summary.followUpDate || '2026-09-30',
      dischargeStatus: 'Finalized',
    };

    setData((prev: typeof data) => ({
      ...prev,
      admissions: prev.admissions.map((a: Admission) => (a.id === admissionId ? { ...a, status: 'Discharged' } : a)),
      beds: prev.beds.map((b: Bed) =>
        b.id === bedId
          ? {
              ...b,
              status: 'Cleaning',
              patientId: undefined,
              patientName: undefined,
              admissionDate: undefined,
              assignedDoctorName: undefined,
            }
          : b
      ),
      dischargeSummaries: [newSummary, ...prev.dischargeSummaries],
      patients: prev.patients.map((p: Patient) => (p.id === adm.patientId ? { ...p, status: 'Discharged' } : p)),
    }));

    logAction('Patient Discharged', 'Discharge', `Discharged ${adm.patientName} from ${adm.bedNumber}`);
  };

  const updateBedStatus = (bedId: string, status: BedStatus) => {
    setData((prev: typeof data) => ({
      ...prev,
      beds: prev.beds.map((b: Bed) => (b.id === bedId ? { ...b, status } : b)),
    }));
  };

  // Emergency
  const addEmergencyCase = (caseData: Omit<EmergencyCase, 'id'>) => {
    const newCase: EmergencyCase = {
      ...caseData,
      id: `ER-${Date.now().toString().slice(-4)}`,
    };
    setData((prev: typeof data) => ({
      ...prev,
      emergencyCases: [newCase, ...prev.emergencyCases],
    }));
    logAction('Emergency Registered', 'Emergency', `Triage Level ${newCase.triagePriority} for ${newCase.patientName}`);
  };

  const updateEmergencyStatus = (id: string, status: EmergencyCase['status']) => {
    setData((prev: typeof data) => ({
      ...prev,
      emergencyCases: prev.emergencyCases.map((c: EmergencyCase) => (c.id === id ? { ...c, status } : c)),
    }));
  };

  // Prescriptions & Pharmacy
  const addPrescription = (rxData: Omit<Prescription, 'id' | 'date'>): Prescription => {
    const newRx: Prescription = {
      ...rxData,
      id: `RX-${2000 + data.prescriptions.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setData((prev: typeof data) => ({
      ...prev,
      prescriptions: [newRx, ...prev.prescriptions],
    }));
    logAction('Prescription Created', 'Prescriptions', `Prescription ${newRx.id} for ${newRx.patientName}`);
    return newRx;
  };

  const dispensePrescription = (prescriptionId: string): boolean => {
    const rx = data.prescriptions.find((p: Prescription) => p.id === prescriptionId);
    if (!rx || rx.dispensed) return false;

    // Deduct stock for each prescribed medicine if found in pharmacy
    setData((prev: typeof data) => {
      const updatedMedicines = prev.medicines.map((m: Medicine) => {
        const prescribed = rx.medicines.find((item: PrescriptionMedicineItem) =>
          item.medicineName.toLowerCase().includes(m.name.toLowerCase()) ||
          m.name.toLowerCase().includes(item.medicineName.toLowerCase())
        );
        if (prescribed) {
          return {
            ...m,
            stockQuantity: Math.max(0, m.stockQuantity - 10),
          };
        }
        return m;
      });

      const updatedPrescriptions = prev.prescriptions.map((p: Prescription) =>
        p.id === prescriptionId ? { ...p, dispensed: true, status: 'Completed' as const } : p
      );

      return {
        ...prev,
        medicines: updatedMedicines,
        prescriptions: updatedPrescriptions,
      };
    });

    logAction('Prescription Dispensed', 'Pharmacy', `Dispensed medicines for Rx #${prescriptionId} (${rx.patientName})`);
    return true;
  };

  const updateMedicineStock = (medicineId: string, delta: number) => {
    setData((prev: typeof data) => ({
      ...prev,
      medicines: prev.medicines.map((m: Medicine) =>
        m.id === medicineId ? { ...m, stockQuantity: Math.max(0, m.stockQuantity + delta) } : m
      ),
    }));
  };

  const addMedicine = (medData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...medData,
      id: `MED-${100 + data.medicines.length + 1}`,
    };
    setData((prev: typeof data) => ({
      ...prev,
      medicines: [newMed, ...prev.medicines],
    }));
    logAction('Medicine Master Added', 'Pharmacy', `Added ${newMed.name} to pharmacy inventory`);
  };

  // Inventory
  const updateInventoryStock = (itemId: string, delta: number) => {
    setData((prev: typeof data) => ({
      ...prev,
      inventory: prev.inventory.map((item: InventoryItem) => {
        if (item.id === itemId) {
          const newQty = Math.max(0, item.quantity + delta);
          return {
            ...item,
            quantity: newQty,
            status: newQty === 0 ? 'Out of Stock' : newQty <= item.minStock ? 'Low Stock' : 'In Stock',
            lastRestockedDate: delta > 0 ? new Date().toISOString().slice(0, 10) : item.lastRestockedDate,
          };
        }
        return item;
      }),
    }));
  };

  // Laboratory
  const addLabOrder = (orderData: Omit<LabOrder, 'id' | 'orderDate' | 'status'>): LabOrder => {
    const newOrder: LabOrder = {
      ...orderData,
      id: `LAB-${3000 + data.labOrders.length + 1}`,
      orderDate: new Date().toISOString().slice(0, 10),
      status: 'Ordered',
    };
    setData((prev: typeof data) => ({
      ...prev,
      labOrders: [newOrder, ...prev.labOrders],
    }));
    logAction('Lab Test Ordered', 'Laboratory', `Ordered ${newOrder.testName} for ${newOrder.patientName}`);
    return newOrder;
  };

  const updateLabStatus = (orderId: string, status: LabOrder['status'], results?: LabOrder['results']) => {
    setData((prev: typeof data) => ({
      ...prev,
      labOrders: prev.labOrders.map((o: LabOrder) =>
        o.id === orderId
          ? {
              ...o,
              status,
              results: results || o.results,
              verifiedBy: status === 'Verified' ? 'Dr. Rebecca Vance (Chief Pathologist)' : o.verifiedBy,
            }
          : o
      ),
    }));
    logAction('Lab Order Updated', 'Laboratory', `Order ${orderId} moved to ${status}`);
  };

  // Radiology
  const addRadiologyOrder = (orderData: Omit<RadiologyOrder, 'id' | 'orderDate' | 'status'>): RadiologyOrder => {
    const newOrder: RadiologyOrder = {
      ...orderData,
      id: `RAD-${4000 + data.radiologyOrders.length + 1}`,
      orderDate: new Date().toISOString().slice(0, 10),
      status: 'Scheduled',
    };
    setData((prev: typeof data) => ({
      ...prev,
      radiologyOrders: [newOrder, ...prev.radiologyOrders],
    }));
    logAction('Radiology Ordered', 'Radiology', `Scheduled ${newOrder.modality} ${newOrder.bodyPart} for ${newOrder.patientName}`);
    return newOrder;
  };

  const updateRadiologyStatus = (orderId: string, status: RadiologyOrder['status'], findings?: string, impression?: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      radiologyOrders: prev.radiologyOrders.map((r: RadiologyOrder) =>
        r.id === orderId
          ? {
              ...r,
              status,
              findings: findings || r.findings,
              impression: impression || r.impression,
              radiologistName: status === 'Verified' ? 'Dr. Arthur Pendelton, FRCR' : r.radiologistName,
            }
          : r
      ),
    }));
    logAction('Radiology Order Updated', 'Radiology', `Scan ${orderId} updated to ${status}`);
  };

  // Billing
  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const newInv: Invoice = {
      ...invData,
      id: `INV-${5000 + data.invoices.length + 1}`,
      invoiceNumber: `INV-2026-${String(8000 + data.invoices.length + 1)}`,
    };
    setData((prev: typeof data) => ({
      ...prev,
      invoices: [newInv, ...prev.invoices],
    }));
    logAction('Invoice Generated', 'Billing', `Generated ${newInv.invoiceNumber} for ${newInv.patientName} (${newInv.totalAmount})`);
    return newInv;
  };

  const recordPayment = (invoiceId: string, amount: number, method: Invoice['paymentMethod']) => {
    setData((prev: typeof data) => ({
      ...prev,
      invoices: prev.invoices.map((inv: Invoice) => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + amount;
          const newBalance = Math.max(0, inv.totalAmount - inv.insuranceCoveredAmount - newPaid);
          const paymentStatus = newBalance <= 0 ? 'Paid' : 'Partial';
          return {
            ...inv,
            paidAmount: newPaid,
            balanceAmount: newBalance,
            paymentStatus,
            paymentMethod: method,
          };
        }
        return inv;
      }),
    }));
    logAction('Payment Recorded', 'Billing', `Recorded payment of $${amount} via ${method} for invoice ${invoiceId}`);
  };

  // Insurance
  const addInsuranceClaim = (claimData: Omit<InsuranceClaim, 'id' | 'claimNumber' | 'submissionDate'>) => {
    const newClaim: InsuranceClaim = {
      ...claimData,
      id: `CLM-${6000 + data.insuranceClaims.length + 1}`,
      claimNumber: `CLM-TPA-${9000 + data.insuranceClaims.length + 1}`,
      submissionDate: new Date().toISOString().slice(0, 10),
    };
    setData((prev: typeof data) => ({
      ...prev,
      insuranceClaims: [newClaim, ...prev.insuranceClaims],
    }));
    logAction('Claim Submitted', 'Insurance', `Submitted claim ${newClaim.claimNumber} for ${newClaim.patientName}`);
  };

  const updateClaimStatus = (claimId: string, status: InsuranceClaim['status'], approvedAmount?: number) => {
    setData((prev: typeof data) => ({
      ...prev,
      insuranceClaims: prev.insuranceClaims.map((c: InsuranceClaim) =>
        c.id === claimId
          ? {
              ...c,
              status,
              approvedAmount: approvedAmount !== undefined ? approvedAmount : c.approvedAmount,
            }
          : c
      ),
    }));
  };

  // Operational Modules (Ambulance, OT, Blood)
  const updateAmbulanceStatus = (ambulanceId: string, status: Ambulance['status'], location?: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      ambulances: prev.ambulances.map((a: Ambulance) =>
        a.id === ambulanceId ? { ...a, status, currentLocation: location || a.currentLocation } : a
      ),
    }));
  };

  const updateOTStatus = (otId: string, status: OperationTheatre['status']) => {
    setData((prev: typeof data) => ({
      ...prev,
      otSchedule: prev.otSchedule.map((ot: OperationTheatre) => (ot.id === otId ? { ...ot, status } : ot)),
    }));
  };

  const updateBloodStock = (groupId: string, change: number) => {
    setData((prev: typeof data) => ({
      ...prev,
      bloodStock: prev.bloodStock.map((b: BloodUnit) =>
        b.id === groupId ? { ...b, unitsAvailable: Math.max(0, b.unitsAvailable + change) } : b
      ),
    }));
  };

  // Documents
  const uploadDocument = (doc: Omit<HospitalDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: HospitalDocument = {
      ...doc,
      id: `DOC-${Date.now().toString().slice(-5)}`,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setData((prev: typeof data) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
    }));
    logAction('Document Uploaded', 'Documents', `Uploaded ${newDoc.title} for ${newDoc.patientName}`);
  };

  const deleteDocument = (docId: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      documents: prev.documents.filter((d: HospitalDocument) => d.id !== docId),
    }));
  };

  // Notifications
  const markNotificationsAsRead = () => {
    setData((prev: typeof data) => ({
      ...prev,
      notifications: prev.notifications.map((n: NotificationItem) => ({ ...n, read: true })),
    }));
  };

  // Settings
  const updateSettings = (updates: Partial<HospitalSettings>) => {
    setData((prev: typeof data) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
    logAction('Settings Updated', 'Settings', 'Updated clinic and branding configurations');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    const initialPatients = generateSyntheticPatients();
    const initialMeds = generateSyntheticMedicines();
    const initialBeds = generateSyntheticBeds();
    const initialAppts = generateSyntheticAppointments(initialPatients);
    const initialPrescriptions = generateSyntheticPrescriptions(initialPatients);
    const initialLab = generateSyntheticLabOrders(initialPatients);
    const initialRad = generateSyntheticRadiologyOrders(initialPatients);
    const initialInvoices = generateSyntheticInvoices(initialPatients);
    const initialClaims = generateSyntheticInsuranceClaims(initialPatients);
    const initialStaff = generateSyntheticStaff();

    const initialAdmissions: Admission[] = initialBeds
      .filter(b => b.status === 'Occupied' && b.patientId)
      .map((b, idx) => ({
        id: `ADM-${200 + idx}`,
        patientId: b.patientId!,
        patientName: b.patientName || 'Admitted Patient',
        age: 48,
        gender: idx % 2 === 0 ? 'Male' : 'Female',
        doctorId: INITIAL_DOCTORS[idx % INITIAL_DOCTORS.length].id,
        doctorName: INITIAL_DOCTORS[idx % INITIAL_DOCTORS.length].name,
        department: INITIAL_DOCTORS[idx % INITIAL_DOCTORS.length].department,
        admissionDate: b.admissionDate || '2026-09-18',
        ward: b.wardType,
        roomNumber: b.roomNumber,
        bedNumber: b.bedNumber,
        reasonForAdmission: 'Continuous hemodynamic monitoring and supportive inpatient clinical care',
        attendantName: 'Family Guardian',
        attendantPhone: '+1 (555) 901-2244',
        insuranceCovered: true,
        status: 'Admitted'
      }));

    setData({
      patients: initialPatients,
      doctors: INITIAL_DOCTORS,
      departments: INITIAL_DEPARTMENTS,
      appointments: initialAppts,
      admissions: initialAdmissions,
      beds: initialBeds,
      emergencyCases: INITIAL_EMERGENCY_CASES,
      prescriptions: initialPrescriptions,
      medicines: initialMeds,
      inventory: INITIAL_INVENTORY,
      labOrders: initialLab,
      radiologyOrders: initialRad,
      invoices: initialInvoices,
      insuranceClaims: initialClaims,
      staff: initialStaff,
      bloodStock: INITIAL_BLOOD_STOCK,
      ambulances: INITIAL_AMBULANCES,
      otSchedule: INITIAL_OT_SCHEDULE,
      dischargeSummaries: INITIAL_DISCHARGE_SUMMARIES,
      documents: INITIAL_DOCUMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: DEFAULT_HOSPITAL_SETTINGS,
    });
  };

  const addVital = (vital: Omit<PatientVital, 'id' | 'recordedAt'>): PatientVital => {
    const newVital: PatientVital = {
      ...vital,
      id: `VIT-${Date.now()}`,
      recordedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setData((prev: typeof data) => ({
      ...prev,
      vitals: [newVital, ...(prev.vitals || [])],
    }));
    logAction('Vital Signs Recorded', 'Nursing', `Recorded vitals for patient ${vital.patientId}`);
    return newVital;
  };

  const addOTSlot = (slot: Omit<OperationTheatreSlot, 'id'>): OperationTheatreSlot => {
    const newSlot: OperationTheatreSlot = {
      ...slot,
      id: `OT-SLOT-${Date.now()}`,
    };
    setData((prev: typeof data) => ({
      ...prev,
      otSlots: [newSlot, ...(prev.otSlots || [])],
    }));
    logAction('Surgery Scheduled', 'Operation Theatre', `Scheduled ${slot.surgeryName} for ${slot.patientName}`);
    return newSlot;
  };

  const updateRadiologyFindings = (orderId: string, findings?: string, impression?: string) => {
    updateRadiologyStatus(orderId, 'Verified', findings, impression);
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setData((prev: typeof data) => ({
      ...prev,
      doctors: prev.doctors.map((d: Doctor) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const updateEmergencyTriage = (id: string, priority: any, status?: any) => {
    setData((prev: typeof data) => ({
      ...prev,
      emergencyCases: prev.emergencyCases.map((c: EmergencyCase) =>
        c.id === id
          ? {
              ...c,
              ...(priority ? { triagePriority: priority } : {}),
              ...(status ? { status } : {}),
            }
          : c
      ),
    }));
  };

  const updateLabOrderStatus = (orderId: string, status: any) => {
    updateLabStatus(orderId, status);
  };

  return (
    <HMSContext.Provider
      value={{
        ...data,
        bills: data.invoices,
        vitals: data.vitals || [],
        otSlots: data.otSlots || [],
        addPatient,
        updatePatient,
        deletePatient,
        toggleDoctorAvailability,
        addDoctor,
        updateDoctor,
        addAppointment,
        updateAppointmentStatus,
        admitPatient,
        dischargeInpatient,
        updateBedStatus,
        addEmergencyCase,
        updateEmergencyStatus,
        updateEmergencyTriage,
        addVital,
        addPrescription,
        dispensePrescription,
        updateMedicineStock,
        addMedicine,
        updateInventoryStock,
        addLabOrder,
        updateLabStatus,
        updateLabOrderStatus,
        addRadiologyOrder,
        updateRadiologyStatus,
        updateRadiologyFindings,
        createInvoice,
        recordPayment,
        addBill: createInvoice,
        recordBillPayment: recordPayment,
        addInsuranceClaim,
        updateClaimStatus,
        updateAmbulanceStatus,
        updateOTStatus,
        addOTSlot,
        updateBloodStock,
        uploadDocument,
        deleteDocument,
        markNotificationsAsRead,
        logAction,
        updateSettings,
        resetDemoData,
        resetToDemoData: resetDemoData,
      }}
    >
      {children}
    </HMSContext.Provider>
  );
};

export const useHMS = () => {
  const context = useContext(HMSContext);
  if (!context) throw new Error('useHMS must be used within HMSProvider');
  return context;
};
