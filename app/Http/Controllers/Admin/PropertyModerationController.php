<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyModerationController extends Controller
{
    public function index()
    {
        $properties = Property::with(['user', 'categorie'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/biens', [
            'properties' => $properties
        ]);
    }

    /**
     * Affiche les détails d'une propriété
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        try {
            $property = Property::with(['user', 'categorie'])->findOrFail($id);
            
            // Décoder additional_images s'il s'agit d'une chaîne JSON
            $additionalImages = $property->additional_images;
            if (is_string($additionalImages)) {
                $additionalImages = json_decode($additionalImages, true) ?: [];
            }
            $property->additional_images = (array) $additionalImages;
            
            // Préparer les données du bien avec les URLs complètes des images
            $propertyData = array_merge($property->toArray(), [
                'image_url' => $property->image ? asset('storage/' . $property->image) : null,
                'all_image_urls' => $property->all_image_urls,
                'additional_images_urls' => $property->additional_images ? 
                    array_map(fn($img) => asset('storage/' . $img), $property->additional_images) : []
            ]);
            
            return Inertia::render('admin/biens/show', [
                'property' => $propertyData
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.properties')
                ->with('error', 'Impossible de charger les détails de la propriété: ' . $e->getMessage());
        }
    }

    public function approve(Property $property)
    {
        try {
            \Log::info('Début de l\'approbation du bien', ['property_id' => $property->id]);
            
            $updated = $property->update([
                'status' => 'Approuvé', // Mise en majuscule pour correspondre aux autres statuts
                'published_at' => now()
            ]);

            if (!$updated) {
                \Log::error('Échec de la mise à jour du bien', ['property_id' => $property->id]);
                throw new \Exception('Échec de la mise à jour du bien');
            }

            \Log::info('Bien approuvé avec succès', ['property_id' => $property->id]);

            return response()->json([
                'success' => true,
                'message' => 'Bien approuvé avec succès',
                'property' => $property->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation: ' . $e->getMessage()
            ], 500);
        }
    }

    public function approveReactivation(Property $property)
    {
        try {
            \Log::info('Début de l\'approbation de la republication du bien', ['property_id' => $property->id]);
            
            // Vérifier que le bien est bien en attente de réactivation
            if ($property->status !== 'En attente de réactivation' || !$property->reactivation_requested) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce bien n\'est pas en attente de réactivation.'
                ], 400);
            }

            $updated = $property->update([
                'status' => 'Approuvé',
                'is_available' => true,
                'reactivation_requested' => false,
                'reactivation_reason' => null,
                'client_name' => null,
                'client_surname' => null,
                'client_phone' => null,
                'deleted_at' => null, // Annuler le soft delete
                'published_at' => now() // Mettre à jour la date de publication
            ]);

            if (!$updated) {
                \Log::error('Échec de l\'approbation de la republication du bien', ['property_id' => $property->id]);
                throw new \Exception('Échec de l\'approbation de la republication du bien');
            }

            \Log::info('Republication du bien approuvée avec succès', ['property_id' => $property->id]);

            return response()->json([
                'success' => true,
                'message' => 'La republication du bien a été approuvée avec succès.',
                'property' => $property->fresh()
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'approbation de la republication du bien:', [
                'message' => $e->getMessage(),
                'property_id' => $property->id
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'approbation de la republication: ' . $e->getMessage()
            ], 500);
        }
    }

    public function reject(Property $property)
    {
        try {
            \Log::info('Début du rejet du bien', ['property_id' => $property->id]);
            
            $updated = $property->update([
                'status' => 'Rejeté' // Mise en majuscule pour correspondre aux autres statuts
            ]);

            if (!$updated) {
                \Log::error('Échec du rejet du bien', ['property_id' => $property->id]);
                throw new \Exception('Échec du rejet du bien');
            }

            \Log::info('Bien rejeté avec succès', ['property_id' => $property->id]);

            return response()->json([
                'success' => true,
                'message' => 'Bien rejeté avec succès',
                'property' => $property->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Property $property)
    {
        try {
            // Supprimer l'image associée
            if ($property->image) {
                \Storage::disk('public')->delete($property->image);
            }

            $property->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bien supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche la vue des détails d'une propriété (pour affichage Inertia)
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function showDetails($id)
    {
        // On ne charge que l'ID, le composant React se chargera de récupérer les données via l'API
        return Inertia::render('admin/biens/show', [
            'id' => $id
        ]);
    }
}

