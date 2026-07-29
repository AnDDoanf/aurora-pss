import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, BookOpen, Users, LayoutGrid, Rocket, Package, ArrowLeftRight, Wrench, Database, Dumbbell } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export function MobileDrawer({ isOpen, onClose }) {
  const { t, lang } = useTranslation();
  const location = useLocation();

  if (!isOpen) return null;

  const links = [
    { label: t('nav.guide'), path: `/${lang}/guide`, icon: BookOpen },
    { label: t('nav.crew'), path: `/${lang}/library/crew`, icon: Users },
    { label: t('nav.rooms'), path: `/${lang}/library/rooms`, icon: LayoutGrid },
    { label: t('nav.ships'), path: `/${lang}/library/ships`, icon: Rocket },
    { label: t('nav.items'), path: `/${lang}/library/items`, icon: Package },
    { label: t('nav.compare'), path: `/${lang}/compare/crew`, icon: ArrowLeftRight },
    { label: t('nav.capacity'), path: `/${lang}/tools/capacity`, icon: Wrench },
    { label: t('layout.training'), path: `/${lang}/tools/training`, icon: Dumbbell },
    { label: t('nav.tools'), path: `/${lang}/tools/targeting`, icon: Wrench },
    { label: t('nav.aboutData'), path: `/${lang}/about/data`, icon: Database }
  ];

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex h-[100dvh] w-[86%] max-w-xs flex-1 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900 p-4 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <span className="font-bold text-lg text-emerald-400 uppercase tracking-wider">{t('layout.libraryMenu')}</span>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 flex flex-col space-y-1.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:mt-6 sm:space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-950/60 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 text-emerald-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
