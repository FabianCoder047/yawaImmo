import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import React, { ReactNode } from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface PageProps<T = {}> extends InertiaPageProps<T> {
    auth: Auth;
    [key: string]: any;
}

export type NextPageWithLayout = React.FC & {
    layout?: (page: ReactNode) => JSX.Element;
  };

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Property {
    id: number;
    title: string;
    price: number;
    status: string;
    image: string;
    location: string;
    type: string;
    description?: string;
    offre?: string; // En vente ou En location
    categorie?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
