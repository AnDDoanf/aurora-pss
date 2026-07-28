import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, ShieldCheck, FileText } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export function Footer() {
  const { t, lang } = useTranslation();
  const [snapshotMeta, setSnapshotMeta] = useState(null);

  useEffect(() => {
    fetch('/data/active/meta.json')
      .then(res => res.json())
      .then(data => setSnapshotMeta(data))
      .catch(() => setSnapshotMeta(null));
  }, []);

  return (
    <footer className="border-t border-slate-800/40 bg-slate-950 text-slate-400 text-xs py-5 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2 text-slate-200 font-semibold">
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
          <span>Pixel Starships Reference Library</span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 text-slate-400 font-mono">
            <Database className="h-4 w-4 text-indigo-400" />
            <span>
              {snapshotMeta ? `Snapshot: ${new Date(snapshotMeta.normalizedAt).toLocaleDateString()}` : 'Snapshot Active'}
            </span>
          </div>

          <Link
            to={`/${lang}/about/data`}
            className="flex items-center space-x-1 text-indigo-400 font-bold hover:underline"
          >
            <FileText className="h-4 w-4" />
            <span>{t('nav.aboutData')}</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
