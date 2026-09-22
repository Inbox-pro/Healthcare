export type UserRole =
  | 'super_admin'
  | 'hospital_admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'pharmacist'
  | 'lab_technician'
  | 'radiology_technician'
  | 'accountant'
  | 'hr_staff'
  | 'patient'
  | 'insurance_staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  patientId?: string; // If role is patient
  doctorId?: string; // If role is doctor
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Patient {
  id: string; // e.g. PAT-1001
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship?: string;
    phone: string;
    relation?: string;
  };
  allergies: string[];
  chronicConditions: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insurance?: {
    provider: string;
    policyNumber: string;
    validUntil?: string;
    validTill?: string;
    coverageAmount?: number;
  };
  registeredDate: string;
  registrationDate?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  status: 'Active' | 'Inpatient' | 'Discharged' | 'Critical';
  totalVisits?: number;
  outstandingBalance?: number;
}

export interface Doctor {
  id: string; // e.g. DOC-201
  name: string;
  title: string;
  specialization: string;
  specialty?: string;
  qualification: string;
  qualifications?: string;
  opdTimings?: string;
  opdDays?: string[];
  experienceYears: number;
  department: string;
  consultationFee: number;
  email: string;
  phone: string;
  isAvailable: boolean;
  avatar?: string;
  roomNumber: string;
  rating: number;
  totalConsultations: number;
  scheduleDays: string[];
  workingHours: string;
}

export interface Department {
  id: string;
  name: string;
  headOfDepartment: string;
  headDoctorId: string;
  location: string;
  phone: string;
  totalBeds: number;
  occupiedBeds: number;
  doctorsCount: number;
  activePatientsCount: number;
  description: string;
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Checked-in'
  | 'In Consultation'
  | 'Completed'
  | 'Cancelled'
  | 'No-show';

export type AppointmentType = 'General' | 'Follow-up' | 'Emergency' | 'Routine Checkup' | 'Telehealth';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  tokenNumber: number;
  vitalSignsRecorded: boolean;
  notes?: string;
  consultationFee?: number;
}

export interface VitalSign {
  id: string;
  patientId: string;
  patientName: string;
  recordedAt: string;
  temperature: number; // Celsius
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number;
  heartRate: number; // bpm
  respiratoryRate: number; // breaths/min
  oxygenSaturation: number; // %
  weight: number; // kg
  height: number; // cm
  recordedBy: string;
}

export interface OPDQueueItem {
  id: string;
  tokenNumber: number;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  timeSlot: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  status: 'Waiting' | 'Vitals Taken' | 'With Doctor' | 'Completed';
  vitals?: VitalSign;
}

export type InpatientStatus = 'Admitted' | 'Under Observation' | 'Transferred' | 'Discharged';

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: Gender;
  doctorId: string;
  doctorName: string;
  department: string;
  admissionDate: string;
  ward: string;
  roomNumber: string;
  bedNumber: string;
  reasonForAdmission: string;
  attendantName: string;
  attendantPhone: string;
  insuranceCovered: boolean;
  status: InpatientStatus;
  doctorNotes?: string;
  wardType?: string;
  admissionDiagnosis?: string;
  attendingNurse?: string;
  initialDeposit?: number;
}

export type BedStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Maintenance';

export type WardType = 'ICU' | 'General Ward' | 'Private Room' | 'Semi-Private' | 'Emergency' | 'Pediatrics' | 'Maternity';

export interface Bed {
  id: string;
  bedNumber: string;
  roomNumber: string;
  wardType: WardType;
  floor: number;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  currentPatientId?: string;
  currentPatientName?: string;
  admissionDate?: string;
  assignedDoctorName?: string;
  dailyRate: number;
  hasOxygen?: boolean;
  hasVentilator?: boolean;
}

export type TriagePriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface EmergencyCase {
  id: string;
  patientName: string;
  patientId?: string;
  age: number;
  gender: Gender;
  triagePriority: TriagePriority;
  chiefComplaint: string;
  arrivalTime: string;
  assignedDoctor: string;
  assignedBed: string;
  bedNumber?: string;
  attendingDoctor?: string;
  status: 'Triage' | 'Treating' | 'Stabilized' | 'Admitted to ICU' | 'Discharged' | 'In Treatment';
  vitals: {
    bp: string;
    pulse: number;
    spo2: number;
    temp: number;
    hr?: number;
    rr?: number;
  };
}

export interface ConsultationNote {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  assessment: string;
  diagnosis: string;
  icd10Code?: string;
  treatmentPlan: string;
  followUpDays?: number;
}

export interface PrescriptionMedicineItem {
  id: string;
  medicineName: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "1-0-1 (Twice daily)"
  duration: string; // e.g. "5 days"
  route: string; // "Oral", "IV", "Topical"
  instructions: string; // "After meals"
}

export type PrescriptionStatus = 'Draft' | 'Active' | 'Completed' | 'Cancelled' | 'Dispensed';

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicineItem[];
  notes?: string;
  status: PrescriptionStatus;
  dispensed: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotics' | 'Analgesics' | 'Antihypertensive' | 'Antidiabetic' | 'Antiviral' | 'Supplements' | 'Respiratory' | 'GI' | 'Emergency' | 'Cardiovascular';
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  minStockAlert?: number;
  unitPrice?: number;
  unit: string; // "Tablets", "Syrup", "Vial", "Capsules"
}

export type MedicineItem = Medicine;
export type MedicineCategory = 'Antibiotics' | 'Analgesics' | 'Antihypertensive' | 'Antidiabetic' | 'Antiviral' | 'Supplements' | 'Respiratory' | 'GI' | 'Emergency' | 'Cardiovascular' | 'Gastrointestinal' | 'Psychiatric' | 'Vitamins & Supplements';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medical Equipment' | 'Consumables' | 'Surgical Items' | 'Laboratory Supplies' | 'Office Supplies';
  supplier: string;
  quantity: number;
  unit: string;
  minStock: number;
  unitPrice: number;
  lastRestockedDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export type LabOrderStatus = 'Ordered' | 'Sample Collected' | 'Processing' | 'Result Ready' | 'Verified' | 'Completed' | 'In Analysis';

export interface LabResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testCategory: 'Hematology (CBC)' | 'Biochemistry' | 'Lipid Profile' | 'Liver Function' | 'Renal Function' | 'Urinalysis' | 'Thyroid';
  testName: string;
  orderDate: string;
  status: LabOrderStatus;
  sampleCollectedAt?: string;
  results?: LabResultItem[];
  verifiedBy?: string;
  notes?: string;
  priority?: string;
}

export type RadiologyStatus = 'Scheduled' | 'Scan Completed' | 'Report Ready' | 'Verified' | 'Reported';

export interface RadiologyOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  modality: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'Mammography';
  bodyPart: string;
  orderDate: string;
  status: RadiologyStatus;
  technicianName: string;
  findings?: string;
  impression?: string;
  radiologistName?: string;
  imagingType?: string;
  urgency?: string;
}

export interface PatientVital {
  id: string;
  patientId: string;
  patientName: string;
  recordedAt: string;
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  temperature: number;
  spo2: number;
  respiratoryRate: number;
  bloodSugar?: number;
  painScore?: number;
  nurseNotes?: string;
  recordedBy?: string;
  nurseName?: string;
}

export interface OperationTheatreSlot {
  id: string;
  patientId: string;
  patientName: string;
  surgeryName: string;
  leadSurgeon: string;
  anesthetist: string;
  theaterRoom: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  pacClearance: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Bed Charge' | 'Laboratory' | 'Radiology' | 'Pharmacy' | 'Procedure' | 'Nursing';
  quantity: number;
  unitPrice: number;
  total: number;
}

export type BillItem = InvoiceItem;
export type Bill = Invoice;
export type BillStatus = PaymentStatus | 'Draft' | 'Pending Insurance' | 'Partially Paid' | 'Paid';

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Refunded';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Credit/Debit Card' | 'Debit Card' | 'UPI' | 'Bank Transfer' | 'Insurance';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  insuranceCoveredAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  status?: string;
  insuranceProvider?: string;
  insuranceClaimAmount?: number;
  tax?: number;
  discount?: number;
  payments?: any[];
  insurancePolicyNumber?: string;
  copayAmount?: number;
  deductible?: number;
}

export type ClaimStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Settled';

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  insuranceCompany: string;
  policyNumber: string;
  treatmentType: 'OPD' | 'IPD Surgeries' | 'Emergency' | 'Maternity';
  claimAmount: number;
  approvedAmount: number;
  submissionDate: string;
  status: ClaimStatus;
  tpaRemarks?: string;
}

export interface FinancialSummary {
  todayRevenue: number;
  monthlyRevenue: number;
  todayExpense: number;
  pendingReceivables: number;
  insuranceClaimsPending: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joinedDate: string;
  shift: 'Morning (08:00 - 16:00)' | 'Evening (16:00 - 00:00)' | 'Night (00:00 - 08:00)' | 'General (09:00 - 17:00)';
  status: 'Active' | 'On Leave' | 'Terminated';
  salary: number;
}

export interface BloodUnit {
  id: string;
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  unitsReserved: number;
  donorCount: number;
  lastDonationDate: string;
  expiryWarningCount: number;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  paramedicName: string;
  status: 'Available' | 'On Trip' | 'Maintenance' | 'Emergency Dispatched';
  currentLocation: string;
  equipmentLevel: 'Basic Life Support (BLS)' | 'Advanced Cardiac Life Support (ACLS)' | 'Neonatal Transport';
}

export interface OperationTheatre {
  id: string;
  theatreNumber: string;
  procedureName: string;
  patientName: string;
  leadSurgeon: string;
  anesthetist: string;
  scheduledTime: string;
  durationMinutes: number;
  status: 'Scheduled' | 'In Preparation' | 'In Progress' | 'Completed' | 'Cancelled';
  preOpChecklistComplete: boolean;
}

export type DischargeType = 'Normal' | 'LAMA' | 'Transferred' | 'Expired';

export interface DischargeSummary {
  id: string;
  patientId: string;
  patientName: string;
  admissionId: string;
  doctorName: string;
  department: string;
  admissionDate: string;
  dischargeDate: string;
  dischargeType: DischargeType;
  finalDiagnosis: string;
  treatmentSummary: string;
  postDischargeMedications: string;
  followUpDate: string;
  dischargeStatus: 'Draft' | 'Finalized' | 'Handed Over';
}

export interface HospitalDocument {
  id: string;
  title: string;
  category: 'Medical Report' | 'Lab Report' | 'Radiology' | 'Prescription' | 'Insurance' | 'ID Proof' | 'Discharge Summary';
  patientId: string;
  patientName: string;
  uploadedAt: string;
  fileSize: string;
  fileType: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'emergency' | 'success';
  read: boolean;
  linkModule?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface HospitalSettings {
  hospitalName: string;
  tagline: string;
  logoUrl: string;
  address: string;
  cityStateZip: string;
  phone: string;
  email: string;
  emergencyContact: string;
  currencySymbol: string;
  taxRatePercent: number;
  enableAutoAppointmentConfirm: boolean;
  theme: 'light' | 'dark';
}

export type InpatientAdmission = Admission;
export type LabTestStatus = LabOrderStatus;
