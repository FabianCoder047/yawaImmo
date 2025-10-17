import PropertyList from '@/components/ownComponents/proprietaires/propertyList';
import LayoutProprietaire from '@/layouts/layoutProprietaire';
import React, { JSX, ReactNode } from 'react';

interface Property {
    id: number;
    title: string;
    price: number;
    status: string;
    image: string;
    location: string;
    type: string;
    description?: string;
    offre?: string;
    categorie?: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

interface BiensProps {
    properties: Property[];
    categories: Category[];
}

export default function Biens({ properties, categories }: BiensProps) {
    return (
        <>
            <PropertyList properties={properties} categories={categories} />
        </>
    );
}

// Déclaration du layout
(Biens as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page: ReactNode) => (
    <LayoutProprietaire activeTab="Mes biens">{page}</LayoutProprietaire>
);
