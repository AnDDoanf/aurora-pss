import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, BookOpen } from 'lucide-react';
import { guideGroups, guides } from '../../content/guide/loader';

export function GuideSidebar({ lang }) {
  const location = useLocation();
  const guide = guides[lang] || guides.en;
  const [isOpen, setIsOpen] = useState(false);

  // Find active section for mobile dropdown button header
  const activeSection = guide.sections.find(sec => location.pathname.includes(sec.id));
  const activeTitle = activeSection ? activeSection.title : (lang === 'vi' ? 'Danh mục Cẩm nang' : 'Guide Topics');

  return (
    <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-20">
      <div className="rounded-lg bg-slate-900 p-3 lg:p-4 shadow-sm flex flex-col lg:max-h-[calc(100vh-6rem)]">

        {/* Mobile Dropdown Toggle Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between lg:hidden text-xs font-bold text-slate-100 p-1"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="truncate text-indigo-400 font-extrabold uppercase tracking-wider">{activeTitle}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-indigo-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop Title Header */}
        <div className="hidden lg:block text-indigo-400 text-xs font-black uppercase tracking-wider border-b border-slate-800/40 pb-3 mb-3 shrink-0">
          {lang === 'vi' ? 'Danh mục Cẩm nang' : 'Guide Topics'}
        </div>

        {/* Navigation Area: Hidden on Mobile unless isOpen, Always Visible on Desktop */}
        <nav className={`space-y-4 text-xs overflow-y-auto pr-1.5 flex-1 ${isOpen ? 'block mt-3 pt-3 border-t border-slate-800/40' : 'hidden lg:block'}`}>
          {guideGroups.map((group) => {
            const sectionsInGroup = guide.sections.filter(s => s.group === group);
            if (sectionsInGroup.length === 0) return null;

            return (
              <div key={group} className="space-y-1.5">
                <div className="font-extrabold text-slate-200 px-1 py-0.5 uppercase text-[11px] tracking-wider">
                  {group}
                </div>

                <div className="pl-3 space-y-1 border-l border-slate-800/40">
                  {sectionsInGroup.map((sec) => {
                    const path = `/${lang}/guide/${group.toLowerCase()}/${sec.id}`;
                    const isActive = location.pathname.includes(sec.id);

                    return (
                      <Link
                        key={sec.id}
                        to={path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-2.5 py-1.5 rounded-md transition-all ${isActive
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                          }`}
                      >
                        {sec.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
