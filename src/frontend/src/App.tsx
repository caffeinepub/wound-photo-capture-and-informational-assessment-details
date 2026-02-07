import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import NewWoundEntryPage from './pages/NewWoundEntryPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import ReportPage from './pages/ReportPage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: NewWoundEntryPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage,
});

const historyDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history/$entryId',
  component: HistoryDetailPage,
});

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report',
  component: ReportPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  historyRoute,
  historyDetailRoute,
  reportRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
