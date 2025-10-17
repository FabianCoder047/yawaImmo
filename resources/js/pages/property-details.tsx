import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/mainLayout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Phone, Mail, ArrowLeft, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    additional_images?: string[];
    all_image_urls?: string[];
    location: string;
    offre: string;
    user: {
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
    };
    categorie: {
        id: number;
        name: string;
    };
}

interface PropertyShowProps {
    property: Property;
}

export default function PropertyShow({ property }: PropertyShowProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Utiliser les URLs complètes des images depuis le modèle si disponibles
    const allImages = property.all_image_urls || [];
    
    // Si pas d'URLs complètes, essayer de les construire manuellement
    const fallbackImages = [
        property.image,
        ...(property.additional_images || [])
    ].filter(img => typeof img === 'string' && img.trim() !== '');
    
    const finalImages = allImages.length > 0 ? allImages : fallbackImages;
    
    console.log('Images du bien:', {
        image: property.image,
        additional_images: property.additional_images,
        all_image_urls: property.all_image_urls,
        finalImages: finalImages
    });

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === finalImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? finalImages.length - 1 : prevIndex - 1
        );
    };

    if (!property) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Propriété non trouvée</h1>
                        <p className="mt-4 text-gray-600">La propriété que vous recherchez n'existe pas ou a été supprimée.</p>
                        <Link href="/properties" className="mt-6 inline-block">
                            <Button>Retour à la liste des propriétés</Button>
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={property.title} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Bouton retour */}
                <div className="mb-6">
                    <Link 
                        href="/properties" 
                        className="inline-flex items-center text-green-600 hover:underline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux propriétés
                    </Link>
                </div>

                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                    <div className="mt-2 flex items-center text-gray-600">
                        <MapPin className="mr-2 h-5 w-5" />
                        <span>{property.location}</span>
                    </div>
                    <div className="mt-4">
                        <Badge className="bg-green-100 text-green-800 text-sm">
                            {property.offre}
                        </Badge>
                        <span className="ml-3 text-2xl font-bold text-green-600">
                            {property.price.toLocaleString()} FCFA
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Galerie d'images */}
                    <div className="lg:col-span-2">
                        <div className="relative overflow-hidden rounded-lg bg-gray-100">
                            {/* Image principale */}
                            <img 
                                src={finalImages[currentImageIndex]} 
                                alt={`${property.title} - Image ${currentImageIndex + 1} sur ${finalImages.length}`}
                                className="h-[500px] w-full object-cover"
                            />
                            
                            {/* Contrôles de navigation */}
                            {finalImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={goToPreviousImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                        aria-label="Image précédente"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button 
                                        onClick={goToNextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                        aria-label="Image suivante"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                            
                            {/* Indicateur d'images */}
                            {finalImages.length > 1 && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                    {finalImages.map((_: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`h-2 w-2 rounded-full ${
                                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                            }`}
                                            aria-label={`Aller à l'image ${index + 1}`}
                                            type="button"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Miniatures des images */}
                        {finalImages.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {finalImages.map((image: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`overflow-hidden rounded-md border-2 ${
                                            index === currentImageIndex 
                                                ? 'border-green-500' 
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                        type="button"
                                    >
                                        <img 
                                            src={image} 
                                            alt={`${property.title} - Miniature ${index + 1} sur ${finalImages.length}`}
                                            className="h-20 w-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Description */}
                        <div className="mt-8">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Description</h2>
                            <p className="text-gray-700">
                                {property.description || 'Aucune description disponible.'}
                            </p>
                        </div>
                    </div>

                    {/* Informations du propriétaire */}
                    <div>
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                                <CardDescription>
                                    Contacter le propriétaire pour plus d'informations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <User className="mr-2 h-5 w-5 text-gray-500" />
                                        <span>{property.user.prenom} {property.user.nom}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="mr-2 h-5 w-5 text-gray-500" />
                                        <a 
                                            href={`tel:${property.user.telephone}`}
                                            className="hover:text-green-600 hover:underline"
                                        >
                                            {property.user.telephone}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="mr-2 h-5 w-5 text-gray-500" />
                                        <a 
                                            href={`mailto:${property.user.email}`}
                                            className="hover:text-green-600 hover:underline"
                                        >
                                            {property.user.email}
                                        </a>
                                    </div>
                                    <a 
                                        href={`https://wa.me/${property.user.telephone.replace(/[^0-9]/g, '')}?text=Bonjour ${property.user.prenom}, je suis intéressé(e) par votre annonce "${property.title}"`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#2E7D32] px-4 py-2 text-white hover:bg-green-600"
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                        Contacter via WhatsApp
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
