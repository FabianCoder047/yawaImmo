import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/mainLayout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Phone, Mail, MessageSquare } from 'lucide-react';

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

interface PropertyShowProps {
    property: Property;
}

export default function PropertyShow({ property }: PropertyShowProps) {
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
                                {property.images && property.images.length > 0 ? (
                                    property.images.map((image, index) => (
                                        <div 
                                            key={`slide-${index}`}
                                            className={`carousel-slide absolute inset-0 transition-opacity duration-300 ${
                                                index === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                            }`}
                                            data-index={index}
                                        >
                                            <img
                                                src={image}
                                                alt={`${property.title} - Image ${index + 1}`}
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
                                    ))
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-gray-100">
                                        <span className="text-gray-500">Aucune image disponible</span>
                                    </div>
                                )}

                                {/* Boutons de navigation */}
                                {property.images && property.images.length > 1 && (
                                    <>
                                        <button 
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                const slides = Array.from(document.querySelectorAll('.carousel-slide'));
                                                if (slides.length === 0) return;
                                                
                                                const currentSlide = slides.find(slide => 
                                                    slide.classList.contains('opacity-100')
                                                ) as HTMLElement | undefined;
                                                if (!currentSlide) return;
                                                
                                                const currentIndex = parseInt(currentSlide.getAttribute('data-index') || '0');
                                                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                                                
                                                currentSlide.classList.remove('opacity-100', 'pointer-events-auto');
                                                currentSlide.classList.add('opacity-0', 'pointer-events-none');
                                                
                                                const prevSlide = slides[prevIndex] as HTMLElement;
                                                if (prevSlide) {
                                                    prevSlide.classList.remove('opacity-0', 'pointer-events-none');
                                                    prevSlide.classList.add('opacity-100', 'pointer-events-auto');
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button 
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                const slides = Array.from(document.querySelectorAll('.carousel-slide'));
                                                if (slides.length === 0) return;
                                                
                                                const currentSlide = slides.find(slide => 
                                                    slide.classList.contains('opacity-100')
                                                ) as HTMLElement | undefined;
                                                if (!currentSlide) return;
                                                
                                                const currentIndex = parseInt(currentSlide.getAttribute('data-index') || '0');
                                                const nextIndex = (currentIndex + 1) % slides.length;
                                                
                                                currentSlide.classList.remove('opacity-100', 'pointer-events-auto');
                                                currentSlide.classList.add('opacity-0', 'pointer-events-none');
                                                
                                                const nextSlide = slides[nextIndex] as HTMLElement;
                                                if (nextSlide) {
                                                    nextSlide.classList.remove('opacity-0', 'pointer-events-none');
                                                    nextSlide.classList.add('opacity-100', 'pointer-events-auto');
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Miniatures */}
                            {property.images && property.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {property.images.map((image, index) => (
                                        <button
                                            key={`thumb-${index}`}
                                            className="relative h-20 w-full overflow-hidden rounded-md border-2 border-transparent hover:border-green-500 transition-all"
                                            onClick={() => {
                                                const slides = Array.from(document.querySelectorAll('.carousel-slide'));
                                                if (!slides.length) return;
                                                
                                                // Masquer toutes les diapositives
                                                slides.forEach(slide => {
                                                    slide.classList.remove('opacity-100', 'pointer-events-auto');
                                                    slide.classList.add('opacity-0', 'pointer-events-none');
                                                });
                                                
                                                // Afficher la diapositive sélectionnée
                                                const targetSlide = slides[index];
                                                if (targetSlide) {
                                                    targetSlide.classList.remove('opacity-0', 'pointer-events-none');
                                                    targetSlide.classList.add('opacity-100', 'pointer-events-auto');
                                                }
                                            }}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`${property.title} - Miniature ${index + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = document.createElement('div');
                                                    fallback.className = 'h-full w-full flex items-center justify-center bg-gray-100';
                                                    fallback.innerHTML = '<svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                                                    target.parentNode?.insertBefore(fallback, target.nextSibling);
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Description */}
                        <Card className="mt-8">
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
            </div>
        </MainLayout>
    );
}
