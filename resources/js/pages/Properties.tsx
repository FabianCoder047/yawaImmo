import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import MainLayout from '@/layouts/mainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { MapPin, User } from 'lucide-react';
import { useState, useEffect } from 'react';

type Categorie = {
    id: number;
    name: string;
};

interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string | null;
    additional_images?: string[];
    all_image_urls: string[];
    location: string;
    offre: string;
    status: string;
    user: {
        nom: string;
        prenom: string;
        telephone: string;
    };
    categorie: {
        id: number;
        name: string;
    };
    published_at: string | null;
}

interface PropertiesProps {
    properties: {
        data: Property[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Categorie[];
    filters?: {
        categorie?: string;
        location?: string;
        type?: string;
        min_price?: string;
        max_price?: string;
    };
}

export default function Properties({ properties, categories, filters: initialFilters = {} }: PropertiesProps) {
    const [filters, setFilters] = useState(() => ({
        categorie: initialFilters?.categorie || '',
        location: initialFilters?.location || '',
        type: initialFilters?.type || '',
        min_price: initialFilters?.min_price || '',
        max_price: initialFilters?.max_price || ''
    }));

    // Fonction pour effectuer la recherche avec les filtres actuels
    const performSearch = (currentFilters: { categorie?: string; location?: string; type?: string }) => {
        router.get('/properties', currentFilters, {
            preserveState: true,
            replace: true,
            only: ['properties'],
            onSuccess: () => {
                // Faire défiler vers le haut après la recherche
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };

    // Gérer le changement de filtre
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value
        };
        setFilters(newFilters);
    };

    // Effet pour déclencher la recherche lorsque les filtres changent
    useEffect(() => {
        // Délai pour éviter trop de requêtes lors de la saisie
        const timeoutId = setTimeout(() => {
            performSearch(filters);
        }, 500); // Délai de 500ms

        return () => clearTimeout(timeoutId);
    }, [filters]);

    // Réinitialiser les filtres lorsque les props changent (navigation arrière/avant)
    useEffect(() => {
        setFilters({
            categorie: initialFilters?.categorie || '',
            location: initialFilters?.location || '',
            type: initialFilters?.type || '',
            min_price: initialFilters?.min_price || '',
            max_price: initialFilters?.max_price || ''
        });
    }, [initialFilters]);

    return (
        <MainLayout>
            <Head title="Toutes les propriétés" />
            <div className="min-h-screen bg-gray-50 px-4 py-24 md:py-32 md:px-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 border-l-4 border-[#2E7D32] pl-4">
                        <h1 className="text-3xl font-bold text-gray-900">Toutes les propriétés</h1>
                        <p className="mt-2 text-gray-600">Découvrez notre sélection de biens immobiliers disponibles</p>
                    </div>

                    {/* Filtres de recherche */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Rechercher un bien</CardTitle>
                            <CardDescription>Filtrez les propriétés selon vos critères</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
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
                                
                                <div>
                                    <label htmlFor="min_price" className="mb-1 block text-sm font-medium text-gray-700">
                                        Prix min (FCFA)
                                    </label>
                                    <input
                                        type="number"
                                        id="min_price"
                                        name="min_price"
                                        value={filters.min_price}
                                        onChange={handleFilterChange}
                                        placeholder="Min"
                                        min="0"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="max_price" className="mb-1 block text-sm font-medium text-gray-700">
                                        Prix max (FCFA)
                                    </label>
                                    <input
                                        type="number"
                                        id="max_price"
                                        name="max_price"
                                        value={filters.max_price}
                                        onChange={handleFilterChange}
                                        placeholder="Max"
                                        min="0"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                                
                                <div className="flex items-end">
                                    <button
                                        onClick={() => performSearch(filters)}
                                        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        Rechercher
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {properties.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="mb-4 text-gray-500">Aucune propriété disponible pour le moment</p>
                                <Link href="/">
                                    <Button>Retour à l'accueil</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {properties.data.map((property) => (
                                    <Card key={property.id} className="overflow-hidden transition hover:shadow-lg">
                                        <div className="relative">
                                            {property.all_image_urls && property.all_image_urls.length > 0 ? (
                                                <img 
                                                    src={property.all_image_urls[0]} 
                                                    alt={property.title} 
                                                    className="h-48 w-full object-cover"
                                                    onError={(e) => {
                                                        // En cas d'erreur de chargement de l'image
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/images/placeholder-property.jpg';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-48 w-full items-center justify-center bg-gray-100">
                                                    <span className="text-gray-400">Aucune image</span>
                                                </div>
                                            )}
                                            <Badge
                                                variant={property.offre === 'En vente' ? 'default' : 'secondary'}
                                                className="absolute top-2 right-2"
                                            >
                                                {property.offre}
                                            </Badge>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{property.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <p className="line-clamp-2 text-sm text-gray-600">{property.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold text-green-600">
                                                        {property.price.toLocaleString()} FCFA
                                                    </span>
                                                    <Badge variant="outline">{property.categorie.name}</Badge>
                                                </div>
                                                <div className="mt-4 text-sm text-gray-600">
                                                    <p className="mb-1 flex items-center"><MapPin className="mr-2 h-5 w-5 text-gray-500" /><strong>Localisation:</strong> {property.location}</p>
                                                    <p className="flex items-center"><User className="mr-2 h-5 w-5 text-gray-500" /><strong>Propriétaire:</strong> {property.user.prenom} {property.user.nom}</p>
                                                </div>
                                                <Link href={`/properties/${property.id}`} className="block w-full">
                                                    <Button className="w-full">Voir les détails</Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {properties.last_page > 1 && (
                                <div className="flex items-center justify-center space-x-2">
                                    {Array.from(
                                        { length: properties.last_page },
                                        (_, i) => i + 1
                                    ).map((page) => {
                                        const isActive = properties.current_page === page;
                                        const baseClasses = 'rounded-md px-3 py-2 text-sm font-medium';
                                        const activeClasses = 'bg-[#2E7D32] text-white';
                                        const inactiveClasses = 'bg-white text-gray-700 hover:bg-gray-100';
                                        
                                        return (
                                            <Link
                                                key={page}
                                                href={`/properties?page=${page}`}
                                                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
