import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Menu, Moon, Sun, Search, ChevronDown, Users, LayoutGrid, Rocket, Package, Cpu, Award, Dumbbell, BarChart3, Target, Grid3X3, GitMerge } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { DirectSearchInput } from '../../features/search/DirectSearchInput';
import { publicUrl } from '../../utils/publicUrl';
import { LANGUAGES, replaceLanguageInPath } from '../../i18n/languages';

export function Header({ onOpenSearch, onToggleMobileNav, theme, onToggleTheme }) {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const changeLanguage = (nextLang) => {
    const newPath = replaceLanguageInPath(location.pathname, nextLang);
    navigate(newPath + location.search + location.hash);
  };

  const catalogItems = [
    { label: t('nav.crew'), path: `/${lang}/library/crew`, icon: Users, desc: t('layout.crewDesc') },
    { label: t('nav.rooms'), path: `/${lang}/library/rooms`, icon: LayoutGrid, desc: t('layout.roomDesc') },
    { label: t('nav.ships'), path: `/${lang}/library/ships`, icon: Rocket, desc: t('layout.shipDesc') },
    { label: t('nav.items'), path: `/${lang}/library/items`, icon: Package, desc: t('layout.itemDesc') },
    { label: t('layout.craftsMissiles'), path: `/${lang}/library/crafts`, icon: Rocket, desc: t('layout.craftDesc') },
    { label: t('layout.researchTree'), path: `/${lang}/library/research`, icon: Cpu, desc: t('layout.researchDesc') },
    { label: t('layout.collectionsSkins'), path: `/${lang}/library/collections`, icon: Award, desc: t('layout.collectionDesc') }
  ];
  const toolItems = [
    {
      label: t('layout.prestige'),
      path: `/${lang}/tools/prestige`,
      icon: GitMerge,
      desc: t('layout.prestigeDesc')
    },
    {
      label: t('nav.shipBuilder'),
      path: `/${lang}/tools/ship-builder`,
      icon: Grid3X3,
      desc: t('layout.shipBuilderDesc')
    },
    {
      label: t('nav.capacity'),
      path: `/${lang}/tools/capacity`,
      icon: BarChart3,
      desc: t('layout.capacityDesc')
    },
    {
      label: t('layout.training'),
      path: `/${lang}/tools/training`,
      icon: Dumbbell,
      desc: t('layout.trainingDesc')
    },
    {
      label: t('layout.targeting'),
      path: `/${lang}/tools/targeting`,
      icon: Target,
      desc: t('layout.targetingDesc')
    },
    {
      label: t('layout.fleetIntelligence'),
      path: `/${lang}/tools/fleet`,
      icon: Users,
      desc: t('layout.fleetIntelligenceDesc')
    },
    {
      label: t('layout.playerIntelligence'),
      path: `/${lang}/tools/player`,
      icon: Target,
      desc: t('layout.playerIntelligenceDesc')
    }
  ];

  const isLibraryActive = location.pathname.includes('/library/');
  const isToolsActive = location.pathname.includes('/tools/');

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md text-slate-100 shadow-sm transition-colors">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-2 px-2 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-3">
          <button 
            onClick={onToggleMobileNav}
            className="shrink-0 p-2 text-slate-400 hover:text-white lg:hidden"
            aria-label={t('layout.openMenu')}
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <Link to={`/${lang}`} className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            <img src={publicUrl('/logo.png')} alt="PSS Library Logo" className="h-7 w-auto shrink-0 object-contain sm:h-8" />
            <span className="hidden whitespace-nowrap text-sm font-black uppercase leading-none tracking-wide text-slate-100 min-[360px]:inline sm:text-lg sm:tracking-wider">
              PSS <span className="font-extrabold text-indigo-500">Aurōra</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold">
          
          <Link
            to={`/${lang}/guide`}
            className={`px-3 py-2 rounded-lg transition-all ${
              location.pathname.includes('/guide')
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
            }`}
          >
            {t('nav.guide')}
          </Link>

          {/* Hover Catalogs Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCatalogOpen(true)}
            onMouseLeave={() => setIsCatalogOpen(false)}
          >
            <button
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                isLibraryActive || isCatalogOpen
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
              }`}
            >
              <span>{t('layout.catalogs')}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isCatalogOpen && (
              <div className="absolute left-0 top-full pt-1 w-80 z-50">
                <div className="rounded-lg bg-slate-950 p-2 shadow-2xl grid grid-cols-1 gap-1 border border-slate-800/40">
                  {catalogItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsCatalogOpen(false)}
                        className={`dropdown-item flex items-start space-x-3 p-2.5 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-indigo-600 text-white font-bold' 
                            : 'text-slate-300 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        <div className="p-2 rounded-md bg-indigo-950/60 text-indigo-400 mt-0.5 shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to={`/${lang}/inventory`}
            className={`px-3 py-2 rounded-lg transition-all ${
              location.pathname.includes('/inventory')
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
            }`}
          >
            {t('nav.inventory')}
          </Link>

          {/* Hover Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsToolsOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={isToolsOpen}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                isToolsActive || isToolsOpen
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
              }`}
            >
              <span>{t('nav.tools')}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsOpen && (
              <div className="absolute right-0 top-full z-50 w-72 pt-1">
                <div role="menu" className="grid grid-cols-1 gap-1 rounded-lg border border-slate-800/40 bg-slate-950 p-2 shadow-2xl">
                  {toolItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        role="menuitem"
                        onClick={() => setIsToolsOpen(false)}
                        className={`dropdown-item flex items-start space-x-3 rounded-lg p-2.5 transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 rounded-md bg-indigo-950/60 p-2 text-indigo-400">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="mt-0.5 text-[10px] opacity-80">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Direct Instant Search Input & Controls */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-2.5">
          <div className="hidden sm:block">
            <DirectSearchInput />
          </div>

          <button
            type="button"
            onClick={onOpenSearch}
            className="rounded-lg bg-slate-900 p-2 text-indigo-400 transition-colors hover:text-white sm:hidden"
            aria-label={t('nav.searchPlaceholder')}
          >
            <Search className="h-4 w-4" />
          </button>

          <label className="relative flex shrink-0 items-center rounded-lg bg-slate-900 text-xs font-bold text-slate-200" title={t('layout.switchLanguage')}>
            <Globe className="pointer-events-none absolute left-2 hidden h-3.5 w-3.5 text-indigo-400 min-[360px]:block" />
            <span className="sr-only">{t('layout.switchLanguage')}</span>
            <select value={lang} onChange={(event) => changeLanguage(event.target.value)} className="max-w-[5.25rem] cursor-pointer appearance-none rounded-lg bg-transparent py-2 pl-2 pr-2 text-xs font-bold text-slate-200 outline-none hover:text-indigo-400 min-[360px]:pl-7 sm:max-w-[8rem]">
              {LANGUAGES.map((language) => <option key={language.code} value={language.code} className="bg-slate-900 text-slate-100">{language.label}</option>)}
            </select>
          </label>

          <button
            onClick={onToggleTheme}
            className="shrink-0 rounded-lg bg-slate-900 p-2 text-slate-400 transition-colors hover:text-indigo-400"
            aria-label={t('layout.toggleTheme')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-300" />}
          </button>
        </div>

      </div>
    </header>
  );
}
