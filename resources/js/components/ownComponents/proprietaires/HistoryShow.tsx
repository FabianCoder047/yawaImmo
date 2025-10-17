import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Calendar, Phone, User, Home, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

interface Property {
    id: number;
    title: string;
    description: string;
    type: string;
    status: 'Vendu' | 'Loué';
    price: number;
    location: string;
    created_at: string;
    updated_at: string;
    client_name: string;
    client_surname: string;
    client_phone: string;
    category_name: string;
    main_image: string | null;
    additional_images: string[];
}

interface HistoryShowProps {
    property: Property;
}

export default function HistoryShow({ property }: HistoryShowProps) {
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
            <Head title={`Détails - ${property.title}`} />

            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href={route('proprietaire.historique')} className="flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à l'historique
                    </Link>
                </Button>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{property.title}</h1>
                        <div className="flex items-center mt-2 space-x-2">
                            {getStatusBadge(property.status)}
                            <span className="text-gray-500">
                                {property.status === 'Loué' ? 'Loué le ' : 'Vendu le '}
                                {format(new Date(property.updated_at), 'dd MMMM yyyy', { locale: fr })}
                            </span>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                        {property.status === 'Loué' && ' / mois'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Galerie d'images */}
                <div className="lg:col-span-2 space-y-4">
                    {property.main_image && (
                        <div className="rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={property.main_image}
                                alt={property.title}
                                className="w-full h-auto max-h-96 object-cover"
                            />
                        </div>
                    )}

                    {property.additional_images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {property.additional_images.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                                    <img
                                        src={image}
                                        alt={`${property.title} - ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Détails du bien */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Détails du bien</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-medium">{property.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Catégorie</p>
                                    <p className="font-medium">{property.category_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Localisation</p>
                                    <p className="font-medium flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {property.location}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date d'ajout</p>
                                    <p className="font-medium flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {format(new Date(property.created_at), 'dd/MM/yyyy', { locale: fr })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Description</p>
                                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Informations du client</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {property.client_name} {property.client_surname}
                                        </p>
                                        <p className="text-sm text-gray-500">Client {property.status === 'Loué' ? 'locataire' : 'acquéreur'}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 pl-11">
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                        <a href={`tel:${property.client_phone}`} className="hover:underline">
                                            {property.client_phone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium">
                                    {property.status === 'Loué' 
                                        ? 'Contrat de location' 
                                        : 'Acte de vente'}
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        {property.status === 'Loué'
                                            ? 'Le contrat de location a été généré et signé électroniquement.'
                                            : 'L\'acte de vente a été enregistré et signé électroniquement.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composants UI réutilisables
function Card({ className, ...props }: any) {
    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: any) {
    return <div className={`p-6 border-b border-gray-200 ${className}`} {...props} />;
}

function CardTitle({ className, ...props }: any) {
    return <h3 className={`font-semibold ${className}`} {...props} />;
}

function CardContent({ className, ...props }: any) {
    return <div className={`p-6 ${className}`} {...props} />;
}
