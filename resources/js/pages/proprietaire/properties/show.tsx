import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LayoutProprietaire from '@/layouts/layoutProprietaire';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Property, User as UserType } from '@/types';

interface PropertyShowProps {
    property: Property & {
        user: UserType;
        categorie: {
            id: number;
            name: string;
        };
        image_url?: string;
        additional_images_urls?: string[];
    };
}

export default function PropertyShow({ property }: PropertyShowProps) {
    if (!property) {
        return (
            <LayoutProprietaire>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Propriété non trouvée</h1>
                        <p className="mt-4 text-gray-600">La propriété que vous recherchez n'existe pas ou a été supprimée.</p>
                        <Link href="/proprietaire/dashboard" className="mt-6 inline-block">
                            <Button>Retour au tableau de bord</Button>
                        </Link>
                    </div>
                </div>
            </LayoutProprietaire>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approuvé':
                return (
                    <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {status}
                    </Badge>
                );
            case 'en attente':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
                        {status}
                    </Badge>
                );
            case 'rejeté':
                return (
                    <Badge className="bg-red-100 text-red-800">
                        <XCircle className="mr-1 h-3 w-3" />
                        {status}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <LayoutProprietaire>
            <Head title={property.title} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Bouton retour */}
                <div className="mb-6">
                    <Link 
                        href="/proprietaire/dashboard" 
                        className="inline-flex items-center text-green-600 hover:underline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour au tableau de bord
                    </Link>
                </div>

                {/* En-tête */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                            <div className="mt-2 flex items-center text-gray-600">
                                <MapPin className="mr-2 h-5 w-5" />
                                <span>{property.location}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {getStatusBadge(property.status)}
                            <Badge className="bg-blue-100 text-blue-800">
                                {property.offre}
                            </Badge>
                            <span className="text-2xl font-bold text-green-600">
                                {property.price.toLocaleString()} FCFA
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Galerie d'images */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Image principale */}
                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                <img 
                                    src={property.image_url || '/images/placeholder.jpg'} 
                                    alt={property.title}
                                    className="h-96 w-full object-cover"
                                />
                            </div>
                            
                            {/* Images supplémentaires */}
                            {property.additional_images_urls && property.additional_images_urls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {property.additional_images_urls.map((imageUrl, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
                                            <img 
                                                src={imageUrl} 
                                                alt={`${property.title} - Image ${index + 1}`}
                                                className="h-40 w-full object-cover hover:opacity-90 transition-opacity"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Description */}
                        <div className="mt-8">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Description</h2>
                            <p className="text-gray-700">
                                {property.description || 'Aucune description disponible.'}
                            </p>
                        </div>

                        {/* Détails supplémentaires */}
                        <div className="mt-8">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Détails du bien</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Type de bien</h3>
                                    <p className="mt-1 text-gray-900">{property.type}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                                    <p className="mt-1 text-gray-900">{property.categorie?.name || 'Non spécifiée'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                                    <div className="mt-1">
                                        {getStatusBadge(property.status)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Date de publication</h3>
                                    <p className="mt-1 text-gray-900">
                                        {new Date(property.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                                <CardDescription>
                                    Gérer cette propriété
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Link 
                                    href={`/proprietaire/mes-biens/${property.id}/edit`}
                                    className="block w-full"
                                >
                                    <Button className="w-full">
                                        Modifier cette propriété
                                    </Button>
                                </Link>
                                
                                <Button 
                                    variant="outline" 
                                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                                    onClick={() => {
                                        if (confirm('Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.')) {
                                            // Implémenter la suppression
                                        }
                                    }}
                                >
                                    Supprimer cette propriété
                                </Button>

                                <div className="pt-4 border-t">
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">Statut</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Date de création</span>
                                            <span className="text-sm font-medium">
                                                {new Date(property.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        {property.updated_at !== property.created_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Dernière mise à jour</span>
                                                <span className="text-sm font-medium">
                                                    {new Date(property.updated_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </LayoutProprietaire>
    );
}
