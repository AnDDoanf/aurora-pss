import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { HomePage } from '../../features/home/HomePage';
import { DataFreshness } from '../../features/about/DataFreshness';

// Route-level Code Splitting via React.lazy
const CrewCatalog = lazy(() => import('../../features/crew/CrewCatalog').then(m => ({ default: m.CrewCatalog })));
const CrewDetail = lazy(() => import('../../features/crew/CrewDetail').then(m => ({ default: m.CrewDetail })));
const RoomCatalog = lazy(() => import('../../features/rooms/RoomCatalog').then(m => ({ default: m.RoomCatalog })));
const RoomDetail = lazy(() => import('../../features/rooms/RoomDetail').then(m => ({ default: m.RoomDetail })));
const ShipCatalog = lazy(() => import('../../features/ships/ShipCatalog').then(m => ({ default: m.ShipCatalog })));
const ShipDetail = lazy(() => import('../../features/ships/ShipDetail').then(m => ({ default: m.ShipDetail })));
const ItemCatalog = lazy(() => import('../../features/items/ItemCatalog').then(m => ({ default: m.ItemCatalog })));
const ItemDetail = lazy(() => import('../../features/items/ItemDetail').then(m => ({ default: m.ItemDetail })));
const CraftCatalog = lazy(() => import('../../features/crafts/CraftCatalog').then(m => ({ default: m.CraftCatalog })));
const CraftDetail = lazy(() => import('../../features/crafts/CraftDetail').then(m => ({ default: m.CraftDetail })));
const MissileCatalog = lazy(() => import('../../features/missiles/MissileCatalog').then(m => ({ default: m.MissileCatalog })));
const MissileDetail = lazy(() => import('../../features/missiles/MissileDetail').then(m => ({ default: m.MissileDetail })));
const ResearchCatalog = lazy(() => import('../../features/research/ResearchCatalog').then(m => ({ default: m.ResearchCatalog })));
const ResearchDetail = lazy(() => import('../../features/research/ResearchDetail').then(m => ({ default: m.ResearchDetail })));
const MissionCatalog = lazy(() => import('../../features/missions/MissionCatalog').then(m => ({ default: m.MissionCatalog })));
const MissionDetail = lazy(() => import('../../features/missions/MissionDetail').then(m => ({ default: m.MissionDetail })));
const CollectionCatalog = lazy(() => import('../../features/collections/CollectionCatalog').then(m => ({ default: m.CollectionCatalog })));
const SkinCatalog = lazy(() => import('../../features/skins/SkinCatalog').then(m => ({ default: m.SkinCatalog })));
const CompareWorkspace = lazy(() => import('../../features/compare/CompareWorkspace').then(m => ({ default: m.CompareWorkspace })));
const InventoryPage = lazy(() => import('../../features/inventory/InventoryPage').then(m => ({ default: m.InventoryPage })));

const Guide = lazy(() => import('../../components/Guide'));
const StarTargeting = lazy(() => import('../../components/StarTargeting'));
const SmartAdvisor = lazy(() => import('../../components/SmartAdvisor'));
const Tournaments = lazy(() => import('../../components/Tournaments'));
const MarketAnalytics = lazy(() => import('../../components/MarketAnalytics'));
const ShipCapacityAnalytics = lazy(() => import('../../features/tools/ShipCapacityAnalytics').then(m => ({ default: m.ShipCapacityAnalytics })));
const TrainingTool = lazy(() => import('../../features/training/TrainingTool').then(m => ({ default: m.TrainingTool })));
const ShipBuilderPage = lazy(() => import('../../features/shipBuilder/ShipBuilderPage').then(m => ({ default: m.ShipBuilderPage })));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-12 text-xs text-slate-400 font-mono animate-pulse">
      Loading view chunk...
    </div>
  );
}

function LanguageGuard() {
  const { lang } = useParams();
  if (lang !== 'en' && lang !== 'vi') {
    return <Navigate to="/vi" replace />;
  }
  return <Outlet />;
}

function CrewInventoryRedirect() {
  const { lang } = useParams();
  const { search } = useLocation();
  return <Navigate to={`/${lang}/inventory${search}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/vi" replace />
  },
  {
    path: '/:lang',
    element: <LanguageGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />
          },
          {
            path: 'guide/*',
            element: <Suspense fallback={<LoadingFallback />}><Guide /></Suspense>
          },
          {
            path: 'library/crew',
            element: <Suspense fallback={<LoadingFallback />}><CrewCatalog /></Suspense>
          },
          {
            path: 'library/crew/:id',
            element: <Suspense fallback={<LoadingFallback />}><CrewDetail /></Suspense>
          },
          {
            path: 'library/rooms',
            element: <Suspense fallback={<LoadingFallback />}><RoomCatalog /></Suspense>
          },
          {
            path: 'library/rooms/:id',
            element: <Suspense fallback={<LoadingFallback />}><RoomDetail /></Suspense>
          },
          {
            path: 'library/ships',
            element: <Suspense fallback={<LoadingFallback />}><ShipCatalog /></Suspense>
          },
          {
            path: 'library/ships/:id',
            element: <Suspense fallback={<LoadingFallback />}><ShipDetail /></Suspense>
          },
          {
            path: 'library/items',
            element: <Suspense fallback={<LoadingFallback />}><ItemCatalog /></Suspense>
          },
          {
            path: 'library/items/:id',
            element: <Suspense fallback={<LoadingFallback />}><ItemDetail /></Suspense>
          },
          {
            path: 'library/crafts',
            element: <Suspense fallback={<LoadingFallback />}><CraftCatalog /></Suspense>
          },
          {
            path: 'library/crafts/:id',
            element: <Suspense fallback={<LoadingFallback />}><CraftDetail /></Suspense>
          },
          {
            path: 'library/missiles',
            element: <Suspense fallback={<LoadingFallback />}><MissileCatalog /></Suspense>
          },
          {
            path: 'library/missiles/:id',
            element: <Suspense fallback={<LoadingFallback />}><MissileDetail /></Suspense>
          },
          {
            path: 'library/research',
            element: <Suspense fallback={<LoadingFallback />}><ResearchCatalog /></Suspense>
          },
          {
            path: 'library/research/:id',
            element: <Suspense fallback={<LoadingFallback />}><ResearchDetail /></Suspense>
          },
          {
            path: 'library/missions',
            element: <Suspense fallback={<LoadingFallback />}><MissionCatalog /></Suspense>
          },
          {
            path: 'library/missions/:id',
            element: <Suspense fallback={<LoadingFallback />}><MissionDetail /></Suspense>
          },
          {
            path: 'library/collections',
            element: <Suspense fallback={<LoadingFallback />}><CollectionCatalog /></Suspense>
          },
          {
            path: 'library/skins',
            element: <Suspense fallback={<LoadingFallback />}><SkinCatalog /></Suspense>
          },
          {
            path: 'inventory',
            element: <Suspense fallback={<LoadingFallback />}><InventoryPage /></Suspense>
          },
          {
            path: 'compare/crew',
            element: <CrewInventoryRedirect />
          },
          {
            path: 'compare/:type',
            element: <Suspense fallback={<LoadingFallback />}><CompareWorkspace /></Suspense>
          },
          {
            path: 'tools/targeting',
            element: <Suspense fallback={<LoadingFallback />}><StarTargeting /></Suspense>
          },
          {
            path: 'tools/advisor',
            element: <Suspense fallback={<LoadingFallback />}><SmartAdvisor /></Suspense>
          },
          {
            path: 'tools/tournaments',
            element: <Suspense fallback={<LoadingFallback />}><Tournaments /></Suspense>
          },
          {
            path: 'tools/market',
            element: <Suspense fallback={<LoadingFallback />}><MarketAnalytics /></Suspense>
          },
          {
            path: 'tools/capacity',
            element: <Suspense fallback={<LoadingFallback />}><ShipCapacityAnalytics /></Suspense>
          },
          {
            path: 'tools/training',
            element: <Suspense fallback={<LoadingFallback />}><TrainingTool /></Suspense>
          },
          {
            path: 'tools/ship-builder',
            element: <Suspense fallback={<LoadingFallback />}><ShipBuilderPage /></Suspense>
          },
          {
            path: 'about/data',
            element: <DataFreshness />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/vi" replace />
  }
], {
  basename: import.meta.env.BASE_URL === '/'
    ? '/'
    : import.meta.env.BASE_URL.replace(/\/$/, '')
});
