import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Camera, History, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandMark from '../branding/BrandMark';

export default function AppLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <h1 className="text-lg font-semibold tracking-tight">WoundCare</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant={currentPath === '/' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate({ to: '/' })}
            >
              <Camera className="h-4 w-4 mr-2" />
              New Entry
            </Button>
            <Button
              variant={currentPath.startsWith('/history') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate({ to: '/history' })}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <Heart className="h-3 w-3 fill-current text-accent" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
