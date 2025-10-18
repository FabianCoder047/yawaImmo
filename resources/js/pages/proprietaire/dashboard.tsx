import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LayoutProprietaire from '@/layouts/layoutProprietaire';
import { Link } from '@inertiajs/react';
import { FaCheckCircle, FaClock, FaEye, FaHome, FaTimesCircle } from 'react-icons/fa';
import React, { JSX, ReactNode, useState, useCallback, useMemo } from 'react';
import Dashboard from '../dashboard';

// Composant réutilisable pour l'affichage des images de biens
const PropertyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon: FallbackIcon = FaHome,
  allImages = []
}: { 
  src?: string | null; 
  alt: string; 
  className?: string; 
  fallbackIcon?: React.ComponentType<{ className?: string }>;
  allImages?: (string | null)[];
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(false);
  
  // Préparer la liste des images à afficher (image principale + images supplémentaires)
  const images = useMemo(() => {
    const imgList = [src, ...(allImages || [])]
      .filter((img): img is string => !!img && typeof img === 'string')
      .map(img => img.startsWith('http') || img.startsWith('/') 
        ? img 
        : `/storage/${img}`);
    
    return imgList.length > 0 ? imgList : [];
  }, [src, allImages]);

  const handleError = useCallback(() => {
    if (currentImageIndex < images.length - 1) {
      // Passer à l'image suivante en cas d'erreur
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setError(true);
    }
  }, [currentImageIndex, images.length]);

  // Si pas d'images ou erreur sur toutes les images, afficher l'icône de remplacement
  if (images.length === 0 || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-md ${className}`}>
        <FallbackIcon className="h-5 w-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentImageIndex]}
        alt={alt}
        className={`object-cover w-full h-full rounded-md ${className}`}
        onError={handleError}
        loading="lazy"
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Voir l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface Subscription {
    status: string;
    type: string;
    end_date: string;
}

interface Property {
    id: number;
    title: string;
    price: number;
    status: string;
    image: string | null;
    all_images?: string[];
    additional_images?: string[];
    created_at: string;
    categorie?: {
        id: number;
        name: string;
    };
}

interface PageProps {
    subscription: Subscription | null;
    recentProperties: Property[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        views: number;
    };
}

export default function ProprietaireDashboard({ subscription, recentProperties = [], stats }: PageProps) {
    return (
        <LayoutProprietaire activeTab="Dashboard">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="mt-2 text-gray-600">Gérez vos biens immobiliers</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total des biens</CardTitle>
                        <FaHome className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Biens enregistrés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En attente</CardTitle>
                        <FaClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Biens en attente de validation</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
                        <FaCheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approved}</div>
                        <p className="text-xs text-muted-foreground">Biens validés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
                        <FaTimesCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rejected}</div>
                        <p className="text-xs text-muted-foreground">Biens rejetés</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Actions rapides</CardTitle>
                        <CardDescription>Gérez vos biens rapidement</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                            <Button className="w-full" variant="outline" onClick={()=>window.location.href='/proprietaire/mes-biens'}>
                                <FaHome className="mr-2 h-4 w-4" />
                                Ajouter un bien
                            </Button>

                        <div className="my-4 border-b border-gray-200"></div>
                            <Button className="w-full" variant="outline" onClick={()=>window.location.href='/proprietaire/mes-biens'}>
                                <FaEye className="mr-2 h-4 w-4" />
                                Gérer mes biens
                            </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statut de l'abonnement</CardTitle>
                        <CardDescription>Informations sur votre abonnement actuel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Statut</span>
                                {subscription ? (
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        subscription.status 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {subscription.status ? (
                                            <FaCheckCircle className="mr-1 h-3 w-3" />
                                        ) : (
                                            <FaTimesCircle className="mr-1 h-3 w-3" />
                                        )}
                                        {subscription.status}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                        <FaTimesCircle className="mr-1 h-3 w-3" />
                                        Aucun abonnement actif
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Type</span>
                                <span className="text-sm text-gray-600">
                                    {subscription ? subscription.type : 'Aucun'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {subscription?.status ? 'Expire le' : 'Expiré le'}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {subscription ? subscription.end_date : 'N/A'}
                                </span>
                            </div>
                            {!subscription?.status && (
                                <div className="pt-4">
                                    <Button className="w-full" variant="outline" onClick={()=>window.location.href='/proprietaire/mes-biens'}>
                                        Gérer mon abonnement
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Mes biens récents</CardTitle>
                                <CardDescription>Biens ajoutés ce mois-ci</CardDescription>
                            </div>
                            <Link href="/proprietaire/mes-biens">
                                <Button variant="outline" size="sm">
                                    Voir tout
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentProperties.length > 0 ? (
                            <div className="space-y-4">
                                {recentProperties.map((property) => (
                                    <div key={property.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 flex-shrink-0">
                                                <PropertyImage 
                                                    src={property.image}
                                                    alt={property.title}
                                                    className="h-12 w-12"
                                                    allImages={property.additional_images || []}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{property.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(property.created_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{property.price.toLocaleString('fr-FR')} FCFA</div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                property.status === 'Approuvé' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : property.status === 'En attente'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {property.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <FaHome className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bien récent</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Aucun bien n'a été ajouté ce mois-ci.
                                </p>
                                <div className="mt-6">
                                    <Link href="/proprietaire/biens">
                                        <Button>
                                            <FaHome className="mr-2 h-4 w-4" />
                                            Ajouter un bien
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </LayoutProprietaire>
    );
}
(Dashboard as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page: ReactNode) => (
    <LayoutProprietaire activeTab="Dashboard">{page}</LayoutProprietaire>
);
