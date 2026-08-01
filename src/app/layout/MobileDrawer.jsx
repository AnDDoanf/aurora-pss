import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Award, Backpack, BarChart3, BookOpen, Cpu, Database, Dumbbell,
  ChevronDown, Grid3X3, LayoutGrid, Package, Rocket, Target, Users, X
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export function MobileDrawer({ isOpen, onClose }) {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const [isCatalogOpen, setIsCatalogOpen] = useState(() => location.pathname.includes('/library/'));

  if (!isOpen) return null;

  const catalogLinks = [
    { label: t('nav.crew'), path: `/${lang}/library/crew`, icon: Users },
    { label: t('nav.rooms'), path: `/${lang}/library/rooms`, icon: LayoutGrid },
    { label: t('nav.ships'), path: `/${lang}/library/ships`, icon: Rocket },
    { label: t('nav.items'), path: `/${lang}/library/items`, icon: Package },
    { label: t('layout.craftsMissiles'), path: `/${lang}/library/crafts`, icon: Rocket },
    { label: t('layout.researchTree'), path: `/${lang}/library/research`, icon: Cpu },
    { label: t('layout.collectionsSkins'), path: `/${lang}/library/collections`, icon: Award }
  ];

  const toolLinks = [
    { label: t('nav.shipBuilder'), path: `/${lang}/tools/ship-builder`, icon: Grid3X3 },
    { label: t('nav.capacity'), path: `/${lang}/tools/capacity`, icon: BarChart3 },
    { label: t('layout.training'), path: `/${lang}/tools/training`, icon: Dumbbell },
    { label: t('layout.targeting'), path: `/${lang}/tools/targeting`, icon: Target },
    { label: t('layout.fleetIntelligence'), path: `/${lang}/tools/fleet`, icon: Users },
    { label: t('layout.playerIntelligence'), path: `/${lang}/tools/player`, icon: Target }
  ];

  const renderLink = (link, nested = false) => {
    const Icon = link.icon;
    const isActive = location.pathname.startsWith(link.path);

    return (
      <Link
        key={link.path}
        to={link.path}
        onClick={onClose}
        className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          nested ? 'ml-2' : ''
        } ${
          isActive
            ? 'bg-indigo-950/60 text-indigo-400 font-semibold'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon className="h-5 w-5 shrink-0 text-indigo-400" />
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <div className="mobile-drawer fixed inset-0 z-50 flex isolate lg:hidden">
      <div
        className="mobile-drawer-backdrop fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="mobile-drawer-panel relative z-10 flex h-[100dvh] w-[86%] max-w-xs flex-1 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={t('layout.libraryMenu')}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <span className="font-bold text-lg text-indigo-600 uppercase tracking-wider">{t('layout.libraryMenu')}</span>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white" aria-label={t('layout.closeMenu')}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:mt-6">
          {renderLink({ label: t('nav.guide'), path: `/${lang}/guide`, icon: BookOpen })}

          <section className="space-y-1">
            <button
              type="button"
              onClick={() => setIsCatalogOpen((open) => !open)}
              aria-expanded={isCatalogOpen}
              aria-controls="mobile-catalog-links"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname.includes('/library/')
                  ? 'bg-indigo-950/60 text-indigo-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-5 w-5 shrink-0 text-indigo-400" />
              <span>{t('layout.catalogs')}</span>
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              id="mobile-catalog-links"
              aria-hidden={!isCatalogOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                isCatalogOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-1 border-l border-slate-800 pl-1">
                  {catalogLinks.map((link) => renderLink(link, true))}
                </div>
              </div>
            </div>
          </section>

          {renderLink({ label: t('nav.inventory'), path: `/${lang}/inventory`, icon: Backpack })}
          {toolLinks.map((link) => renderLink(link))}

          <div className="border-t border-slate-800 pt-3">
            {renderLink({ label: t('nav.aboutData'), path: `/${lang}/about/data`, icon: Database })}
          </div>
        </nav>
      </div>
    </div>
  );
}
