<?php

namespace App\Http\Controllers\Proprietaire;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\UserSubscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;

class SubscriptionController extends Controller
{
    public function showSubscriptionForm()
    {
        try {
            $subscriptions = Subscription::where('status', 'actif')->get();
            
            if ($subscriptions->isEmpty()) {
                $subscriptions = collect([
                    [
                        'id' => 1,
                        'name' => 'Abonnement Mensuel',
                        'description' => 'Accès complet pour 1 mois',
                        'price' => 5000,
                        'duration_months' => 1,
                        'status' => 'actif'
                    ]
                ]);
            }
            
            return Inertia::render('proprietaire/subscription', [
                'subscriptions' => $subscriptions,
                'flash' => [
                    'message' => session('message', 'Veuillez souscrire à un abonnement pour continuer'),
                    'status' => session('status', 'info')
                ],
            ]);
        } catch (Exception $e) {
            Log::error('Erreur lors de l\'affichage du formulaire d\'abonnement', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()
                ->with('error', 'Une erreur est survenue lors du chargement des abonnements.');
        }
    }

    public function subscribe(Request $request)
    {
        try {
            $validated = $request->validate([
                'subscription_id' => 'required|exists:subscriptions,id',
                'payment_method' => 'required|string|in:flooz,mixx by yas',
                'phone_number' => ['required', 'string', 'regex:/^(228)?[0-9]{8}$/']
            ]);

            // Supprimer le préfixe 228 s'il est présent
            $phoneNumber = preg_replace('/^228/', '', $validated['phone_number']);

            $user = Auth::user();
            $subscription = Subscription::findOrFail($validated['subscription_id']);

            // Créer l'abonnement utilisateur avec les informations de paiement
            $userSubscription = new UserSubscription([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'start_date' => now(),
                'end_date' => now()->addMonths($subscription->duration_months),
                'status' => 'actif',
                'payment_method' => $validated['payment_method'],
                'payment_phone' => $phoneNumber, // Utiliser le numéro nettoyé
                'payment_status' => 'completed',
                'payment_date' => now(),
                'transaction_id' => 'TXN-' . time() . '-' . $user->id
            ]);

            $userSubscription->save();

            // Mettre à jour le statut de l'utilisateur
            $user->isActive = true;
            $user->save();

            return redirect()->route('proprietaire.dashboard')
                ->with('message', 'Paiement effectué avec succès ! Votre abonnement est maintenant actif.')
                ->with('status', 'success');

        } catch (\Exception $e) {
            Log::error('Erreur lors de la souscription', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->with('message', 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.')
                ->with('status', 'error');
        }
    }
    
    public function mesAbonnements()
    {
        try {
            $user = Auth::user();
            
            $abonnements = $user->userSubscriptions()
                ->with('subscription')
                ->latest('end_date')
                ->get()
                ->map(function($abonnement) {
                    // Convertir les chaînes de date en instances Carbon si nécessaire
                    $startDate = is_string($abonnement->start_date) 
                        ? \Carbon\Carbon::parse($abonnement->start_date)
                        : $abonnement->start_date;
                        
                    $endDate = is_string($abonnement->end_date)
                        ? \Carbon\Carbon::parse($abonnement->end_date)
                        : $abonnement->end_date;
                    
                    $paymentDate = $abonnement->payment_date 
                        ? (is_string($abonnement->payment_date) 
                            ? \Carbon\Carbon::parse($abonnement->payment_date) 
                            : $abonnement->payment_date)
                        : null;
                    
                    return [
                        'id' => $abonnement->id,
                        'nom' => $abonnement->subscription->name,
                        'description' => $abonnement->subscription->description,
                        'prix' => $abonnement->subscription->price,
                        'date_debut' => $startDate->format('d/m/Y'),
                        'date_fin' => $endDate->format('d/m/Y'),
                        'statut' => $abonnement->status,
                        'est_actif' => $endDate->isFuture() && $abonnement->status === 'actif',
                        'paiement' => [
                            'methode' => $abonnement->payment_method,
                            'telephone' => $abonnement->payment_phone,
                            'statut' => $abonnement->payment_status,
                            'date' => $paymentDate ? $paymentDate->format('d/m/Y H:i') : null,
                            'transaction_id' => $abonnement->transaction_id
                        ]
                    ];
                });
            
            $abonnementsDisponibles = Subscription::where('status', 'actif')->get();
            
            return Inertia::render('proprietaire/mes-abonnements', [
                'abonnements' => $abonnements,
                'abonnementsDisponibles' => $abonnementsDisponibles,
                'flash' => [
                    'message' => session('message'),
                    'status' => session('status')
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des abonnements', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()
                ->with('message', 'Une erreur est survenue lors du chargement de vos abonnements.')
                ->with('status', 'error');
        }
    }
}