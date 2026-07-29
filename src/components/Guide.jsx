import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Search, ArrowRight, ArrowLeft, SlidersHorizontal, Clock, ChevronDown, X } from 'lucide-react';
import { guides } from '../content/guide/loader';
import { useTranslation } from '../i18n/useTranslation';
import { GuideSidebar } from '../features/guide/GuideSidebar';
import { GuideToc } from '../features/guide/GuideToc';
import { publicUrl } from '../utils/publicUrl';

const RECENT_READS_KEY = 'pss_guide_recent_reads';

function getRecentReads() {
  try {
    const raw = localStorage.getItem(RECENT_READS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentRead(sec, lang) {
  if (!sec) return;
  try {
    const history = getRecentReads();
    const filtered = history.filter(item => item.id !== sec.id || item.lang !== lang);
    const newItem = {
      id: sec.id,
      group: sec.group,
      title: sec.title,
      level: sec.level,
      path: `/${lang}/guide/${sec.group.toLowerCase()}/${sec.id}`,
      readAt: Date.now(),
      lang
    };
    const updated = [newItem, ...filtered].slice(0, 10);
    localStorage.setItem(RECENT_READS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save recent read:', err);
  }
}

const levelWeight = {
  beginner: 1,
  intermediate: 2,
  advanced: 3
};

const renderLevelBadge = (level, lang) => {
  const isVi = lang === 'vi';
  switch (level) {
    case 'intermediate':
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300">
          {isVi ? 'Trung cấp' : 'Intermediate'}
        </span>
      );
    case 'advanced':
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300">
          {isVi ? 'Nâng cao' : 'Advanced'}
        </span>
      );
    default:
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300">
          {isVi ? 'Sơ cấp' : 'Beginner'}
        </span>
      );
  }
};

export default function Guide() {
  const { lang = 'vi' } = useParams();
  const { t } = useTranslation();
  const location = useLocation();

  const guide = guides[lang] || guides.vi;
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];

  const isGuideRoot = !lastPart || lastPart === 'guide';

  const [recentReads, setRecentReads] = useState(() => getRecentReads());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Find explicit section by URL id
  let matchedSection = guide.sections.find(s => s.id === lastPart);

  // If user is accessing /guide root without doc ID, auto-resolve to latest read or very first doc
  if (isGuideRoot || !matchedSection) {
    const latestRead = recentReads.find(item => item.lang === lang) || recentReads[0];
    if (latestRead) {
      const foundInCurrentGuide = guide.sections.find(s => s.id === latestRead.id);
      if (foundInCurrentGuide) {
        matchedSection = foundInCurrentGuide;
      }
    }
    if (!matchedSection) {
      matchedSection = guide.sections[0];
    }
  }

  const currentSection = matchedSection;

  useEffect(() => {
    if (currentSection) {
      saveRecentRead(currentSection, lang);
      setRecentReads(getRecentReads());
    }
  }, [currentSection?.id, lang]);

  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('order');

  const currentIndex = guide.sections.findIndex(s => s.id === currentSection?.id);
  const prevSection = currentIndex > 0 ? guide.sections[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < guide.sections.length - 1 ? guide.sections[currentIndex + 1] : null;

  const filteredSections = useMemo(() => {
    let list = guide.sections.filter(s => {
      const matchSearch = !search.trim() || 
        s.title.toLowerCase().includes(search.toLowerCase()) || 
        s.content.toLowerCase().includes(search.toLowerCase());

      const matchLevel = selectedLevel === 'ALL' || s.level === selectedLevel;

      return matchSearch && matchLevel;
    });

    if (sortBy === 'level-asc') {
      list = [...list].sort((a, b) => (levelWeight[a.level] || 1) - (levelWeight[b.level] || 1));
    } else if (sortBy === 'level-desc') {
      list = [...list].sort((a, b) => (levelWeight[b.level] || 1) - (levelWeight[a.level] || 1));
    }

    return list;
  }, [guide.sections, search, selectedLevel, sortBy]);

  return (
    <div className="space-y-8 pb-20 w-full">
      
      {/* Header Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {guide.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('pages.guide.description')}
          </p>
        </div>

        {/* Search Input & Recent Reads Dropdown */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('home.searchPrompt')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* Recent Reads Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:text-indigo-400 transition-colors shadow-sm border border-slate-800/40"
              title={lang === 'vi' ? 'Lịch sử đọc' : 'Recent Reads'}
            >
              <Clock className="h-4 w-4 text-indigo-400" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Bài đọc gần đây' : 'Recent Reads'}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isHistoryOpen && (
              <div className="absolute right-0 top-full pt-2 w-72 sm:w-80 z-50">
                <div className="rounded-lg bg-slate-950 p-3 shadow-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
                    <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                      {lang === 'vi' ? 'Bài đọc gần đây' : 'Recent Reads'}
                    </span>
                    <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {recentReads.length > 0 ? (
                      recentReads.map(item => (
                        <Link
                          key={`${item.id}-${item.readAt}`}
                          to={item.path}
                          onClick={() => setIsHistoryOpen(false)}
                          className="block p-2 rounded-md hover:bg-slate-900 transition-all text-xs group border-b border-slate-900/50 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono">{item.group}</span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(item.readAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="font-bold text-slate-200 group-hover:text-indigo-300 transition-colors mt-0.5 truncate">
                            {item.title}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        {lang === 'vi' ? 'Chưa có lịch sử đọc bài viết nào.' : 'No recent reading history.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout with Fixed Left Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* Left Sticky Topic Navigation Sidebar */}
        <GuideSidebar lang={lang} />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-8">
          
          {currentSection ? (
            /* Document Reading View */
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              
              <article className="flex-1 min-w-0 rounded-lg bg-slate-900 p-6 sm:p-10 space-y-6 shadow-sm">
                
                {/* Article Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950/80">
                      {currentSection.group}
                    </span>
                    <span className="text-xs text-slate-400">/</span>
                    <span className="text-xs font-bold text-slate-300">{currentSection.title}</span>
                  </div>

                  {renderLevelBadge(currentSection.level, lang)}
                </div>

                {/* Article Header Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                  {currentSection.title}
                </h1>

                {/* Markdown Content */}
                <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-8 mb-4 border-b border-slate-800/40 pb-2" {...props} />,
                      h2: ({node, ...props}) => <h3 className="text-lg sm:text-xl font-bold text-indigo-300 mt-6 mb-3" {...props} />,
                      h3: ({node, ...props}) => <h4 className="text-base sm:text-lg font-bold text-slate-200 mt-4 mb-2" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline 
                          ? <code className="bg-slate-950 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                          : <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-slate-800/40 my-4" {...props} />,
                      a: ({node, ...props}) => <a className="text-indigo-400 hover:underline font-bold" {...props} />,
                      img: ({node, src, ...props}) => <img src={publicUrl(src)} {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-1 my-3" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-1 my-3" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-400 my-4 bg-slate-950/40 py-2 rounded-r" {...props} />
                    }}
                  >
                    {currentSection.content}
                  </ReactMarkdown>
                </div>

                {/* Footer Prev/Next Buttons */}
                <div className="pt-8 border-t border-slate-800/40 flex items-center justify-between gap-4 text-xs font-bold">
                  {prevSection ? (
                    <Link
                      to={`/${lang}/guide/${prevSection.group.toLowerCase()}/${prevSection.id}`}
                      className="flex items-center space-x-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                    >
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <span>{prevSection.title}</span>
                    </Link>
                  ) : <div />}

                  {nextSection ? (
                    <Link
                      to={`/${lang}/guide/${nextSection.group.toLowerCase()}/${nextSection.id}`}
                      className="flex items-center space-x-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                    >
                      <span>{nextSection.title}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : <div />}
                </div>

              </article>

              {/* Table of Contents Scroll-Spy */}
              <GuideToc content={currentSection.content} />
            </div>
          ) : (
            /* Fallback View */
            <div className="p-8 text-center text-slate-400">
              No document found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
