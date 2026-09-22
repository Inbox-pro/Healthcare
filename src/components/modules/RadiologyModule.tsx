import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { RadiologyOrder } from '../../types/hms';
import {
  ScanLine,
  Search,
  Printer,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Contrast,
  CheckCircle2,
  User,
  Stethoscope,
  X
} from 'lucide-react';

interface RadiologyModuleProps {
  onPrintDocument: (type: any, data: any, title: string) => void;
}

export const RadiologyModule: React.FC<RadiologyModuleProps> = ({ onPrintDocument }) => {
  const { radiologyOrders, updateRadiologyFindings } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<RadiologyOrder>(radiologyOrders[0]);

  // PACS Viewer Controls State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);

  // Edit findings
  const [findingsText, setFindingsText] = useState(selectedOrder?.findings || '');
  const [impressionText, setImpressionText] = useState(selectedOrder?.impression || '');

  const filteredOrders = radiologyOrders.filter((order) => {
    const matchesSearch =
      search === '' ||
      order.patientName.toLowerCase().includes(search.toLowerCase()) ||
      order.bodyPart.toLowerCase().includes(search.toLowerCase()) ||
      (order.imagingType || order.modality || '').toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'all' || (order.imagingType || order.modality) === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSelectOrder = (order: RadiologyOrder) => {
    setSelectedOrder(order);
    setFindingsText(order.findings || '');
    setImpressionText(order.impression || '');
    setZoomLevel(100);
    setRotation(0);
    setIsInverted(false);
  };

  const handleSaveReport = () => {
    if (!selectedOrder) return;
    updateRadiologyFindings(selectedOrder.id, findingsText, impressionText);
    showToast({
      type: 'success',
      title: 'PACS Diagnostic Report Verified',
      message: `Radiologist impression signed off for ${selectedOrder.patientName} (${selectedOrder.imagingType || selectedOrder.modality}).`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-sky-600" />
            <span>Radiology &amp; Digital PACS Imaging Workstation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Diagnostic imaging matrix, DICOM viewer console, contrast modulation, and radiologist impressions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">DICOM 3.0 / HL7 Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Order Roster List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search scan, patient, body part..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredOrders.map((ord) => {
              const isSelected = ord.id === selectedOrder?.id;

              return (
                <div
                  key={ord.id}
                  onClick={() => handleSelectOrder(ord)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 shadow-xs'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs">
                        {ord.id}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {ord.patientName}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ord.imagingType || ord.modality}
                    </span>
                  </div>

                  <div className="mt-2 text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {ord.bodyPart} &bull; Urgency: {ord.urgency || 'Routine'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Ordered by: {ord.doctorName} ({ord.orderDate})
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                    <span
                      className={`font-semibold uppercase tracking-wider ${
                        ord.status === 'Reported' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      &bull; {ord.status}
                    </span>
                    <span className="text-sky-600 font-medium">Load in PACS &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: PACS Interactive DICOM Canvas & Diagnostic Reporting (8 cols) */}
        {selectedOrder && (
          <div className="lg:col-span-8 space-y-4">
            {/* PACS DICOM Viewer Window */}
            <div className="bg-black rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
              {/* Viewer Control Bar */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sky-400">
                    {selectedOrder.imagingType || selectedOrder.modality} &mdash; {selectedOrder.bodyPart}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">
                    FOV: 350mm &bull; Matrix: 512x512
                  </span>
                </div>

                {/* DICOM Manipulation Toolbar */}
                <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 20))}
                    className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(60, z - 20))}
                    className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Rotate 90"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsInverted((inv) => !inv)}
                    className={`p-1.5 rounded hover:bg-slate-700 ${
                      isInverted ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Invert Grayscale LUT"
                  >
                    <Contrast className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(100);
                      setRotation(0);
                      setIsInverted(false);
                      setBrightness(100);
                    }}
                    className="px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-white"
                    title="Reset viewport"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* PACS Screen Canvas */}
              <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none">
                {/* On-screen Patient Telemetry Overlay */}
                <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-emerald-400/90 space-y-0.5 pointer-events-none">
                  <p className="font-bold">{selectedOrder.patientName.toUpperCase()}</p>
                  <p className="text-[10px] text-slate-400">ID: {selectedOrder.patientId}</p>
                  <p className="text-[10px] text-slate-400">STUDY: {selectedOrder.id}</p>
                  <p className="text-[10px] text-slate-400">ACQ: {selectedOrder.orderDate}</p>
                </div>

                <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-slate-400 text-right pointer-events-none">
                  <p className="text-sky-400 font-bold">{selectedOrder.imagingType || selectedOrder.modality} SCAN</p>
                  <p>ZOOM: {zoomLevel}%</p>
                  <p>ROT: {rotation}&deg;</p>
                  <p>LUT: {isInverted ? 'INVERTED' : 'STANDARD'}</p>
                </div>

                {/* DICOM Scan Graphic Simulator */}
                <div
                  className="transition-transform duration-200 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    filter: `${isInverted ? 'invert(1)' : ''} brightness(${brightness}%)`,
                  }}
                >
                  <div className="relative w-80 h-80 rounded-xl bg-gradient-to-b from-slate-900 via-slate-800 to-black border border-slate-700/60 shadow-2xl flex flex-col items-center justify-center p-6 text-slate-300">
                    {/* Simulated Anatomical X-Ray Silhouette */}
                    <div className="relative w-64 h-64 border border-slate-700/50 rounded-lg flex flex-col items-center justify-center bg-black/60">
                      {/* Spine / Ribcage Art */}
                      <div className="w-3 h-48 bg-slate-400/80 rounded-full blur-[0.5px]" />
                      <div className="absolute top-12 w-44 h-8 border-t-2 border-slate-300/60 rounded-full" />
                      <div className="absolute top-20 w-48 h-8 border-t-2 border-slate-300/70 rounded-full" />
                      <div className="absolute top-28 w-52 h-8 border-t-2 border-slate-300/80 rounded-full" />
                      <div className="absolute top-36 w-50 h-8 border-t-2 border-slate-300/70 rounded-full" />
                      <div className="absolute top-44 w-44 h-8 border-t-2 border-slate-300/60 rounded-full" />

                      {/* Bilateral Lungs Shade */}
                      <div className="absolute top-10 left-6 w-20 h-32 bg-slate-600/30 rounded-full blur-md" />
                      <div className="absolute top-10 right-6 w-20 h-32 bg-slate-600/30 rounded-full blur-md" />

                      {/* Cardiac Silhouette */}
                      <div className="absolute top-24 left-24 w-16 h-20 bg-slate-300/40 rounded-full blur-xs" />

                      <span className="absolute bottom-2 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                        ANTERIOR - POSTERIOR
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-slate-500 pointer-events-none">
                  INBOX INFOTECH PACS ENTERPRISE &bull; CLINICAL GRADE
                </div>
              </div>
            </div>

            {/* Diagnostic Findings & Radiologist Impression Form */}
            <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-sky-600" />
                  <span>Radiological Report &amp; Impression Chart</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onPrintDocument('radiology', selectedOrder, `Radiology Report #${selectedOrder.id}`)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Scan Report</span>
                  </button>

                  <button
                    onClick={handleSaveReport}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify &amp; Sign Off</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Radiological Findings:
                </label>
                <textarea
                  rows={3}
                  value={findingsText}
                  onChange={(e) => setFindingsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Impression &amp; Clinical Recommendation:
                </label>
                <input
                  type="text"
                  value={impressionText}
                  onChange={(e) => setImpressionText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-sky-700 dark:text-sky-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
