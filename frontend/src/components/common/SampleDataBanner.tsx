import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';

export const SampleDataBanner: React.FC = () => {
  const { t, resetToSampleData } = useApp();

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>DEMO ENVIRONMENT:</strong> {t.sampleDataNotice}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1 text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" /> No Merchant Funds Flow (MVP Rule Enforced)
        </span>
        <button
          onClick={resetToSampleData}
          className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 font-medium hover:underline text-[11px]"
          title="Reset database to initial sample records"
        >
          <RotateCcw className="w-3 h-3" /> Reset Sample Data
        </button>
      </div>
    </div>
  );
};
