<?php

use App\Http\Controllers\Admin\CategorieController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\ProprietaireController;
use App\Http\Controllers\Admin\PropertyModerationController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Proprietaire\PropertyController as ProprietairePropertyController;
use App\Http\Controllers\Proprietaire\PropertyActionController;
use App\Http\Controllers\Client\PropertyRequestController;
use App\Http\Controllers\ContactController;
use App\Models\Property;
use App\Models\Categorie;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Routes d'authentification
require __DIR__.'/auth.php';

// Routes protégées par authentification
    // Profil utilisateur
    // Route::prefix('profile')->name('profile.')->group(function () {
    //     Route::get('/', [App\Http\Controllers\ProfileController::class, 'edit'])->name('edit');
    //     Route::put('/', [App\Http\Controllers\ProfileController::class, 'update'])->name('update');
    //     Route::put('/password', [App\Http\Controllers\ProfileController::class, 'password'])->name('password.update');
    // });

    Route::get('/about', function () {
        return Inertia::render('about');
    })->name('about');

    Route::get('/contact', function () {
        return Inertia::render('contact');
    })->name('contact');

    // Routes d'inscription personnalisées
    Route::get('/register/proprietaire', [\App\Http\Controllers\Auth\ProprietaireRegistrationController::class, 'showRegistrationForm'])
        ->middleware('guest')
        ->name('register.proprietaire');

    Route::post('/register/proprietaire', [\App\Http\Controllers\Auth\ProprietaireRegistrationController::class, 'register'])
        ->middleware('guest');

    // Routes publiques
    Route::get('/', [\App\Http\Controllers\Public\PropertyController::class, 'index'])
        ->name('home');

    // Route pour afficher toutes les propriétés approuvées avec filtrage
    Route::get('/properties', [\App\Http\Controllers\Public\PropertyController::class, 'index'])
        ->name('properties.index');

    // Route pour afficher les détails d'une propriété approuvée
    Route::get('/properties/{property}', [\App\Http\Controllers\Public\PropertyController::class, 'show'])
        ->name('properties.show');

    // Affichage des biens disponibles avec filtres
    Route::get('/biens', [\App\Http\Controllers\Public\PropertyController::class, 'index'])->name('properties.index');
    Route::get('/biens/{property}', [\App\Http\Controllers\Public\PropertyController::class, 'show'])->name('properties.show');

    // Page de contact
    //Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
    //Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

    // Routes pour les propriétaires - Groupe principal avec authentification
    Route::prefix('proprietaire')->name('proprietaire.')->middleware(['auth'])->group(function () {
        // Page de souscription
        Route::get('/subscription', [\App\Http\Controllers\Proprietaire\SubscriptionController::class, 'showSubscriptionForm'])
            ->name('subscription');
        
        // Traitement de la souscription
        Route::post('/subscribe', [\App\Http\Controllers\Proprietaire\SubscriptionController::class, 'subscribe'])
            ->name('subscribe');
        
        // Routes du tableau de bord propriétaire
        Route::group([], function () {
            // Tableau de bord propriétaire (nécessite un abonnement actif)
            Route::get('/dashboard', [\App\Http\Controllers\Proprietaire\DashboardController::class, 'index'])
                ->name('dashboard');
                
            // Gestion des biens du propriétaire (nécessite un abonnement actif)
            Route::resource('mes-biens', ProprietairePropertyController::class, [
                'names' => [
                    'index' => 'mes-biens.index',
                    'create' => 'mes-biens.create',
                    'store' => 'mes-biens.store',
                    'edit' => 'mes-biens.edit',
                    'update' => 'mes-biens.update',
                    'destroy' => 'mes-biens.destroy',
                ],
                'parameters' => [
                    'mes-biens' => 'property' // Ceci garantit que le paramètre de route s'appelle 'property' et non 'mes_biens'
                ]
            ])->except(['show']);

            // Route pour la demande de republication d'un bien loué
            Route::post('/mes-biens/{property}/request-reactivation', [PropertyActionController::class, 'requestReactivation'])
                ->name('mes-biens.request-reactivation');
            
            // Routes pour les actions sur les biens avec vérification client
            Route::group(['prefix' => 'mes-biens/{property}'], function () {
                // Désactiver un bien en location
                Route::post('disable', [PropertyActionController::class, 'disable'])
                    ->name('mes-biens.disable');
                    
                // Supprimer un bien avec vérification client
                Route::post('delete-with-client', [PropertyActionController::class, 'deleteWithClientVerification'])
                    ->name('mes-biens.delete-with-client');
            });
            
            // Gestion des abonnements du propriétaire
            Route::get('/mes-abonnements', [\App\Http\Controllers\Proprietaire\SubscriptionController::class, 'mesAbonnements'])
                ->name('mes-abonnements');
            
            // Historique des biens vendus et loués
            Route::get('/historique', [\App\Http\Controllers\Proprietaire\HistoryController::class, 'index'])
                ->name('historique');
                
            // Détails d'un bien de l'historique
            Route::get('/historique/{property}', [\App\Http\Controllers\Proprietaire\HistoryController::class, 'show'])
                ->name('historique.show');
        });
    });


    // Routes protégées par authentification et rôle admin
    Route::middleware(['auth', 'role:admin'])->group(function () {
        // Tableau de bord admin
        Route::prefix('admin')->name('admin.')->group(function () {
            // Tableau de bord
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
            
            // Approuver la republication d'un bien
            Route::post('/properties/{property}/approve-reactivation', [PropertyModerationController::class, 'approveReactivation'])
                ->name('properties.approve-reactivation');

            // Gestion des biens
            Route::get('/biens', [PropertyModerationController::class, 'index'])
                ->name('properties');
            Route::get('/biens/{property}', [PropertyModerationController::class, 'show'])
                ->name('properties.show');
                
            // Routes pour l'approbation et le rejet des biens
            Route::middleware(['auth', 'role:admin'])->group(function () {
                Route::put('/biens/{property}/approve', [PropertyModerationController::class, 'approve'])
                    ->name('properties.approve');
                    
                Route::put('/biens/{property}/reject', [PropertyModerationController::class, 'reject'])
                    ->name('properties.reject');
                    
                Route::delete('/biens/{property}', [PropertyModerationController::class, 'destroy'])
                    ->name('properties.destroy');
            });
            // Gestion des propriétaires
            Route::get('/proprietaires', [ProprietaireController::class, 'index'])
                ->name('owners');

            // Gestion des abonnements
            Route::get('/abonnements', [SubscriptionController::class, 'index'])
                ->name('subscriptions');

            // Gestion des clients
            Route::get('/clients', [ClientController::class, 'index'])
                ->name('clients');

            // Gestion des catégories
            Route::get('/categories', function () {
                return Inertia::render('admin/categories');
            })->name('categories');
            Route::get('/historique',[\App\Http\Controllers\Admin\HistoryController::class,'index'])->name('historique');
            // API pour les catégories
            Route::prefix('api')->group(function () {
                Route::get('/categories', [CategorieController::class, 'index']);
                Route::post('/categories', [CategorieController::class, 'store']);
                Route::put('/categories/{categorie}', [CategorieController::class, 'update']);
                Route::delete('/categories/{categorie}', [CategorieController::class, 'destroy']);
            });
        });
    });