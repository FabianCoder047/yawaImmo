'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import React from 'react';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

interface FeaturedProperty {
  id: number;
  title: string;
  price: number;
  location: string;
  image: string | null;
  all_images?: string[];
  offre: string;
  created_at: string;
  description?: string;
  user?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
}

// Fonction utilitaire pour obtenir l'URL complète de l'image
const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  return imagePath.startsWith('http') 
    ? imagePath 
    : imagePath.startsWith('/storage/')
      ? imagePath
      : `/storage/${imagePath}`;
};

export default function HeroCarousel() {
  const { featuredProperties = [] } = usePage().props as { featuredProperties?: FeaturedProperty[] };

  // Formater le prix
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XOF',
      maximumFractionDigits: 0 
    }).format(price);
  };

  // Gestion des erreurs d'image
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const img = e.target as HTMLImageElement;
    img.onerror = null; // Évite la boucle d'erreur
    img.src = 'https://via.placeholder.com/1920x1080?text=Image+non+disponible';
    img.className = 'absolute inset-0 w-full h-full object-cover';
  };

  // Si aucune propriété n'est disponible, ne pas afficher le carrousel
  if (!featuredProperties || featuredProperties.length === 0) {
    return null;
  }

  // Préparer les slides avec toutes les images
  const slides = [];
  for (const property of featuredProperties) {
    // Si la propriété a des images multiples
    if (property.all_images?.length) {
      for (const img of property.all_images) {
        const imageUrl = getImageUrl(img);
        if (imageUrl) {
          slides.push({ property, imageUrl });
        }
      }
    } 
    // Sinon, utiliser l'image principale si elle existe
    else if (property.image) {
      const imageUrl = getImageUrl(property.image);
      if (imageUrl) {
        slides.push({ property, imageUrl });
      }
    }
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 5
        }}
        autoplay={{ 
          delay: 5000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={slides.length > 1}
        className="h-[90vh] w-full"
      >
        {slides.map(({ property, imageUrl }, index) => (
          <SwiperSlide key={`${property.id}-${index}`}>
            <div className="relative h-full w-full">
              <img
                src={imageUrl}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black/50 z-0" />
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 lg:px-24">
                  <div className="max-w-2xl text-white space-y-4">
                    <p className="text-sm md:text-base uppercase tracking-wide">
                      {property.location}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                      {property.title}
                    </h1>
                    <p className="text-2xl font-semibold text-green-400">
                      {formatPrice(property.price)}
                    </p>
                    <div className="pt-4">
                      <Link 
                        href={`/biens/${property.id}`}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
