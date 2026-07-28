import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Menu, Moon, Sun, ChevronDown, Users, LayoutGrid, Rocket, Package, Cpu, Award, Dumbbell } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { DirectSearchInput } from '../../features/search/DirectSearchInput';
import { publicUrl } from '../../utils/publicUrl';

export function Header({ onToggleMobileNav, theme, onToggleTheme }) {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'vi' : 'en';
    const newPath = location.pathname.replace(/^\/(en|vi)/, `/${nextLang}`);
    navigate(newPath + location.search);
  };

  const catalogItems = [
    { label: t('nav.crew'), path: `/${lang}/library/crew`, icon: Users, desc: 'Stats, L1-40 scaling, slots' },
    { label: t('nav.rooms'), path: `/${lang}/library/rooms`, icon: LayoutGrid, desc: 'Level chains, power, stats' },
    { label: t('nav.ships'), path: `/${lang}/library/ships`, icon: Rocket, desc: 'Grid masks, repair costs' },
    { label: t('nav.items'), path: `/${lang}/library/items`, icon: Package, desc: 'Enhancements, market data' },
    { label: lang === 'vi' ? 'Máy bay & Tên lửa' : 'Crafts & Missiles', path: `/${lang}/library/crafts`, icon: Rocket, desc: 'Flight speed, damage' },
    { label: lang === 'vi' ? 'Cây nghiên cứu' : 'Research Tree', path: `/${lang}/library/research`, icon: Cpu, desc: 'Prerequisites, costs' },
    { label: lang === 'vi' ? 'Bộ sưu tập & Skins' : 'Collections & Skins', path: `/${lang}/library/collections`, icon: Award, desc: 'Crew rosters, cosmetics' }
  ];

  const isLibraryActive = location.pathname.includes('/library/');

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md text-slate-100 shadow-sm transition-colors">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onToggleMobileNav}
            className="p-2 text-slate-400 hover:text-white lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link to={`/${lang}`} className="flex items-center space-x-2.5">
            <img src={publicUrl('/logo.png')} alt="PSS Library Logo" className="h-8 w-auto object-contain" />
            <span className="font-black text-lg tracking-wider uppercase text-slate-100">
              PSS <span className="text-indigo-500 font-extrabold">Library</span>
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
              <span>{lang === 'vi' ? 'Thư viện Tra cứu' : 'Catalogs'}</span>
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
            to={`/${lang}/compare/crew`}
            className={`px-3 py-2 rounded-lg transition-all ${
              location.pathname.includes('/compare')
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
            }`}
          >
            {t('nav.compare')}
          </Link>

          <Link
            to={`/${lang}/tools/capacity`}
            className={`px-3 py-2 rounded-lg transition-all ${
              location.pathname.includes('/tools/capacity')
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
            }`}
          >
            {lang === 'vi' ? 'Phân Tích Công/Thủ' : 'Capacity Analytics'}
          </Link>

          <Link
            to={`/${lang}/tools/training`}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              location.pathname.includes('/tools/training')
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5" />
            {lang === 'vi' ? 'Huấn luyện' : 'Training'}
          </Link>

          <Link
            to={`/${lang}/tools/targeting`}
            className={`px-3 py-2 rounded-lg transition-all ${
              location.pathname.includes('/tools/targeting')
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-900/60'
            }`}
          >
            {t('nav.tools')}
          </Link>

        </nav>

        {/* Direct Instant Search Input & Controls */}
        <div className="flex items-center space-x-2.5">
          <DirectSearchInput />

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:text-indigo-400 transition-colors"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg bg-slate-900"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-300" />}
          </button>
        </div>

      </div>
    </header>
  );
}
