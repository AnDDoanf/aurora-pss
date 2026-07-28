import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Target, Wrench } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function HomePage({ onOpenSearch }) {
  const { t, lang } = useTranslation();

  const primaryCards = [
    { title: t('nav.crew'), path: `/${lang}/library/crew`, spriteId: '1', badge: '545 Crew' },
    { title: t('nav.rooms'), path: `/${lang}/library/rooms`, spriteId: '39', badge: '128 Groups' },
    { title: t('nav.ships'), path: `/${lang}/library/ships`, spriteId: '10', badge: '423 Ships' },
    { title: t('nav.items'), path: `/${lang}/library/items`, spriteId: '100', badge: '2,556 Items' },
    { title: 'Crafts & Missiles', path: `/${lang}/library/crafts`, spriteId: '1200', badge: '474 Ammunition' },
    { title: 'Research Tech Tree', path: `/${lang}/library/research`, spriteId: '200', badge: '322 Techs' }
  ];

  const quickTools = [
    { title: t('nav.guide'), path: `/${lang}/guide`, icon: BookOpen },
    { title: lang === 'vi' ? 'Phân Tích Công/Thủ' : 'Capacity Analytics', path: `/${lang}/tools/capacity`, icon: Target },
    { title: t('nav.compare'), path: `/${lang}/compare/crew`, icon: Target },
    { title: t('nav.tools'), path: `/${lang}/tools/targeting`, icon: Wrench }
  ];

  return (
    <div className="space-y-8 py-4">
      
      {/* Hero section */}
      <div className="hero-banner rounded-lg bg-slate-900 p-6 sm:p-10 text-center space-y-4 shadow-sm">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight max-w-4xl mx-auto">
          Pixel Starships <span className="text-indigo-400">Library</span>
        </h1>

        {/* Global Search hero button */}
        <div className="pt-2 max-w-xl mx-auto">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between rounded-lg bg-slate-950 px-5 py-3.5 text-sm text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
          >
            <div className="flex items-center space-x-3">
              <Search className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-slate-300">{t('home.searchPrompt')}</span>
            </div>
            <kbd className="hidden sm:inline rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">Ctrl K</kbd>
          </button>
        </div>
      </div>

      {/* Primary Catalog Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">
          Thư Viện Tra Cứu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {primaryCards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="rounded-lg bg-slate-900 p-4 flex items-center justify-between transition-all hover:translate-y-[-1px] hover:shadow-md group"
            >
              <div className="flex items-center space-x-3">
                <SpriteFrame spriteId={card.spriteId} size="md" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <span className="text-[11px] font-bold font-mono text-slate-400">
                    {card.badge}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Tools Section */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-200">Công Cụ Tác Chiến</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickTools.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="rounded-lg bg-slate-900 p-4 hover:bg-slate-900/80 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="h-4 w-4 text-indigo-400" />
                  <span className="font-bold text-xs text-slate-100 group-hover:text-indigo-300 transition-colors">{tool.title}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
