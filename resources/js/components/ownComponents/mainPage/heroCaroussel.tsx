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
}

// Fonction utilitaire pour obtenir l'URL complète de l'image
const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return null;
  return imagePath.startsWith('http') 
    ? imagePath 
    : imagePath.startsWith('/storage/')
      ? imagePath
      : `/storage/${imagePath}`;
};

export default function HeroCarousel() {
  const { featuredProperties = [] } = usePage().props as { featuredProperties?: FeaturedProperty[] };

  // Log pour déboguer
  console.log('Featured Properties:', featuredProperties);
  if (featuredProperties && featuredProperties.length > 0) {
    console.log('First property image path:', featuredProperties[0]?.image);
    console.log('Full image URL:', 
      featuredProperties[0]?.image 
        ? (featuredProperties[0].image.startsWith('http') 
            ? featuredProperties[0].image 
            : featuredProperties[0].image.startsWith('/storage/')
              ? featuredProperties[0].image
              : `/storage/${featuredProperties[0].image}`)
        : 'No image');
  }

  // Si aucune propriété n'est disponible, ne pas afficher le carrousel
  if (!featuredProperties || featuredProperties.length === 0) {
    console.log('Aucune propriété à afficher dans le carrousel');
    return null;
  }

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XOF',
      maximumFractionDigits: 0 
    }).format(price);
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="h-[90vh]"
      >
        {featuredProperties.flatMap(property => {
          // Utiliser all_images si disponible, sinon utiliser l'image unique
          const images = property.all_images && property.all_images.length > 0 
            ? property.all_images 
            : property.image 
              ? [property.image] 
              : [];
          
          return images.map((img, imgIndex) => (
            <SwiperSlide key={`${property.id}-${imgIndex}`}>
              <div
                className="h-full min-h-[500px] w-full bg-cover bg-center relative flex items-center"
                style={{
                  backgroundImage: `url(${getImageUrl(img) || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'fixed',
                  minHeight: '500px',
                  width: '100%'
                }}
              >
                <div className="absolute inset-0 bg-black/50 z-0" />

                <div className="container mx-auto px-6 lg:px-24 z-10">
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
            </SwiperSlide>
          ));
        })}
      </Swiper>
    </div>
  );
}