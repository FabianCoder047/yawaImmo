import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

interface Property {
    id: number;
    title: string;
    description: string;
    location: string;
    price: number;
    offre: string;
    image: string;
    user: {
        nom: string;
        prenom: string;
        telephone: string;
    };
}

interface PropertyRequest {
    id: number;
    message: string;
    created_at: string;
    property: Property;
}

interface MyRequestsProps {
    requests: PropertyRequest[];
}

export default function MyRequests({ requests = [] }: MyRequestsProps) {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
                    <p className="mt-2 text-gray-600">Consultez l'historique de vos demandes de propriétés</p>
                </div>

                {!requests || requests.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="mb-4 text-gray-500">Vous n'avez pas encore fait de demandes</p>
                            <Link href="/">
                                <Button>Parcourir les propriétés</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((request) => (
                            <Card key={request.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle>{request.property.title}</CardTitle>
                                            <CardDescription>
                                                Demande envoyée le {new Date(request.created_at).toLocaleDateString('fr-FR')}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={request.property.offre === 'En vente' ? 'default' : 'secondary'}>
                                            {request.property.offre}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-3">
                                        {/* Image de la propriété */}
                                        <div>
                                            <img
                                                src={`/storage/${request.property.image}`}
                                                alt={request.property.title}
                                                className="h-32 w-full rounded-lg object-cover"
                                            />
                                        </div>

                                        {/* Détails de la propriété */}
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Localisation:</span>
                                                <p className="text-gray-900">{request.property.location}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Prix:</span>
                                                <p className="font-semibold text-gray-900">{request.property.price.toLocaleString()} FCFA</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Propriétaire:</span>
                                                <p className="text-gray-900">
                                                    {request.property.user.prenom} {request.property.user.nom}
                                                </p>
                                                <p className="text-sm text-gray-600">{request.property.user.telephone}</p>
                                            </div>
                                        </div>

                                        {/* Message de la demande */}
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Votre message:</span>
                                            <p className="mt-1 text-sm leading-relaxed text-gray-900">{request.message}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
