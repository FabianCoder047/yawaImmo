import LayoutAdmin from '@/layouts/layoutAdmin';
import { ArrowLeft, Building, Calendar, DollarSign, FileText, MapPin, User } from 'lucide-react';
import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Property {
    id: number;
    title: string;
    price: number;
    status: string;
    image: string;
    location: string;
    type: string;
    description?: string;
    offre?: string;
    image_url?: string;
    all_image_urls?: string[];
    additional_images?: string[];
    additional_images_urls?: string[];
    user?: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        telephone: string;
    };
    categorie?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
    published_at?: string;
}

interface PropertyShowProps {
    property: Property;
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
}

const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
        case 'approuvé':
        case 'approuve':
            return 'bg-green-100 text-green-800';
        case 'en attente':
        case 'en_attente':
            return 'bg-yellow-100 text-yellow-800';
        case 'rejeté':
        case 'rejete':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function PropertyShow({ property }: PropertyShowProps) {
    if (!property) {
        return (
            <LayoutAdmin>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900">Erreur</h3>
                        <p className="mt-1 text-gray-500">Aucune donnée de propriété disponible</p>
                        <div className="mt-6">
                            <Link
                                href="/admin/biens"
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour à la liste
                            </Link>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        );
    }

    const getOffreColor = (offre?: string) => {
        if (!offre) return 'bg-gray-100 text-gray-800';
        
        switch (offre.toLowerCase()) {
            case 'en vente':
            case 'vente':
                return 'bg-blue-100 text-blue-800';
            case 'en location':
            case 'location':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <LayoutAdmin>
            <Head title={`Détails du bien - ${property?.title || 'Sans titre'}`} />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Détails du bien</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(property.status)}`}>
                            {property.status}
                        </span>
                        {property.offre && (
                            <span className={`rounded-full px-3 py-1 text-sm font-medium ${getOffreColor(property.offre)}`}>
                                {property.offre}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Galerie d'images du bien */}
                    <div className="space-y-4">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Galerie du bien</h2>
                            
                            {/* Carrousel d'images */}
                            <div className="relative">
                                <div className="relative h-96 w-full overflow-hidden rounded-lg">
                                    {(property.all_image_urls || []).map((imageUrl, index) => (
                                        <div 
                                            key={`slide-${index}`}
                                            className={`carousel-slide absolute inset-0 transition-opacity duration-300 ${
                                                index === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                            }`}
                                            data-index={index}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={`${property.title} - Image ${index + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = document.createElement('div');
                                                    fallback.className = 'absolute inset-0 flex items-center justify-center bg-gray-100';
                                                    fallback.innerHTML = '<svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                                                    target.parentNode?.insertBefore(fallback, target.nextSibling);
                                                }}
                                            />
                                        </div>
                                    ))}
                                    
                                    {/* Boutons de navigation */}
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
                                </div>

                            </div>
                            
                            {/* Miniatures */}
                            <div className="mt-4 grid grid-cols-4 md:grid-cols-6 gap-2">
                                {(property.all_image_urls || []).map((imageUrl, index) => (
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
                                            src={imageUrl}
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
                        </div>
                    </div>



                    {/* Informations du bien */}
                    <div className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Informations du bien</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        <span className="text-lg font-semibold text-gray-900">
                                            {property.price?.toLocaleString()} FCFA
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700">{property.location}</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Building className="h-5 w-5 text-gray-600" />
                                        <span className="text-gray-700">Catégorie : {property.categorie?.name}</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                        <span className="text-gray-700">
                                            {new Date(property.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    

                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-600" />
                                        <span className="text-gray-700">Publié par : {property.user?.nom}</span>
                                    </div>
                                </div>

                                {property.description && (
                                    <div>
                                        <div className="mb-2 flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-gray-600" />
                                            <span className="font-medium text-gray-900">Description</span>
                                        </div>
                                        <p className="text-gray-700">{property.description}</p>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Informations du propriétaire */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Informations du propriétaire</h2>
                            {property.user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium text-gray-900">
                                            {property.user.nom} {property.user.prenom}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        <div>Email: {property.user.email}</div>
                                        <div>Téléphone: {property.user.telephone}</div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">Informations du propriétaire non disponibles</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}

// Définition du layout pour la page
