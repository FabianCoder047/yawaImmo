import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MapPin, User as UserIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Types pour les propriétés de la page
interface UserType {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    [key: string]: unknown;
}

interface PropertyType {
    id: number;
    title: string;
    price: number;
    image: string | null;
    all_images?: (string | null)[];
    location: string;
    offre: string;
    user: UserType;
    created_at?: string;
}

interface AuthProps {
    user?: UserType;
    [key: string]: unknown;
}

interface FlashProps {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    [key: string]: unknown;
}

interface PageProps {
    auth?: AuthProps;
    flash?: FlashProps;
    [key: string]: unknown;
}

// Composant de navigation personnalisé
const NavigationButtons = ({ swiperRef }: { swiperRef: { current: SwiperType | null } }) => (
    <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
        <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md transition hover:bg-white"
            aria-label="Image précédente"
        >
            <ChevronLeft size={20} />
        </button>
        <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md transition hover:bg-white"
            aria-label="Image suivante"
        >
            <ChevronRight size={20} />
        </button>
    </div>
);

// Fonction utilitaire pour obtenir l'URL complète de l'image
const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') 
        ? imagePath 
        : imagePath.startsWith('/storage/')
            ? imagePath
            : `/storage/${imagePath}`;
};

interface LatestPropertiesProps {
    properties?: PropertyType[];
    filters?: {
        categorie?: string;
        location?: string;
        type?: 'location' | 'vente' | '';
    };
}

export default function LatestProperties({ 
    properties: initialProperties = [],
    filters = {}
}: LatestPropertiesProps) {
    const [properties, setProperties] = useState<PropertyType[]>(initialProperties);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = usePage<PageProps>().props.auth || {};
    const swiperRefs = useRef<{[key: number]: SwiperType | null}>({});

    useEffect(() => {
        const loadProperties = async () => {
            const hasActiveFilters = filters && Object.values(filters).some(value => 
                value !== undefined && value !== '' && value !== null
            );

            if (!hasActiveFilters) {
                setProperties(initialProperties);
                return;
            }
            
            setIsLoading(true);
            try {
                const cleanFilters = Object.fromEntries(
                    Object.entries(filters).filter(([, value]) => 
                        value !== '' && value !== null && value !== undefined
                    )
                );

                const response = await fetch(`/biens?${new URLSearchParams(cleanFilters as Record<string, string>)}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.properties) {
                    if (data.properties.data) {
                        setProperties(data.properties.data);
                    } else if (Array.isArray(data.properties)) {
                        setProperties(data.properties);
                    }
                } else if (Array.isArray(data)) {
                    setProperties(data);
                } else {
                    console.warn('Format de réponse inattendu:', data);
                    setProperties(initialProperties);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des propriétés:', error);
                setProperties(initialProperties);
            } finally {
                setIsLoading(false);
            }
        };

        loadProperties();
    }, [filters, initialProperties]);

    // Fonction pour obtenir les images d'une propriété
    const getPropertyImages = (property: PropertyType): string[] => {
        if (property.all_images && property.all_images.length > 0) {
            return property.all_images
                .map(img => getImageUrl(img))
                .filter((img): img is string => !!img);
        }
        if (property.image) {
            const imgUrl = getImageUrl(property.image);
            return imgUrl ? [imgUrl] : [];
        }
        return [];
    };

    return (
        <section className="bg-white py-16" id="latest-properties">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
                {/* Header */}
                <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
                    <h2 className="inline-block border-b-4 border-green-500 pb-2 text-3xl font-bold text-gray-800">Propriétés récentes</h2>
                    <Link href="/properties" className="mt-4 text-green-600 hover:underline md:mt-0">
                        Voir plus →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">Chargement des propriétés...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">
                            {Object.keys(filters).length > 0 
                                ? "Aucune propriété ne correspond à vos critères de recherche."
                                : "Aucune propriété disponible pour le moment"}
                        </p>
                    </div>
                ) : (
                    /* Swiper principal pour les cartes de propriétés */
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        spaceBetween={30}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-12"
                    >
                        {properties.map((property) => {
                            const images = getPropertyImages(property);
                            const hasMultipleImages = images.length > 1;
                            
                            return (
                                <SwiperSlide key={property.id} className="pb-10">
                                    <div className="mx-2 overflow-hidden rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
                                        <div className="relative h-60 w-full overflow-hidden">
                                            {images.length > 0 ? (
                                                <div className="relative h-full w-full">
                                                    <Swiper
                                                        modules={[Navigation, Pagination]}
                                                        onSwiper={(swiper) => {
                                                            if (swiperRefs.current) {
                                                                swiperRefs.current[property.id] = swiper;
                                                            }
                                                        }}
                                                        loop={hasMultipleImages}
                                                        pagination={hasMultipleImages ? { 
                                                            clickable: true,
                                                            el: '.swiper-pagination',
                                                            type: 'bullets'
                                                        } : false}
                                                        navigation={hasMultipleImages ? {
                                                            nextEl: '.swiper-button-next',
                                                            prevEl: '.swiper-button-prev',
                                                        } : false}
                                                        className="h-full w-full"
                                                    >
                                                        {images.map((img, index) => (
                                                            <SwiperSlide key={index} className="h-full w-full">
                                                                <img 
                                                                    src={img} 
                                                                    alt={`${property.title} - Image ${index + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+non+disponible';
                                                                    }}
                                                                />
                                                            </SwiperSlide>
                                                        ))}
                                                    </Swiper>
                                                    
                                                    {hasMultipleImages && (
                                                        <>
                                                            <div className="swiper-pagination absolute bottom-2 left-1/2 z-10 -translate-x-1/2"></div>
                                                            <div className="swiper-button-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 text-white"></div>
                                                            <div className="swiper-button-next absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white"></div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                    <span className="text-gray-400">Pas d'image disponible</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-white p-5">
                                            <h3 className="mb-2 text-xl font-semibold text-gray-800">{property.title}</h3>
                                            <p className="mb-3 font-medium text-green-600">
                                                {property.offre} | {property.price.toLocaleString()} FCFA
                                            </p>
                                            <div className="mt-3">
                                                <Link 
                                                    href={`/properties/${property.id}`}
                                                    className="inline-block text-green-600 hover:underline"
                                                >
                                                    Voir les détails →
                                                </Link>
                                                <div className="mt-4 text-sm text-gray-600">
                                                    <p className="mb-1 flex items-center">
                                                        <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                                                        <strong>Localisation:</strong> {property.location}
                                                    </p>
                                                    <p className="flex items-center">
                                                        <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
                                                        <strong>Propriétaire:</strong> {property.user ? `${property.user.prenom} ${property.user.nom}` : 'Non spécifié'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                )}
            </div>
        </section>
    );
}
