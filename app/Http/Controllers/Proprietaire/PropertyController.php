<?php

namespace App\Http\Controllers\Proprietaire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use App\Models\Property;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Récupère toutes les propriétés disponibles
     */
    public function getProperties()
    {
        $properties = Property::with(['user', 'categorie'])
            ->where('status', 'Approuvé')
            ->latest()
            ->paginate(10);

        return response()->json($properties);
    }
    /**
     * Affiche la liste des propriétés avec possibilité de filtrage
     */
    public function index(Request $request)
    {
        // Si l'utilisateur est connecté et n'est pas admin, on utilise la relation properties()
        if (auth()->check() && !auth()->user()->checkIsAdmin()) {
            $query = auth()->user()->properties()->with(['categorie']);
        } else {
            // Pour les non-connectés ou admin, on utilise le modèle Property directement
            $query = Property::with(['user', 'categorie']);
            $query->where('status', 'Approuvé');
        }

        // Filtre par catégorie
        if ($request->has('categorie') && !empty($request->categorie)) {
            $query->where('categorie_id', $request->categorie);
        }

        // Filtre par localisation
        if ($request->has('location') && !empty($request->location)) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }
        
        // Exécuter la requête et récupérer les résultats
        $properties = $query->get()->map(function($property) {
            $propertyArray = $property->toArray();
            
            // Ajouter les URLs complètes pour l'image principale
            if (!empty($property->image)) {
                $propertyArray['image_url'] = asset('storage/' . $property->image);
            }
            
            // Ajouter les URLs complètes pour les images supplémentaires
            if (!empty($property->additional_images) && is_array($property->additional_images)) {
                $propertyArray['additional_images_urls'] = array_map(function($image) {
                    return asset('storage/' . $image);
                }, $property->additional_images);
            } else {
                $propertyArray['additional_images_urls'] = [];
            }
            
            return $propertyArray;
        });
        
        // Vérifier si la requête est une requête AJAX ou si on attend une réponse JSON
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'properties' => $properties,
                'categories' => Categorie::all(),
            ]);
        }
        
        // Pour une requête normale, renvoyer la vue Inertia
        // Le composant se trouve dans resources/js/Pages/proprietaire/biens.tsx
        return Inertia::render('proprietaire/biens', [
            'properties' => $properties,
            'categories' => Categorie::all(),
        ]);

        // Filtre par type (location/vente)
        if ($request->has('type') && !empty($request->type)) {
            $query->where('offre', 'LIKE', '%' . $request->type . '%');
        }

        // Si l'utilisateur est connecté et n'est pas admin, ne montrer que ses propriétés
        if (auth()->check() && !auth()->user()->checkIsAdmin()) {
            $query->where('user_id', auth()->id());
        }

        // On récupère tous les biens sans pagination pour le propriétaire
        $properties = $query->latest()->get();
        $categories = Categorie::all();

        // Pour la page "Mes biens" du propriétaire, on retourne toujours la vue Inertia
        return Inertia::render('proprietaire/biens', [
            'properties' => $properties->map(function($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'price' => $property->price,
                    'status' => $property->status,
                    'image' => $property->image,
                    'location' => $property->location,
                    'type' => $property->type,
                    'description' => $property->description,
                    'offre' => $property->offre,
                    'categorie' => $property->categorie ? [
                        'id' => $property->categorie->id,
                        'name' => $property->categorie->name
                    ] : null
                ];
            }),
            'categories' => $categories,
            'filters' => $request->only(['categorie', 'location'])
        ]);
    }

    public function store(Request $request)
    {
        // Vérifier le jeton CSRF
        if (! $request->expectsJson()) {
            $request->headers->set('X-Requested-With', 'XMLHttpRequest');
        }
        
        // Désactiver temporairement la vérification CSRF pour le débogage
        // if ($request->header('X-CSRF-TOKEN') !== csrf_token()) {
        //     \Log::error('Token CSRF invalide', [
        //         'token_header' => $request->header('X-CSRF-TOKEN'),
        //         'token_session' => csrf_token(),
        //         'cookies' => $request->cookies->all(),
        //         'session' => session()->all()
        //     ]);
            
        //     return response()->json([
        //         'message' => 'Token CSRF invalide. Veuillez rafraîchir la page et réessayer.'
        //     ], 419);
        // }

        \Log::info('Début de la méthode store');
        \Log::info('Données reçues:', $request->except(['images']));
        \Log::info('Fichiers reçus:', ['has_files' => $request->hasFile('images'), 'files' => $request->file('images')]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'description' => 'nullable|string',
                'categorie' => 'required|in:En vente,En location',
                'location' => 'required|string',
                'price' => 'required|numeric|min:0',
            ], [
                'title.required' => 'Le titre du bien est obligatoire',
                'images.required' => 'Au moins une image est obligatoire',
                'images.*.image' => 'Tous les fichiers doivent être des images',
                'images.*.mimes' => 'Les images doivent être au format JPEG, PNG, JPG ou GIF',
                'images.*.max' => 'Chaque image ne doit pas dépasser 2MB',
                'location.required' => 'La localisation est obligatoire',
                'price.required' => 'Le prix est obligatoire',
                'price.numeric' => 'Le prix doit être un nombre',
                'price.min' => 'Le prix doit être positif',
                'categorie.required' => 'La catégorie est obligatoire',
                'categorie.in' => 'La catégorie doit être "En vente" ou "En location"',
            ]);

            \Log::info('Validation passée avec succès');

            // Vérification de l'abonnement (temporairement désactivé pour les tests)
            // if (!Auth::user()->hasValidSubscription()) {
            //     throw new \Exception('Votre abonnement a expiré');
            // }

            // Trouver la catégorie correspondante au type
            $categorie = Categorie::where('name', $request->type)->first();
            
            if (!$categorie) {
                throw new \Exception('Type de bien invalide');
            }

            // Vérifier si des images ont été téléchargées
            if (!$request->hasFile('images')) {
                throw new \Exception('Aucune image n\'a été téléchargée');
            }

            // Créer le bien avec la première image comme image principale
            $firstImage = $request->file('images')[0];
            $imagePath = $firstImage->store('properties', 'public');
            
            $property = Auth::user()->properties()->create([
                'title' => $request->title,
                'description' => $request->description,
                'categorie_id' => $categorie->id,
                'offre' => $request->categorie,
                'location' => $request->location,
                'price' => $request->price,
                'image' => $imagePath, // Première image comme image principale
                'status' => 'En attente',
                'published_at' => now()->addHours(24),
            ]);

            // Stocker les images supplémentaires dans un champ JSON
            $additionalImages = [];
            if (count($request->file('images')) > 1) {
                foreach (array_slice($request->file('images'), 1) as $image) {
                    $path = $image->store('properties', 'public');
                    $additionalImages[] = $path;
                }
                
                // Stocker les chemins des images supplémentaires dans un champ JSON
                if (!empty($additionalImages)) {
                    $property->additional_images = json_encode($additionalImages);
                    $property->save();
                }
            }

            \Log::info('Bien créé avec succès:', $property->toArray());

            if ($request->wantsJson() || $request->ajax()) {
                $response = new Response([
                    'success' => true,
                    'message' => 'Bien créé avec succès',
                    'redirect' => route('proprietaire.mes-biens.index')
                ]);

                // Ajout des en-têtes CORS
                return $response
                    ->header('Access-Control-Allow-Origin', config('cors.allowed_origins')[0])
                    ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->header('Access-Control-Allow-Credentials', 'true')
                    ->header('Access-Control-Allow-Headers', 'X-CSRF-TOKEN, X-Requested-With, Content-Type, X-Token-Auth, Authorization');
            }

            return redirect()->route('proprietaire.mes-biens.index')
                           ->with('success', 'Bien soumis pour validation.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Erreur de validation:', ['errors' => $e->errors()]);
            
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $e->errors()
                ], 422);
            }
            
            return back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création du bien:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la création du bien: ' . $e->getMessage()
                ], 500);
            }
            
            return back()->with('error', 'Erreur lors de la création du bien: ' . $e->getMessage())->withInput();
        }
    }

   public function update(Request $request, $id)
{
    \Log::info('Début de la mise à jour du bien', ['property_id' => $id, 'data' => $request->except(['images'])]);

    try {
        // Récupérer le bien à mettre à jour
        $property = Property::findOrFail($id);
        
        // Vérifier que l'utilisateur est propriétaire du bien
        if ($property->user_id !== auth()->id()) {
            \Log::warning('Tentative non autorisée de mise à jour', [
                'user_id' => auth()->id(),
                'property_owner_id' => $property->user_id
            ]);
            
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Non autorisé'], 403);
            }
            return back()->with('error', 'Non autorisé');
        }

        // Vérifier si le bien est déjà approuvé
        if ($property->status === 'Approuvé') {
            \Log::warning('Tentative de modification d\'un bien approuvé', ['property_id' => $id]);
            
            if ($request->wantsJson()) {
                return response()->json([
                    'error' => 'Impossible de modifier un bien approuvé'
                ], 403);
            }
            return back()->with('error', 'Impossible de modifier un bien approuvé');
        }

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string',
            'location' => 'required|string',
            'price' => 'required|numeric|min:0',
            'categorie' => 'required|in:En vente,En location',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        $validated = $request->validate($rules, [
            'title.required' => 'Le titre du bien est obligatoire',
            'type.required' => 'Le type de bien est obligatoire',
            'location.required' => 'La localisation est obligatoire',
            'price.required' => 'Le prix est obligatoire',
            'price.numeric' => 'Le prix doit être un nombre',
            'price.min' => 'Le prix doit être positif',
            'categorie.required' => 'La catégorie est obligatoire',
            'categorie.in' => 'La catégorie doit être "En vente" ou "En location"',
            'images.*.image' => 'Les fichiers doivent être des images',
            'images.*.mimes' => 'Les images doivent être au format JPEG, PNG, JPG ou GIF',
            'images.*.max' => 'Chaque image ne doit pas dépasser 2MB',
        ]);

        \Log::info('Validation passée avec succès', ['property_id' => $id]);

        // Trouver la catégorie correspondante au type
        $categorie = Categorie::where('name', $request->type)->first();
        
        if (!$categorie) {
            \Log::error('Type de bien invalide', ['type' => $request->type]);
            
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Type de bien invalide'], 422);
            }
            return back()->with('error', 'Type de bien invalide');
        }

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'location' => $request->location,
            'price' => $request->price,
            'categorie_id' => $categorie->id,
            'offre' => $request->categorie,
            'status' => 'En attente', // Remettre en attente après modification
        ];

        // Gestion des images
        $existingImages = [];
        $newImages = [];

        // Récupérer les images existantes si elles sont fournies
        if ($request->has('existing_images')) {
            $existingImages = array_filter((array)$request->input('existing_images'));
            \Log::info('Images existantes reçues', ['count' => count($existingImages), 'images' => $existingImages]);
        }

        // Traiter les nouvelles images
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('properties', 'public');
                    $newImages[] = $path;
                    \Log::info('Nouvelle image téléchargée', ['path' => $path]);
                } else {
                    \Log::warning('Fichier invalide', ['name' => $file->getClientOriginalName()]);
                }
            }
        }

        // Combiner les images existantes et nouvelles
        $allImages = array_merge($existingImages, $newImages);

        if (!empty($allImages)) {
            // Mettre à jour les images du bien
            $data['image'] = $allImages[0]; // Première image comme image principale
            
            if (count($allImages) > 1) {
                $data['additional_images'] = array_slice($allImages, 1);
            } else {
                $data['additional_images'] = null;
            }
            
            \Log::info('Mise à jour des images du bien', [
                'main_image' => $data['image'],
                'additional_images' => $data['additional_images']
            ]);
        } else {
            // Si aucune image n'est fournie, conserver les images existantes
            $data['image'] = $property->image;
            $data['additional_images'] = $property->additional_images;
        }

        \Log::info('Mise à jour du bien', ['data' => $data]);
        
        // Mettre à jour le bien
        $property->update($data);
        $property->load('categorie');

        \Log::info('Bien mis à jour avec succès', ['property_id' => $property->id]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Bien modifié avec succès',
                'property' => $property
            ]);
        }

        return redirect()->route('proprietaire.mes-biens.index')
            ->with('success', 'Bien modifié avec succès');

    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('Erreur de validation', ['errors' => $e->errors()]);
        
        if ($request->wantsJson()) {
            return response()->json([
                'error' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }
        
        return back()->withErrors($e->errors())->withInput();
        
    } catch (\Exception $e) {
        \Log::error('Erreur lors de la modification du bien', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        if ($request->wantsJson()) {
            return response()->json([
                'error' => 'Erreur lors de la modification du bien: ' . $e->getMessage()
            ], 500);
        }
        
        return back()->with('error', 'Une erreur est survenue lors de la modification du bien');
    }
}

/**
 * Supprime les images d'un bien
 * 
 * @param Property $property Le bien dont on veut supprimer les images
 * @return void
 */
private function deletePropertyImages(Property $property): void
{
    try {
        // Supprimer l'image principale
        if (!empty($property->image)) {
            $imagePath = $property->image;
            if (\Storage::disk('public')->exists($imagePath)) {
                \Storage::disk('public')->delete($imagePath);
                \Log::info('Image principale supprimée avec succès', [
                    'property_id' => $property->id,
                    'path' => $imagePath
                ]);
            } else {
                \Log::warning('Image principale introuvable lors de la suppression', [
                    'property_id' => $property->id,
                    'path' => $imagePath
                ]);
            }
        }
        
        // Supprimer les images supplémentaires
        $additionalImages = [];
        
        // Gérer différents formats de données pour additional_images
        if (is_string($property->additional_images)) {
            $decoded = json_decode($property->additional_images, true);
            $additionalImages = is_array($decoded) ? $decoded : [];
        } elseif (is_array($property->additional_images)) {
            $additionalImages = $property->additional_images;
        }
        
        foreach ($additionalImages as $index => $image) {
            if (empty($image)) {
                continue;
            }
            
            // Si l'image est dans un objet avec une propriété 'url' ou 'path'
            if (is_array($image) || is_object($image)) {
                $image = $image['url'] ?? $image['path'] ?? null;
                if (empty($image)) {
                    continue;
                }
            }
            
            // Nettoyer le chemin de l'image (supprimer le préfixe /storage/ s'il existe)
            $imagePath = str_replace('/storage/', '', $image);
            
            if (\Storage::disk('public')->exists($imagePath)) {
                \Storage::disk('public')->delete($imagePath);
                \Log::info('Image supplémentaire supprimée avec succès', [
                    'property_id' => $property->id,
                    'index' => $index,
                    'path' => $imagePath
                ]);
            } else {
                \Log::warning('Image supplémentaire introuvable lors de la suppression', [
                    'property_id' => $property->id,
                    'index' => $index,
                    'path' => $imagePath
                ]);
            }
        }
    } catch (\Exception $e) {
        \Log::error('Erreur lors de la suppression des images du bien', [
            'property_id' => $property->id ?? null,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        // Relancer l'exception pour permettre à la méthode appelante de la gérer
        throw $e;
    }
}

    public function show(Property $property)
    {
        // Vérifier que l'utilisateur est propriétaire du bien
        if ($property->user_id !== Auth::id()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Charger les relations nécessaires
        $property->load(['user', 'categorie']);

        // Préparer les données du bien avec les URLs complètes des images
        $propertyData = array_merge($property->toArray(), [
            'image_url' => $property->image ? asset('storage/' . $property->image) : null,
            'additional_images_urls' => $property->additional_images ? 
                array_map(fn($img) => asset('storage/' . $img), $property->additional_images) : []
        ]);

        return Inertia::render('proprietaire/properties/show', [
            'property' => $propertyData
        ]);
    }

    public function destroy(Property $property)
    {
        // Vérifier que l'utilisateur est propriétaire du bien
        if ($property->user_id !== Auth::id()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        try {
            // Supprimer l'image associée
            if ($property->image) {
                \Storage::disk('public')->delete($property->image);
            }

            $property->delete();

            return response()->json(['message' => 'Bien supprimé avec succès']);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression du bien:', [
                'message' => $e->getMessage(),
                'property_id' => $property->id
            ]);
            
            return response()->json(['error' => 'Erreur lors de la suppression du bien'], 500);
        }
    }
}
