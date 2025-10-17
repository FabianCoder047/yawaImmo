<?php

namespace App\Http\Controllers\Proprietaire;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryController extends Controller
{
    /**
     * Affiche l'historique des biens vendus et loués
     */
    public function index()
    {
        $user = Auth::user();
        
        // Récupérer les biens vendus ou loués par l'utilisateur, y compris ceux supprimés en douceur
        $properties = Property::with(['categorie', 'user'])
            ->withTrashed() // Inclure les biens supprimés logiquement
            ->where('user_id', $user->id)
            ->where(function($query) {
                $query->where('status', 'Vendu')
                      ->orWhere('status', 'Loué');
            })
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function($property) {
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
                    'image' => $property->image ? asset('storage/' . $property->image) : null,
                    'deleted_at' => $property->deleted_at, // Ajout pour le débogage
                ];
            });

        // Log pour le débogage
        \Log::info('Propriétés historiques récupérées : ' . $properties->count());
        \Log::info('Détails des propriétés : ', $properties->toArray());

        // Vérifier les données avant envoi
        foreach ($properties as $property) {
            \Log::info("Propriété ID: {$property['id']}", [
                'client_name' => $property['client_name'] ?? 'non défini',
                'client_surname' => $property['client_surname'] ?? 'non défini',
                'client_phone' => $property['client_phone'] ?? 'non défini',
                'image' => $property['image'] ?? 'non définie',
            ]);
        }

        return Inertia::render('proprietaire/History', [
            'properties' => $properties,
            'stats' => [
                'total' => $properties->count(),
                'sold' => $properties->where('status', 'Vendu')->count(),
                'rented' => $properties->where('status', 'Loué')->count(),
            ]
        ]);
    }

    /**
     * Affiche les détails d'un bien de l'historique
     */
    public function show(Property $property)
    {
        // Vérifier que l'utilisateur est bien le propriétaire du bien
        if ($property->user_id !== Auth::id()) {
            abort(403, 'Non autorisé.');
        }

        // Vérifier que le bien est bien vendu ou loué
        if (!in_array($property->status, ['Vendu', 'Loué'])) {
            abort(404, 'Ce bien ne fait pas partie de l\'historique.');
        }

        // Charger les relations nécessaires
        $property->load(['categorie', 'user']);

        // Formater les images supplémentaires
        $additionalImages = [];
        if ($property->additional_images) {
            $additionalImages = array_map(function($image) {
                return asset('storage/' . $image);
            }, (array)$property->additional_images);
        }

        // Préparer les données pour la vue
        $propertyData = [
            'id' => $property->id,
            'title' => $property->title,
            'description' => $property->description,
            'type' => $property->type,
            'status' => $property->status,
            'price' => $property->price,
            'location' => $property->location,
            'created_at' => $property->created_at->format('d/m/Y'),
            'updated_at' => $property->updated_at->format('d/m/Y H:i'),
            'client_name' => $property->client_name,
            'client_surname' => $property->client_surname,
            'client_phone' => $property->client_phone,
            'category_name' => $property->categorie ? $property->categorie->name : 'Non catégorisé',
            'main_image' => $property->image ? asset('storage/' . $property->image) : null,
            'additional_images' => $additionalImages,
        ];

        return Inertia::render('proprietaire/HistoryShow', [
            'property' => $propertyData
        ]);
    }
}
