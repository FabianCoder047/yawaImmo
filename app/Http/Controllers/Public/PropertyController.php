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
        $property = Property::with(['user', 'categorie'])
            ->where('status', 'Approuvé')
            ->findOrFail($id);

        // Utiliser les accesseurs du modèle pour les URLs d'images
        $allImages = $property->all_image_urls;
        $mainImage = !empty($allImages) ? $allImages[0] : null;
        
        // Préparer les données pour le carrousel
        $carouselImages = array_map(function($image, $index) use ($mainImage) {
            return [
                'id' => $index,
                'src' => $image,
                'alt' => 'Image ' . ($index + 1) . ' du bien',
                'isActive' => $image === $mainImage
            ];
        }, $allImages, array_keys($allImages));

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
            'images' => $allImages,
            'main_image' => $mainImage,
            'carousel_images' => $carouselImages, // Nouveau format pour le carrousel
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

        return Inertia::render('properties/show', [
            'property' => $propertyData
        ]);
    }
}
