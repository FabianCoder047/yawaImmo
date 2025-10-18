<?php

namespace App\Http\Controllers\Proprietaire;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropertyActionController extends Controller
{
    /**
     * Désactive un bien en location
     */
    public function disable(Request $request, Property $property)
    {
        // Vérifier que l'utilisateur est bien le propriétaire du bien
        if ($property->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé.'
            ], 403);
        }

        // Vérifier que le bien est bien en location
        if ($property->offre !== 'En location') {
            return response()->json([
                'success' => false,
                'message' => 'Cette action ne peut être effectuée que sur un bien en location.'
            ], 400);
        }

        $validated = $request->validate([
            'client_nom' => 'required|string|max:255',
            'client_prenom' => 'required|string|max:255',
            'client_telephone' => 'required|string|max:20',
        ]);

        try {
            // Mettre à jour le statut du bien
            $updateData = [
                'status' => 'Loué',
                'is_available' => false,
                'client_name' => $validated['client_nom'],
                'client_surname' => $validated['client_prenom'],
                'client_phone' => $validated['client_telephone'],
                'deleted_at' => now(), // Soft delete pour le cacher des listes
                'updated_at' => now(),
            ];
            
            // Journalisation pour débogage
            \Log::info('Mise à jour du bien en location', [
                'property_id' => $property->id,
                'update_data' => $updateData
            ]);
            
            $property->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Le bien a été marqué comme loué avec succès.',
                'property' => $property->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la location du bien:', [
                'message' => $e->getMessage(),
                'property_id' => $property->id
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la location du bien.'
            ], 500);
        }
    }

    /**
     * Supprime un bien avec vérification des informations du client
     */
    public function requestReactivation(Request $request, Property $property)
    {
        // Vérifier que l'utilisateur est bien le propriétaire du bien
        if ($property->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé.'
            ], 403);
        }

        // Vérifier que le bien est bien marqué comme loué
        if ($property->status !== 'Loué') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les biens marqués comme loués peuvent faire l\'objet d\'une demande de republication.'
            ], 400);
        }

        $validated = $request->validate([
            'reactivation_reason' => 'required|string|min:10|max:1000',
        ]);

        try {
            // Mettre à jour le bien avec la demande de réactivation
            $property->update([
                'reactivation_requested' => true,
                'reactivation_reason' => $validated['reactivation_reason'],
                'status' => 'En attente de réactivation',
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Votre demande de republication a été envoyée avec succès. Elle sera examinée par un administrateur.',
                'property' => $property->fresh()
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la demande de republication du bien:', [
                'message' => $e->getMessage(),
                'property_id' => $property->id
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la demande de republication.'
            ], 500);
        }
    }

    public function deleteWithClientVerification(Request $request, Property $property)
    {
        // Vérifier que l'utilisateur est bien le propriétaire du bien
        if ($property->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé.'
            ], 403);
        }

        $validated = $request->validate([
            'client_nom' => 'required|string|max:255',
            'client_prenom' => 'required|string|max:255',
            'client_telephone' => 'required|string|max:20',
        ]);

        try {
            // Préparer les données de mise à jour
            $updateData = [
                'status' => 'Vendu',
                'is_available' => false,
                'client_name' => $validated['client_nom'],
                'client_surname' => $validated['client_prenom'],
                'client_phone' => $validated['client_telephone'],
                'updated_at' => now(),
            ];

            // Journalisation pour débogage
            \Log::info('Mise à jour du bien vendu', [
                'property_id' => $property->id,
                'update_data' => $updateData
            ]);

            // Mettre à jour le bien
            $property->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Le bien a été marqué comme vendu avec succès.',
                'property' => $property->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la vente du bien avec vérification client:', [
                'message' => $e->getMessage(),
                'property_id' => $property->id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la vente du bien: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime directement un bien sans vérification client
     */
    public function deleteDirect(Property $property)
    {
        // Vérifier que l'utilisateur est bien le propriétaire du bien
        if ($property->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé.'
            ], 403);
        }

        try {
            // Journalisation avant suppression
            \Log::info('Suppression directe du bien', [
                'property_id' => $property->id,
                'user_id' => Auth::id()
            ]);

            // Supprimer les images associées
            if ($property->image) {
                Storage::disk('public')->delete($property->image);
            }

            // Supprimer les images supplémentaires
            if ($property->additional_images) {
                foreach (json_decode($property->additional_images, true) as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            // Supprimer définitivement le bien
            $property->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Le bien a été supprimé avec succès.'
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression directe du bien:', [
                'message' => $e->getMessage(),
                'property_id' => $property->id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la suppression du bien: ' . $e->getMessage()
            ], 500);
        }
    }
}
