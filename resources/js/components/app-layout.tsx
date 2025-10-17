import { AppShell } from './app-shell';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { AppContent } from './app-content';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function AppLayout({ children, header }: AppLayoutProps) {
  const { auth } = usePage<SharedData>().props;
  
  return (
    <AppShell>
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar user={auth.user} />
        <AppContent>
          {header && (
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {header}
              </div>
            </div>
          )}
          <main className="flex-1 overflow-y-auto focus:outline-none py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </AppContent>
      </div>
    </AppShell>
  );
}
