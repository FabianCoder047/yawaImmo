import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

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
    categorie: {
        name: string;
    };
}

interface PropertyRequestProps {
    property: Property;
}

export default function PropertyRequest({ property }: PropertyRequestProps) {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/property-request/${property.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Demande de propriété</h1>
                    <p className="mt-2 text-gray-600">Envoyez votre demande pour cette propriété au propriétaire</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Informations de la propriété */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Détails de la propriété</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <img src={`/storage/${property.image}`} alt={property.title} className="h-48 w-full rounded-lg object-cover" />
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                                <p className="mt-2 text-gray-600">{property.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Localisation</Label>
                                    <p className="text-gray-900">{property.location}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Prix</Label>
                                    <p className="font-semibold text-gray-900">{property.price.toLocaleString()} FCFA</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Type</Label>
                                    <Badge variant={property.offre === 'En vente' ? 'default' : 'secondary'}>{property.offre}</Badge>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Catégorie</Label>
                                    <p className="text-gray-900">{property.categorie.name}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="mb-2 font-medium text-gray-900">Propriétaire</h4>
                                <p className="text-gray-600">
                                    {property.user.prenom} {property.user.nom}
                                </p>
                                <p className="text-gray-600">{property.user.telephone}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulaire de demande */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Votre demande</CardTitle>
                            <CardDescription>Rédigez votre message au propriétaire. Soyez précis sur vos besoins et votre budget.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errors.message && (
                                    <Alert>
                                        <AlertDescription>{errors.message}</AlertDescription>
                                    </Alert>
                                )}

                                <div>
                                    <Label htmlFor="message">Message au propriétaire</Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Décrivez votre intérêt pour cette propriété, vos besoins, votre budget, etc..."
                                        rows={8}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Envoi en cours...' : 'Envoyer ma demande'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
