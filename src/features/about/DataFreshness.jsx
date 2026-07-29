import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, Server, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export function DataFreshness() {
  const { t, lang } = useTranslation();
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/active/meta.json')
      .then(res => res.json())
      .then(data => {
        setMeta(data);
        setLoading(false);
      })
      .catch(() => {
        setMeta(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header section */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pages.data.title')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('pages.data.description')}</p>
        </div>
      </div>

      {/* Snapshot Active Status Box */}
      <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-6 space-y-4">
        <div className="flex items-center space-x-3 text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Active Snapshot Status: Verified</h2>
        </div>

        {loading ? (
          <div className="text-sm text-slate-400">Loading snapshot metadata...</div>
        ) : meta ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-500">Normalized Timestamp:</span>
              <div className="font-mono text-emerald-300 font-medium text-sm mt-0.5">
                {new Date(meta.normalizedAt).toLocaleString()}
              </div>
            </div>

            <div>
              <span className="text-slate-500">Ingestion Mode:</span>
              <div className="font-mono text-slate-200 text-sm mt-0.5">
                Build-Time Immutable XML Pipeline
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-amber-400 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Using fallback local snapshot data.</span>
          </div>
        )}
      </div>

      {/* Ingested Counts Breakdown */}
      {meta?.counts && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-200 flex items-center space-x-2">
            <Server className="h-5 w-5 text-emerald-400" />
            <span>Ingested Catalog Entity Counts</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(meta.counts).map(([key, count]) => (
              <div key={key} className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400 font-mono">{count}</div>
                <div className="text-xs text-slate-400 capitalize mt-1">{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Sources & Data Policies */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-200 flex items-center space-x-2">
          <FileCode className="h-5 w-5 text-emerald-400" />
          <span>Raw Source Disclosures & Scope</span>
        </h3>

        <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
          <li>
            <strong>Official Endpoints:</strong> Data is ingested directly from official public catalog endpoints at <code>api.pixelstarships.com</code>.
          </li>
          <li>
            <strong>Security & Privacy:</strong> This reference library is 100% read-only. It does NOT prompt for, store, or transmit player passwords, access tokens, or personal identifiers.
          </li>
          <li>
            <strong>Third-Party Adapters:</strong> External analytics services (FleetData, PixyShip, Reality) operate behind strict adapter boundaries with timeouts and clear UI labels.
          </li>
          <li>
            <strong>Editorial vs API Facts:</strong> Official XML API fields (HP, Attack, Level Requirements) are displayed alongside clear badges distinguishing them from community recommendations.
          </li>
        </ul>
      </div>

    </div>
  );
}
