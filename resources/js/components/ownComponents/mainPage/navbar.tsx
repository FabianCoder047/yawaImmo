'use client';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import UserAvatar from './userAvatar';

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

interface NavbarProps {
    user?: User;
}

export default function Navbar({ user }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/about', label: 'A propos' },
        { href: '/properties', label: 'Logement' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="fixed top-0 right-0 left-0 z-50 bg-white px-8 py-4 shadow-sm lg:px-24">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="cursor-pointer text-2xl font-bold">
                    <a href="/">
                        <span className="text-black">Yawa</span>
                        <span className="text-[#2E7D32]">Immo</span>
                    </a>
                </div>

                {/* Desktop nav */}
                <nav className="hidden items-center space-x-8 text-lg font-semibold md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="w-fit cursor-pointer border-[#2E7D32] text-black transition hover:border-b-2 hover:text-[#2E7D32]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* User section - Avatar if logged in, Login button if not */}
                <div className="hidden md:block">
                    {user ? (
                        <UserAvatar user={user} />
                    ) : (
                        <a href="/login" className="rounded bg-[#2E7D32] px-4 py-2 font-semibold text-white transition hover:bg-[#2E7D32]">
                            Connexion
                        </a>
                    )}
                </div>

                {/* Hamburger icon */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-2xl text-black focus:outline-none">
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mt-4 flex flex-col space-y-4 text-lg font-semibold md:hidden">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="w-fit cursor-pointer border-[#2E7D32] text-black transition hover:border-b-2 hover:text-[#2E7D32]"
                        >
                            {link.label}
                        </a>
                    ))}
                    {user ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                                {user.prenom} {user.nom}
                            </span>
                            <UserAvatar user={user} />
                        </div>
                    ) : (
                        <a
                            href="/login"
                            className="w-fit cursor-pointer rounded bg-[#2E7D32] px-4 py-2 font-semibold text-white transition hover:bg-[#2E7D32]"
                        >
                            Connexion
                        </a>
                    )}
                </div>
            )}
        </header>
    );
}
