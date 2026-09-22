import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import {
  ClipboardEdit,
  User,
  Heart,
  AlertCircle,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  FlaskConical,
  ScanLine,
  Stethoscope,
  Pill,
  Save
} from 'lucide-react';

interface ConsultationModuleProps {
  initialAppointment?: any;
  onPrintDocument: (type: any, data: any, title: string) => void;
}

export const ConsultationModule: React.FC<ConsultationModuleProps> = ({
  initialAppointment,
  onPrintDocument,
}) => {
  const {
    patients,
    doctors,
    appointments,
    updateAppointmentStatus,
    addPrescription,
    addLabOrder,
    addRadiologyOrder,
    medicines,
  } = useHMS();
  const { showToast } = useToast();

  const [selectedApptId, setSelectedApptId] = useState(
    initialAppointment?.id || appointments.find((a) => a.status === 'In Consultation' || a.status === 'Checked-in')?.id || appointments[0]?.id || ''
  );

  const currentAppt = appointments.find((a) => a.id === selectedApptId);
  const currentPatient = patients.find((p) => p.id === currentAppt?.patientId);
  const currentDoctor = doctors.find((d) => d.id === currentAppt?.doctorId) || doctors[0];

  // Clinical notes state
  const [chiefComplaint, setChiefComplaint] = useState(currentAppt?.reason || 'Persistent headache and fatigue');
  const [clinicalNotes, setClinicalNotes] = useState('Patient reports symptoms worsening in the afternoon. No fever. Normal appetite.');
  const [diagnosis, setDiagnosis] = useState('Essential (primary) hypertension (ICD-10 I10)');
  const [followUpDate, setFollowUpDate] = useState('2026-10-05');

  // Prescribed medicines state
  const [prescribedMeds, setPrescribedMeds] = useState<Array<{
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    instructions: string;
  }>>([
    {
      medicineId: medicines[0]?.id || 'MED-1',
      medicineName: medicines[0]?.name || 'Amoxicillin 500mg',
      dosage: '500mg',
      frequency: 'TDS (3 times a day)',
      duration: '5 days',
      route: 'Oral',
      instructions: 'Take after meals with water',
    },
  ]);

  // Orders to dispatch
  const [orderBloodTest, setOrderBloodTest] = useState(false);
  const [bloodTestName, setBloodTestName] = useState('Complete Blood Count (CBC)');
  const [orderRadiology, setOrderRadiology] = useState(false);
  const [radiologyTestName, setRadiologyTestName] = useState('Chest X-Ray PA View');

  const handleAddMedicineRow = () => {
    const med = medicines[0];
    setPrescribedMeds([
      ...prescribedMeds,
      {
        medicineId: med?.id || 'MED-1',
        medicineName: med?.name || 'Paracetamol 650mg',
        dosage: '650mg',
        frequency: 'BD (Twice daily)',
        duration: '3 days',
        route: 'Oral',
        instructions: 'After meals',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setPrescribedMeds(prescribedMeds.filter((_, idx) => idx !== index));
  };

  const handleCompleteConsultation = () => {
    if (!currentPatient || !currentDoctor) return;

    // 1. Create Prescription
    const rx = addPrescription({
      patientId: currentPatient.id,
      patientName: `${currentPatient.firstName} ${currentPatient.lastName}`,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      diagnosis,
      medicines: prescribedMeds.map((m, idx) => ({
        id: `RX-ITEM-${idx}-${Date.now()}`,
        ...m,
      })),
      notes: clinicalNotes,
      status: 'Active',
      dispensed: false,
    });

    // 2. If lab test checked, create lab order
    if (orderBloodTest) {
      addLabOrder({
        patientId: currentPatient.id,
        patientName: `${currentPatient.firstName} ${currentPatient.lastName}`,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        testName: bloodTestName,
        testCategory: 'Hematology (CBC)',
        priority: 'Normal',
        results: [
          { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', isAbnormal: false },
          { parameter: 'Total WBC', value: '7,800', unit: '/mcL', referenceRange: '4,000 - 11,000', isAbnormal: false },
        ],
      });
    }

    // 3. If radiology checked, create radiology order
    if (orderRadiology) {
      addRadiologyOrder({
        patientId: currentPatient.id,
        patientName: `${currentPatient.firstName} ${currentPatient.lastName}`,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        modality: 'X-Ray',
        imagingType: 'X-Ray',
        bodyPart: 'Chest',
        technicianName: 'Rad Tech',
        urgency: 'Routine',
        findings: 'Pending scan acquisition',
        impression: 'Pending report',
      });
    }

    // 4. Update appointment status
    if (currentAppt) {
      updateAppointmentStatus(currentAppt.id, 'Completed');
    }

    showToast({
      type: 'success',
      title: 'Consultation Finalized',
      message: `Prescription #${rx.id} generated for ${currentPatient.firstName} ${currentPatient.lastName}.`,
    });

    onPrintDocument('prescription', rx, `Prescription #${rx.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardEdit className="w-6 h-6 text-sky-600" />
            <span>Doctor Consultation Workstation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Electronic clinical documentation, ICD-10 diagnostic charting, and e-prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">Active Encounter:</label>
          <select
            value={selectedApptId}
            onChange={(e) => setSelectedApptId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-hidden"
          >
            {appointments
              .filter((a) => a.date === '2026-09-21')
              .map((a) => (
                <option key={a.id} value={a.id}>
                  Token #{a.tokenNumber} - {a.patientName} ({a.status})
                </option>
              ))}
          </select>
        </div>
      </div>

      {currentPatient && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Patient Summary Card & Allergies */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {currentPatient.firstName[0]}
                  {currentPatient.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {currentPatient.firstName} {currentPatient.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentPatient.age}y &bull; {currentPatient.gender} &bull; {currentPatient.id}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Blood Group:</span>
                  <span className="font-bold text-rose-600">{currentPatient.bloodGroup}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Contact:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{currentPatient.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Prior Hospital Visits:</span>
                  <span className="font-semibold">{currentPatient.totalVisits}</span>
                </div>
              </div>

              {/* Documented Allergies */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Allergies Alert
                </p>
                <div className="flex flex-wrap gap-1">
                  {currentPatient.allergies.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200 text-[10px] font-semibold border border-rose-200 dark:border-rose-900"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chronic Conditions */}
              {currentPatient.chronicConditions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Chronic History
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {currentPatient.chronicConditions.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 text-[10px] font-semibold border border-amber-200 dark:border-amber-900"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostic Investigations Quick Dispatch */}
            <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                Order Diagnostic Investigations
              </h4>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={orderBloodTest}
                    onChange={(e) => setOrderBloodTest(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <FlaskConical className="w-4 h-4 text-sky-600" />
                  <span>Order Pathology / Lab Test</span>
                </label>
                {orderBloodTest && (
                  <select
                    value={bloodTestName}
                    onChange={(e) => setBloodTestName(e.target.value)}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 text-xs bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                    <option value="Comprehensive Metabolic Panel (CMP)">CMP Liver &amp; Kidney</option>
                    <option value="Lipid Panel Profile">Lipid Panel Profile</option>
                    <option value="Glycated Hemoglobin (HbA1c)">HbA1c Blood Sugar</option>
                    <option value="Serum Electrolytes">Serum Electrolytes</option>
                  </select>
                )}
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={orderRadiology}
                    onChange={(e) => setOrderRadiology(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <ScanLine className="w-4 h-4 text-indigo-600" />
                  <span>Order Radiology / Medical Imaging</span>
                </label>
                {orderRadiology && (
                  <select
                    value={radiologyTestName}
                    onChange={(e) => setRadiologyTestName(e.target.value)}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 text-xs bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Chest X-Ray PA View">Chest X-Ray PA View</option>
                    <option value="CT Scan Brain (Non-Contrast)">CT Scan Brain (Non-Contrast)</option>
                    <option value="MRI Lumbar Spine">MRI Lumbar Spine</option>
                    <option value="Ultrasound Abdomen &amp; Pelvis">Ultrasound Abdomen &amp; Pelvis</option>
                    <option value="Echocardiogram 2D">Echocardiogram 2D</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Center & Right Column: Notes & E-Prescription (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <span>Clinical Evaluation &amp; Diagnosis</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chief Complaint &amp; Symptoms
                  </label>
                  <textarea
                    rows={2}
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Clinical Diagnosis (ICD-10)
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-sky-700 dark:text-sky-300"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physician Examination &amp; Assessment Notes
                </label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Prescribed Medications Table */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-rose-600" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Prescribed Medications (Rx)
                    </span>
                  </div>
                  <button
                    onClick={handleAddMedicineRow}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {prescribedMeds.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 grid grid-cols-1 md:grid-cols-6 gap-2 text-xs items-center"
                    >
                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-400">Medicine Name</label>
                        <select
                          value={med.medicineId}
                          onChange={(e) => {
                            const found = medicines.find((m) => m.id === e.target.value);
                            const updated = [...prescribedMeds];
                            updated[idx].medicineId = e.target.value;
                            updated[idx].medicineName = found?.name || '';
                            setPrescribedMeds(updated);
                          }}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                        >
                          {medicines.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.stockQuantity} in stock)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400">Frequency</label>
                        <select
                          value={med.frequency}
                          onChange={(e) => {
                            const updated = [...prescribedMeds];
                            updated[idx].frequency = e.target.value;
                            setPrescribedMeds(updated);
                          }}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          <option value="OD (Once daily)">OD (Once daily)</option>
                          <option value="BD (Twice daily)">BD (Twice daily)</option>
                          <option value="TDS (3 times/day)">TDS (3 times/day)</option>
                          <option value="QID (4 times/day)">QID (4 times/day)</option>
                          <option value="SOS / PRN (As needed)">SOS (As needed)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400">Duration</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => {
                            const updated = [...prescribedMeds];
                            updated[idx].duration = e.target.value;
                            setPrescribedMeds(updated);
                          }}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400">Instructions</label>
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => {
                            const updated = [...prescribedMeds];
                            updated[idx].instructions = e.target.value;
                            setPrescribedMeds(updated);
                          }}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          onClick={() => handleRemoveMedicineRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up date & Finalize Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Recommended Follow-up:
                  </span>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                <button
                  onClick={handleCompleteConsultation}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalize Consultation &amp; Issue Rx</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
