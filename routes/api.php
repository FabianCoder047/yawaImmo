<?php

use App\Http\Controllers\Proprietaire\PropertyController as ProprietairePropertyController;
use App\Http\Controllers\Client\PropertyRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques
Route::get('/properties', [ProprietairePropertyController::class, 'getProperties']);
Route::get('/properties/{property}', [ProprietairePropertyController::class, 'show']);

// Routes protégées
Route::middleware(['auth:sanctum'])->group(function () {
    // Routes pour les propriétaires
    Route::prefix('proprietaire')->group(function () {
        Route::apiResource('properties', ProprietairePropertyController::class);
    });
    
    // Routes pour les clients
    Route::prefix('client')->group(function () {
        Route::apiResource('property-requests', PropertyRequestController::class);
    });
});
