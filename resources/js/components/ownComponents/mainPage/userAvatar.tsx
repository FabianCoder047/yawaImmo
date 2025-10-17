'use client';
import { useEffect, useRef, useState } from 'react';
import { FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

interface UserAvatarProps {
    user: User;
}

export default function UserAvatar({ user }: UserAvatarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Utiliser la route de déconnexion Laravel
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        document.body.appendChild(form);
        form.submit();
    };

    const getDashboardUrl = () => {
        switch (user.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'proprietaire':
                return '/proprietaire/dashboard';
            case 'client':
                return '/client/dashboard';
            default:
                return '/client/dashboard';
        }
    };

    const getInitials = () => {
        return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32] text-white transition-colors duration-200 hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none"
            >
                <span className="text-sm font-semibold flex items-center justify-center w-full h-full">{getInitials()}</span>
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2">
                        <p className="text-sm font-medium text-gray-900 align-center">
                            {user.prenom} {user.nom}
                        </p>
                        <p className="text-xs text-gray-500 align-center">{user.email}</p>
                    </div>

                    <a
                        href={getDashboardUrl()}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100"
                    >
                        <FaTachometerAlt className="mr-2" />
                        Dashboard
                    </a>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100"
                    >
                        <FaSignOutAlt className="mr-2" />
                        Déconnexion
                    </button>
                </div>
            )}
        </div>
    );
}
