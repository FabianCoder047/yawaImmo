import { Head, Link, router, usePage } from '@inertiajs/react';
import { Home, Building2, DollarSign, MapPin, User, Search, Calendar, Phone, Mail } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Date invalide';
};
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    route: (name: string, params?: any) => string;
  }
}

interface Property {
    id: number;
    title: string;
    type: string;
    status: 'Vendu' | 'Loué';
    price: number;
    location: string;
    updated_at: string;
    client_name: string;
    client_surname: string;
    client_phone: string;
    category_name: string;
    image: string | null;
    images: Array<{ id: string; url: string; is_main: boolean }>;
    proprietaire: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        phone?: string;
    } | null;
}

interface Stats {
    total: number;
    sold: number;
    rented: number;
}

interface PropertyHistoryProps {
    properties: Property[];
    stats: Stats;
    proprietaires: Array<{ id: number; nom: string; prenom: string }>;
    filters: {
        proprietaire_id?: number;
        status?: string;
    };
}

export default function PropertyHistory({ 
    properties, 
    stats, 
    proprietaires = [], 
    filters: initialFilters = {} 
}: PropertyHistoryProps) {
    const { url } = usePage();
    // Initialisation des filtres avec les valeurs par défaut
    // Créer un identifiant unique pour les filtres initiaux
    const initialFiltersKey = JSON.stringify({
        p: initialFilters?.proprietaire_id,
        s: initialFilters?.status
    });

    const [filters, setFilters] = useState(() => ({
        search: '',
        proprietaire_id: initialFilters?.proprietaire_id ? String(initialFilters.proprietaire_id) : 'all',
        status: initialFilters?.status || 'all'
    }));

    // Mise à jour des filtres quand les props changent
    useEffect(() => {
        const newProprietaireId = initialFilters?.proprietaire_id ? String(initialFilters.proprietaire_id) : 'all';
        const newStatus = initialFilters?.status || 'all';

        setFilters(prev => {
            // Ne mettre à jour que si les valeurs ont changé
            if (prev.proprietaire_id !== newProprietaireId || prev.status !== newStatus) {
                return {
                    ...prev,
                    proprietaire_id: newProprietaireId,
                    status: newStatus
                };
            }
            return prev;
        });
    }, [initialFiltersKey]); // Utiliser l'identifiant unique comme dépendance

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        // Préparer les paramètres de requête
        const queryParams: Record<string, string> = {};
        
        if (newFilters.search) queryParams.search = newFilters.search;
        if (newFilters.proprietaire_id && newFilters.proprietaire_id !== 'all') {
            queryParams.proprietaire_id = newFilters.proprietaire_id;
        }
        if (newFilters.status && newFilters.status !== 'all') {
            queryParams.status = newFilters.status;
        }
        
        router.get(url, queryParams, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            proprietaire_id: 'all',
            status: 'all'
        });
        
        // Obtenir l'URL de base sans les paramètres de requête
        const baseUrl = url.split('?')[0];
        
        router.get(baseUrl, {}, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Vendu':
                return <Badge className="bg-green-600 hover:bg-green-700">Vendu</Badge>;
            case 'Loué':
                return <Badge className="bg-blue-600 hover:bg-blue-700">Loué</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Historique des transactions</h1>
                <p className="text-gray-600">Consultez l'historique des biens vendus et loués</p>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-lg shadow mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        value={filters.proprietaire_id || 'all'}
                        onValueChange={(value) => handleFilterChange('proprietaire_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tous les propriétaires" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les propriétaires</SelectItem>
                            {Array.isArray(proprietaires) && proprietaires.map((proprietaire) => (
                                <SelectItem key={proprietaire.id} value={String(proprietaire.id)}>
                                    {proprietaire.nom + ' ' + proprietaire.prenom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="Vendu">Vendu</SelectItem>
                            <SelectItem value="Loué">Loué</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={handleResetFilters}
                    >
                        Réinitialiser les filtres
                    </Button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Transactions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vendus</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.sold}</div>
                        <p className="text-xs text-muted-foreground">Biens vendus</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Loués</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.rented}</div>
                        <p className="text-xs text-muted-foreground">Biens loués</p>
                    </CardContent>
                </Card>
            </div>

            {/* Liste des biens */}
            <div className="space-y-6">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <Card key={property.id} className="overflow-hidden">
                            <div className="md:flex p-4">
                                <div className="md:w-1/4 h-48 md:h-48 bg-gray-100">
                                    {property.image ? (
                                        <img
                                            src={property.image }
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Building2 className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h2 className="text-xl font-semibold">{property.title}</h2>
                                                {getStatusBadge(property.status)}
                                            </div>
                                            <p className="text-gray-600 mb-4">{property.category_name}</p>
                                        </div>
                                        <div className="text-2xl font-bold text-primary">
                                            {formatPrice(property.price)}
                                            {property.status === 'Loué' && ' / mois'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{property.location}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="h-4 w-4 mr-2" />
                                            <span>Propriétaire: {property.proprietaire?.nom + ' ' + property.proprietaire?.prenom || 'Inconnu'}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="h-4 w-4 mr-2" />{property.proprietaire?.email || 'Non renseigné'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>Mis à jour le {property.updated_at}</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mt-4">
                                        <h3 className="font-medium mb-2 flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            Informations du client
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center">
                                                <span className="font-medium mr-2">Nom:</span>
                                                <span>{property.client_name} {property.client_surname}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="h-4 w-4 mr-2" />
                                                <a href={`tel:${property.client_phone}`} className="hover:underline">
                                                    {property.client_phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bien trouvé</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Aucun bien ne correspond à vos critères de recherche.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
