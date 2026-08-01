import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { Footer } from './Footer';
import { SearchModal } from '../../features/search/SearchModal';
import { SEOHead } from '../../components/SEOHead';

export function AppLayout() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('pss_theme') || 'dark');

  // Sync theme changes to html and body DOM elements
  useEffect(() => {
    localStorage.setItem('pss_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.add('light-mode');
    }
  }, [theme]);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isEmbedded = new URLSearchParams(window.location.search).get('embed') === 'true';
  const isTrainingTool = location.pathname.includes('/tools/training');
  const isShipBuilder = location.pathname.includes('/tools/ship-builder');

  if (isEmbedded) {
    return (
      <div className={`min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <main className="flex-1 w-full mx-auto px-4 py-4">
          <Outlet context={{ onOpenSearch: () => setIsSearchOpen(true) }} />
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <SEOHead />
      <Header 
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileNav={() => setIsMobileNavOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <MobileDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <main className={`flex-1 w-full min-w-0 mx-auto ${isShipBuilder ? 'max-w-none px-2 sm:px-3' : 'max-w-[1600px] px-3 sm:px-6 lg:px-8'} ${
        isTrainingTool ? 'py-4 sm:py-6 xl:h-[calc(100dvh-7.75rem)] xl:flex-none xl:overflow-hidden' : 'py-4 sm:py-6'
      }`}>
        <Outlet context={{ onOpenSearch: () => setIsSearchOpen(true) }} />
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
