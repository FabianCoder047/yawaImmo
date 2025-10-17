import React from 'react';
import Sidebar from '@/components/ownComponents/proprietaires/sideBar';
import TopBar from '@/components/ownComponents/proprietaires/topBar';
import { usePage } from '@inertiajs/react';
import { User } from '@/types';

interface LayoutProprietaireProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    activeTab?: string;
  }

  const LayoutProprietaire = ({ children, header, activeTab = '' }: LayoutProprietaireProps) => {
  const { props } = usePage();
  const { auth: { user } } = props as unknown as { auth: { user: User } };

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        activeTab={activeTab || ''} // activeTab envoyé depuis le serveur (Laravel)
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        setActiveTab={() => {}} // on ne gère plus localement ici
      />
      <div className="flex flex-col flex-1">
        <TopBar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-white p-6 rounded shadow">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutProprietaire;
