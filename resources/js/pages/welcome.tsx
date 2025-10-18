import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import HeroCarousel from '@/components/ownComponents/mainPage/heroCaroussel';
import Services from '@/components/ownComponents/mainPage/servicesSection';
import LatestProperties from '@/components/ownComponents/mainPage/latestProperties';
import MainLayout from '@/layouts/mainLayout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Types partagés avec le composant LatestProperties
export interface Property {
    id: number;
    title: string;
    price: number;
    image: string;
    location: string;
    offre: string;
    user: User;
    [key: string]: unknown; // Index signature pour la compatibilité
}

export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    [key: string]: unknown; // Index signature pour la compatibilité
}

interface Flash {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    [key: string]: unknown; // Index signature pour la compatibilité
}

interface Categorie {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown; // Index signature pour la compatibilité
}

interface WelcomeProps {
    properties?: Property[];
    featuredProperties?: Array<{
        id: number;
        title: string;
        price: number;
        location: string;
        image: string | null;
        offre: string;
        created_at: string;
        [key: string]: unknown; // Index signature pour la compatibilité
    }>;
    categories?: Categorie[];
    user?: User;
    flash?: Flash;
    filters?: {
        categorie?: string;
        location?: string;
        type?: 'location' | 'vente' | '';
        [key: string]: unknown; // Index signature pour la compatibilité
    };
}

export default function Welcome({ 
    properties: initialProperties = [], 
    // Suppression de featuredProperties car non utilisé
    categories = [], 
    filters: initialFilters = {} 
}: WelcomeProps) {
    const [filters, setFilters] = useState<{
        categorie: string;
        location: string;
        type: 'location' | 'vente' | '';
    }>(() => ({
        categorie: initialFilters.categorie || '',
        location: initialFilters.location || '',
        type: initialFilters.type === 'location' || initialFilters.type === 'vente' ? initialFilters.type : ''
    }));
    
    // Mettre à jour les filtres uniquement si les valeurs initiales changent réellement
    useEffect(() => {
        setFilters(prev => {
            const newType = initialFilters.type === 'location' || initialFilters.type === 'vente' 
                ? initialFilters.type 
                : '';
                
            const newFilters = {
                categorie: initialFilters.categorie || '',
                location: initialFilters.location || '',
                type: newType
            } as { categorie: string; location: string; type: 'location' | 'vente' | '' };
            
            // Ne mettre à jour que si les valeurs ont changé
            if (prev.categorie !== newFilters.categorie || 
                prev.location !== newFilters.location || 
                prev.type !== newFilters.type) {
                return newFilters;
            }
            return prev;
        });
    }, [initialFilters.categorie, initialFilters.location, initialFilters.type]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Ne mettre à jour que si la valeur a changé
        setFilters(prev => {
            if (prev[name as keyof typeof prev] === value) return prev;
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleSearch = () => {
        // Ne pas déclencher de recherche si les filtres sont vides
        if (!filters.categorie && !filters.location) {
            return;
        }
        
        router.get('/biens', filters, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <>
            <MainLayout>
                {/* Hero Carousel */}
                <HeroCarousel />
                
                <div className="bg-gray-50 py-12 lg:px-16">
                    <div className="max-w-7xl mx-auto sm:px-6">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Trouvez la propriété de vos rêves
                            </h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Découvrez notre sélection de biens immobiliers exceptionnels à travers le pays.
                            </p>
                        </div>
                        <Services/>
                        {/* Filtres de recherche */}
                        <div className="mt-12 -ml-4">
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Rechercher un bien</CardTitle>
                                    <CardDescription>Filtrez les propriétés selon vos critères</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                        <div>
                                            <label htmlFor="categorie" className="mb-1 block text-sm font-medium text-gray-700">
                                                Catégorie
                                            </label>
                                            <select
                                                id="categorie"
                                                name="categorie"
                                                value={filters.categorie}
                                                onChange={handleFilterChange}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            >
                                                <option value="">Toutes les catégories</option>
                                                {categories.map((categorie) => (
                                                    <option key={categorie.id} value={categorie.id}>
                                                        {categorie.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
                                                Type de transaction
                                            </label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={filters.type}
                                                onChange={handleFilterChange}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            >
                                                <option value="">Tous les types</option>
                                                <option value="En location">Location</option>
                                                <option value="En vente">Vente</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
                                                Localisation
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={filters.location}
                                                onChange={handleFilterChange}
                                                placeholder="Ville ou quartier"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        
                                        <div className="flex items-end">
                                            <button
                                                onClick={handleSearch}
                                                className="w-60 bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                Rechercher
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <LatestProperties properties={initialProperties} filters={filters} />
            </MainLayout>
        </>
    );
}
