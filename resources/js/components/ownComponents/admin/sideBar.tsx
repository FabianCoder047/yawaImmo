import {
    Home,
    Building2,
    Users,
    BadgeDollarSign,
    ListTodo,
    History
  } from 'lucide-react';
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
  } from '@/components/ui/dropdown-menu';
  
  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/admin/dashboard' },
    { name: 'Catégories', icon: ListTodo, href: '/admin/categories' },
    { name: 'Biens', icon: Building2, href: '/admin/biens' },
    { name: 'Propriétaires', icon: Users, href: '/admin/proprietaires' },
    { name: "Historique", icon: History, href: '/admin/historique' },
    { name: "Abonnements", icon: BadgeDollarSign, href: '/admin/abonnements' },
  ];
  
  interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    user: {
      photo?: string;
      nom: string;
      prenom: string;
      role: string;
    };
  }
  
  import { router } from '@inertiajs/react';

  const handleLogout = () => {
    router.post('/logout');
  };
  

  export default function Sidebar({
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    user,
  }: SidebarProps) {
    const avatar =
      user?.photo ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.nom + ' ' + user.prenom || 'Admin'
      )}`;
  
    return (
      <div
        className={`fixed md:static top-0 left-0 h-full z-40 bg-white w-64 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shadow md:shadow-none`}
      >
        <div className="h-16 flex items-center justify-start px-8 font-bold text-green-600 border-b text-lg">
          <span className="text-black">Yawa</span>
          <span className="text-green-600">Immo</span>
        </div>
  
        <nav className="p-4 space-y-1">
          {navItems.map(({ name, icon: Icon, href }) => (
            <button
              key={name}
              onClick={() => {
                setActiveTab(name);
                setSidebarOpen(false);
                window.location.href = href;
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
                activeTab === name
                  ? 'bg-green-100 text-green-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </button>
          ))}
        </nav>
  
        {/* Dropdown Avatar User */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div className="text-sm text-left">
                  <div className="font-semibold text-gray-800">
                    {user.nom} {user.prenom}
                  </div>
                  <div className="text-blue-600 text-xs uppercase font-bold">{user.role}</div>
                </div>
              </div>
            </DropdownMenuTrigger>
  
            <DropdownMenuContent side="top" align="start" className="w-48">
              <DropdownMenuItem onClick={() => window.location.href = '/profile'}>Profil</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  