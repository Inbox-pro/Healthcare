import {
  Patient,
  Doctor,
  Department,
  Appointment,
  Admission,
  Bed,
  EmergencyCase,
  Prescription,
  Medicine,
  InventoryItem,
  LabOrder,
  RadiologyOrder,
  Invoice,
  InvoiceItem,
  InsuranceClaim,
  StaffMember,
  BloodUnit,
  Ambulance,
  OperationTheatre,
  DischargeSummary,
  HospitalDocument,
  AuditLogItem,
  NotificationItem,
  HospitalSettings,
  User,
  BloodGroup,
  Gender
} from '../types/hms';

// Demo Users for RBAC switching
export const DEMO_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Dr. Evelyn Reed (Super Admin)',
    email: 'admin@demo.com',
    role: 'super_admin',
    department: 'Hospital Administration',
    phone: '+1 (555) 019-2831',
  },
  {
    id: 'USR-002',
    name: 'Marcus Vance (Hospital Admin)',
    email: 'hospadmin@demo.com',
    role: 'hospital_admin',
    department: 'Operations',
    phone: '+1 (555) 019-3342',
  },
  {
    id: 'USR-003',
    name: 'Dr. Sarah Jenkins, MD',
    email: 'doctor@demo.com',
    role: 'doctor',
    department: 'Cardiology',
    doctorId: 'DOC-201',
    phone: '+1 (555) 019-4455',
  },
  {
    id: 'USR-004',
    name: 'Nurse Clara Oswald, RN',
    email: 'nurse@demo.com',
    role: 'nurse',
    department: 'Intensive Care Unit (ICU)',
    phone: '+1 (555) 019-5566',
  },
  {
    id: 'USR-005',
    name: 'Liam Henderson (Receptionist)',
    email: 'reception@demo.com',
    role: 'receptionist',
    department: 'Front Desk & Admissions',
    phone: '+1 (555) 019-6677',
  },
  {
    id: 'USR-006',
    name: 'Rita Patel, PharmD',
    email: 'pharmacy@demo.com',
    role: 'pharmacist',
    department: 'Central Pharmacy',
    phone: '+1 (555) 019-7788',
  },
  {
    id: 'USR-007',
    name: 'David Zhao (Lab Technician)',
    email: 'lab@demo.com',
    role: 'lab_technician',
    department: 'Pathology & Laboratory',
    phone: '+1 (555) 019-8899',
  },
  {
    id: 'USR-008',
    name: 'Elena Rostova (Radiology Tech)',
    email: 'radiology@demo.com',
    role: 'radiology_technician',
    department: 'Radiology & Imaging',
    phone: '+1 (555) 019-9900',
  },
  {
    id: 'USR-009',
    name: 'Nathaniel Cross (Accountant)',
    email: 'accountant@demo.com',
    role: 'accountant',
    department: 'Finance & Billing',
    phone: '+1 (555) 019-1122',
  },
  {
    id: 'USR-010',
    name: 'Sophia Martinez (HR Officer)',
    email: 'hr@demo.com',
    role: 'hr_staff',
    department: 'Human Resources',
    phone: '+1 (555) 019-2233',
  },
  {
    id: 'USR-011',
    name: 'Johnathan Doe (Patient)',
    email: 'patient@demo.com',
    role: 'patient',
    patientId: 'PAT-1001',
    department: 'Patient Portal',
    phone: '+1 (555) 019-3344',
  },
  {
    id: 'USR-012',
    name: 'Hannah Abbott (Insurance Officer)',
    email: 'insurance@demo.com',
    role: 'insurance_staff',
    department: 'Insurance & Claims',
    phone: '+1 (555) 019-4466',
  }
];

// 17 Departments
export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'DEP-01', name: 'Cardiology', headOfDepartment: 'Dr. Sarah Jenkins', headDoctorId: 'DOC-201', location: 'Building A, 3rd Floor', phone: '+1 (555) 201-1001', totalBeds: 24, occupiedBeds: 18, doctorsCount: 4, activePatientsCount: 32, description: 'Comprehensive cardiac care, angiography, and ECG monitoring.' },
  { id: 'DEP-02', name: 'Neurology', headOfDepartment: 'Dr. Alistair Finch', headDoctorId: 'DOC-202', location: 'Building A, 4th Floor', phone: '+1 (555) 201-1002', totalBeds: 20, occupiedBeds: 14, doctorsCount: 3, activePatientsCount: 22, description: 'Brain, spinal cord, and neuromuscular disorder treatments.' },
  { id: 'DEP-03', name: 'Orthopedics', headOfDepartment: 'Dr. Maya Lin', headDoctorId: 'DOC-203', location: 'Building B, 2nd Floor', phone: '+1 (555) 201-1003', totalBeds: 26, occupiedBeds: 21, doctorsCount: 4, activePatientsCount: 29, description: 'Bone fractures, arthroscopy, joint replacement and sports injuries.' },
  { id: 'DEP-04', name: 'Pediatrics', headOfDepartment: 'Dr. Samuel Green', headDoctorId: 'DOC-204', location: 'Building C, 1st Floor', phone: '+1 (555) 201-1004', totalBeds: 18, occupiedBeds: 11, doctorsCount: 3, activePatientsCount: 25, description: 'Specialized healthcare for infants, children, and adolescents.' },
  { id: 'DEP-05', name: 'Gynecology & Obstetrics', headOfDepartment: 'Dr. Priya Sharma', headDoctorId: 'DOC-205', location: 'Building C, 2nd Floor', phone: '+1 (555) 201-1005', totalBeds: 22, occupiedBeds: 17, doctorsCount: 3, activePatientsCount: 28, description: 'Maternity care, reproductive health, and neonatal delivery.' },
  { id: 'DEP-06', name: 'General Medicine', headOfDepartment: 'Dr. Robert Miller', headDoctorId: 'DOC-206', location: 'Building A, 1st Floor', phone: '+1 (555) 201-1006', totalBeds: 30, occupiedBeds: 22, doctorsCount: 5, activePatientsCount: 45, description: 'Primary internal medicine, chronic disease management, and fever triage.' },
  { id: 'DEP-07', name: 'Dermatology', headOfDepartment: 'Dr. Fiona Gallagher', headDoctorId: 'DOC-207', location: 'Building B, 3rd Floor', phone: '+1 (555) 201-1007', totalBeds: 8, occupiedBeds: 2, doctorsCount: 2, activePatientsCount: 19, description: 'Skin diagnostics, allergy testing, and dermatological procedures.' },
  { id: 'DEP-08', name: 'ENT (Otolaryngology)', headOfDepartment: 'Dr. Tariq Mansoor', headDoctorId: 'DOC-208', location: 'Building B, 1st Floor', phone: '+1 (555) 201-1008', totalBeds: 10, occupiedBeds: 4, doctorsCount: 2, activePatientsCount: 15, description: 'Ear, nose, throat and endoscopic sinus surgeries.' },
  { id: 'DEP-09', name: 'Ophthalmology', headOfDepartment: 'Dr. Chloe Bennett', headDoctorId: 'DOC-209', location: 'Building B, 1st Floor', phone: '+1 (555) 201-1009', totalBeds: 10, occupiedBeds: 3, doctorsCount: 2, activePatientsCount: 18, description: 'Cataract surgery, glaucoma management, and vision care.' },
  { id: 'DEP-10', name: 'Psychiatry', headOfDepartment: 'Dr. Julian Ross', headDoctorId: 'DOC-210', location: 'Building D, 2nd Floor', phone: '+1 (555) 201-1010', totalBeds: 14, occupiedBeds: 9, doctorsCount: 2, activePatientsCount: 14, description: 'Mental health assessment, counseling, and psychotherapy.' },
  { id: 'DEP-11', name: 'Dental Care', headOfDepartment: 'Dr. Naomi Watts', headDoctorId: 'DOC-211', location: 'Building D, 1st Floor', phone: '+1 (555) 201-1011', totalBeds: 4, occupiedBeds: 0, doctorsCount: 2, activePatientsCount: 20, description: 'Oral maxillofacial surgery, root canals, and restorative dental.' },
  { id: 'DEP-12', name: 'Emergency / Trauma', headOfDepartment: 'Dr. Ethan Hunt', headDoctorId: 'DOC-212', location: 'Ground Floor, North Gate', phone: '+1 (555) 201-9911', totalBeds: 16, occupiedBeds: 12, doctorsCount: 6, activePatientsCount: 24, description: '24/7 Level 1 Trauma triage, resuscitations, and critical care.' },
  { id: 'DEP-13', name: 'Radiology & Imaging', headOfDepartment: 'Dr. Arthur Pendelton', headDoctorId: 'DOC-213', location: 'Basement 1, Diagnostic Wing', phone: '+1 (555) 201-1013', totalBeds: 0, occupiedBeds: 0, doctorsCount: 3, activePatientsCount: 35, description: 'Digital X-Ray, Multi-slice 128 CT, 3.0T MRI, and Ultrasound.' },
  { id: 'DEP-14', name: 'Pathology & Laboratory', headOfDepartment: 'Dr. Rebecca Vance', headDoctorId: 'DOC-214', location: 'Basement 1, Diagnostic Wing', phone: '+1 (555) 201-1014', totalBeds: 0, occupiedBeds: 0, doctorsCount: 3, activePatientsCount: 50, description: 'Automated clinical biochemistry, hematology, microbiology, and serology.' },
  { id: 'DEP-15', name: 'Pharmacy Services', headOfDepartment: 'Rita Patel, PharmD', headDoctorId: 'DOC-215', location: 'Ground Floor, Main Atrium', phone: '+1 (555) 201-1015', totalBeds: 0, occupiedBeds: 0, doctorsCount: 4, activePatientsCount: 95, description: 'Inpatient and outpatient prescription dispensing and inventory control.' },
  { id: 'DEP-16', name: 'Intensive Care Unit (ICU)', headOfDepartment: 'Dr. Leonard McCoy', headDoctorId: 'DOC-216', location: 'Building A, 2nd Floor', phone: '+1 (555) 201-1016', totalBeds: 16, occupiedBeds: 13, doctorsCount: 4, activePatientsCount: 13, description: 'Advanced mechanical ventilators, hemodynamic monitoring, and post-op ICU.' },
  { id: 'DEP-17', name: 'Operation Theatre & Surgery', headOfDepartment: 'Dr. Victoria Sterling', headDoctorId: 'DOC-217', location: 'Building A, 2nd Floor', phone: '+1 (555) 201-1017', totalBeds: 8, occupiedBeds: 5, doctorsCount: 5, activePatientsCount: 10, description: 'Modular laminar airflow operating rooms for general and lap surgeries.' },
];

// 20 Doctors
export const INITIAL_DOCTORS: Doctor[] = [
  { id: 'DOC-201', name: 'Dr. Sarah Jenkins', title: 'Senior Cardiologist & Chief of Cardio', specialization: 'Interventional Cardiology', qualification: 'MD, FACC, MBBS', experienceYears: 16, department: 'Cardiology', consultationFee: 150, email: 's.jenkins@inboxhealth.demo', phone: '+1 (555) 201-0001', isAvailable: true, roomNumber: 'Room 302', rating: 4.9, totalConsultations: 1420, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '09:00 AM - 04:00 PM' },
  { id: 'DOC-202', name: 'Dr. Alistair Finch', title: 'Consultant Neurologist', specialization: 'Cognitive & Stroke Neurology', qualification: 'MD, DM Neurology, FRCP', experienceYears: 18, department: 'Neurology', consultationFee: 175, email: 'a.finch@inboxhealth.demo', phone: '+1 (555) 201-0002', isAvailable: true, roomNumber: 'Room 405', rating: 4.8, totalConsultations: 1180, scheduleDays: ['Mon', 'Wed', 'Fri'], workingHours: '10:00 AM - 03:00 PM' },
  { id: 'DOC-203', name: 'Dr. Maya Lin', title: 'Lead Orthopedic Surgeon', specialization: 'Joint Replacement & Arthroscopy', qualification: 'MS Orthopedics, MCh Orth', experienceYears: 14, department: 'Orthopedics', consultationFee: 140, email: 'm.lin@inboxhealth.demo', phone: '+1 (555) 201-0003', isAvailable: true, roomNumber: 'Room 210', rating: 4.9, totalConsultations: 980, scheduleDays: ['Tue', 'Thu', 'Sat'], workingHours: '08:30 AM - 02:30 PM' },
  { id: 'DOC-204', name: 'Dr. Samuel Green', title: 'Pediatric Specialist', specialization: 'Neonatology & Child Health', qualification: 'MD Pediatrics, DCH', experienceYears: 12, department: 'Pediatrics', consultationFee: 110, email: 's.green@inboxhealth.demo', phone: '+1 (555) 201-0004', isAvailable: true, roomNumber: 'Room 112', rating: 4.95, totalConsultations: 1650, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], workingHours: '09:00 AM - 05:00 PM' },
  { id: 'DOC-205', name: 'Dr. Priya Sharma', title: 'Consultant Obstetrician & Gynae', specialization: 'High-risk Pregnancy & Laparoscopy', qualification: 'MS, DGO, FICOG', experienceYears: 15, department: 'Gynecology & Obstetrics', consultationFee: 135, email: 'p.sharma@inboxhealth.demo', phone: '+1 (555) 201-0005', isAvailable: true, roomNumber: 'Room 204', rating: 4.85, totalConsultations: 1340, scheduleDays: ['Mon', 'Tue', 'Thu', 'Fri'], workingHours: '09:30 AM - 03:30 PM' },
  { id: 'DOC-206', name: 'Dr. Robert Miller', title: 'Internal Medicine Physician', specialization: 'Chronic Disease & Diabetes Care', qualification: 'MD Internal Medicine', experienceYears: 20, department: 'General Medicine', consultationFee: 95, email: 'r.miller@inboxhealth.demo', phone: '+1 (555) 201-0006', isAvailable: true, roomNumber: 'Room 101', rating: 4.75, totalConsultations: 2450, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '08:00 AM - 04:00 PM' },
  { id: 'DOC-207', name: 'Dr. Fiona Gallagher', title: 'Consultant Dermatologist', specialization: 'Clinical & Cosmetic Dermatology', qualification: 'MD Dermatology, DVD', experienceYears: 9, department: 'Dermatology', consultationFee: 120, email: 'f.gallagher@inboxhealth.demo', phone: '+1 (555) 201-0007', isAvailable: false, roomNumber: 'Room 315', rating: 4.8, totalConsultations: 890, scheduleDays: ['Wed', 'Fri', 'Sat'], workingHours: '10:00 AM - 02:00 PM' },
  { id: 'DOC-208', name: 'Dr. Tariq Mansoor', title: 'ENT Surgeon', specialization: 'Head & Neck / Otology', qualification: 'MS ENT, DLO', experienceYears: 13, department: 'ENT (Otolaryngology)', consultationFee: 115, email: 't.mansoor@inboxhealth.demo', phone: '+1 (555) 201-0008', isAvailable: true, roomNumber: 'Room 108', rating: 4.7, totalConsultations: 760, scheduleDays: ['Tue', 'Thu', 'Sat'], workingHours: '09:00 AM - 01:00 PM' },
  { id: 'DOC-209', name: 'Dr. Chloe Bennett', title: 'Ophthalmic Surgeon', specialization: 'Retina & Cataract Surgery', qualification: 'MS Ophthalmology, FICO', experienceYears: 11, department: 'Ophthalmology', consultationFee: 125, email: 'c.bennett@inboxhealth.demo', phone: '+1 (555) 201-0009', isAvailable: true, roomNumber: 'Room 105', rating: 4.9, totalConsultations: 920, scheduleDays: ['Mon', 'Wed', 'Fri'], workingHours: '09:00 AM - 03:00 PM' },
  { id: 'DOC-210', name: 'Dr. Julian Ross', title: 'Consultant Neuropsychiatrist', specialization: 'Adult Psychiatry & Mood Disorders', qualification: 'MD Psychiatry, MRCPsych', experienceYears: 17, department: 'Psychiatry', consultationFee: 160, email: 'j.ross@inboxhealth.demo', phone: '+1 (555) 201-0010', isAvailable: true, roomNumber: 'Room 220', rating: 4.8, totalConsultations: 640, scheduleDays: ['Mon', 'Tue', 'Thu'], workingHours: '11:00 AM - 05:00 PM' },
  { id: 'DOC-211', name: 'Dr. Naomi Watts', title: 'Dental Surgeon & Orthodontist', specialization: 'Endodontics & Oral Rehab', qualification: 'BDS, MDS', experienceYears: 10, department: 'Dental Care', consultationFee: 90, email: 'n.watts@inboxhealth.demo', phone: '+1 (555) 201-0011', isAvailable: true, roomNumber: 'Room D-02', rating: 4.85, totalConsultations: 1120, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '09:00 AM - 04:00 PM' },
  { id: 'DOC-212', name: 'Dr. Ethan Hunt', title: 'Emergency Medicine Specialist', specialization: 'Trauma Life Support & Resuscitation', qualification: 'MD Emergency Medicine, FACEM', experienceYears: 15, department: 'Emergency / Trauma', consultationFee: 180, email: 'e.hunt@inboxhealth.demo', phone: '+1 (555) 201-0012', isAvailable: true, roomNumber: 'ER Bay 1', rating: 4.95, totalConsultations: 3100, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], workingHours: 'Rotational 24x7' },
  { id: 'DOC-213', name: 'Dr. Arthur Pendelton', title: 'Chief Radiologist', specialization: 'Musculoskeletal & Neuro-imaging', qualification: 'MD Radiodiagnosis, FRCR', experienceYears: 19, department: 'Radiology & Imaging', consultationFee: 140, email: 'a.pendelton@inboxhealth.demo', phone: '+1 (555) 201-0013', isAvailable: true, roomNumber: 'RAD Reading 1', rating: 4.9, totalConsultations: 2800, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '08:30 AM - 04:30 PM' },
  { id: 'DOC-214', name: 'Dr. Rebecca Vance', title: 'Chief Pathologist', specialization: 'Clinical Hematopathology & Histology', qualification: 'MD Pathology, FRCPath', experienceYears: 16, department: 'Pathology & Laboratory', consultationFee: 100, email: 'r.vance@inboxhealth.demo', phone: '+1 (555) 201-0014', isAvailable: true, roomNumber: 'Lab Admin 1', rating: 4.88, totalConsultations: 4200, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], workingHours: '08:00 AM - 05:00 PM' },
  { id: 'DOC-215', name: 'Dr. Jessica Alba-Cruz', title: 'General & Laparoscopic Surgeon', specialization: 'Minimally Invasive Abdominal Surgery', qualification: 'MS General Surgery, FMAS', experienceYears: 13, department: 'Operation Theatre & Surgery', consultationFee: 165, email: 'j.cruz@inboxhealth.demo', phone: '+1 (555) 201-0015', isAvailable: true, roomNumber: 'OT Suite 2', rating: 4.92, totalConsultations: 850, scheduleDays: ['Mon', 'Wed', 'Fri'], workingHours: '07:30 AM - 02:00 PM' },
  { id: 'DOC-216', name: 'Dr. Leonard McCoy', title: 'Critical Care / Intensivist', specialization: 'Critical Care & Sepsis Protocol', qualification: 'MD Anaesthesia, EDIC', experienceYears: 21, department: 'Intensive Care Unit (ICU)', consultationFee: 200, email: 'l.mccoy@inboxhealth.demo', phone: '+1 (555) 201-0016', isAvailable: true, roomNumber: 'ICU Control', rating: 4.98, totalConsultations: 1980, scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], workingHours: 'Rotational ICU' },
  { id: 'DOC-217', name: 'Dr. Victoria Sterling', title: 'Cardiothoracic Surgeon', specialization: 'CABG & Valve Replacement', qualification: 'MCh CTVS, FACS', experienceYears: 22, department: 'Cardiology', consultationFee: 250, email: 'v.sterling@inboxhealth.demo', phone: '+1 (555) 201-0017', isAvailable: true, roomNumber: 'OT Suite 1', rating: 4.97, totalConsultations: 620, scheduleDays: ['Tue', 'Thu'], workingHours: '08:00 AM - 03:00 PM' },
  { id: 'DOC-218', name: 'Dr. Kevin O\'Connor', title: 'Consultant Nephrologist', specialization: 'Renal Dialysis & Kidney Health', qualification: 'MD, DM Nephrology', experienceYears: 14, department: 'General Medicine', consultationFee: 145, email: 'k.oconnor@inboxhealth.demo', phone: '+1 (555) 201-0018', isAvailable: true, roomNumber: 'Dialysis Unit', rating: 4.78, totalConsultations: 890, scheduleDays: ['Mon', 'Wed', 'Fri'], workingHours: '09:00 AM - 03:00 PM' },
  { id: 'DOC-219', name: 'Dr. Meera Nambiar', title: 'Consultant Endocrinologist', specialization: 'Thyroid, Pituitary & Complex Diabetes', qualification: 'MD, DM Endocrinology', experienceYears: 11, department: 'General Medicine', consultationFee: 130, email: 'm.nambiar@inboxhealth.demo', phone: '+1 (555) 201-0019', isAvailable: false, roomNumber: 'Room 107', rating: 4.82, totalConsultations: 1040, scheduleDays: ['Tue', 'Thu', 'Sat'], workingHours: '10:00 AM - 04:00 PM' },
  { id: 'DOC-220', name: 'Dr. Christian Ward', title: 'Pulmonologist', specialization: 'Asthma, COPD & Sleep Apnea', qualification: 'MD Chest Medicine, FCCP', experienceYears: 13, department: 'General Medicine', consultationFee: 135, email: 'c.ward@inboxhealth.demo', phone: '+1 (555) 201-0020', isAvailable: true, roomNumber: 'Room 208', rating: 4.87, totalConsultations: 950, scheduleDays: ['Mon', 'Tue', 'Thu', 'Sat'], workingHours: '09:00 AM - 02:00 PM' }
];

// Helper to generate 50 realistic synthetic patients
export function generateSyntheticPatients(): Patient[] {
  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const firstNamesM = ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Paul', 'Steven', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald'];
  const firstNamesF = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Sandra', 'Margaret', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
  const cities = ['Springfield', 'Riverdale', 'Oakwood', 'Fairview', 'Pinehurst', 'Maple Valley', 'Silver Creek', 'Lakewood'];
  const insuranceCompanies = ['BlueCross MediShield', 'Aetna Health Guard', 'Cigna Global Care', 'UnitedHealth Premier', 'Kaiser WellCare', 'Humana Platinum'];
  const allergiesList = [
    ['Penicillin'],
    ['Sulfa Drugs', 'Aspirin'],
    ['Latex'],
    ['Shellfish', 'Iodine'],
    ['None Known'],
    ['NSAIDs'],
    ['Pollen', 'Peanuts'],
    ['Ciprofloxacin']
  ];
  const chronicList = [
    ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    ['Hypertension'],
    ['Asthma', 'Allergic Rhinitis'],
    ['Coronary Artery Disease'],
    ['None'],
    ['Hyperlipidemia'],
    ['Chronic Kidney Disease Stage 2'],
    ['Osteoarthritis']
  ];

  const patients: Patient[] = [];

  for (let i = 1; i <= 52; i++) {
    const isMale = i % 2 === 1;
    const firstName = isMale
      ? firstNamesM[(i - 1) % firstNamesM.length]
      : firstNamesF[(i - 1) % firstNamesF.length];
    const lastName = lastNames[(i * 3) % lastNames.length];
    const age = 18 + ((i * 7) % 65);
    const birthYear = 2026 - age;
    const birthMonth = String((i % 12) + 1).padStart(2, '0');
    const birthDay = String((i % 28) + 1).padStart(2, '0');
    const doctor = INITIAL_DOCTORS[(i * 2) % INITIAL_DOCTORS.length];
    const status: Patient['status'] = i % 8 === 0 ? 'Inpatient' : i % 25 === 0 ? 'Critical' : 'Active';

    patients.push({
      id: `PAT-${1000 + i}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@syntheticmail.test`,
      phone: `+1 (555) ${String(100 + i * 13).padStart(3, '0')}-${String(2000 + i * 29).slice(0, 4)}`,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      age,
      gender: isMale ? 'Male' : 'Female',
      bloodGroup: bloodGroups[i % bloodGroups.length],
      address: `${100 + i * 14} Health Avenue, Apt #${(i % 12) + 1}`,
      city: cities[i % cities.length],
      emergencyContact: {
        name: `${isMale ? 'Evelyn' : 'Arthur'} ${lastName}`,
        relationship: isMale ? 'Spouse' : 'Brother',
        phone: `+1 (555) ${String(400 + i * 11).padStart(3, '0')}-${String(3000 + i * 17).slice(0, 4)}`
      },
      allergies: allergiesList[i % allergiesList.length],
      chronicConditions: chronicList[i % chronicList.length],
      insuranceProvider: i % 5 === 0 ? undefined : insuranceCompanies[i % insuranceCompanies.length],
      insurancePolicyNumber: i % 5 === 0 ? undefined : `POL-${77000 + i * 31}`,
      registeredDate: `2026-0${(i % 8) + 1}-${String((i % 25) + 1).padStart(2, '0')}`,
      assignedDoctorId: doctor.id,
      assignedDoctorName: doctor.name,
      status
    });
  }

  return patients;
}

// 50 synthetic medicines in pharmacy
export function generateSyntheticMedicines(): Medicine[] {
  const catalog = [
    { name: 'Amoxicillin 500mg', generic: 'Amoxicillin Trihydrate', cat: 'Antibiotics', form: 'Capsules', price: 12, cost: 7 },
    { name: 'Azithromycin 250mg', generic: 'Azithromycin Dihydrate', cat: 'Antibiotics', form: 'Tablets', price: 18, cost: 11 },
    { name: 'Ciprofloxacin 500mg', generic: 'Ciprofloxacin HCl', cat: 'Antibiotics', form: 'Tablets', price: 15, cost: 9 },
    { name: 'Augmentin 625mg', generic: 'Amoxicillin + Clavulanic Acid', cat: 'Antibiotics', form: 'Tablets', price: 24, cost: 16 },
    { name: 'Cephalexin 500mg', generic: 'Cephalexin Monohydrate', cat: 'Antibiotics', form: 'Capsules', price: 14, cost: 8 },
    { name: 'Paracetamol 650mg', generic: 'Acetaminophen', cat: 'Analgesics', form: 'Tablets', price: 4, cost: 1.5 },
    { name: 'Ibuprofen 400mg', generic: 'Ibuprofen', cat: 'Analgesics', form: 'Tablets', price: 6, cost: 2.8 },
    { name: 'Tramadol 50mg', generic: 'Tramadol Hydrochloride', cat: 'Analgesics', form: 'Capsules', price: 22, cost: 14 },
    { name: 'Amlodipine 5mg', generic: 'Amlodipine Besylate', cat: 'Antihypertensive', form: 'Tablets', price: 8, cost: 3.5 },
    { name: 'Telmisartan 40mg', generic: 'Telmisartan', cat: 'Antihypertensive', form: 'Tablets', price: 14, cost: 7 },
    { name: 'Losartan 50mg', generic: 'Losartan Potassium', cat: 'Antihypertensive', form: 'Tablets', price: 11, cost: 5 },
    { name: 'Metformin 500mg', generic: 'Metformin Hydrochloride', cat: 'Antidiabetic', form: 'Tablets', price: 7, cost: 2.9 },
    { name: 'Glimepiride 2mg', generic: 'Glimepiride', cat: 'Antidiabetic', form: 'Tablets', price: 9, cost: 4.1 },
    { name: 'Sitagliptin 100mg', generic: 'Sitagliptin Phosphate', cat: 'Antidiabetic', form: 'Tablets', price: 32, cost: 21 },
    { name: 'Atorvastatin 20mg', generic: 'Atorvastatin Calcium', cat: 'Supplements', form: 'Tablets', price: 16, cost: 8.5 },
    { name: 'Rosuvastatin 10mg', generic: 'Rosuvastatin Calcium', cat: 'Supplements', form: 'Tablets', price: 19, cost: 10 },
    { name: 'Pantoprazole 40mg', generic: 'Pantoprazole Sodium', cat: 'GI', form: 'Tablets', price: 9, cost: 4 },
    { name: 'Omeprazole 20mg', generic: 'Omeprazole', cat: 'GI', form: 'Capsules', price: 8, cost: 3.2 },
    { name: 'Ondansetron 4mg', generic: 'Ondansetron HCl', cat: 'GI', form: 'Tablets', price: 11, cost: 5.5 },
    { name: 'Montelukast 10mg', generic: 'Montelukast Sodium', cat: 'Respiratory', form: 'Tablets', price: 15, cost: 8 },
    { name: 'Salbutamol Inhaler 100mcg', generic: 'Albuterol Sulfate', cat: 'Respiratory', form: 'Inhaler', price: 28, cost: 17 },
    { name: 'Budesonide Respules 0.5mg', generic: 'Budesonide', cat: 'Respiratory', form: 'Respules', price: 21, cost: 13 },
    { name: 'Vitamin D3 60K IU', generic: 'Cholecalciferol', cat: 'Supplements', form: 'Capsules', price: 10, cost: 4.5 },
    { name: 'Methylcobalamin 1500mcg', generic: 'Vitamin B12', cat: 'Supplements', form: 'Tablets', price: 14, cost: 6.8 },
    { name: 'Ferrous Ascorbate + Folic Acid', generic: 'Iron Supplement', cat: 'Supplements', form: 'Tablets', price: 12, cost: 5.2 },
    { name: 'Acyclovir 400mg', generic: 'Acyclovir', cat: 'Antiviral', form: 'Tablets', price: 25, cost: 15 },
    { name: 'Oseltamivir 75mg', generic: 'Oseltamivir Phosphate', cat: 'Antiviral', form: 'Capsules', price: 45, cost: 28 },
    { name: 'Ceftriaxone 1g Injection', generic: 'Ceftriaxone Sodium', cat: 'Antibiotics', form: 'Vial', price: 18, cost: 9 },
    { name: 'Levofloxacin 500mg', generic: 'Levofloxacin Hemihydrate', cat: 'Antibiotics', form: 'Tablets', price: 16, cost: 8.5 },
    { name: 'Doxycycline 100mg', generic: 'Doxycycline Hyclate', cat: 'Antibiotics', form: 'Capsules', price: 13, cost: 6.5 },
    { name: 'Diclofenac 50mg', generic: 'Diclofenac Sodium', cat: 'Analgesics', form: 'Tablets', price: 5, cost: 2.2 },
    { name: 'Ketorolac 10mg', generic: 'Ketorolac Tromethamine', cat: 'Analgesics', form: 'Tablets', price: 12, cost: 6.5 },
    { name: 'Metoprolol 25mg', generic: 'Metoprolol Tartrate', cat: 'Antihypertensive', form: 'Tablets', price: 10, cost: 4.8 },
    { name: 'Hydrochlorothiazide 12.5mg', generic: 'Hydrochlorothiazide', cat: 'Antihypertensive', form: 'Tablets', price: 7, cost: 3 },
    { name: 'Spironolactone 25mg', generic: 'Spironolactone', cat: 'Antihypertensive', form: 'Tablets', price: 12, cost: 5.8 },
    { name: 'Insulin Glargine 100 IU/ml', generic: 'Long-Acting Insulin', cat: 'Antidiabetic', form: 'Pen', price: 65, cost: 44 },
    { name: 'Regular Insulin 100 IU/ml', generic: 'Short-Acting Insulin', cat: 'Antidiabetic', form: 'Vial', price: 38, cost: 24 },
    { name: 'Dapagliflozin 10mg', generic: 'Dapagliflozin', cat: 'Antidiabetic', form: 'Tablets', price: 35, cost: 22 },
    { name: 'Esomeprazole 40mg', generic: 'Esomeprazole Magnesium', cat: 'GI', form: 'Capsules', price: 14, cost: 7 },
    { name: 'Domperidone 10mg', generic: 'Domperidone', cat: 'GI', form: 'Tablets', price: 6, cost: 2.7 },
    { name: 'Lactulose Solution 100ml', generic: 'Lactulose', cat: 'GI', form: 'Syrup', price: 11, cost: 5.5 },
    { name: 'Cetirizine 10mg', generic: 'Cetirizine HCl', cat: 'Respiratory', form: 'Tablets', price: 5, cost: 1.8 },
    { name: 'Fexofenadine 120mg', generic: 'Fexofenadine HCl', cat: 'Respiratory', form: 'Tablets', price: 14, cost: 7.2 },
    { name: 'Prednisolone 10mg', generic: 'Prednisolone', cat: 'Supplements', form: 'Tablets', price: 8, cost: 3.5 },
    { name: 'Calcium Carbonate + D3', generic: 'Calcium + Cholecalciferol', cat: 'Supplements', form: 'Tablets', price: 11, cost: 5 },
    { name: 'Zinc Sulfate 20mg', generic: 'Zinc Elemental', cat: 'Supplements', form: 'Tablets', price: 6, cost: 2.1 },
    { name: 'Multivitamin Complex Gold', generic: 'Vitamins & Minerals', cat: 'Supplements', form: 'Capsules', price: 15, cost: 7.5 },
    { name: 'Heparin 5000 IU/ml', generic: 'Heparin Sodium', cat: 'Analgesics', form: 'Vial', price: 30, cost: 19 },
    { name: 'Enoxaparin 40mg/0.4ml', generic: 'Low Molecular Heparin', cat: 'Analgesics', form: 'Pre-filled Syringe', price: 42, cost: 29 },
    { name: 'Normal Saline 0.9% 500ml', generic: 'Sodium Chloride IV', cat: 'GI', form: 'IV Bottle', price: 6, cost: 2 }
  ];

  return catalog.map((item, idx) => ({
    id: `MED-${101 + idx}`,
    name: item.name,
    genericName: item.generic,
    category: item.cat as Medicine['category'],
    manufacturer: ['Pfizer Health', 'Novartis Lab', 'Sun Pharma Bio', 'GlaxoSmithKline', 'Sanofi Aventis', 'Cipla Therapeutics'][idx % 6],
    batchNumber: `BAT-2026-${String(300 + idx * 7)}`,
    expiryDate: `2027-0${(idx % 11) + 1}-15`,
    purchasePrice: item.cost,
    sellingPrice: item.price,
    stockQuantity: idx === 3 ? 12 : idx === 8 ? 8 : 45 + ((idx * 17) % 320),
    minStockLevel: 25,
    unit: item.form
  }));
}

// 100 synthetic appointments
export function generateSyntheticAppointments(patients: Patient[]): Appointment[] {
  const types: Appointment['type'][] = ['General', 'Follow-up', 'Emergency', 'Routine Checkup', 'Telehealth'];
  const statuses: Appointment['status'][] = ['Scheduled', 'Confirmed', 'Checked-in', 'In Consultation', 'Completed', 'Cancelled', 'No-show'];
  const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];
  const reasons = [
    'Persistent chest discomfort & palpitation',
    'Follow-up on blood pressure control',
    'Chronic migraine & headache evaluation',
    'Right knee pain after light jogging',
    'Annual pediatric wellness & immunization check',
    'Third-trimester prenatal routine scan review',
    'Type 2 Diabetes HbA1c review & insulin dose adjustment',
    'Skin rash and suspected dermatitis on forearm',
    'Recurrent sinus headache & nasal congestion',
    'Blurry distant vision & refraction testing',
    'Anxiety symptoms and sleep disorder counseling',
    'Severe lower back spasm & lumbar examination'
  ];

  const appts: Appointment[] = [];
  const today = '2026-09-21';

  for (let i = 1; i <= 104; i++) {
    const p = patients[(i * 3) % patients.length];
    const doc = INITIAL_DOCTORS[(i * 2) % INITIAL_DOCTORS.length];
    // Dates distribute across today, past week, and next 5 days
    let date = today;
    if (i <= 28) {
      date = today; // Today's appointments for instant queue!
    } else if (i <= 65) {
      const pastDay = 21 - ((i % 7) + 1);
      date = `2026-09-${String(pastDay).padStart(2, '0')}`;
    } else {
      const futureDay = 21 + ((i % 8) + 1);
      date = `2026-09-${String(futureDay).padStart(2, '0')}`;
    }

    const status = i <= 28
      ? (i % 4 === 0 ? 'In Consultation' : i % 3 === 0 ? 'Checked-in' : i % 2 === 0 ? 'Confirmed' : 'Scheduled')
      : (i <= 65 ? (i % 7 === 0 ? 'No-show' : 'Completed') : (i % 5 === 0 ? 'Confirmed' : 'Scheduled'));

    appts.push({
      id: `APT-${1000 + i}`,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date,
      time: times[i % times.length],
      type: types[i % types.length],
      status: status as Appointment['status'],
      reason: reasons[i % reasons.length],
      tokenNumber: (i % 25) + 1,
      vitalSignsRecorded: status === 'Checked-in' || status === 'In Consultation' || status === 'Completed',
      notes: `Patient reports onset ${i % 5 + 1} weeks ago. Monitored in ${doc.department}.`
    });
  }

  return appts;
}

// 50 synthetic prescriptions
export function generateSyntheticPrescriptions(patients: Patient[]): Prescription[] {
  const prescriptions: Prescription[] = [];
  const medPool = [
    { name: 'Amoxicillin 500mg', dose: '500 mg', freq: '1-0-1 (Twice daily)', dur: '7 days', route: 'Oral', inst: 'After meals' },
    { name: 'Paracetamol 650mg', dose: '650 mg', freq: '1-1-1 (Thrice daily)', dur: '3 days', route: 'Oral', inst: 'SOS for fever' },
    { name: 'Amlodipine 5mg', dose: '5 mg', freq: '0-0-1 (Night)', dur: '30 days', route: 'Oral', inst: 'After dinner' },
    { name: 'Metformin 500mg', dose: '500 mg', freq: '1-0-1 (Twice daily)', dur: '30 days', route: 'Oral', inst: 'With breakfast and dinner' },
    { name: 'Pantoprazole 40mg', dose: '40 mg', freq: '1-0-0 (Morning)', dur: '14 days', route: 'Oral', inst: 'Empty stomach 30 mins before food' },
    { name: 'Atorvastatin 20mg', dose: '20 mg', freq: '0-0-1 (Night)', dur: '30 days', route: 'Oral', inst: 'Bedtime' },
    { name: 'Cetirizine 10mg', dose: '10 mg', freq: '0-0-1 (Night)', dur: '5 days', route: 'Oral', inst: 'May cause drowsiness' }
  ];

  const diagnoses = [
    'Acute Upper Respiratory Infection (J06.9)',
    'Essential Primary Hypertension (I10)',
    'Type 2 Diabetes Mellitus without complications (E11.9)',
    'Acute Gastritis (K29.0)',
    'Osteoarthritis of Knee joint (M17.0)',
    'Bacterial Pharyngitis (J02.8)',
    'Allergic Rhinitis (J30.9)'
  ];

  for (let i = 1; i <= 52; i++) {
    const p = patients[(i * 2) % patients.length];
    const doc = INITIAL_DOCTORS[(i * 3) % INITIAL_DOCTORS.length];
    const medsCount = 2 + (i % 3);
    const chosenMeds = [];
    for (let m = 0; m < medsCount; m++) {
      const med = medPool[(i + m) % medPool.length];
      chosenMeds.push({
        id: `RX-ITEM-${i}-${m}`,
        medicineName: med.name,
        dosage: med.dose,
        frequency: med.freq,
        duration: med.dur,
        route: med.route,
        instructions: med.inst
      });
    }

    prescriptions.push({
      id: `RX-${2000 + i}`,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      doctorId: doc.id,
      doctorName: doc.name,
      date: `2026-09-${String(Math.max(1, 21 - (i % 14))).padStart(2, '0')}`,
      diagnosis: diagnoses[i % diagnoses.length],
      medicines: chosenMeds,
      notes: 'Maintain adequate oral hydration. Avoid strenuous physical stress until reviewed.',
      status: i % 7 === 0 ? 'Draft' : 'Active',
      dispensed: i % 3 === 0
    });
  }

  return prescriptions;
}

// 50 synthetic laboratory orders with full test results & reference ranges
export function generateSyntheticLabOrders(patients: Patient[]): LabOrder[] {
  const labTests = [
    {
      category: 'Hematology (CBC)' as const,
      name: 'Complete Blood Count (CBC) with Differential',
      results: [
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', isAbnormal: false },
        { parameter: 'Total WBC Count', value: '7,400', unit: '/mcL', referenceRange: '4,500 - 11,000', isAbnormal: false },
        { parameter: 'Platelet Count', value: '240,000', unit: '/mcL', referenceRange: '150,000 - 450,000', isAbnormal: false },
        { parameter: 'Neutrophils', value: '62', unit: '%', referenceRange: '40 - 70', isAbnormal: false },
        { parameter: 'Lymphocytes', value: '28', unit: '%', referenceRange: '20 - 40', isAbnormal: false }
      ]
    },
    {
      category: 'Biochemistry' as const,
      name: 'Fasting & Postprandial Blood Glucose Profile',
      results: [
        { parameter: 'Fasting Plasma Glucose', value: '128', unit: 'mg/dL', referenceRange: '70 - 99', isAbnormal: true },
        { parameter: 'HbA1c (Glycated Hemoglobin)', value: '6.9', unit: '%', referenceRange: '< 5.7', isAbnormal: true },
        { parameter: 'Postprandial Glucose (2h)', value: '168', unit: 'mg/dL', referenceRange: '< 140', isAbnormal: true }
      ]
    },
    {
      category: 'Lipid Profile' as const,
      name: 'Comprehensive Lipid Profile Panel',
      results: [
        { parameter: 'Total Cholesterol', value: '215', unit: 'mg/dL', referenceRange: '< 200', isAbnormal: true },
        { parameter: 'Triglycerides', value: '175', unit: 'mg/dL', referenceRange: '< 150', isAbnormal: true },
        { parameter: 'HDL (Good) Cholesterol', value: '44', unit: 'mg/dL', referenceRange: '> 40', isAbnormal: false },
        { parameter: 'LDL (Bad) Cholesterol', value: '136', unit: 'mg/dL', referenceRange: '< 100', isAbnormal: true }
      ]
    },
    {
      category: 'Liver Function' as const,
      name: 'Hepatic Function Panel (LFT)',
      results: [
        { parameter: 'Total Bilirubin', value: '0.9', unit: 'mg/dL', referenceRange: '0.2 - 1.2', isAbnormal: false },
        { parameter: 'SGPT / ALT', value: '38', unit: 'U/L', referenceRange: '7 - 56', isAbnormal: false },
        { parameter: 'SGOT / AST', value: '32', unit: 'U/L', referenceRange: '10 - 40', isAbnormal: false },
        { parameter: 'Alkaline Phosphatase', value: '88', unit: 'U/L', referenceRange: '44 - 147', isAbnormal: false },
        { parameter: 'Serum Albumin', value: '4.2', unit: 'g/dL', referenceRange: '3.4 - 5.4', isAbnormal: false }
      ]
    },
    {
      category: 'Renal Function' as const,
      name: 'Kidney Function Panel & Electrolytes (KFT)',
      results: [
        { parameter: 'Serum Creatinine', value: '1.05', unit: 'mg/dL', referenceRange: '0.7 - 1.3', isAbnormal: false },
        { parameter: 'Blood Urea Nitrogen (BUN)', value: '16', unit: 'mg/dL', referenceRange: '7 - 20', isAbnormal: false },
        { parameter: 'eGFR', value: '84', unit: 'mL/min/1.73m²', referenceRange: '> 60', isAbnormal: false },
        { parameter: 'Sodium', value: '141', unit: 'mEq/L', referenceRange: '135 - 145', isAbnormal: false },
        { parameter: 'Potassium', value: '4.3', unit: 'mEq/L', referenceRange: '3.5 - 5.0', isAbnormal: false }
      ]
    },
    {
      category: 'Thyroid' as const,
      name: 'Thyroid Stimulating Hormone (TSH) & Free T4',
      results: [
        { parameter: 'Serum TSH', value: '2.84', unit: 'uIU/mL', referenceRange: '0.4 - 4.2', isAbnormal: false },
        { parameter: 'Free T4 (Thyroxine)', value: '1.25', unit: 'ng/dL', referenceRange: '0.8 - 1.8', isAbnormal: false }
      ]
    }
  ];

  const statuses: LabOrder['status'][] = ['Ordered', 'Sample Collected', 'Processing', 'Result Ready', 'Verified'];
  const orders: LabOrder[] = [];

  for (let i = 1; i <= 52; i++) {
    const p = patients[(i * 4) % patients.length];
    const doc = INITIAL_DOCTORS[(i * 5) % INITIAL_DOCTORS.length];
    const test = labTests[i % labTests.length];
    const status = statuses[i % statuses.length];

    orders.push({
      id: `LAB-${3000 + i}`,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      doctorId: doc.id,
      doctorName: doc.name,
      testCategory: test.category,
      testName: test.name,
      orderDate: `2026-09-${String(Math.max(1, 21 - (i % 10))).padStart(2, '0')}`,
      status,
      sampleCollectedAt: status !== 'Ordered' ? `2026-09-20 09:30 AM` : undefined,
      results: (status === 'Result Ready' || status === 'Verified') ? test.results : undefined,
      verifiedBy: status === 'Verified' ? 'Dr. Rebecca Vance (Chief Pathologist)' : undefined,
      notes: 'Sample run on automated spectrophotometer & cell counter. Internal QC verified.'
    });
  }

  return orders;
}

// 30 synthetic radiology orders
export function generateSyntheticRadiologyOrders(patients: Patient[]): RadiologyOrder[] {
  const scans = [
    { modality: 'X-Ray' as const, part: 'Chest PA View', findings: 'Normal bronchovascular markings. No focal consolidation, pneumothorax, or pleural effusion noted. Cardiothoracic ratio is within normal limits.', impression: 'Clear lung fields without active cardiopulmonary disease.' },
    { modality: 'MRI' as const, part: 'Brain with Contrast', findings: 'Symmetrical cerebral hemispheres. Ventricular system is normal for age. No acute infarct, hemorrhage, or mass effect seen.', impression: 'Unremarkable brain MRI without acute intracranial pathology.' },
    { modality: 'CT Scan' as const, part: 'Abdomen & Pelvis (CECT)', findings: 'Liver, spleen, pancreas, and adrenal glands appear unremarkable. Appendix is normal in caliber. No bowel obstruction.', impression: 'No acute intra-abdominal inflammatory process.' },
    { modality: 'Ultrasound' as const, part: 'Whole Abdomen & KUB', findings: 'Normal hepatic echotexture. Gallbladder is well distended without calculi. Bilateral kidneys demonstrate normal corticomedullary differentiation.', impression: 'Normal abdominal ultrasonography.' },
    { modality: 'X-Ray' as const, part: 'Right Knee AP & Lateral', findings: 'Mild joint space narrowing in the medial compartment. Minimal subchondral sclerosis. No acute fracture or dislocation.', impression: 'Grade 1 medial compartment osteoarthritis of the right knee.' },
    { modality: 'Mammography' as const, part: 'Bilateral Screening', findings: 'Scattered fibroglandular densities. No dominant mass, architectural distortion, or suspicious microcalcifications identified.', impression: 'BI-RADS Category 1: Negative screening exam.' }
  ];

  const statuses: RadiologyOrder['status'][] = ['Scheduled', 'Scan Completed', 'Report Ready', 'Verified'];
  const techs = ['Elena Rostova', 'Mark Miller', 'Samantha Cruz'];
  const rads: RadiologyOrder[] = [];

  for (let i = 1; i <= 32; i++) {
    const p = patients[(i * 3) % patients.length];
    const doc = INITIAL_DOCTORS[(i * 2) % INITIAL_DOCTORS.length];
    const scan = scans[i % scans.length];
    const status = statuses[i % statuses.length];

    rads.push({
      id: `RAD-${4000 + i}`,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      doctorId: doc.id,
      doctorName: doc.name,
      modality: scan.modality,
      bodyPart: scan.part,
      orderDate: `2026-09-${String(Math.max(1, 21 - (i % 12))).padStart(2, '0')}`,
      status,
      technicianName: techs[i % techs.length],
      findings: (status === 'Report Ready' || status === 'Verified') ? scan.findings : undefined,
      impression: (status === 'Report Ready' || status === 'Verified') ? scan.impression : undefined,
      radiologistName: status === 'Verified' ? 'Dr. Arthur Pendelton, FRCR' : undefined
    });
  }

  return rads;
}

// 50 synthetic billing invoices with real calculated item totals
export function generateSyntheticInvoices(patients: Patient[]): Invoice[] {
  const statuses: Invoice['paymentStatus'][] = ['Paid', 'Paid', 'Partial', 'Pending', 'Pending'];
  const methods: Invoice['paymentMethod'][] = ['Credit/Debit Card', 'Cash', 'UPI', 'Insurance', 'Bank Transfer'];

  const invoices: Invoice[] = [];

  for (let i = 1; i <= 52; i++) {
    const p = patients[(i * 2) % patients.length];
    const isBigBill = i % 5 === 0;

    const items: InvoiceItem[] = [
      { id: `ITM-${i}-1`, description: 'Specialist Consultation Fee', category: 'Consultation' as const, quantity: 1, unitPrice: 150, total: 150 },
      { id: `ITM-${i}-2`, description: 'Routine Lab Workup (CBC & LFT)', category: 'Laboratory' as const, quantity: 1, unitPrice: 95, total: 95 }
    ];

    if (isBigBill) {
      items.push({ id: `ITM-${i}-3`, description: 'Inpatient Bed Charges (3 Days)', category: 'Bed Charge' as const, quantity: 3, unitPrice: 350, total: 1050 });
      items.push({ id: `ITM-${i}-4`, description: 'Pharmacy Inpatient Medications', category: 'Pharmacy' as const, quantity: 1, unitPrice: 220, total: 220 });
    }

    const subtotal = items.reduce((acc, itm) => acc + itm.total, 0);
    const taxAmount = Math.round(subtotal * 0.05);
    const discountAmount = i % 4 === 0 ? 25 : 0;
    const insuranceCoveredAmount = (p.insuranceProvider && i % 3 === 0) ? Math.round(subtotal * 0.65) : 0;
    const totalAmount = subtotal + taxAmount - discountAmount;
    const patientPayable = Math.max(0, totalAmount - insuranceCoveredAmount);

    const paymentStatus = statuses[i % statuses.length];
    const paidAmount = paymentStatus === 'Paid'
      ? patientPayable
      : paymentStatus === 'Partial'
        ? Math.round(patientPayable * 0.5)
        : 0;
    const balanceAmount = patientPayable - paidAmount;

    invoices.push({
      id: `INV-${5000 + i}`,
      invoiceNumber: `INV-2026-${String(8000 + i)}`,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      date: `2026-09-${String(Math.max(1, 21 - (i % 15))).padStart(2, '0')}`,
      dueDate: `2026-10-${String((i % 25) + 1).padStart(2, '0')}`,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      insuranceCoveredAmount,
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentStatus,
      paymentMethod: paidAmount > 0 ? methods[i % methods.length] : undefined
    });
  }

  return invoices;
}

// 20 synthetic insurance claims
export function generateSyntheticInsuranceClaims(patients: Patient[]): InsuranceClaim[] {
  const companies = ['BlueCross MediShield', 'Aetna Health Guard', 'Cigna Global Care', 'UnitedHealth Premier', 'Kaiser WellCare'];
  const claimStatuses: InsuranceClaim['status'][] = ['Submitted', 'Under Review', 'Approved', 'Settled', 'Rejected'];
  const treatments: InsuranceClaim['treatmentType'][] = ['IPD Surgeries', 'Emergency', 'OPD', 'Maternity'];

  const claims: InsuranceClaim[] = [];

  for (let i = 1; i <= 22; i++) {
    const p = patients[(i * 3) % patients.length];
    const status = claimStatuses[i % claimStatuses.length];
    const claimAmount = 450 + (i * 280);
    const approvedAmount = (status === 'Approved' || status === 'Settled')
      ? Math.round(claimAmount * 0.85)
      : (status === 'Rejected' ? 0 : 0);

    claims.push({
      id: `CLM-${6000 + i}`,
      claimNumber: `CLM-TPA-${9000 + i}`,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      insuranceCompany: companies[i % companies.length],
      policyNumber: p.insurancePolicyNumber || `POL-77${100 + i}`,
      treatmentType: treatments[i % treatments.length],
      claimAmount,
      approvedAmount,
      submissionDate: `2026-09-${String(Math.max(1, 20 - (i % 14))).padStart(2, '0')}`,
      status,
      tpaRemarks: status === 'Approved' ? 'Pre-authorized procedure verified under clause 4.2.' : status === 'Rejected' ? 'Non-covered pre-existing waiting period constraint.' : 'Awaiting clinical discharge summary verification.'
    });
  }

  return claims;
}

// 30 Staff members
export function generateSyntheticStaff(): StaffMember[] {
  const roles = [
    { title: 'Senior Staff Nurse', role: 'nurse' as const, dept: 'Intensive Care Unit (ICU)', salary: 65000 },
    { title: 'Registered Ward Nurse', role: 'nurse' as const, dept: 'General Medicine', salary: 58000 },
    { title: 'Triage Nurse', role: 'nurse' as const, dept: 'Emergency / Trauma', salary: 62000 },
    { title: 'Head Receptionist', role: 'receptionist' as const, dept: 'Front Desk & Admissions', salary: 42000 },
    { title: 'Admissions Officer', role: 'receptionist' as const, dept: 'Front Desk & Admissions', salary: 40000 },
    { title: 'Chief Pharmacist', role: 'pharmacist' as const, dept: 'Pharmacy Services', salary: 82000 },
    { title: 'Dispensing Pharmacist', role: 'pharmacist' as const, dept: 'Pharmacy Services', salary: 60000 },
    { title: 'Senior Lab Technologist', role: 'lab_technician' as const, dept: 'Pathology & Laboratory', salary: 55000 },
    { title: 'Phlebotomist', role: 'lab_technician' as const, dept: 'Pathology & Laboratory', salary: 44000 },
    { title: 'Lead MRI Technologist', role: 'radiology_technician' as const, dept: 'Radiology & Imaging', salary: 68000 },
    { title: 'X-Ray Tech Specialist', role: 'radiology_technician' as const, dept: 'Radiology & Imaging', salary: 52000 },
    { title: 'Senior Billing Accountant', role: 'accountant' as const, dept: 'Finance & Billing', salary: 64000 },
    { title: 'Claims Auditor', role: 'accountant' as const, dept: 'Finance & Billing', salary: 59000 },
    { title: 'HR Generalist', role: 'hr_staff' as const, dept: 'Human Resources', salary: 54000 },
    { title: 'Operations Coordinator', role: 'hospital_admin' as const, dept: 'Operations', salary: 72000 }
  ];

  const names = [
    'Clara Oswald', 'Thomas Shelby', 'Hannah Abbott', 'David Zhao', 'Elena Rostova',
    'Nathaniel Cross', 'Sophia Martinez', 'Liam Henderson', 'Lucas Gray', 'Chloe Bennett',
    'Amelia Watson', 'Felix Wright', 'Grace Hopper', 'Ian Malcolm', 'Jasmine Kaur',
    'Kenji Sato', 'Laura Palmer', 'Marcus Rivera', 'Nadia Comaneci', 'Oliver Queen',
    'Penny Hofstadter', 'Quinn Fabray', 'Rory Gilmore', 'Simon Templar', 'Tara Maclay',
    'Uma Thurman', 'Victor Creed', 'Wanda Maximoff', 'Xavier Thorpe', 'Yvonne Strahovski', 'Zack Taylor'
  ];

  return names.slice(0, 31).map((name, i) => {
    const roleInfo = roles[i % roles.length];
    return {
      id: `STF-${700 + i}`,
      name,
      role: roleInfo.role,
      designation: roleInfo.title,
      department: roleInfo.dept,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@inboxhealth.demo`,
      phone: `+1 (555) 700-${String(1000 + i * 17).slice(0, 4)}`,
      joinedDate: `2024-0${(i % 10) + 1}-12`,
      shift: i % 3 === 0 ? 'Morning (08:00 - 16:00)' : i % 3 === 1 ? 'Evening (16:00 - 00:00)' : 'Night (00:00 - 08:00)',
      status: i === 5 ? 'On Leave' : 'Active',
      salary: roleInfo.salary
    };
  });
}

// 20 hospital inventory items
export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-ITM-01', name: 'N95 Respirator Masks (Box of 50)', category: 'Consumables', supplier: 'MedSupply Co', quantity: 180, unit: 'Boxes', minStock: 50, unitPrice: 32, lastRestockedDate: '2026-09-10', status: 'In Stock' },
  { id: 'INV-ITM-02', name: 'Sterile Nitrile Gloves Large (Box of 100)', category: 'Consumables', supplier: 'SafeGlove Ltd', quantity: 340, unit: 'Boxes', minStock: 100, unitPrice: 18, lastRestockedDate: '2026-09-12', status: 'In Stock' },
  { id: 'INV-ITM-03', name: 'IV Infusion Sets 20 Drop/ml', category: 'Consumables', supplier: 'Baxter Healthcare', quantity: 450, unit: 'Units', minStock: 150, unitPrice: 4.5, lastRestockedDate: '2026-09-08', status: 'In Stock' },
  { id: 'INV-ITM-04', name: 'Disposable Syringes 5ml with Needle', category: 'Consumables', supplier: 'Becton Dickinson', quantity: 800, unit: 'Units', minStock: 200, unitPrice: 0.8, lastRestockedDate: '2026-09-15', status: 'In Stock' },
  { id: 'INV-ITM-05', name: 'Blood Collection Tubes EDTA Purple (Pack of 100)', category: 'Laboratory Supplies', supplier: 'BD Vacutainer', quantity: 28, unit: 'Packs', minStock: 30, unitPrice: 45, lastRestockedDate: '2026-08-25', status: 'Low Stock' },
  { id: 'INV-ITM-06', name: 'Biochemistry Reagent Rotor Panel', category: 'Laboratory Supplies', supplier: 'Abbott Diagnostics', quantity: 60, unit: 'Kits', minStock: 25, unitPrice: 120, lastRestockedDate: '2026-09-02', status: 'In Stock' },
  { id: 'INV-ITM-07', name: 'Surgical Scalpel Blades #10 (Box of 100)', category: 'Surgical Items', supplier: 'Swann-Morton', quantity: 45, unit: 'Boxes', minStock: 20, unitPrice: 28, lastRestockedDate: '2026-09-05', status: 'In Stock' },
  { id: 'INV-ITM-08', name: 'Monocryl 3-0 Absorbable Suture (Pack of 36)', category: 'Surgical Items', supplier: 'Ethicon Endo', quantity: 18, unit: 'Packs', minStock: 25, unitPrice: 85, lastRestockedDate: '2026-08-20', status: 'Low Stock' },
  { id: 'INV-ITM-09', name: 'Portable Multi-parameter Patient Monitor', category: 'Medical Equipment', supplier: 'Mindray Global', quantity: 14, unit: 'Devices', minStock: 5, unitPrice: 2800, lastRestockedDate: '2026-06-15', status: 'In Stock' },
  { id: 'INV-ITM-10', name: 'Biphasic Defibrillator with AED', category: 'Medical Equipment', supplier: 'Zoll Medical', quantity: 8, unit: 'Devices', minStock: 4, unitPrice: 6500, lastRestockedDate: '2026-05-10', status: 'In Stock' },
  { id: 'INV-ITM-11', name: 'ICU Ventilator Servo-u Mechanical', category: 'Medical Equipment', supplier: 'Getinge Corp', quantity: 12, unit: 'Devices', minStock: 6, unitPrice: 18000, lastRestockedDate: '2026-04-18', status: 'In Stock' },
  { id: 'INV-ITM-12', name: 'ECG Electrodes Pre-gelled (Pack of 50)', category: 'Consumables', supplier: '3M Healthcare', quantity: 95, unit: 'Packs', minStock: 40, unitPrice: 22, lastRestockedDate: '2026-09-14', status: 'In Stock' },
  { id: 'INV-ITM-13', name: 'Digital Infrared Forehead Thermometer', category: 'Medical Equipment', supplier: 'Omron Health', quantity: 35, unit: 'Units', minStock: 15, unitPrice: 65, lastRestockedDate: '2026-08-11', status: 'In Stock' },
  { id: 'INV-ITM-14', name: 'Suction Catheter 12 Fr Sterile', category: 'Consumables', supplier: 'Covidien Med', quantity: 240, unit: 'Units', minStock: 100, unitPrice: 2.2, lastRestockedDate: '2026-09-11', status: 'In Stock' },
  { id: 'INV-ITM-15', name: 'Urine Drainage Bag 2000ml Anti-reflux', category: 'Consumables', supplier: 'Bard Medical', quantity: 160, unit: 'Units', minStock: 80, unitPrice: 3.5, lastRestockedDate: '2026-09-13', status: 'In Stock' },
  { id: 'INV-ITM-16', name: 'High-Level Surface Disinfectant 5L', category: 'Office Supplies', supplier: 'Ecolab', quantity: 40, unit: 'Bottles', minStock: 20, unitPrice: 42, lastRestockedDate: '2026-09-01', status: 'In Stock' },
  { id: 'INV-ITM-17', name: 'Autoclave Sterilization Pouch Rolls', category: 'Surgical Items', supplier: 'Crosstex', quantity: 50, unit: 'Rolls', minStock: 25, unitPrice: 34, lastRestockedDate: '2026-09-06', status: 'In Stock' },
  { id: 'INV-ITM-18', name: 'X-Ray Lead Apron 0.5mm Pb', category: 'Medical Equipment', supplier: 'Infab Corp', quantity: 10, unit: 'Units', minStock: 6, unitPrice: 290, lastRestockedDate: '2026-03-22', status: 'In Stock' },
  { id: 'INV-ITM-19', name: 'Thermal ECG Recording Paper (Box of 10)', category: 'Office Supplies', supplier: 'GE Healthcare', quantity: 12, unit: 'Boxes', minStock: 20, unitPrice: 48, lastRestockedDate: '2026-08-18', status: 'Low Stock' },
  { id: 'INV-ITM-20', name: 'Pulse Oximeter Fingertip Probe Sensor', category: 'Medical Equipment', supplier: 'Masimo', quantity: 25, unit: 'Units', minStock: 10, unitPrice: 110, lastRestockedDate: '2026-07-29', status: 'In Stock' }
];

// 32 Hospital Beds across Wards
export function generateSyntheticBeds(): Bed[] {
  const wards: { type: Bed['wardType']; prefix: string; floor: number; rate: number; count: number }[] = [
    { type: 'ICU', prefix: 'ICU', floor: 2, rate: 750, count: 6 },
    { type: 'General Ward', prefix: 'GW', floor: 1, rate: 180, count: 8 },
    { type: 'Private Room', prefix: 'PVT', floor: 3, rate: 450, count: 6 },
    { type: 'Semi-Private', prefix: 'SP', floor: 2, rate: 290, count: 4 },
    { type: 'Emergency', prefix: 'ER', floor: 1, rate: 350, count: 4 },
    { type: 'Pediatrics', prefix: 'PED', floor: 1, rate: 250, count: 2 },
    { type: 'Maternity', prefix: 'MAT', floor: 2, rate: 380, count: 2 }
  ];

  const beds: Bed[] = [];
  let bedIdx = 1;

  for (const ward of wards) {
    for (let c = 1; c <= ward.count; c++) {
      const isOccupied = (bedIdx % 2 === 1) || (ward.type === 'ICU' && c <= 4);
      const isCleaning = bedIdx === 8;
      const isMaintenance = bedIdx === 14;

      let status: Bed['status'] = 'Available';
      if (isOccupied) status = 'Occupied';
      else if (isCleaning) status = 'Cleaning';
      else if (isMaintenance) status = 'Maintenance';

      beds.push({
        id: `BED-${100 + bedIdx}`,
        bedNumber: `${ward.prefix}-${String(c).padStart(2, '0')}`,
        roomNumber: `Room ${ward.floor}0${c}`,
        wardType: ward.type,
        floor: ward.floor,
        status,
        patientId: isOccupied ? `PAT-${1000 + bedIdx}` : undefined,
        patientName: isOccupied ? (bedIdx % 2 === 1 ? 'Robert Miller' : 'Mary Elizabeth') : undefined,
        admissionDate: isOccupied ? '2026-09-18' : undefined,
        assignedDoctorName: isOccupied ? 'Dr. Sarah Jenkins' : undefined,
        dailyRate: ward.rate
      });
      bedIdx++;
    }
  }

  return beds;
}

// 8 Emergency Triage Cases
export const INITIAL_EMERGENCY_CASES: EmergencyCase[] = [
  {
    id: 'ER-CASE-01',
    patientName: 'Jonathan Campbell',
    age: 58,
    gender: 'Male',
    triagePriority: 'Critical',
    chiefComplaint: 'Acute substernal crushing chest pain, diaphoresis & dyspnea',
    arrivalTime: '10 mins ago',
    assignedDoctor: 'Dr. Ethan Hunt',
    assignedBed: 'ER-Bay 01',
    status: 'Treating',
    vitals: { bp: '85/55', pulse: 122, spo2: 89, temp: 37.1 }
  },
  {
    id: 'ER-CASE-02',
    patientName: 'Samantha Green',
    age: 29,
    gender: 'Female',
    triagePriority: 'High',
    chiefComplaint: 'Severe acute right lower quadrant abdominal rebound tenderness',
    arrivalTime: '25 mins ago',
    assignedDoctor: 'Dr. Jessica Alba-Cruz',
    assignedBed: 'ER-Bay 02',
    status: 'Triage',
    vitals: { bp: '118/76', pulse: 98, spo2: 98, temp: 38.6 }
  },
  {
    id: 'ER-CASE-03',
    patientName: 'Michael Chang',
    age: 44,
    gender: 'Male',
    triagePriority: 'Medium',
    chiefComplaint: 'Deep forearm laceration from construction equipment; active oozing',
    arrivalTime: '40 mins ago',
    assignedDoctor: 'Dr. Ethan Hunt',
    assignedBed: 'ER-Bay 03',
    status: 'Stabilized',
    vitals: { bp: '130/84', pulse: 82, spo2: 99, temp: 36.8 }
  },
  {
    id: 'ER-CASE-04',
    patientName: 'Dorothy Wright',
    age: 76,
    gender: 'Female',
    triagePriority: 'High',
    chiefComplaint: 'Acute left-sided facial droop and right arm motor weakness',
    arrivalTime: '50 mins ago',
    assignedDoctor: 'Dr. Alistair Finch',
    assignedBed: 'ER-Bay 04',
    status: 'Treating',
    vitals: { bp: '178/104', pulse: 88, spo2: 96, temp: 36.9 }
  },
  {
    id: 'ER-CASE-05',
    patientName: 'Lucas Vance',
    age: 8,
    gender: 'Male',
    triagePriority: 'Medium',
    chiefComplaint: 'High febrile convulsion episode; lethargic post-ictal',
    arrivalTime: '1 hour ago',
    assignedDoctor: 'Dr. Samuel Green',
    assignedBed: 'ER-Bay 05',
    status: 'Stabilized',
    vitals: { bp: '100/65', pulse: 110, spo2: 97, temp: 39.2 }
  }
];

// Blood bank stock
export const INITIAL_BLOOD_STOCK: BloodUnit[] = [
  { id: 'BLD-01', bloodGroup: 'A+', unitsAvailable: 28, unitsReserved: 4, donorCount: 142, lastDonationDate: '2026-09-19', expiryWarningCount: 2 },
  { id: 'BLD-02', bloodGroup: 'A-', unitsAvailable: 12, unitsReserved: 2, donorCount: 65, lastDonationDate: '2026-09-17', expiryWarningCount: 1 },
  { id: 'BLD-03', bloodGroup: 'B+', unitsAvailable: 34, unitsReserved: 6, donorCount: 180, lastDonationDate: '2026-09-20', expiryWarningCount: 3 },
  { id: 'BLD-04', bloodGroup: 'B-', unitsAvailable: 8, unitsReserved: 1, donorCount: 42, lastDonationDate: '2026-09-16', expiryWarningCount: 0 },
  { id: 'BLD-05', bloodGroup: 'AB+', unitsAvailable: 16, unitsReserved: 3, donorCount: 88, lastDonationDate: '2026-09-18', expiryWarningCount: 1 },
  { id: 'BLD-06', bloodGroup: 'AB-', unitsAvailable: 5, unitsReserved: 1, donorCount: 29, lastDonationDate: '2026-09-12', expiryWarningCount: 0 },
  { id: 'BLD-07', bloodGroup: 'O+', unitsAvailable: 42, unitsReserved: 8, donorCount: 230, lastDonationDate: '2026-09-20', expiryWarningCount: 4 },
  { id: 'BLD-08', bloodGroup: 'O-', unitsAvailable: 7, unitsReserved: 2, donorCount: 51, lastDonationDate: '2026-09-18', expiryWarningCount: 1 }
];

// Ambulances
export const INITIAL_AMBULANCES: Ambulance[] = [
  { id: 'AMB-01', vehicleNumber: 'MED-EMG-101', driverName: 'Gary Kasparov', driverPhone: '+1 (555) 301-1101', paramedicName: 'Sarah Connor, EMT-P', status: 'Available', currentLocation: 'Hospital Trauma Bay Bay #1', equipmentLevel: 'Advanced Cardiac Life Support (ACLS)' },
  { id: 'AMB-02', vehicleNumber: 'MED-EMG-102', driverName: 'Bill Paxton', driverPhone: '+1 (555) 301-1102', paramedicName: 'John Watson, EMT-B', status: 'Emergency Dispatched', currentLocation: 'En Route to West Oak Highway Mile 14', equipmentLevel: 'Advanced Cardiac Life Support (ACLS)' },
  { id: 'AMB-03', vehicleNumber: 'MED-EMG-103', driverName: 'Terry Crews', driverPhone: '+1 (555) 301-1103', paramedicName: 'Diana Prince, EMT-B', status: 'On Trip', currentLocation: 'Inter-hospital Transfer: St. Jude General', equipmentLevel: 'Basic Life Support (BLS)' },
  { id: 'AMB-04', vehicleNumber: 'MED-EMG-104', driverName: 'Dominic Toretto', driverPhone: '+1 (555) 301-1104', paramedicName: 'Mia Toretto, RN', status: 'Available', currentLocation: 'North Bay Standby Station', equipmentLevel: 'Neonatal Transport' }
];

// Operation Theatres
export const INITIAL_OT_SCHEDULE: OperationTheatre[] = [
  { id: 'OT-01', theatreNumber: 'OT Suite 1 (Cardiothoracic)', procedureName: 'Coronary Artery Bypass Graft (CABG x 3)', patientName: 'Arthur Dent (PAT-1012)', leadSurgeon: 'Dr. Victoria Sterling', anesthetist: 'Dr. Leonard McCoy', scheduledTime: 'Today 08:30 AM', durationMinutes: 240, status: 'In Progress', preOpChecklistComplete: true },
  { id: 'OT-02', theatreNumber: 'OT Suite 2 (Orthopedics)', procedureName: 'Total Left Knee Arthroplasty', patientName: 'Margaret Thatcher (PAT-1019)', leadSurgeon: 'Dr. Maya Lin', anesthetist: 'Dr. Leonard McCoy', scheduledTime: 'Today 01:00 PM', durationMinutes: 120, status: 'Scheduled', preOpChecklistComplete: true },
  { id: 'OT-03', theatreNumber: 'OT Suite 3 (General / Lap)', procedureName: 'Laparoscopic Cholecystectomy', patientName: 'Richard Roe (PAT-1025)', leadSurgeon: 'Dr. Jessica Alba-Cruz', anesthetist: 'Dr. Samuel Green', scheduledTime: 'Today 03:30 PM', durationMinutes: 90, status: 'Scheduled', preOpChecklistComplete: false }
];

// Discharge Summaries
export const INITIAL_DISCHARGE_SUMMARIES: DischargeSummary[] = [
  {
    id: 'DISC-01',
    patientId: 'PAT-1004',
    patientName: 'Michael Williams',
    admissionId: 'ADM-201',
    doctorName: 'Dr. Robert Miller',
    department: 'General Medicine',
    admissionDate: '2026-09-14',
    dischargeDate: '2026-09-20',
    dischargeType: 'Normal',
    finalDiagnosis: 'Community-Acquired Lobar Pneumonia (Right Middle Lobe)',
    treatmentSummary: 'Treated with IV Ceftriaxone 1g BID, oral Azithromycin 500mg, chest physiotherapy, and supplemental oxygen. Afebrile for 48 hours with resolved leukocytosis.',
    postDischargeMedications: '1. Tab Augmentin 625mg PO BID x 5 days\n2. Tab Paracetamol 650mg PO PRN for fever',
    followUpDate: '2026-09-28',
    dischargeStatus: 'Finalized'
  }
];

// Documents
export const INITIAL_DOCUMENTS: HospitalDocument[] = [
  { id: 'DOC-FILE-01', title: 'Chest X-Ray Digital Scan Report', category: 'Radiology', patientId: 'PAT-1001', patientName: 'Johnathan Doe', uploadedAt: '2026-09-20', fileSize: '4.2 MB', fileType: 'PDF' },
  { id: 'DOC-FILE-02', title: 'Comprehensive Blood Count & Lipid Panel', category: 'Lab Report', patientId: 'PAT-1001', patientName: 'Johnathan Doe', uploadedAt: '2026-09-18', fileSize: '1.1 MB', fileType: 'PDF' },
  { id: 'DOC-FILE-03', title: 'Government Health Insurance Card Copy', category: 'Insurance', patientId: 'PAT-1001', patientName: 'Johnathan Doe', uploadedAt: '2026-09-15', fileSize: '850 KB', fileType: 'PNG' },
  { id: 'DOC-FILE-04', title: 'Cardiology Discharge Summary & ECG Strip', category: 'Discharge Summary', patientId: 'PAT-1004', patientName: 'Michael Williams', uploadedAt: '2026-09-20', fileSize: '2.8 MB', fileType: 'PDF' }
];

// Audit logs
export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  { id: 'LOG-001', userId: 'USR-001', userName: 'Dr. Evelyn Reed (Super Admin)', role: 'super_admin', action: 'System Backup Initiated', module: 'System Settings', timestamp: '2026-09-21 08:30:12', ipAddress: '192.168.1.100', details: 'Automated encrypted snapshot verified' },
  { id: 'LOG-002', userId: 'USR-005', userName: 'Liam Henderson (Receptionist)', role: 'receptionist', action: 'Patient Registered', module: 'Patients', timestamp: '2026-09-21 08:42:05', ipAddress: '192.168.1.105', details: 'Created PAT-1052 with insurance policy validation' },
  { id: 'LOG-003', userId: 'USR-003', userName: 'Dr. Sarah Jenkins', role: 'doctor', action: 'Prescription Created', module: 'Prescriptions', timestamp: '2026-09-21 09:15:30', ipAddress: '192.168.2.201', details: 'Generated RX-2024 for PAT-1001' },
  { id: 'LOG-004', userId: 'USR-007', userName: 'David Zhao', role: 'lab_technician', action: 'Lab Results Verified', module: 'Laboratory', timestamp: '2026-09-21 09:40:18', ipAddress: '192.168.3.305', details: 'Verified CBC panel for PAT-1014' },
  { id: 'LOG-005', userId: 'USR-006', userName: 'Rita Patel', role: 'pharmacist', action: 'Medicine Dispensed', module: 'Pharmacy', timestamp: '2026-09-21 10:05:42', ipAddress: '192.168.4.402', details: 'Dispensed Amoxicillin 500mg (Qty: 14) for RX-2018' },
  { id: 'LOG-006', userId: 'USR-009', userName: 'Nathaniel Cross', role: 'accountant', action: 'Payment Received', module: 'Billing', timestamp: '2026-09-21 10:22:11', ipAddress: '192.168.1.112', details: 'Recorded payment of $245 via Credit Card for INV-5008' }
];

// Initial notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'NOTIF-01', title: 'Emergency Room Triage Alert', message: 'Critical trauma case incoming to Bay #1 via Ambulance MED-EMG-102.', timestamp: '5 mins ago', type: 'emergency', read: false, linkModule: 'emergency' },
  { id: 'NOTIF-02', title: 'Low Stock Medicine Warning', message: 'Augmentin 625mg and Prednisolone have dropped below minimum threshold of 25 units.', timestamp: '30 mins ago', type: 'warning', read: false, linkModule: 'pharmacy' },
  { id: 'NOTIF-03', title: 'Critical Lab Value Flagged', message: 'Fasting Glucose 128 mg/dL and elevated HbA1c flagged for patient Johnathan Doe.', timestamp: '1 hour ago', type: 'warning', read: false, linkModule: 'laboratory' },
  { id: 'NOTIF-04', title: 'Insurance Claim Settled', message: 'TPA approved payment of $2,380 for patient Margaret Thatcher claim #CLM-TPA-9004.', timestamp: '2 hours ago', type: 'success', read: true, linkModule: 'insurance' },
  { id: 'NOTIF-05', title: 'New Appointment Booked', message: 'Patient Sophia Clark confirmed for Cardiology consultation at 02:00 PM today.', timestamp: '3 hours ago', type: 'info', read: true, linkModule: 'appointments' }
];

// Hospital Default Settings
export const DEFAULT_HOSPITAL_SETTINGS: HospitalSettings = {
  hospitalName: 'Inbox Health Hospital & Medical Center',
  tagline: 'Powered by Inbox Infotech Pvt. Ltd. Enterprise Healthcare Solutions',
  logoUrl: '/inbox-logo.svg',
  address: 'Inbox Infotech Towers, 400 Innovation Drive',
  cityStateZip: 'Silicon Valley, CA 94016',
  phone: '+1 (800) 555-INBOX',
  email: 'healthcare@inboxinfotech.com',
  emergencyContact: '+1 (800) 911-INBOX (24x7)',
  currencySymbol: '$',
  taxRatePercent: 5.0,
  enableAutoAppointmentConfirm: true,
  theme: 'light'
};
