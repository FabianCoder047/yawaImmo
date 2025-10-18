<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of approved properties with filters.
     */
    public function index(Request $request)
    {
        $isHomePage = $request->is('/');
        
        // Base query for approved properties
        $query = Property::with(['user', 'categorie'])
            ->where('status', 'Approuvé')
            ->when($request->categorie, function($q) use ($request) {
                $q->where('categorie_id', $request->categorie);
            })
            ->when($request->location, function($q) use ($request) {
                $q->where('location', 'like', '%' . $request->location . '%');
            })
            ->when($request->type, function($q) use ($request) {
                $q->where('offre', $request->type);
            })
            ->when($request->min_price, function($q) use ($request) {
                $q->where('price', '>=', $request->min_price);
            })
            ->when($request->max_price, function($q) use ($request) {
                $q->where('price', '<=', $request->max_price);
            });

        if ($isHomePage) {
            // For home page, get only 9 latest properties
            $properties = $query->take(9)->get()->map(function($property) {
                $allImages = $property->all_image_urls;
                $property->image_url = !empty($allImages) ? $allImages[0] : null;
                return $property;
            });
        } else {
            // For properties page, get paginated results (12 items per page)
            $properties = $query->paginate(12)->through(function($property) {
                $allImages = $property->all_image_urls;
                $property->image_url = !empty($allImages) ? $allImages[0] : null;
                return $property;
            });
        }

        // Get featured properties for hero carousel (first 5 approved properties)
        $featuredProperties = Property::with(['user', 'categorie'])
            ->where('status', 'Approuvé')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($property) {
                // Utiliser les accesseurs du modèle pour les URLs d'images
                $allImages = $property->all_image_urls;
                
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'price' => $property->price,
                    'location' => $property->location,
                    'image' => !empty($allImages) ? $allImages[0] : null, // Première image
                    'all_images' => $allImages, // Toutes les images
                    'offre' => $property->offre,
                    'created_at' => $property->created_at->toDateTimeString(),
                    'description' => $property->description,
                    'user' => $property->user ? [
                        'id' => $property->user->id,
                        'nom' => $property->user->nom,
                        'prenom' => $property->user->prenom,
                        'email' => $property->user->email,
                        'telephone' => $property->user->telephone,
                    ] : null
                ];
            });

        // Get all categories for the filter dropdown
        $categories = Categorie::all();

        // Return JSON only for AJAX requests
        if ($request->wantsJson()) {
            return response()->json([
                'properties' => $properties,
                'categories' => $categories,
                'featuredProperties' => $featuredProperties,
                'filters' => $request->only(['categorie', 'location', 'type', 'min_price', 'max_price'])
            ]);
        }

        // For regular requests, return Inertia response
        if ($isHomePage) {
            return Inertia::render('welcome', [
                'properties' => $properties,
                'featuredProperties' => $featuredProperties,
                'categories' => $categories,
                'filters' => $request->only(['categorie', 'location', 'type', 'min_price', 'max_price'])
            ]);
        } else {
            return Inertia::render('Properties', [
                'properties' => $properties,
                'categories' => $categories,
                'filters' => $request->only(['categorie', 'location', 'type', 'min_price', 'max_price'])
            ]);
        }
    }

    /**
     * Display the specified property.
     */
    public function show($id)
    {
        // Récupérer la propriété avec les relations nécessaires
        $property = Property::with(['user', 'categorie'])
            ->where('status', 'Approuvé')
            ->findOrFail($id);
            
        // Forcer le chargement des attributs supplémentaires
        $property->append(['all_image_urls', 'formatted_additional_images']);
        
        // Debug: Afficher les données brutes
        \Log::info('=== DÉBOGAGE DES IMAGES ===');
        \Log::info('Données de la propriété:', [
            'id' => $property->id,
            'image' => $property->image,
            'additional_images' => $property->additional_images,
            'all_image_urls' => $property->all_image_urls,
            'formatted_additional_images' => $property->formatted_additional_images,
            'raw_attributes' => $property->getAttributes(),
            'storage_path' => storage_path('app/public'),
            'public_path' => public_path('storage')
        ]);
        
        // Vérifier l'existence des fichiers
        if (!empty($property->image)) {
            $imagePath = str_replace('storage/', '', $property->image);
            \Log::info('Vérification de l\'image principale:', [
                'path' => $imagePath,
                'exists' => \Storage::disk('public')->exists($imagePath) ? 'Oui' : 'Non',
                'full_path' => storage_path('app/public/' . $imagePath)
            ]);
        }
        
        if (!empty($property->additional_images) && is_array($property->additional_images)) {
            foreach ($property->additional_images as $index => $img) {
                if (!empty($img)) {
                    $imgPath = str_replace('storage/', '', $img);
                    \Log::info('Vérification de l\'image supplémentaire ' . ($index + 1) . ':', [
                        'path' => $imgPath,
                        'exists' => \Storage::disk('public')->exists($imgPath) ? 'Oui' : 'Non',
                        'full_path' => storage_path('app/public/' . $imgPath)
                    ]);
                }
            }
        }

        // Utiliser les accesseurs du modèle pour les URLs d'images
        $allImages = $property->all_image_urls;
        
        // S'assurer que $allImages est un tableau
        if (!is_array($allImages)) {
            $allImages = [];
        }
        
        // Nettoyer le tableau des images vides
        $allImages = array_filter($allImages, function($image) {
            return !empty($image);
        });
        
        $mainImage = !empty($allImages) ? reset($allImages) : null;
        
        // Préparer les données pour le carrousel
        $carouselImages = array_map(function($image, $index) use ($mainImage) {
            return [
                'id' => $index,
                'src' => $image,
                'alt' => 'Image ' . ($index + 1) . ' du bien',
                'isActive' => $image === $mainImage
            ];
        }, $allImages, array_keys($allImages));

        // S'assurer que toutes les images sont des tableaux et non null
        $allImages = is_array($allImages) ? $allImages : [];
        $carouselImages = is_array($carouselImages) ? $carouselImages : [];
        
        $propertyData = [
            'id' => $property->id,
            'title' => $property->title,
            'description' => $property->description,
            'price' => $property->price,
            'location' => $property->location,
            'surface' => $property->surface,
            'rooms' => $property->rooms,
            'bathrooms' => $property->bathrooms,
            'offre' => $property->offre,
            'status' => $property->status,
            'created_at' => $property->created_at->toDateTimeString(),
            'updated_at' => $property->updated_at->toDateTimeString(),
            'images' => $allImages, // Toutes les URLs d'images
            'main_image' => $mainImage,
            'carousel_images' => $carouselImages, // Format pour le carrousel
            'categorie' => $property->categorie ? [
                'id' => $property->categorie->id,
                'name' => $property->categorie->name,
                'slug' => $property->categorie->slug
            ] : null,
            'user' => $property->user ? [
                'id' => $property->user->id,
                'nom' => $property->user->nom,
                'prenom' => $property->user->prenom,
                'email' => $property->user->email,
                'telephone' => $property->user->telephone,
                'created_at' => $property->user->created_at->toDateTimeString()
            ] : null
        ];

        // Récupérer des biens similaires (même catégorie, même type d'offre, limité à 4)
        $similarProperties = [];
        if ($property->categorie) {
            $similarProperties = Property::with(['user', 'categorie'])
                ->where('status', 'Approuvé')
                ->where('id', '!=', $property->id) // Exclure le bien actuel
                ->where('categorie_id', $property->categorie->id)
                ->where('offre', $property->offre)
                ->take(4)
                ->get()
                ->map(function($similar) {
                    $allImages = $similar->all_image_urls;
                    return [
                        'id' => $similar->id,
                        'title' => $similar->title,
                        'price' => $similar->price,
                        'location' => $similar->location,
                        'surface' => $similar->surface,
                        'rooms' => $similar->rooms,
                        'offre' => $similar->offre,
                        'image_url' => !empty($allImages) ? $allImages[0] : null,
                        'categorie' => $similar->categorie ? [
                            'id' => $similar->categorie->id,
                            'name' => $similar->categorie->name,
                            'slug' => $similar->categorie->slug
                        ] : null
                    ];
                });
        }

        return Inertia::render('properties/show', [
            'property' => $propertyData,
            'similarProperties' => $similarProperties
        ]);
    }
}
