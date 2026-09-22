import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { useToast } from '../../context/ToastContext';
import { MedicineItem, MedicineCategory } from '../../types/hms';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  Package,
  Layers,
  Calendar,
  X,
  TrendingDown,
  DollarSign
} from 'lucide-react';

export const PharmacyModule: React.FC = () => {
  const { medicines, updateMedicineStock } = useHMS();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [activeAdjustMed, setActiveAdjustMed] = useState<MedicineItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(50);

  const categories: string[] = [
    'Antibiotics',
    'Analgesics',
    'Cardiovascular',
    'Antidiabetic',
    'Respiratory',
    'Gastrointestinal',
    'Psychiatric',
    'Vitamins & Supplements',
  ];

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || m.stockQuantity <= (m.minStockAlert || m.minStockLevel || 10);

    return matchesSearch && matchesCat && matchesLowStock;
  });

  const lowStockCount = medicines.filter((m) => m.stockQuantity <= (m.minStockAlert || m.minStockLevel || 10)).length;
  const totalStockValue = medicines.reduce((sum, m) => sum + m.stockQuantity * (m.unitPrice || m.sellingPrice || 0), 0);

  const handleStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdjustMed) return;

    const newQty = activeAdjustMed.stockQuantity + Number(adjustAmount);
    updateMedicineStock(activeAdjustMed.id, Math.max(0, newQty));

    showToast({
      type: 'success',
      title: 'Inventory Restocked',
      message: `${activeAdjustMed.name} stock updated to ${Math.max(0, newQty)} units.`,
    });

    setActiveAdjustMed(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Pill className="w-6 h-6 text-sky-600" />
            <span>Pharmacy &amp; Formulary Inventory Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Prescription dispensary, batch expiry tracking, reorder thresholds, and drug database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Asset Valuation</span>
            <p className="text-base font-bold font-mono text-emerald-600">
              ${totalStockValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">Total SKUs in Formulary</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {medicines.length} Medicines
            </p>
          </div>
          <Package className="w-6 h-6 text-sky-600 opacity-80" />
        </div>

        <div
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`p-4 rounded-xl border shadow-xs flex items-center justify-between cursor-pointer transition-all ${
            showLowStockOnly
              ? 'bg-rose-500 text-white border-rose-600'
              : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div>
            <p className={showLowStockOnly ? 'text-white/80' : 'text-slate-400'}>
              Low Stock Warnings
            </p>
            <p
              className={`text-2xl font-bold mt-0.5 ${
                showLowStockOnly ? 'text-white' : 'text-rose-600'
              }`}
            >
              {lowStockCount} Items Below Threshold
            </p>
          </div>
          <AlertTriangle
            className={`w-6 h-6 ${showLowStockOnly ? 'text-white' : 'text-rose-600'}`}
          />
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-medium">Expiring within 90 Days</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">3 Batches</p>
          </div>
          <Calendar className="w-6 h-6 text-amber-600 opacity-80" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicine by name, generic, manufacturer, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-hidden font-medium"
          >
            <option value="all">All Drug Classes</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Drug / Brand Name</th>
                <th className="py-3 px-4">Generic Composition</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Batch &amp; Expiry</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredMedicines.map((med) => {
                const isLow = med.stockQuantity <= (med.minStockAlert || med.minStockLevel || 10);

                return (
                  <tr
                    key={med.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {med.name}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{med.id}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {med.genericName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {med.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div>{med.batchNumber}</div>
                      <div className="text-[10px] text-slate-400">Exp: {med.expiryDate}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      ${(med.unitPrice || med.sellingPrice || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isLow ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {med.stockQuantity}
                        </span>
                        {isLow && (
                          <span className="text-[9px] font-bold text-rose-600 uppercase flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Reorder
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveAdjustMed(med)}
                        className="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 font-semibold text-[11px]"
                      >
                        Adjust / Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {activeAdjustMed && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveAdjustMed(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">{activeAdjustMed.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {activeAdjustMed.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveAdjustMed(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-slate-600 dark:text-slate-400">
              <p>Current Quantity in Dispensary: <span className="font-bold text-slate-900 dark:text-slate-100">{activeAdjustMed.stockQuantity}</span></p>
              <p>Batch: <span className="font-mono">{activeAdjustMed.batchNumber}</span></p>
            </div>

            <form onSubmit={handleStockAdjust} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity Adjustment (positive to add, negative to deduct)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveAdjustMed(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
