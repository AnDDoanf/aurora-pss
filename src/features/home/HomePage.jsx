import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight, BarChart3, BookOpen, Database, Dumbbell, Search,
  Backpack, ShieldCheck, Sparkles, Wrench
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function HomePage({ onOpenSearch }) {
  const { t, lang } = useTranslation();
  const outletContext = useOutletContext();
  const openSearch = onOpenSearch || outletContext?.onOpenSearch;

  const primaryCards = [
    { title: t('nav.crew'), path: `/${lang}/library/crew`, spriteId: '2993', badge: t('home.crewCount') },
    { title: t('nav.rooms'), path: `/${lang}/library/rooms`, spriteId: '44', badge: t('home.roomCount') },
    { title: t('nav.ships'), path: `/${lang}/library/ships`, spriteId: '3567', badge: t('home.shipCount') },
    { title: t('nav.items'), path: `/${lang}/library/items`, spriteId: '1246', badge: t('home.itemCount') },
    { title: t('home.craftsMissiles'), path: `/${lang}/library/crafts`, spriteId: '1200', badge: t('home.ammunitionCount') },
    { title: t('home.researchTree'), path: `/${lang}/library/research`, spriteId: '2972', badge: t('home.researchCount') }
  ];

  const quickTools = [
    { title: t('nav.guide'), path: `/${lang}/guide`, icon: BookOpen },
    { title: t('layout.training'), path: `/${lang}/tools/training`, icon: Dumbbell },
    { title: t('nav.capacity'), path: `/${lang}/tools/capacity`, icon: BarChart3 },
    { title: t('nav.inventory'), path: `/${lang}/inventory`, icon: Backpack },
    { title: t('nav.tools'), path: `/${lang}/tools/targeting`, icon: Wrench }
  ];

  return (
    <div className="min-w-0 max-w-full space-y-8 overflow-hidden py-2 sm:space-y-10 sm:py-4">
      <section className="hero-banner relative min-w-0 max-w-full overflow-hidden rounded-lg bg-slate-900 px-5 py-8 shadow-sm sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('home.dataFreshnessNotice')}
          </div>
          <h1 className="break-words text-3xl font-black tracking-tight text-slate-100 sm:text-5xl">
            {t('home.brandTitle')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {t('home.subtitle')}
          </p>

          <div className="mx-auto mt-6 max-w-2xl">
            <button
              type="button"
              onClick={openSearch}
              className="group flex w-full items-center justify-between rounded-lg bg-slate-950 px-4 py-4 text-sm text-slate-400 shadow-inner transition-all hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 sm:px-5"
            >
              <span className="flex min-w-0 items-center space-x-3 text-left">
                <Search className="h-5 w-5 shrink-0 text-indigo-400 transition-transform group-hover:scale-110" />
                <span className="font-medium text-slate-300">{t('home.searchPrompt')}</span>
              </span>
              <kbd className="hidden rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-400 sm:inline">Ctrl K</kbd>
            </button>
          </div>
        </div>
      </section>

      <Link
        to={`/${lang}/tools/training`}
        className="home-training-promo group relative grid min-w-0 max-w-full overflow-hidden rounded-lg bg-gradient-to-br from-[#073b63] via-slate-900 to-indigo-950 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)] lg:items-center lg:gap-8"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 bg-cyan-400/10 blur-3xl" />
        <div className="relative min-w-0">
          <div className="home-training-eyebrow mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t('home.trainingEyebrow')}
          </div>
          <div className="flex min-w-0 items-start gap-4">
            <div className="hidden rounded-lg bg-cyan-300/10 p-3 text-cyan-300 sm:block">
              <Dumbbell className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h2 className="home-training-title text-xl font-black text-white transition-colors group-hover:text-cyan-200 sm:text-2xl">
                {t('home.trainingTitle')}
              </h2>
              <p className="home-training-description mt-2 max-w-2xl text-sm leading-relaxed text-cyan-100/65">
                {t('home.trainingDescription')}
              </p>
              <span className="home-training-link mt-4 inline-flex items-center gap-2 text-xs font-black text-cyan-300">
                {t('home.openTraining')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid min-w-0 grid-cols-[repeat(3,minmax(0,1fr))] gap-2 lg:mt-0">
          {[
            [Database, '142', t('home.trainingPrograms')],
            [Dumbbell, '9', t('home.trainableStats')],
            [ShieldCheck, '545', t('home.crewDesigns')]
          ].map(([Icon, value, label]) => (
            <div key={label} className="home-training-stat rounded-lg bg-slate-950/55 p-3 text-center backdrop-blur sm:p-4">
              <Icon className="mx-auto h-4 w-4 text-cyan-300" />
              <div className="home-training-stat-value mt-2 font-mono text-lg font-black text-white sm:text-xl">{value}</div>
              <div className="home-training-stat-label mt-0.5 break-words text-[9px] font-bold uppercase leading-tight tracking-wider text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </Link>

      <section className="space-y-4">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-100">
          {t('home.catalogSection')}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {primaryCards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="group flex items-center justify-between rounded-lg bg-slate-900 p-4 transition-all hover:-translate-y-px hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <SpriteFrame spriteId={card.spriteId} size="md" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-100 transition-colors group-hover:text-indigo-400">
                    {card.title}
                  </h3>
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    {card.badge}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-indigo-400" />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-200">{t('home.toolsSection')}</h2>

        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="group flex min-w-0 items-center justify-between gap-2 rounded-lg bg-slate-900 p-4 shadow-sm transition-all hover:bg-slate-900/80"
              >
                <div className="flex min-w-0 items-center space-x-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span className="min-w-0 break-words text-xs font-bold text-slate-100 transition-colors group-hover:text-indigo-300">
                    {tool.title}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-indigo-400" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
