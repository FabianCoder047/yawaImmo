import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LayoutAdmin from '@/layouts/layoutAdmin';
import { Link } from '@inertiajs/react';
import { FaBuilding, FaCreditCard, FaUser, FaHome, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { useState, useCallback, useMemo } from 'react';

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


type Stats = {
    total_clients: number;
    total_owners: number;
    total_properties: number;
    total_subscriptions: number;
    pending_properties: number;
    approved_properties: number;
    rejected_properties: number;
    active_subscriptions: number;
    expired_subscriptions: number;
};

type Property = {
    id: number;
    title: string;
    price: number;
    status: string;
    image: string | null;
    all_images?: string[];
    additional_images?: string[];
    created_at: string;
    user: User;
};

type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    created_at: string;
};

interface AdminDashboardProps {
    stats: Stats;
    recentProperties: Property[];
    recentUsers: User[];
}

export default function AdminDashboard({ stats, recentProperties = [], recentUsers = [] }: AdminDashboardProps) {
    return (
        <LayoutAdmin activeTab="Dashboard">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
                <p className="mt-2 text-gray-600">Gérez votre plateforme immobilière</p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total propriétaires</CardTitle>
                        <FaUser className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_owners}</div>
                        <p className="text-xs text-muted-foreground">Propriétaires actifs</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total biens</CardTitle>
                        <FaBuilding className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_properties}</div>
                        <p className="text-xs text-muted-foreground">Biens enregistrés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Abonnements</CardTitle>
                        <FaCreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_subscriptions}</div>
                        <p className="text-xs text-muted-foreground">Abonnements actifs</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Aperçu des statistiques</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Biens en attente</CardTitle>
                            <FaClock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_properties}</div>
                            <p className="text-xs text-muted-foreground">En attente de validation</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Biens approuvés</CardTitle>
                            <FaCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved_properties}</div>
                            <p className="text-xs text-muted-foreground">Biens publiés</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Biens rejetés</CardTitle>
                            <FaTimes className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rejected_properties}</div>
                            <p className="text-xs text-muted-foreground">Biens non publiés</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Biens récents</CardTitle>
                                <CardDescription>Derniers biens ajoutés</CardDescription>
                            </div>
                            <Link href="/admin/biens">
                                <Button variant="outline" size="sm">Voir tout</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProperties.length > 0 ? (
                                recentProperties.map((property) => (
                                    <div key={property.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <PropertyImage 
                                                    src={property.image}
                                                    alt={property.title}
                                                    className="h-10 w-10"
                                                    allImages={property.additional_images || []}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {property.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {new Intl.NumberFormat('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'XOF',
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0
                                                    }).format(property.price)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{property.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {property.user?.prenom || 'Utilisateur inconnu'} {property.user?.nom || ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium">{property.price} FCFA</span>
                                            <p className="text-xs text-muted-foreground">{property.created_at}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Aucun bien récent</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Propriétaires récents</CardTitle>
                                <CardDescription>Dernières inscriptions</CardDescription>
                            </div>
                            <Link href="/admin/proprietaires">
                                <Button variant="outline" size="sm">Voir tout</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <FaUser className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : user.role === 'proprietaire'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role === 'admin' ? 'Administrateur' : user.role === 'proprietaire' ? 'Propriétaire' : 'Client'}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-1">{user.created_at}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Aucun utilisateur récent</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LayoutAdmin>
    );
}
// Layout is already handled by the component itself

