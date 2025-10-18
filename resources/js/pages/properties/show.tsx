import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/mainLayout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Phone, Mail, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    location: string;
    offre: string;
    surface?: number;
    rooms?: number;
    bathrooms?: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
    images: string[];
    main_image: string | null;
    user: {
        id: number;
        nom: string;
        prenom: string;
        telephone: string | null;
        email: string;
        created_at?: string;
    };
    categorie: {
        id: number;
        name: string;
        slug?: string;
    } | null;
}

interface SimilarProperty {
    id: number;
    title: string;
    price: number;
    location: string;
    surface?: number;
    rooms?: number;
    offre: string;
    image_url: string | null;
    categorie: {
        id: number;
        name: string;
        slug?: string;
    } | null;
}

interface PropertyShowProps {
    property: Property;
    similarProperties: SimilarProperty[];
}

export default function PropertyShow({ property, similarProperties = [] }: PropertyShowProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    
    // Vérifier si les images sont des URLs valides
    const validateImageUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            console.warn('URL d\'image invalide :', url);
            return false;
        }
    };
    
    // Formater les URLs des images
    const formatImageUrl = (url: string): string => {
        if (!url) return '';
        
        // Si c'est déjà une URL complète, on la retourne telle quelle
        if (url.startsWith('http')) {
            return url;
        }
        
        // Nettoyer l'URL
        let cleanUrl = url.trim();
        
        // Ajouter le préfixe /storage/ si nécessaire
        if (!cleanUrl.startsWith('/storage/')) {
            cleanUrl = cleanUrl.startsWith('/') 
                ? `/storage${cleanUrl}`
                : `/storage/${cleanUrl}`;
        }
        
        // S'assurer qu'il n'y a pas de double slash
        cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, '$1');
        
        return cleanUrl;
    };
    
    // Préparer les images pour l'affichage
    const validImages = useMemo(() => {
        if (!property.images || !Array.isArray(property.images)) {
            console.warn('Aucune image valide trouvée pour cette propriété');
            return [];
        }
        
        // Filtrer et formater les images
        return property.images
            .filter(img => img && typeof img === 'string' && img.trim() !== '')
            .map(img => formatImageUrl(img));
    }, [property.images]);
    
    // Gestion du changement d'image
    const goToNext = () => {
        setActiveImageIndex((prevIndex) => 
            prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
        );
    };
    
    const goToPrevious = () => {
        setActiveImageIndex((prevIndex) =>
            prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
        );
    };
    
    const goToImage = (index: number) => {
        setActiveImageIndex(index);
    };

    // Vérifier si la propriété existe
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

    // S'assurer que les données nécessaires sont présentes
    if (!property.user || !property.categorie) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Erreur de chargement</h1>
                        <p className="mt-4 text-gray-600">Les informations de la propriété sont incomplètes.</p>
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
            
            <div className="container mx-auto px-4 py-12">
                {/* Bouton retour */}
                <div className="mb-6">
                    <Link href="/properties" className="inline-flex items-center text-green-600 hover:underline">
                        &larr; Retour à la liste des propriétés
                    </Link>
                </div>

                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                    <div className="mt-2 flex items-center text-gray-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{property.location}</span>
                    </div>
                    <div className="mt-4">
                        <Badge className="bg-green-100 text-green-800">
                            {property.offre}
                        </Badge>
                        <span className="ml-4 text-2xl font-bold text-green-600">
                            {property.price.toLocaleString()} FCFA
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Galerie d'images */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            {/* Carrousel principal */}
                            <div className="relative h-96 w-full overflow-hidden rounded-lg mb-4">
                                {validImages.length > 0 ? (
                                    <div className="relative h-full w-full">
                                        {/* Image active */}
                                        <div className="h-full w-full">
                                            <img
                                                src={validImages[activeImageIndex]}
                                                alt={`${property.title} - Image ${activeImageIndex + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = document.createElement('div');
                                                    fallback.className = 'h-full w-full flex items-center justify-center bg-gray-100';
                                                    fallback.innerHTML = '<svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                                                    target.parentNode?.insertBefore(fallback, target.nextSibling);
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Indicateurs de diapositives */}
                                        {validImages.length > 1 && (
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                                {validImages.map((_, index) => (
                                                    <button
                                                        key={`indicator-${index}`}
                                                        className={`w-2 h-2 rounded-full transition-colors ${
                                                            index === activeImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                                                        }`}
                                                        onClick={() => goToImage(index)}
                                                        aria-label={`Aller à l'image ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Boutons de navigation */}
                                        {validImages.length > 1 && (
                                            <>
                                                <button 
                                                    type="button"
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        goToPrevious();
                                                    }}
                                                    aria-label="Image précédente"
                                                >
                                                    <ChevronLeft className="h-6 w-6" />
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        goToNext();
                                                    }}
                                                    aria-label="Image suivante"
                                                >
                                                    <ChevronRight className="h-6 w-6" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-gray-100">
                                        <span className="text-gray-500">Aucune image disponible</span>
                                    </div>
                                )}
                            </div>

                            {/* Miniatures des images */}
                            {property.images && property.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto py-2">
                                    {property.images.map((image, index) => (
                                        <button
                                            key={`thumb-${index}`}
                                            type="button"
                                            className="flex-shrink-0 w-20 h-16 overflow-hidden rounded-md border border-gray-200 hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            onClick={() => {
                                                const slides = Array.from(document.querySelectorAll('[data-index]'));
                                                const currentSlide = slides.find(slide => 
                                                    slide.classList.contains('opacity-100')
                                                ) as HTMLElement | undefined;
                                                
                                                if (currentSlide) {
                                                    currentSlide.classList.remove('opacity-100', 'pointer-events-auto');
                                                    currentSlide.classList.add('opacity-0', 'pointer-events-none');
                                                }
                                                
                                                const targetSlide = slides.find(slide => 
                                                    slide.getAttribute('data-index') === index.toString()
                                                ) as HTMLElement;
                                                
                                                if (targetSlide) {
                                                    targetSlide.classList.remove('opacity-0', 'pointer-events-none');
                                                    targetSlide.classList.add('opacity-100', 'pointer-events-auto');
                                                }
                                            }}
                                        >
                                            <img
                                                src={image?.startsWith('http') ? image : `/${image.replace(/^\//, '')}`}
                                                alt={`Miniature ${index + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = document.createElement('div');
                                                    fallback.className = 'h-full w-full flex items-center justify-center bg-gray-100';
                                                    fallback.innerHTML = '<svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                                                    target.parentNode?.insertBefore(fallback, target.nextSibling);
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>
                    
                    {/* Description */}
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line text-gray-700">
                                    {property.description || 'Aucune description disponible pour ce bien.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    </div>

                    {/* Formulaire de contact */}
                    <div>
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Contacter le propriétaire</CardTitle>
                                <CardDescription>
                                    Remplissez le formulaire pour plus d'informations sur ce bien.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {property.user.prenom} {property.user.nom}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Phone className="mr-1 h-4 w-4" />
                                            <a href={`tel:${property.user.telephone}`} className="hover:underline">
                                                {property.user.telephone}
                                            </a>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Mail className="mr-1 h-4 w-4" />
                                            <a href={`mailto:${property.user.email}`} className="hover:underline">
                                                {property.user.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    <p>Ou contactez directement le propriétaire</p>
                                </div>
                                
                                <div className="mt-4">
                                    {property.user.telephone ? (
                                        <a 
                                            href={`https://wa.me/${property.user.telephone.replace(/[^0-9]/g, '')}?text=Bonjour ${property.user.prenom}, je suis intéressé(e) par votre annonce "${property.title}"`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#2E7D32] px-4 py-2 text-white hover:bg-green-600"
                                        >
                                            <MessageSquare className="h-5 w-5" />
                                            Contacter sur WhatsApp
                                        </a>
                                    ) : (
                                        <div className="text-center text-sm text-gray-500">
                                            Numéro de téléphone non disponible
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                    </div>
                    
                </div>

                {/* Biens similaires */}
                {similarProperties.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Biens similaires</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {similarProperties.map((similar) => (
                                <Link key={similar.id} href={`/properties/${similar.id}`} className="group block">
                                    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
                                        <div className="relative h-48 overflow-hidden">
                                            {similar.image_url ? (
                                                <img
                                                    src={similar.image_url}
                                                    alt={similar.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-gray-100">
                                                    <span className="text-gray-400">Aucune image</span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-2 right-2">
                                                <Badge className="bg-green-100 text-green-800">
                                                    {similar.offre}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                                                {similar.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {similar.location}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-lg font-bold text-green-600">
                                                    {similar.price.toLocaleString()} FCFA
                                                </span>
                                                <div className="text-sm text-gray-500">
                                                    {similar.surface && `${similar.surface} m²`}
                                                    {similar.rooms && ` • ${similar.rooms} pièces`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>

        </MainLayout>
    );
}
