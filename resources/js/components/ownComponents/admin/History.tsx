import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Home, Building2, Clock, DollarSign, MapPin, Calendar, Phone, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
}

interface Stats {
    total: number;
    sold: number;
    rented: number;
}

interface HistoryProps {
    properties: Property[];
    stats: Stats;
}

export default function History({ properties, stats }: HistoryProps) {
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
            <Head title="Historique des biens" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Historique des biens</h1>
                <p className="text-gray-600">Consultez l'historique de vos biens vendus et loués</p>
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
                        <p className="text-xs text-muted-foreground">Biens au total</p>
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
                            <div className="md:flex">
                                <div className="md:w-1/4 h-48 md:h-auto">
                                    {property.image ? (
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bien dans l'historique</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Les biens que vous vendez ou louez apparaîtront ici.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
