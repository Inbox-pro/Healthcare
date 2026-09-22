import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  Users,
  Activity,
  BedSingle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const ReportsModule: React.FC = () => {
  const { patients, appointments, admissions, bills, beds, labOrders } = useHMS();
  const { showToast } = useToast();

  const [dateRange, setDateRange] = useState('current-month');

  // Revenue by Category Data
  const revenueCategoryData = [
    { name: 'OPD Consultations', value: 38500, color: '#0284C7' },
    { name: 'IPD Bed Charges', value: 52400, color: '#6366F1' },
    { name: 'Pharmacy Sales', value: 41200, color: '#10B981' },
    { name: 'Pathology Labs', value: 24800, color: '#F59E0B' },
    { name: 'Radiology / PACS', value: 31600, color: '#EC4899' },
    { name: 'Surgery & OT', value: 68000, color: '#8B5CF6' },
  ];

  // Daily Patient Footfall Data
  const footfallData = [
    { day: 'Mon', opd: 95, ipd: 14, er: 28 },
    { day: 'Tue', opd: 110, ipd: 18, er: 22 },
    { day: 'Wed', opd: 125, ipd: 21, er: 35 },
    { day: 'Thu', opd: 105, ipd: 16, er: 19 },
    { day: 'Fri', opd: 140, ipd: 25, er: 30 },
    { day: 'Sat', opd: 85, ipd: 12, er: 42 },
    { day: 'Sun', opd: 45, ipd: 8, er: 48 },
  ];

  const handleExportCSV = () => {
    // Generate a quick CSV of patients & billing
    const headers = 'ID,Name,Phone,Gender,BloodGroup,RegisteredDate\n';
    const rows = patients
      .map(
        (p) =>
          `"${p.id}","${p.firstName} ${p.lastName}","${p.phone}","${p.gender}","${p.bloodGroup}","${p.registeredDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HMS_Patient_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Report Exported',
      message: 'Patient Clinical Registry CSV downloaded successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            <span>Hospital MIS, Operational Analytics &amp; Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Executive financial intelligence, patient volume analytics, clinical throughput, and regulatory reporting.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Master CSV Report</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-slate-400 font-medium">Registered Patient Base</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {patients.length} Active EMRs
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +14.2% MoM
          </p>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-slate-400 font-medium">OPD Outpatient Encounters</p>
          <p className="text-2xl font-bold text-sky-600 mt-0.5">
            {appointments.length} Consultations
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Avg 34 mins consult</p>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-slate-400 font-medium">Inpatient Bed Occupancy</p>
          <p className="text-2xl font-bold text-indigo-600 mt-0.5">
            {Math.round((beds.filter((b) => b.status === 'Occupied').length / beds.length) * 100)}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">ALOS: 3.4 Days</p>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-slate-400 font-medium">Diagnostic Lab Throughput</p>
          <p className="text-2xl font-bold text-amber-600 mt-0.5">
            {labOrders.length} Tests Processed
          </p>
          <p className="text-[11px] text-slate-400 mt-1">99.4% SLA adherence</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Footfall Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Patient Influx by Care Stream (Weekly)
              </h3>
              <p className="text-xs text-slate-400">
                Outpatient Clinics vs Inpatient Admissions vs ER Trauma
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={footfallData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="opd" name="OPD Visits" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ipd" name="IPD Admissions" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="er" name="ER Trauma" fill="#E11D48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution Pie (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Revenue Source Breakdown
              </h3>
              <p className="text-xs text-slate-400">Distribution across hospital service centers</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {revenueCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
