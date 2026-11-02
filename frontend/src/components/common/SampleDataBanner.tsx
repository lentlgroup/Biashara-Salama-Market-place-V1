import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Database, LoaderCircle, RotateCcw, ShieldCheck, WifiOff } from 'lucide-react';
import { getApiHealth } from '../../api';

type ApiStatus = 'checking' | 'online' | 'offline';

export const SampleDataBanner: React.FC = () => {
  const { t, resetToSampleData, databaseStatus, databaseError } = useApp();
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');

  const checkApi = useCallback(async () => {
    setApiStatus('checking');

    try {
      const health = await getApiHealth();
      setApiStatus(health.status === 'ok' && health.message === 'pong' ? 'online' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  }, []);

  useEffect(() => {
    void checkApi();
  }, [checkApi]);

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>DEMO ENVIRONMENT:</strong> {t.sampleDataNotice}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void checkApi()}
          className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
            apiStatus === 'online'
              ? 'text-emerald-800 bg-emerald-100/70 border-emerald-300'
              : apiStatus === 'offline'
                ? 'text-rose-800 bg-rose-100/70 border-rose-300'
                : 'text-slate-700 bg-slate-100/70 border-slate-300'
          }`}
          title="Check the Laravel API connection again"
        >
          {apiStatus === 'online' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : apiStatus === 'offline' ? (
            <WifiOff className="w-3.5 h-3.5" />
          ) : (
            <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
          )}
          API {apiStatus === 'online' ? 'Connected' : apiStatus === 'offline' ? 'Unavailable' : 'Connecting'}
        </button>
        <span
          className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
            databaseStatus === 'synced'
              ? 'text-emerald-800 bg-emerald-100/70 border-emerald-300'
              : databaseStatus === 'saving' || databaseStatus === 'connecting'
                ? 'text-blue-800 bg-blue-100/70 border-blue-300'
                : 'text-rose-800 bg-rose-100/70 border-rose-300'
          }`}
          title={databaseError || 'Marketplace data is stored in MySQL'}
        >
          {databaseStatus === 'saving' || databaseStatus === 'connecting' ? (
            <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Database className="w-3.5 h-3.5" />
          )}
          MySQL {databaseStatus === 'synced' ? 'Synced' : databaseStatus}
        </span>
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
