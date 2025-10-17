import { Menu } from 'lucide-react';
import { User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { router, Link } from '@inertiajs/react';
import { Label } from "@/components/ui/label";

interface TopBarProps {
  user: User;
  onToggleSidebar: () => void;
}

const handleLogout = () => {
  router.post('/logout');
};


export default function TopBar({ user, onToggleSidebar }: TopBarProps) {
  const avatar = user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nom + ' ' + user.prenom || 'Admin')}`;

  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 shadow md:shadow-none border-b">
      <button className="md:hidden text-gray-700" onClick={onToggleSidebar}>
        <Menu className="w-6 h-6" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={avatar} className="w-9 h-9 rounded-full border object-cover" />
              <span className="text-sm font-bold text-gray-700 hidden sm:inline">
                {user.nom} {user.prenom}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleLogout}>
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
