import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClientLayout from '@/layouts/layoutClient';
import { FaHeart, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

interface FavoritesProps {
    user: any;
    favorites?: any[];
    flash?: any;
}

export default function Favorites({ user, favorites = [], flash }: FavoritesProps) {
    return (
        <ClientLayout user={user} activeTab="favorites">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
                <p className="mt-2 text-gray-600">Retrouvez tous vos biens favoris</p>
            </div>

            {favorites.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FaHeart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun favori</h3>
                        <p className="mt-2 text-sm text-gray-500">Vous n'avez pas encore ajouté de biens à vos favoris.</p>
                        <div className="mt-6">
                            <Button asChild>
                                <a href="/properties">Découvrir des biens</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((property) => (
                        <Card key={property.id} className="overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={property.image ? `/storage/${property.image}` : '/assets/img/property-1.jpg'}
                                    alt={property.title}
                                    className="h-48 w-full object-cover"
                                />
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="text-lg">{property.title}</CardTitle>
                                <CardDescription className="flex items-center">
                                    <FaMapMarkerAlt className="mr-1 h-4 w-4" />
                                    {property.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-lg font-bold text-green-600">
                                        <FaMoneyBillWave className="mr-1 h-4 w-4" />
                                        {property.price?.toLocaleString()} FCFA
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <FaHeart className="mr-1 h-4 w-4 text-red-500" />
                                        Retirer
                                    </Button>
                                </div>
                                <div className="mt-4">
                                    <Button className="w-full" size="sm">
                                        Voir les détails
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </ClientLayout>
    );
}
