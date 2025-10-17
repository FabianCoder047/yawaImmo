<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['categorie', 'user'])
            ->whereIn('status', ['Vendu', 'Loué']);

        // Appliquer le filtre de statut si spécifié
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Appliquer le filtre de propriétaire si spécifié
        if ($request->has('proprietaire_id') && $request->proprietaire_id !== 'all') {
            $query->where('user_id', $request->proprietaire_id);
        }

        $properties = $query->orderBy('updated_at', 'desc')
            ->get()
            ->map(function($property) {
                // Gérer l'image principale
                $mainImage = $property->image 
                    ? (str_starts_with($property->image, 'http') 
                        ? $property->image 
                        : asset('storage/' . ltrim($property->image, '/')))
                    : null;

                // Gérer les images supplémentaires
                $additionalImages = is_string($property->additional_images) 
                    ? json_decode($property->additional_images, true) 
                    : $property->additional_images;

                $images = [];
                if ($mainImage) {
                    $images[] = [
                        'id' => 'main',
                        'url' => $mainImage,
                        'is_main' => true
                    ];
                }

                if (is_array($additionalImages)) {
                    foreach ($additionalImages as $index => $img) {
                        if (!empty($img)) {
                            $images[] = [
                                'id' => 'additional_' . $index,
                                'url' => str_starts_with($img, 'http') 
                                    ? $img 
                                    : asset('storage/' . ltrim($img, '/')),
                                'is_main' => false
                            ];
                        }
                    }
                }

                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'type' => $property->type,
                    'status' => $property->status,
                    'price' => $property->price,
                    'location' => $property->location,
                    'updated_at' => $property->updated_at->format('d/m/Y H:i'),
                    'client_name' => $property->client_name,
                    'client_surname' => $property->client_surname,
                    'client_phone' => $property->client_phone,
                    'category_name' => $property->categorie ? $property->categorie->name : 'Non catégorisé',
                    'image' => $mainImage,
                    'images' => $images,
                    'proprietaire' => $property->user ? [
                        'id' => $property->user->id,
                        'nom' => $property->user->nom,
                        'prenom' => $property->user->prenom,
                        'email' => $property->user->email
                    ] : null
                ];
            });

        // Récupérer la liste des propriétaires
        $proprietaires = User::where('role', 'proprietaire')
            ->select('id', 'nom', 'prenom')
            ->orderBy('nom')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom
                ];
            });

        return Inertia::render('admin/History', [
            'properties' => $properties,
            'stats' => [
                'total' => $properties->count(),
                'sold' => $properties->where('status', 'Vendu')->count(),
                'rented' => $properties->where('status', 'Loué')->count(),
            ],
            'proprietaires' => $proprietaires,
            'filters' => request()->only(['proprietaire_id', 'status'])
        ]);
    }

    public function show(Property $property)
    {
        $property->load(['categorie', 'user']);
        
        // Gérer l'image principale
        $mainImage = $property->image 
            ? (str_starts_with($property->image, 'http') 
                ? $property->image 
                : asset('storage/' . ltrim($property->image, '/')))
            : null;

        // Gérer les images supplémentaires
        $additionalImages = is_string($property->additional_images) 
            ? json_decode($property->additional_images, true) 
            : $property->additional_images;

        $images = [];
        if ($mainImage) {
            $images[] = [
                'id' => 'main',
                'url' => $mainImage,
                'is_main' => true
            ];
        }

        if (is_array($additionalImages)) {
            foreach ($additionalImages as $index => $img) {
                if (!empty($img)) {
                    $images[] = [
                        'id' => 'additional_' . $index,
                        'url' => str_starts_with($img, 'http') 
                            ? $img 
                            : asset('storage/' . ltrim($img, '/')),
                        'is_main' => false
                    ];
                }
            }
        }

        $propertyData = [
            'id' => $property->id,
            'title' => $property->title,
            'description' => $property->description,
            'type' => $property->type,
            'status' => $property->status,
            'price' => $property->price,
            'address' => $property->address,
            'surface' => $property->surface,
            'rooms' => $property->rooms,
            'bathrooms' => $property->bathrooms,
            'created_at' => $property->created_at->format('d/m/Y'),
            'updated_at' => $property->updated_at->format('d/m/Y H:i'),
            'client_name' => $property->client_name,
            'client_surname' => $property->client_surname,
            'client_phone' => $property->client_phone,
            'client_email' => $property->client_email,
            'category' => $property->categorie ? [
                'id' => $property->categorie->id,
                'name' => $property->categorie->name
            ] : null,
            'images' => $images,
            'proprietaire' => $property->user ? [
                'id' => $property->user->id,
                'name' => $property->user->nom . ' ' . $property->user->prenom,
                'email' => $property->user->email,
                'phone' => $property->user->phone
            ] : null
        ];

        return Inertia::render('admin/HistoryShow', [
            'property' => $propertyData
        ]);
    }
}