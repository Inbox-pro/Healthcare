import React from 'react';
import { useHMS } from '../../context/HMSContext';
import {
  Users,
  Calendar,
  Stethoscope,
  BedSingle,
  Siren,
  FlaskConical,
  CreditCard,
  Pill,
  TrendingUp,
  Hotel,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

interface DashboardModuleProps {
  onNavigate: (module: string) => void;
  onQuickAction?: (action: string) => void;
  onStartConsultation?: (appointment: any) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigate, onQuickAction = () => {}, onStartConsultation }) => {
  const {
    patients,
    doctors,
    appointments,
    admissions,
    beds,
    emergencyCases,
    labOrders,
    invoices,
    medicines,
    departments,
    settings,
  } = useHMS();

  // Metric calculations
  const todayStr = '2026-09-21';
  const todayAppts = appointments.filter((a) => a.date === todayStr);
  const availableDoctors = doctors.filter((d) => d.isAvailable).length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const bedOccupancyRate = Math.round((occupiedBeds / beds.length) * 100);
  const pendingLabs = labOrders.filter((l) => l.status === 'Ordered' || l.status === 'Sample Collected').length;
  const criticalER = emergencyCases.filter((c) => c.triagePriority === 'Critical' || c.triagePriority === 'High').length;
  const pendingInvoices = invoices.filter((inv) => inv.paymentStatus === 'Pending' || inv.paymentStatus === 'Partial');
  const totalOutstanding = pendingInvoices.reduce((acc, curr) => acc + curr.balanceAmount, 0);
  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const lowStockCount = medicines.filter((m) => m.stockQuantity <= m.minStockLevel).length;

  // Chart data 1: Weekly Registration & Appointments Trend
  const weeklyTrendData = [
    { day: 'Mon 09/15', registrations: 12, appointments: 24, emergency: 4 },
    { day: 'Tue 09/16', registrations: 15, appointments: 28, emergency: 6 },
    { day: 'Wed 09/17', registrations: 18, appointments: 32, emergency: 3 },
    { day: 'Thu 09/18', registrations: 14, appointments: 26, emergency: 7 },
    { day: 'Fri 09/19', registrations: 22, appointments: 35, emergency: 5 },
    { day: 'Sat 09/20', registrations: 19, appointments: 30, emergency: 8 },
    { day: 'Today', registrations: 16, appointments: todayAppts.length || 28, emergency: criticalER },
  ];

  // Chart data 2: Monthly Financial Collection
  const monthlyRevenueData = [
    { month: 'Apr', revenue: 42000, collections: 38500 },
    { month: 'May', revenue: 46500, collections: 44000 },
    { month: 'Jun', revenue: 51200, collections: 49000 },
    { month: 'Jul', revenue: 54000, collections: 51500 },
    { month: 'Aug', revenue: 58900, collections: 56200 },
    { month: 'Sep (MTD)', revenue: totalRevenue, collections: Math.round(totalRevenue * 0.92) },
  ];

  // Chart data 3: Department Patient Share
  const departmentPieData = departments.slice(0, 6).map((dep, idx) => ({
    name: dep.name.split(' ')[0],
    value: dep.activePatientsCount,
  }));
  const PIE_COLORS = ['#0288D1', '#7CB342', '#E64A19', '#8E24AA', '#F57C00', '#00897B'];

  // Chart data 4: Ward Bed Occupancy
  const wardBedData = [
    { ward: 'ICU', total: 6, occupied: beds.filter((b) => b.wardType === 'ICU' && b.status === 'Occupied').length },
    { ward: 'Gen Ward', total: 8, occupied: beds.filter((b) => b.wardType === 'General Ward' && b.status === 'Occupied').length },
    { ward: 'Private', total: 6, occupied: beds.filter((b) => b.wardType === 'Private Room' && b.status === 'Occupied').length },
    { ward: 'Semi-Pvt', total: 4, occupied: beds.filter((b) => b.wardType === 'Semi-Private' && b.status === 'Occupied').length },
    { ward: 'Emergency', total: 4, occupied: beds.filter((b) => b.wardType === 'Emergency' && b.status === 'Occupied').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Hospital Operations Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time clinical census, OPD appointments, ICU beds, emergency triage, and billing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onQuickAction('register_patient')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Patient</span>
          </button>
          <button
            onClick={() => onQuickAction('book_appointment')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit</span>
          </button>
          <button
            onClick={() => onQuickAction('create_invoice')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Patients</span>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {patients.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              +14% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active electronic health records</p>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Today's Visits</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {todayAppts.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {todayAppts.filter((a) => a.status === 'Completed').length} consultations completed
          </p>
        </div>

        {/* Available Doctors */}
        <div
          onClick={() => onNavigate('doctors')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>On-Duty Doctors</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {availableDoctors}{' '}
              <span className="text-sm font-normal text-slate-400">/ {doctors.length}</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">Available</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 17 clinical departments</p>
        </div>

        {/* Bed Occupancy */}
        <div
          onClick={() => onNavigate('beds')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Bed Occupancy</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Hotel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {bedOccupancyRate}%
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {occupiedBeds} / {beds.length}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                bedOccupancyRate > 85 ? 'bg-rose-500' : 'bg-purple-600'
              }`}
              style={{ width: `${bedOccupancyRate}%` }}
            />
          </div>
        </div>

        {/* Emergency Triage */}
        <div
          onClick={() => onNavigate('emergency')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-red-300 dark:hover:border-red-800 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Emergency ER</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
              <Siren className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {criticalER}
            </span>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded">
              High Triage
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{emergencyCases.length} total active ER cases</p>
        </div>

        {/* Pending Lab Tests */}
        <div
          onClick={() => onNavigate('lab')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Pending Lab Tests</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {pendingLabs}
            </span>
            <span className="text-[11px] font-medium text-amber-600">Processing</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{labOrders.length} total orders registered</p>
        </div>

        {/* Pharmacy Low Stock */}
        <div
          onClick={() => onNavigate('pharmacy')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Low Stock Medicines</span>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lowStockCount}
            </span>
            <span className="text-[11px] font-semibold text-orange-600">Reorder Alert</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{medicines.length} catalogue master items</p>
        </div>

        {/* Inpatient Admissions */}
        <div
          onClick={() => onNavigate('ipd')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Admitted IPD</span>
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <BedSingle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {admissions.filter((a) => a.status === 'Admitted').length}
            </span>
            <span className="text-[11px] font-medium text-teal-600">In Wards</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rounds &amp; nursing continuous care</p>
        </div>

        {/* Month Revenue */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Recorded Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              ${Math.round(totalRevenue / 1000)}k
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">+8.5%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Paid consultations, IPD &amp; labs</p>
        </div>

        {/* Outstanding Receivables */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Pending Balance</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              ${Math.round(totalOutstanding / 1000)}k
            </span>
            <span className="text-[11px] font-medium text-rose-600">Receivable</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{pendingInvoices.length} invoices with balance</p>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Appointments & Registrations Trend */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Patient Traffic &amp; Appointments Velocity
              </h3>
              <p className="text-xs text-slate-400">Daily appointment visits vs new registrations</p>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              View Schedule &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrendData}>
                <defs>
                  <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0288D1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0288D1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CB342" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7CB342" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="appointments"
                  name="Appointments"
                  stroke="#0288D1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAppts)"
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  stroke="#7CB342"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRegs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue vs Collections */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Financial Revenue &amp; Payment Collections
              </h3>
              <p className="text-xs text-slate-400">Total invoiced billing vs actual collection (USD)</p>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              Finance Hub &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Bar dataKey="revenue" name="Billed Amount" fill="#0288D1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collections" name="Collected" fill="#7CB342" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Department Distribution & Ward Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie: Department Distribution */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Clinical Patient Volume
          </h3>
          <p className="text-xs text-slate-400 mb-2">Patients distribution across specialties</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Ward Bed Occupancy Breakdown */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Ward Bed Allocation
              </h3>
              <p className="text-xs text-slate-400">Occupied vs capacity</p>
            </div>
            <button
              onClick={() => onNavigate('beds')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
            >
              Bed Map &rarr;
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardBedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="ward" type="category" tick={{ fontSize: 10 }} width={70} />
                <Tooltip />
                <Bar dataKey="occupied" name="Occupied Beds" fill="#E64A19" radius={[0, 4, 4, 0]} />
                <Bar dataKey="total" name="Total Capacity" fill="#CBD5E1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Triage Queue Widget */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Siren className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Emergency Trauma Queue
                </h3>
              </div>
              <button
                onClick={() => onNavigate('emergency')}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                ER Console &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {emergencyCases.slice(0, 3).map((er) => (
                <div
                  key={er.id}
                  className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{er.patientName}</span>
                      <span className="text-[10px] text-slate-400">{er.age}y</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">
                      {er.chiefComplaint}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      BP: <span className="font-semibold text-slate-700 dark:text-slate-300">{er.vitals.bp}</span> | SpO2:{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{er.vitals.spo2}%</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      er.triagePriority === 'Critical'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : er.triagePriority === 'High'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {er.triagePriority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Trauma Bay Resuscitation: Active</span>
            <span className="font-semibold text-rose-600">{criticalER} High Priority</span>
          </div>
        </div>
      </div>

      {/* Row 4: Today's Appointments Table & Quick Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments List (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Today's Outpatient Appointments ({todayAppts.length})
              </h3>
              <p className="text-xs text-slate-400">Live consultation queue and token tracker</p>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              Full Calendar &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2 font-medium">Token</th>
                  <th className="pb-2 font-medium">Patient</th>
                  <th className="pb-2 font-medium">Doctor / Dept</th>
                  <th className="pb-2 font-medium">Time</th>
                  <th className="pb-2 font-medium">Reason</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {todayAppts.slice(0, 6).map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold font-mono text-sky-600 dark:text-sky-400">
                      #{appt.tokenNumber}
                    </td>
                    <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      {appt.patientName}
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">
                      <div>{appt.doctorName}</div>
                      <div className="text-[10px] text-slate-400">{appt.department}</div>
                    </td>
                    <td className="py-2.5 text-slate-500 font-mono text-[11px]">{appt.time}</td>
                    <td className="py-2.5 text-slate-500 truncate max-w-[150px]">{appt.reason}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          appt.status === 'In Consultation'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : appt.status === 'Checked-in'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : appt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Medicine & Inventory Alerts (1 Column) */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Pharmacy Reorder Alerts
              </h3>
            </div>
            <button
              onClick={() => onNavigate('pharmacy')}
              className="text-xs text-orange-600 hover:underline font-medium"
            >
              Pharmacy &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {medicines
              .filter((m) => m.stockQuantity <= m.minStockLevel)
              .slice(0, 4)
              .map((med) => (
                <div
                  key={med.id}
                  className="p-2.5 rounded-lg border border-orange-200 dark:border-orange-950/60 bg-orange-50/50 dark:bg-orange-950/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{med.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {med.category} • Batch: {med.batchNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600">
                      {med.stockQuantity} {med.unit} left
                    </span>
                    <p className="text-[9px] text-slate-400">Min: {med.minStockLevel}</p>
                  </div>
                </div>
              ))}

            {medicines.filter((m) => m.stockQuantity <= m.minStockLevel).length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                All medications are currently well-stocked.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
