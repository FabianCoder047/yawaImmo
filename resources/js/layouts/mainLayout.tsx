import FlashMessage from '@/components/ownComponents/mainPage/flashMessage';
import Footer from '@/components/ownComponents/mainPage/footer';
import Navbar from '@/components/ownComponents/mainPage/navbar';
import React from 'react';

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

interface Flash {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

interface MainLayoutProps {
    children: React.ReactNode;
    user?: User;
    flash?: Flash;
}

const MainLayout = ({ children, user, flash }: MainLayoutProps) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar user={user} />
            <FlashMessage {...flash} />

            <main className="container mx-auto flex-1 px-4 py-6">{children}</main>

            <Footer />
        </div>
    );
};

export default MainLayout;
