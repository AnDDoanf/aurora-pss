import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Sparkles, Palette } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function SkinCatalog() {
  const { t } = useTranslation();
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/active/skins.json')
      .then(res => res.json())
      .then(data => {
        setSkins(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setSkins([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Skins & Cosmetic Sets Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">
          Catalog of ship, room, and crew cosmetic skins and skin set relationships.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skins.length > 0 ? (
          skins.map((skin, idx) => (
            <div key={skin.SkinId || idx} className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <SpriteFrame spriteId={skin.SpriteId} size="md" />
                <div>
                  <div className="font-bold text-slate-100">{skin.SkinName || `Skin #${skin.SkinId}`}</div>
                  <div className="text-[10px] text-slate-400">ID: {skin.SkinId}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-xs text-slate-500 rounded-xl border border-slate-800 bg-slate-900">
            No active cosmetic skins catalog entries found.
          </div>
        )}
      </div>
    </div>
  );
}
