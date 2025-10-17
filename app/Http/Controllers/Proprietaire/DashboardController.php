<?php

namespace App\Http\Controllers\Proprietaire;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Models\Property;
use App\Models\User;
use App\Models\Subscription;
use App\Models\UserSubscription;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Vérifier si l'utilisateur a un abonnement actif
            $subscription = $user->userSubscriptions()
                ->where('end_date', '>=', now())
                ->where('status', 'actif')
                ->with('subscription')
                ->latest()
                ->first();
                
            // Si l'utilisateur n'a pas d'abonnement actif, le rediriger vers la page de souscription
            if (!$subscription) {
                // Désactiver le compte si ce n'est pas déjà fait
                if ($user->isActive) {
                    $user->update(['isActive' => false]);
                }
                
                return redirect()->route('proprietaire.subscription')
                    ->with([
                        'message' => 'Veuillez souscrire à un abonnement pour accéder à votre tableau de bord.',
                        'status' => 'warning'
                    ]);
            }

        // Statistiques des biens
        $stats = [
            'total' => $user->properties()->count(),
            'pending' => $user->properties()->where('status', 'En attente')->count(),
            'approved' => $user->properties()->where('status', 'Approuvé')->count(),
            'rejected' => $user->properties()->where('status', 'Rejeté')->count(),
            
        ];

        // Récupérer l'historique des biens loués ou vendus
        $history = $user->properties()
            ->whereIn('status', ['Loué', 'Vendu'])
            ->whereNotNull('client_name')
            ->orderBy('updated_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'type' => $property->type,
                    'status' => $property->status,
                    'price' => $property->price,
                    'updated_at' => $property->updated_at->format('d/m/Y H:i'),
                    'client_name' => trim($property->client_name . ' ' . $property->client_surname) ?: 'N/A',
                    'client_phone' => $property->client_phone ?? 'N/A',
                ];
            });

        // Récupérer les biens récents
        $recentProperties = $user->properties()
            ->with('categorie')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($property) {
                // Nettoyer le chemin de l'image principale
                $mainImage = $property->image 
                    ? (str_starts_with($property->image, 'http') 
                        ? $property->image 
                        : (str_starts_with($property->image, '/storage/') 
                            ? asset($property->image) 
                            : asset('storage/' . ltrim($property->image, '/'))))
                    : null;

                // Préparer les images supplémentaires
                $additionalImages = [];
                $rawAdditionalImages = $property->additional_images;
                
                if (is_string($rawAdditionalImages)) {
                    $rawAdditionalImages = json_decode($rawAdditionalImages, true) ?: [];
                }
                
                if (is_array($rawAdditionalImages)) {
                    $additionalImages = collect($rawAdditionalImages)
                        ->map(function($image) {
                            if (empty($image)) return null;
                            return str_starts_with($image, 'http') 
                                ? $image 
                                : (str_starts_with($image, '/storage/') 
                                    ? asset($image) 
                                    : asset('storage/' . ltrim($image, '/')));
                        })
                        ->filter()
                        ->values()
                        ->toArray();
                }

                // Toutes les images (image principale + images supplémentaires)
                $allImages = array_filter([$mainImage, ...$additionalImages]);
                
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'price' => $property->price,
                    'status' => $property->status,
                    'image' => $mainImage,
                    'all_images' => $allImages,
                    'additional_images' => $additionalImages,
                    'created_at' => $property->created_at->toDateTimeString(),
                    'categorie' => $property->categorie ? [
                        'id' => $property->categorie->id,
                        'name' => $property->categorie->name,
                    ] : null
                ];
            });

        // Formater les données d'abonnement pour le frontend
        $subscriptionData = null;
        if ($subscription) {
            $subscriptionData = [
                'status' => $subscription->status,
                'type' => $subscription->subscription ? $subscription->subscription->name : 'Inconnu',
                'end_date' => $subscription->end_date ? \Carbon\Carbon::parse($subscription->end_date)->format('d/m/Y') : 'Date non définie',
                'isActive' => $subscription->end_date >= now() && $subscription->status === 'actif',
            ];
        }

            return Inertia::render('proprietaire/dashboard', [
                'subscription' => $subscriptionData,
                'recentProperties' => $recentProperties,
                'stats' => $stats,
                'history' => $history,
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement du tableau de bord', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()
                ->with([
                    'message' => 'Une erreur est survenue lors du chargement du tableau de bord. Veuillez réessayer.',
                    'status' => 'error'
                ]);
        }
    }
}